/**
 * @fileOverview Zod schemas and TypeScript types for the AI image suggestion flow.
 */
import { z } from 'genkit';

export const SuggestImagesInputSchema = z.object({
  blogPostContent: z.string().describe('The full text of the drafted blog post.'),
  mainTitle: z.string().optional().describe('The main title of the blog post for context.'),
});
export type SuggestImagesInput = z.infer<typeof SuggestImagesInputSchema>;

export const ImageSuggestionSchema = z.object({
  imageConcept: z.string().describe('A concise and descriptive visual idea that was used to generate the image. This is the prompt used for generation.'),
  altText: z.string().describe('Descriptive alt text for the generated image, suitable for SEO and accessibility.'),
  imageDataUri: z.string().url().describe('The AI-generated image as a base64 data URI.'),
  insertAfterParagraphContaining: z.string().optional().describe('A short, unique text snippet (e.g., first ~10 words) from a paragraph in the blog post. The image should be inserted AFTER the paragraph that starts with or uniquely contains this snippet. If empty or not found, image might be appended or skipped for inline insertion.')
});
export type ImageSuggestion = z.infer<typeof ImageSuggestionSchema>;

export const SuggestImagesOutputSchema = z.object({
  imageSuggestions: z.array(ImageSuggestionSchema).describe('An array of AI-generated image suggestions for the blog post, including placement hints.'),
});
export type SuggestImagesOutput = z.infer<typeof SuggestImagesOutputSchema>;

// Schema for the intermediate step of generating concepts before image generation
export const ImageConceptSchema = z.object({
    imageConcept: z.string().describe('A concise and descriptive visual idea. THIS CONCEPT WILL BE DIRECTLY USED AS A PROMPT FOR AN IMAGE GENERATION AI.'),
    altText: z.string().describe('Descriptive alt text for the generated image, good for SEO and accessibility.'),
    insertAfterParagraphContaining: z.string().optional().describe('A short, unique text snippet (e.g., first ~10 words) from a paragraph in the blog post. The image should be inserted AFTER the paragraph containing this snippet. If empty or not found, image might be appended or skipped for inline insertion.')
});
export type ImageConcept = z.infer<typeof ImageConceptSchema>;

export const GenerateImageConceptsOutputSchema = z.object({
    concepts: z.array(ImageConceptSchema)
});
export type GenerateImageConceptsOutput = z.infer<typeof GenerateImageConceptsOutputSchema>;
