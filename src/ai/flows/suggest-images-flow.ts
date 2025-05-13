'use server';
/**
 * @fileOverview AI flow to generate image suggestions (and actual images) for a blog post.
 *
 * - suggestImages - A function that generates image concepts and then generates images based on those concepts.
 * - SuggestImagesInput - The input type for the suggestImages function.
 * - SuggestImagesOutput - The return type for the suggestImages function.
 */

import { ai } from '@/ai/genkit';
import {
  SuggestImagesInputSchema,
  type SuggestImagesInput,
  SuggestImagesOutputSchema,
  type SuggestImagesOutput,
  type ImageSuggestion,
} from '@/ai/schemas/suggest-images-schemas';

export type { SuggestImagesInput, SuggestImagesOutput };

export async function suggestImages(input: SuggestImagesInput): Promise<SuggestImagesOutput> {
  return suggestImagesFlow(input);
}

// This prompt now focuses on generating good "imageConcepts" that can be used as prompts for an image generation AI
const generateImageConceptsPrompt = ai.definePrompt({
  name: 'generateImageConceptsPrompt',
  input: { schema: SuggestImagesInputSchema },
  // Output schema for this intermediate step (concepts, not final images yet)
  output: { 
    schema: z.object({
      concepts: z.array(z.object({
        sectionContext: z.string().optional(),
        imageConcept: z.string(), // This will be used as the prompt for image generation
        placementHint: z.string().optional(),
      })),
    }),
  },
  prompt: `You are a Visual Content Strategist and Creative Director for blog posts.
Your task is to analyze the provided blog post content and generate 3 distinct image concepts that would enhance its visual appeal and reader engagement.
For each concept, provide the following details:
1.  sectionContext: (Optional) Identify which part of the blog this image is best for (e.g., "Introduction", "Section: Understanding AI", "Conclusion"). If the image is generally applicable, you can omit this.
2.  imageConcept: A concise and descriptive visual idea. THIS CONCEPT WILL BE DIRECTLY USED AS A PROMPT FOR AN IMAGE GENERATION AI. Make it descriptive and evocative. For example, instead of "AI and writing", suggest "A glowing, abstract representation of a neural network merging with a classic fountain pen on a dark, textured background."
3.  placementHint: (Optional) A brief suggestion on where this image could be placed within the article relative to the text or headings.

Focus on creating concepts that are:
- Directly relevant to the content of the blog post or a specific section.
- Illustrative or metaphoric, helping to convey key messages.
- Visually engaging and of a professional or appropriate tone for a blog.
- Diverse in concept to offer variety.

Blog Post Title (Optional Context): {{{mainTitle}}}

Full Blog Post Content:
{{{blogPostContent}}}

Please ensure your output is a valid JSON object matching the requested schema.
Example for one concept object:
{
  "sectionContext": "Introduction",
  "imageConcept": "A futuristic cityscape at dawn with data streams flowing between buildings, symbolizing the flow of information in the digital age.",
  "placementHint": "As a header image or after the first introductory paragraph to set the theme."
}
Provide an array of such concept objects under the 'concepts' key.
`,
});

const suggestImagesFlow = ai.defineFlow(
  {
    name: 'suggestImagesFlow',
    inputSchema: SuggestImagesInputSchema,
    outputSchema: SuggestImagesOutputSchema,
  },
  async (input) => {
    // Step 1: Generate image concepts
    const conceptsResponse = await generateImageConceptsPrompt(input);
    const concepts = conceptsResponse.output?.concepts;

    if (!concepts || concepts.length === 0) {
      console.warn('SuggestImagesFlow: AI did not return valid image concepts.');
      return { imageSuggestions: [] };
    }

    const generatedImageSuggestions: ImageSuggestion[] = [];

    // Step 2: Generate images for each concept
    for (const concept of concepts) {
      if (!concept.imageConcept || concept.imageConcept.trim() === "") {
        console.warn('SuggestImagesFlow: Skipping concept with empty imageConcept:', concept);
        continue;
      }
      try {
        console.log(`SuggestImagesFlow: Generating image for concept: "${concept.imageConcept}"`);
        const { media } = await ai.generate({
          model: 'googleai/gemini-2.0-flash-exp', // IMPORTANT: Use the specified model for image generation
          prompt: concept.imageConcept, // Use the concept as the prompt
          config: {
            responseModalities: ['TEXT', 'IMAGE'], // Must provide both
          },
        });

        if (media && media.url) {
          generatedImageSuggestions.push({
            sectionContext: concept.sectionContext,
            imageConcept: concept.imageConcept, // This is the prompt used, good for alt text
            imageDataUri: media.url, // This is the data URI of the generated image
            placementHint: concept.placementHint,
          });
        } else {
          console.warn(`SuggestImagesFlow: Image generation failed or returned no media for concept: "${concept.imageConcept}"`);
        }
      } catch (error) {
        console.error(`SuggestImagesFlow: Error generating image for concept "${concept.imageConcept}":`, error);
        // Optionally, you could add a placeholder or error state for this specific image suggestion
      }
    }
    
    if (generatedImageSuggestions.length === 0 && concepts.length > 0) {
        console.warn('SuggestImagesFlow: All image generations failed, though concepts were provided.');
    }

    return { imageSuggestions: generatedImageSuggestions };
  }
);
