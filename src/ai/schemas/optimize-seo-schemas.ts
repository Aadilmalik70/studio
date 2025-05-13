/**
 * @fileOverview Zod schemas and TypeScript types for the SEO optimization flow.
 */
import { z } from 'genkit';

export const OptimizeSeoInputSchema = z.object({
  blogPostContent: z
    .string()
    .describe('The content of the blog post to optimize for SEO.'),
  keyword: z.string().describe('The primary keyword for the blog post.'),
});
export type OptimizeSeoInput = z.infer<typeof OptimizeSeoInputSchema>;

export const OptimizeSeoOutputSchema = z.object({
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
