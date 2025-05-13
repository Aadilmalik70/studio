// src/app/api/keyword-research/route.ts

import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { analyzeKeywordIntent } from '@/ai/flows/analyze-keyword-intent-flow';
import { clusterKeywords } from '@/ai/flows/cluster-keywords-flow';
// Types will be re-exported from flow files or can be imported from schema files if needed directly.
// For now, relying on types inferred from the flow functions.
import type { AnalyzeKeywordIntentOutput } from '@/ai/flows/analyze-keyword-intent-flow'; 
import type { ClusterKeywordsOutput } from '@/ai/flows/cluster-keywords-flow';

import { 
    getKeywordMetrics, 
    getRelatedKeywords, 
    getQuestionKeywords, 
    getLongTailKeywords 
} from '@/services/seo-api-client';
import type { KeywordMetric, TopicCluster, KeywordResearchResponse } from '@/types/keyword-research';

const KeywordResearchRequestSchema = z.object({
  seedKeywords: z.array(z.string().min(1, "Seed keyword cannot be empty"))
                  .min(1, "At least one seed keyword is required"),
  targetCountry: z.string().optional(),
  targetLanguage: z.string().optional(),
});

export async function POST(request: NextRequest) {
  console.log('[API /api/keyword-research] Received POST request');
  try {
    // Explicitly check for Genkit API key (Google AI)
    const googleApiKey = process.env.GOOGLE_API_KEY;
    const genaiApiKey = process.env.GENAI_API_KEY; // Genkit's googleAI plugin uses GOOGLE_API_KEY by default

    if (!googleApiKey && !genaiApiKey) {
      console.error('[API /api/keyword-research] CRITICAL: Genkit API key (GOOGLE_API_KEY or GENAI_API_KEY) is not configured in server environment variables.');
      return NextResponse.json({ error: 'AI service is not configured. Please check server logs or contact support.' }, { status: 500 });
    }
    if (genaiApiKey && !googleApiKey) {
        console.warn('[API /api/keyword-research] GENAI_API_KEY is set, but googleAI() plugin prefers GOOGLE_API_KEY. If AI calls fail, consider renaming GENAI_API_KEY to GOOGLE_API_KEY.');
    }


    let body;
    try {
      body = await request.json();
      console.log('[API /api/keyword-research] Parsed request body:', body);
    } catch (jsonError: any) {
      console.error('[API /api/keyword-research] Error parsing request JSON:', jsonError.message);
      return NextResponse.json({ error: 'Invalid JSON in request body', details: jsonError.message }, { status: 400 });
    }

    const validationResult = KeywordResearchRequestSchema.safeParse(body);

    if (!validationResult.success) {
      console.error('[API /api/keyword-research] Zod validation failed:', validationResult.error.flatten());
      return NextResponse.json({ error: 'Invalid request body', details: validationResult.error.flatten() }, { status: 400 });
    }

    const { seedKeywords, targetCountry, targetLanguage } = validationResult.data;
    console.log('[API /api/keyword-research] Validation successful. Data:', { seedKeywords, targetCountry, targetLanguage });

    console.log('[API /api/keyword-research] Fetching seed keyword metrics and intents...');
    const seedKeywordMetricsPromises = seedKeywords.map(async (kw) => {
      try {
        console.log(`[API] Processing seed keyword: ${kw}`);
        const metrics = await getKeywordMetrics(kw, targetCountry, targetLanguage);
        console.log(`[API] Metrics for ${kw}:`, metrics);
        const intentResult: AnalyzeKeywordIntentOutput = await analyzeKeywordIntent({ keyword: kw });
        console.log(`[API] Intent for ${kw}:`, intentResult);
        if (!intentResult || typeof intentResult.intent === 'undefined') {
            console.warn(`[API] Intent analysis for ${kw} returned undefined or malformed output. Defaulting intent.`);
            return { ...metrics, intent: 'Unknown' }; 
        }
        return { ...metrics, intent: intentResult.intent };
      } catch (innerError: any) {
        console.error(`[API] Error processing seed keyword ${kw}:`, innerError.message, innerError.stack);
        return { keyword: kw, volume: 'N/A', difficulty: 'N/A', cpc: 'N/A', intent: 'Error' };
      }
    });
    const seedKeywordMetrics: KeywordMetric[] = await Promise.all(seedKeywordMetricsPromises);
    console.log('[API /api/keyword-research] Completed seedKeywordMetrics:', seedKeywordMetrics);

    console.log('[API /api/keyword-research] Fetching related, question, and long-tail keywords...');
    const relatedKeywordsPromises = seedKeywords.map(kw => getRelatedKeywords(kw, targetCountry, targetLanguage));
    const questionKeywordsPromises = seedKeywords.map(kw => getQuestionKeywords(kw, targetCountry, targetLanguage));
    const longTailKeywordsPromises = seedKeywords.map(kw => getLongTailKeywords(kw, targetCountry, targetLanguage));
    
    const [relatedKeywordsFlat, questionKeywordsFlat, longTailKeywordsFlat] = await Promise.all([
        Promise.all(relatedKeywordsPromises).then(res => res.flat()).catch(e => { console.error("[API] Error fetching relatedKeywords", e); return []; }),
        Promise.all(questionKeywordsPromises).then(res => res.flat()).catch(e => { console.error("[API] Error fetching questionKeywords", e); return []; }),
        Promise.all(longTailKeywordsPromises).then(res => res.flat()).catch(e => { console.error("[API] Error fetching longTailKeywords", e); return []; })
    ]);
    console.log('[API /api/keyword-research] Fetched flat keyword lists:', { relatedKeywordsFlat, questionKeywordsFlat, longTailKeywordsFlat });

    const processKeywordsWithIntent = async (keywords: Omit<KeywordMetric, 'intent'>[], type: string): Promise<KeywordMetric[]> => {
      console.log(`[API /api/keyword-research] Adding intent to ${type} keywords...`);
      const promises = keywords.map(async (metric) => {
        try {
          if(!metric || typeof metric.keyword !== 'string') {
            console.warn(`[API] Invalid metric object in ${type}:`, metric);
            return { ...metric, keyword: metric?.keyword || 'unknown_keyword', volume: metric?.volume || 'N/A', difficulty: metric?.difficulty || 'N/A', cpc: metric?.cpc || 'N/A', intent: 'Unknown' };
          }
          const intentResult: AnalyzeKeywordIntentOutput = await analyzeKeywordIntent({ keyword: metric.keyword });
          if (!intentResult || typeof intentResult.intent === 'undefined') {
            console.warn(`[API] Intent analysis for ${metric.keyword} (${type}) returned undefined or malformed output. Defaulting intent.`);
            return { ...metric, intent: 'Unknown' };
          }
          return { ...metric, intent: intentResult.intent };
        } catch (innerError: any) {
          console.error(`[API] Error adding intent to ${type} keyword ${metric?.keyword}:`, innerError.message, innerError.stack);
          return { ...metric, keyword: metric?.keyword || 'unknown_keyword', volume: metric?.volume || 'N/A', difficulty: metric?.difficulty || 'N/A', cpc: metric?.cpc || 'N/A', intent: 'Error' };
        }
      });
      const results = await Promise.all(promises);
      console.log(`[API /api/keyword-research] Completed adding intent to ${type} keywords:`, results);
      return results;
    };
    
    const relatedKeywords = await processKeywordsWithIntent(relatedKeywordsFlat, 'related');
    const questionKeywords = await processKeywordsWithIntent(questionKeywordsFlat, 'question');
    const longTailKeywords = await processKeywordsWithIntent(longTailKeywordsFlat, 'longTail');

    console.log('[API /api/keyword-research] Generating allKeywords for clustering...');
    const allGeneratedKeywords = [
      ...relatedKeywords.map(k => k.keyword),
      ...questionKeywords.map(k => k.keyword),
      ...longTailKeywords.map(k => k.keyword),
    ].filter(kw => typeof kw === 'string' && kw.trim() !== '');

    let topicClusters: TopicCluster[] = [];
    if (allGeneratedKeywords.length > 0) {
        const uniqueKeywords = Array.from(new Set(allGeneratedKeywords));
        console.log('[API /api/keyword-research] Calling clusterKeywords flow with unique keywords:', uniqueKeywords);
        try {
            const clusteringResult: ClusterKeywordsOutput = await clusterKeywords({ keywordsList: uniqueKeywords });
            topicClusters = clusteringResult?.clusters || [];
            console.log('[API /api/keyword-research] Topic clusters:', topicClusters);
        } catch (clusterError: any) {
            console.error('[API /api/keyword-research] Error during keyword clustering:', clusterError.message, clusterError.stack);
        }
    } else {
        console.log('[API /api/keyword-research] No keywords generated for clustering.');
    }

    const responseData: KeywordResearchResponse = {
      seedKeywordMetrics,
      relatedKeywords,
      questionKeywords,
      longTailKeywords,
      topicClusters,
      error: "Note: Displaying sample data/AI suggestions. Real-time SEO data API for metrics (volume, difficulty, CPC) integration is pending.", 
    };
    console.log('[API /api/keyword-research] Sending successful response.');
    return NextResponse.json(responseData, { status: 200 });

  } catch (error: any) {
    console.error('[API /api/keyword-research] Critical unhandled error in POST function:', error.message, error.stack);
    return NextResponse.json({ error: error.message || 'An unexpected error occurred during keyword research.' }, { status: 500 });
  }
}
