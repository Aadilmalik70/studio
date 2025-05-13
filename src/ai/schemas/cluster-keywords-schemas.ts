/**
 * @fileOverview Zod schemas and TypeScript types for the keyword clustering flow.
 */
import { z } from 'genkit';

export const ClusterKeywordsInputSchema = z.object({
  keywordsList: z.array(z.string()).describe('A list of keywords to cluster.'),
});
export type ClusterKeywordsInput = z.infer<typeof ClusterKeywordsInputSchema>;

export const ClusterKeywordsOutputSchema = z.object({
  clusters: z.array(z.object({
    clusterName: z.string().describe('A concise name for the topic cluster.'),
    keywords: z.array(z.string()).describe('Keywords belonging to this cluster.'),
  })).describe('An array of topic clusters, each with a name and associated keywords.'),
});
export type ClusterKeywordsOutput = z.infer<typeof ClusterKeywordsOutputSchema>;
