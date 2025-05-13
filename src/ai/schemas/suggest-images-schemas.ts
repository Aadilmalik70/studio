/**
 * @fileOverview Zod schemas and TypeScript types for the AI image suggestion flow.
 */
import { z } from 'genkit';

export const SuggestImagesInputSchema = z.object({
  blogPostContent: z.string().describe('The full text of the drafted blog post.'),
  mainTitle: z.string().optional().describe('The main title of the blog post for context.'),
  // keySections could be added later for more targeted suggestions per section
  // keySections: z.array(z.object({ heading: z.string().optional(), summary: z.string() })).optional()
  //   .describe('An array of key sections from the blog post, each with an optional heading and a brief summary/content snippet of that section.'),
});
export type SuggestImagesInput = z.infer<typeof SuggestImagesInputSchema>;

export const ImageSuggestionSchema = z.object({
  sectionContext: z.string().optional().describe('Which part of the blog this image is best for (e.g., "Introduction", "Section: AI-Driven Content Optimization").'),
  imageConcept: z.string().describe('A concise description of the visual idea (e.g., "A diverse team collaborating around a computer showing data charts," "A single lightbulb glowing brightly against a dark background representing an idea").'),
  searchKeywords: z.array(z.string()).describe('An array of 3-5 keywords to find such an image on a stock photo site (e.g., ["team collaboration data analytics", "innovation lightbulb idea dark"]).'),
  placementHint: z.string().optional().describe('A brief suggestion on where this image could be placed in relation to the text (e.g., "As a header image", "After the first H2 heading," "Alongside the paragraph discussing benefits").'),
});
export type ImageSuggestion = z.infer<typeof ImageSuggestionSchema>;

export const SuggestImagesOutputSchema = z.object({
  imageSuggestions: z.array(ImageSuggestionSchema).describe('An array of AI-generated image suggestions for the blog post.'),
});
export type SuggestImagesOutput = z.infer<typeof SuggestImagesOutputSchema>;
