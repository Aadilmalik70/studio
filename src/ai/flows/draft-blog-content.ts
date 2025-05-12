'use server';

/**
 * @fileOverview AI flow to generate a draft of a blog post based on a given outline.
 *
 * - draftBlogContent - A function that generates a blog post draft.
 * - DraftBlogContentInput - The input type for the draftBlogContent function.
 * - DraftBlogContentOutput - The return type for the draftBlogContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DraftBlogContentInputSchema = z.object({
  outline: z.string().describe('The outline of the blog post to generate.'),
});
export type DraftBlogContentInput = z.infer<typeof DraftBlogContentInputSchema>;

const DraftBlogContentOutputSchema = z.object({
  draft: z.string().describe('The generated draft of the blog post.'),
  progress: z.string().describe('A short summary of what has been generated.'),
});
export type DraftBlogContentOutput = z.infer<typeof DraftBlogContentOutputSchema>;

export async function draftBlogContent(input: DraftBlogContentInput): Promise<DraftBlogContentOutput> {
  return draftBlogContentFlow(input);
}

const draftBlogContentPrompt = ai.definePrompt({
  name: 'draftBlogContentPrompt',
  input: {schema: DraftBlogContentInputSchema},
  output: {schema: DraftBlogContentOutputSchema},
  prompt: `You are an AI-powered blog content generator. Generate a blog post draft based on the following outline:\n\nOutline: {{{outline}}}\n\nDraft: `,
});

const draftBlogContentFlow = ai.defineFlow(
  {
    name: 'draftBlogContentFlow',
    inputSchema: DraftBlogContentInputSchema,
    outputSchema: DraftBlogContentOutputSchema,
  },
  async input => {
    const {output} = await draftBlogContentPrompt(input);
    return {
      draft: output?.draft ?? 'Failed to generate blog post draft.',
      progress: 'Generated a draft of the blog post based on the provided outline.',
    };
  }
);
