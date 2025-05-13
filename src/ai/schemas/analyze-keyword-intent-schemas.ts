/**
 * @fileOverview Zod schemas and TypeScript types for the keyword intent analysis flow.
 */
import { z } from 'genkit';

export const AnalyzeKeywordIntentInputSchema = z.object({
  keyword: z.string().describe('The keyword to analyze for search intent.'),
});
export type AnalyzeKeywordIntentInput = z.infer<typeof AnalyzeKeywordIntentInputSchema>;

export const AnalyzeKeywordIntentOutputSchema = z.object({
  intent: z.enum(["Informational", "Navigational", "Commercial Investigation", "Transactional", "Unknown"])
            .describe('The classified search intent of the keyword.'),
});
export type AnalyzeKeywordIntentOutput = z.infer<typeof AnalyzeKeywordIntentOutputSchema>;
