
'use server';
/**
 * @fileOverview Genkit flow to cluster a list of keywords into topic groups.
 *
 * - clusterKeywords - A function that groups keywords into topic clusters.
 * - ClusterKeywordsInput - The input type.
 * - ClusterKeywordsOutput - The return type.
 */

import { ai } from '@/ai/genkit';
import { 
    ClusterKeywordsInputSchema,
    type ClusterKeywordsInput,
    ClusterKeywordsOutputSchema,
    type ClusterKeywordsOutput
} from '@/ai/schemas/cluster-keywords-schemas';

export type { ClusterKeywordsInput, ClusterKeywordsOutput };

export async function clusterKeywords(input: ClusterKeywordsInput): Promise<ClusterKeywordsOutput> {
  return clusterKeywordsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'clusterKeywordsPrompt',
  input: { schema: ClusterKeywordsInputSchema },
  output: { schema: ClusterKeywordsOutputSchema },
  prompt: `You are an expert SEO Content Strategist. Based on the following list of keywords, group them into 3-5 distinct topic clusters.
Each cluster should represent a coherent theme. Provide a concise name for each cluster.

Keywords to cluster:
{{#each keywordsList}}
- {{{this}}}
{{/each}}

Output the result as a valid JSON object matching the provided schema. Example:
{
  "clusters": [
    { "clusterName": "Understanding AI Writing", "keywords": ["what is ai writing", "how ai writing works"] },
    { "clusterName": "Benefits of AI for Bloggers", "keywords": ["ai for blog productivity", "save time with ai blogging"] }
  ]
}
`,
});

const clusterKeywordsFlow = ai.defineFlow(
  {
    name: 'clusterKeywordsFlow',
    inputSchema: ClusterKeywordsInputSchema,
    outputSchema: ClusterKeywordsOutputSchema,
  },
  async (input) => {
    if (input.keywordsList.length === 0) {
      return { clusters: [] };
    }
    const { output } = await prompt(input);
    return output || { clusters: [] };
  }
);
