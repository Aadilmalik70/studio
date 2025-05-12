'use server';

/**
 * @fileOverview AI flow to generate SEO-optimized meta titles and descriptions for blog posts.
 *
 * - optimizeSeo - A function that generates SEO-optimized meta titles and descriptions for a given blog post.
 * - OptimizeSeoInput - The input type for the optimizeSeo function.
 * - OptimizeSeoOutput - The return type for the optimizeSeo function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OptimizeSeoInputSchema = z.object({
  blogPostContent: z
    .string()
    .describe('The content of the blog post to optimize for SEO.'),
  keyword: z.string().describe('The primary keyword for the blog post.'),
});

export type OptimizeSeoInput = z.infer<typeof OptimizeSeoInputSchema>;

const OptimizeSeoOutputSchema = z.object({
  metaTitle: z
    .string()
    .describe('The SEO-optimized meta title for the blog post.'),
  metaDescription: z
    .string()
    .describe(
      'The SEO-optimized meta description for the blog post. Should be between 150-160 characters.'
    ),
});

export type OptimizeSeoOutput = z.infer<typeof OptimizeSeoOutputSchema>;

export async function optimizeSeo(
  input: OptimizeSeoInput
): Promise<OptimizeSeoOutput> {
  return optimizeSeoFlow(input);
}

const prompt = ai.definePrompt({
  name: 'optimizeSeoPrompt',
  input: {schema: OptimizeSeoInputSchema},
  output: {schema: OptimizeSeoOutputSchema},
  prompt: `You are an SEO expert specializing in creating compelling meta titles and descriptions.

  Given the blog post content and the primary keyword, generate an SEO-optimized meta title and a concise meta description.
  The meta description should be between 150-160 characters to maximize its effectiveness in search engine results.

  Blog Post Content: {{{blogPostContent}}}
  Primary Keyword: {{{keyword}}}
  Make sure to include the keyword in both the meta title and meta description.
  Follow all best practices of SEO.
  Make the user want to click on the result.
  `,
});

const optimizeSeoFlow = ai.defineFlow(
  {
    name: 'optimizeSeoFlow',
    inputSchema: OptimizeSeoInputSchema,
    outputSchema: OptimizeSeoOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
