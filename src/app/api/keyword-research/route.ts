
import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { analyzeKeywordIntent } from '@/ai/flows/analyze-keyword-intent-flow';
import { clusterKeywords } from '@/ai/flows/cluster-keywords-flow';
import { getKeywordMetrics, getRelatedKeywords, getQuestionKeywords, getLongTailKeywords } from '@/services/seo-api-client';
import type { KeywordMetric, TopicCluster, KeywordResearchResponse } from '@/types/keyword-research';

const KeywordResearchRequestSchema = z.object({
  seedKeywords: z.array(z.string().min(1)).min(1),
  targetCountry: z.string().optional(),
  targetLanguage: z.string().optional(),
});

export async function POST(request: NextRequest) {
  console.log('Received request to /api/keyword-research');

  // It's crucial that GENAI_API_KEY (or GOOGLE_API_KEY for googleAI plugin) is set.
  // If Genkit initialization fails due to a missing key in src/ai/genkit.ts,
  // this route might not even load correctly, leading to an HTML error page.
  if (!process.env.GENAI_API_KEY && !process.env.GOOGLE_API_KEY) {
    console.error('CRITICAL SERVER CONFIG ERROR: GENAI_API_KEY or GOOGLE_API_KEY is not set. AI features will not work.');
    return NextResponse.json(
      { error: 'Server configuration error: AI API Key is missing. AI functionalities are disabled for this endpoint.' },
      { status: 503 } // Service Unavailable
    );
  }

  try {
    const body = await request.json();
    const validationResult = KeywordResearchRequestSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json({ error: 'Invalid request body', details: validationResult.error.flatten() }, { status: 400 });
    }

    const { seedKeywords, targetCountry, targetLanguage } = validationResult.data;
    
    const seedKeywordMetricsPromises = seedKeywords.map(async (kw) => {
      const metrics = await getKeywordMetrics(kw, targetCountry, targetLanguage);
      const intentResult = await analyzeKeywordIntent({ keyword: kw });
      return { ...metrics, intent: intentResult.intent };
    });
    const seedKeywordMetrics: KeywordMetric[] = await Promise.all(seedKeywordMetricsPromises);

    const relatedKeywordsPromises = seedKeywords.map(kw => getRelatedKeywords(kw, targetCountry, targetLanguage));
    const questionKeywordsPromises = seedKeywords.map(kw => getQuestionKeywords(kw, targetCountry, targetLanguage));
    const longTailKeywordsPromises = seedKeywords.map(kw => getLongTailKeywords(kw, targetCountry, targetLanguage));
    
    const [relatedKeywordsFlat, questionKeywordsFlat, longTailKeywordsFlat] = await Promise.all([
        Promise.all(relatedKeywordsPromises).then(res => res.flat()),
        Promise.all(questionKeywordsPromises).then(res => res.flat()),
        Promise.all(longTailKeywordsPromises).then(res => res.flat())
    ]);

    const relatedKeywordsWithIntentPromises = relatedKeywordsFlat.map(async (metric) => {
        const intentResult = await analyzeKeywordIntent({ keyword: metric.keyword });
        return { ...metric, intent: intentResult.intent };
    });
    const relatedKeywords: KeywordMetric[] = await Promise.all(relatedKeywordsWithIntentPromises);

    const questionKeywordsWithIntentPromises = questionKeywordsFlat.map(async (metric) => {
        const intentResult = await analyzeKeywordIntent({ keyword: metric.keyword });
        return { ...metric, intent: intentResult.intent };
    });
    const questionKeywords: KeywordMetric[] = await Promise.all(questionKeywordsWithIntentPromises);
    
    const longTailKeywordsWithIntentPromises = longTailKeywordsFlat.map(async (metric) => {
        const intentResult = await analyzeKeywordIntent({ keyword: metric.keyword });
        return { ...metric, intent: intentResult.intent };
    });
    const longTailKeywords: KeywordMetric[] = await Promise.all(longTailKeywordsWithIntentPromises);

    const allGeneratedKeywords = [
      ...relatedKeywords.map(k => k.keyword),
      ...questionKeywords.map(k => k.keyword),
      ...longTailKeywords.map(k => k.keyword),
    ];
    
    let topicClusters: TopicCluster[] = [];
    if (allGeneratedKeywords.length > 0) {
        const uniqueKeywords = Array.from(new Set(allGeneratedKeywords));
        // Ensure clusterKeywords is called only if uniqueKeywords is not empty to prevent potential errors with empty lists in AI flow
        if (uniqueKeywords.length > 0) {
            const clusteringResult = await clusterKeywords({ keywordsList: uniqueKeywords });
            topicClusters = clusteringResult.clusters;
        }
    }

    const responseData: KeywordResearchResponse = {
      seedKeywordMetrics,
      relatedKeywords,
      questionKeywords,
      longTailKeywords,
      topicClusters,
      error: process.env.MOCK_SEO_API === 'true' ? "Note: Displaying sample data. Real-time SEO data API integration is pending." : null,
    };

    return NextResponse.json(responseData, { status: 200 });

  } catch (error: unknown) { 
    console.error('Keyword research API critical error:', error);
    let errorMessage = 'An unexpected error occurred during keyword research.';
    let errorDetailsString: string | null = null;

    if (error instanceof Error) {
      errorMessage = error.message;
      errorDetailsString = error.stack || 'No stack trace available.';
    } else if (typeof error === 'string') {
      errorMessage = error;
    } else {
      // Try to get a string representation of the error for logging and response
      try {
        const serializedError = JSON.stringify(error);
        errorMessage = `A non-Error object was thrown during keyword research: ${serializedError}`;
      } catch (stringifyError) {
        errorMessage = 'A complex, non-serializable error object was thrown during keyword research.';
      }
    }
    
    // Log the processed error for server-side debugging
    console.error(`Processed error for API response: Message: "${errorMessage}", Details: "${errorDetailsString || 'N/A'}"`);

    return NextResponse.json(
      { error: errorMessage, details: errorDetailsString },
      { status: 500 }
    );
  }
}
