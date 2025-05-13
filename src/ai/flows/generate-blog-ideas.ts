
'use server';

/**
 * @fileOverview Blog post idea generator flow.
 *
 * - generateBlogIdeas - A function that generates blog post titles and outlines from a keyword.
 * - GenerateBlogIdeasInput - The input type for the generateBlogIdeas function.
 * - GenerateBlogIdeasOutput - The return type for the generateBlogIdeas function.
 */

import {ai} from '@/ai/genkit';
import {
    GenerateBlogIdeasInputSchema,
    type GenerateBlogIdeasInput,
    GenerateBlogIdeasOutputSchema,
    type GenerateBlogIdeasOutput
} from '@/ai/schemas/generate-blog-ideas-schemas';

export type { GenerateBlogIdeasInput, GenerateBlogIdeasOutput };

export async function generateBlogIdeas(input: GenerateBlogIdeasInput): Promise<GenerateBlogIdeasOutput> {
  return generateBlogIdeasFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateBlogIdeasPrompt',
  input: {schema: GenerateBlogIdeasInputSchema},
  output: {schema: GenerateBlogIdeasOutputSchema},
  prompt: `You are an expert blog post idea generator.

You will generate several blog post titles and outlines based on the given keyword.

Keyword: {{{keyword}}}

Respond in JSON format.

Example:
{
  "ideas": [
    {
      "title": "The Ultimate Guide to Genkit",
      "outline": "1. Introduction to Genkit\\n2. Genkit Features\\n3. How to Use Genkit\\n4. Genkit Benefits\\n5. Conclusion"
    },
    {
      "title": "5 Ways Genkit Can Improve Your Productivity",
      "outline": "1. Automate tasks\\n2. Generate content quickly\\n3. Get more done in less time\\n4. Stay organized\\n5. Conclusion"
    }
  ]
}
`,
});

const generateBlogIdeasFlow = ai.defineFlow(
  {
    name: 'generateBlogIdeasFlow',
    inputSchema: GenerateBlogIdeasInputSchema,
    outputSchema: GenerateBlogIdeasOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
