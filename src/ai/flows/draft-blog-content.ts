'use server';

/**
 * @fileOverview AI flow to generate a draft of a blog post based on a given outline.
 *
 * - draftBlogContent - A function that generates a blog post draft.
 * - DraftBlogContentInput - The input type for the draftBlogContent function.
 * - DraftBlogContentOutput - The return type for the draftBlogContent function.
 */

import {ai} from '@/ai/genkit';
import { 
    DraftBlogContentInputSchema,
    type DraftBlogContentInput,
    DraftBlogContentOutputSchema,
    type DraftBlogContentOutput
} from '@/ai/schemas/draft-blog-content-schemas';

export type { DraftBlogContentInput, DraftBlogContentOutput };

export async function draftBlogContent(input: DraftBlogContentInput): Promise<DraftBlogContentOutput> {
  return draftBlogContentFlow(input);
}

const draftBlogContentPrompt = ai.definePrompt({
  name: 'draftBlogContentPrompt',
  input: {schema: DraftBlogContentInputSchema},
  output: {schema: DraftBlogContentOutputSchema},
  prompt: `You are an AI-powered blog content generator. Generate a comprehensive and engaging blog post draft based on the following outline.
The blog post should be well-structured, informative, and at least 500 words long.
Ensure proper paragraphing and flow.

Outline: {{{outline}}}

Draft: `,
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
