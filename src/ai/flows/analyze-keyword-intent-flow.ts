
'use server';
/**
 * @fileOverview Genkit flow to analyze the search intent of a keyword.
 *
 * - analyzeKeywordIntent - A function that analyzes a keyword's search intent.
 * - AnalyzeKeywordIntentInput - The input type.
 * - AnalyzeKeywordIntentOutput - The return type.
 */

import { ai } from '@/ai/genkit';
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

export async function analyzeKeywordIntent(input: AnalyzeKeywordIntentInput): Promise<AnalyzeKeywordIntentOutput> {
  return analyzeKeywordIntentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeKeywordIntentPrompt',
  input: { schema: AnalyzeKeywordIntentInputSchema },
  output: { schema: AnalyzeKeywordIntentOutputSchema },
  prompt: `You are an SEO expert. Analyze the following keyword and determine the most likely primary search intent.
The primary search intent categories are:
- Informational: The user is looking for information or an answer to a question.
- Navigational: The user wants to go to a specific website or page.
- Commercial Investigation: The user is comparing products, services, or brands before a potential purchase.
- Transactional: The user intends to make a purchase or perform a specific action now.

Keyword: '{{{keyword}}}'

Output only one of the four intent labels: Informational, Navigational, Commercial Investigation, or Transactional. If the intent is unclear or doesn't fit well, output "Unknown".
Ensure your output is a valid JSON object matching the provided schema. For example: { "intent": "Informational" }
`,
});

const analyzeKeywordIntentFlow = ai.defineFlow(
  {
    name: 'analyzeKeywordIntentFlow',
    inputSchema: AnalyzeKeywordIntentInputSchema,
    outputSchema: AnalyzeKeywordIntentOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    // Ensure the output is one of the enum values, default to Unknown if not.
    const validIntents: AnalyzeKeywordIntentOutput['intent'][] = ["Informational", "Navigational", "Commercial Investigation", "Transactional", "Unknown"];
    const intent = output?.intent && validIntents.includes(output.intent as any) ? output.intent as AnalyzeKeywordIntentOutput['intent'] : "Unknown";
    
    return { intent };
  }
);
