/**
 * @fileOverview Zod schemas and TypeScript types for the blog content drafting flow.
 */
import { z } from 'genkit';

export const DraftBlogContentInputSchema = z.object({
  outline: z.string().describe('The outline of the blog post to generate.'),
});
export type DraftBlogContentInput = z.infer<typeof DraftBlogContentInputSchema>;

export const DraftBlogContentOutputSchema = z.object({
  draft: z.string().describe('The generated draft of the blog post.'),
  progress: z.string().describe('A short summary of what has been generated.'),
});
export type DraftBlogContentOutput = z.infer<typeof DraftBlogContentOutputSchema>;
