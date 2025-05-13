/**
 * @fileOverview Zod schemas and TypeScript types for the blog idea generation flow.
 */
import { z } from 'genkit';

export const GenerateBlogIdeasInputSchema = z.object({
  keyword: z.string().describe('The keyword to generate blog post ideas for.'),
});
export type GenerateBlogIdeasInput = z.infer<typeof GenerateBlogIdeasInputSchema>;

export const GenerateBlogIdeasOutputSchema = z.object({
  ideas: z
    .array(z.object({
      title: z.string().describe('The title of the blog post.'),
      outline: z.string().describe('The outline of the blog post.'),
    }))
    .describe('An array of blog post ideas.'),
});
export type GenerateBlogIdeasOutput = z.infer<typeof GenerateBlogIdeasOutputSchema>;
