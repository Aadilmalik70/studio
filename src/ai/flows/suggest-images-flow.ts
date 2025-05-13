
'use server';
/**
 * @fileOverview AI flow to generate image suggestions (and actual images) for a blog post,
 * including hints for inline placement.
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
  GenerateImageConceptsOutputSchema,
  type ImageConcept,
} from '@/ai/schemas/suggest-images-schemas';

export type { SuggestImagesInput, SuggestImagesOutput };

export async function suggestImages(input: SuggestImagesInput): Promise<SuggestImagesOutput> {
  return suggestImagesFlow(input);
}

const generateImageConceptsPrompt = ai.definePrompt({
  name: 'generateImageConceptsPrompt',
  input: { schema: SuggestImagesInputSchema },
  output: { schema: GenerateImageConceptsOutputSchema },
  prompt: `You are a Visual Content Strategist and Creative Director for blog posts.
Your task is to analyze the provided blog post content and generate 1-2 distinct image concepts that would enhance its visual appeal and reader engagement.
For each concept, provide:
1.  imageConcept: A concise and descriptive visual idea. THIS CONCEPT WILL BE DIRECTLY USED AS A PROMPT FOR AN IMAGE GENERATION AI. Make it descriptive and evocative. For example, instead of "AI and writing", suggest "A glowing, abstract representation of a neural network merging with a classic fountain pen on a dark, textured background."
2.  altText: Descriptive alt text for the image that will be generated from the imageConcept. This should be good for SEO and accessibility.
3.  insertAfterParagraphContaining: A short, unique text snippet (e.g., the first 7-10 words) from a paragraph in the blog post. The image should be inserted *after* the paragraph that contains this exact snippet. If the image is general or for a header, you can leave this field blank or provide a general hint like "Header". Make sure the snippet is unique enough to be found.

Focus on creating concepts that are:
- Directly relevant to the content of the blog post or a specific section.
- Illustrative or metaphoric, helping to convey key messages.
- Visually engaging and of a professional or appropriate tone for a blog.

Blog Post Title (Optional Context): {{{mainTitle}}}

Full Blog Post Content:
{{{blogPostContent}}}

Please ensure your output is a valid JSON object matching the requested schema, providing an array of concept objects under the 'concepts' key.
Example for one concept object:
{
  "imageConcept": "A futuristic cityscape at dawn with data streams flowing between buildings, symbolizing the flow of information in the digital age.",
  "altText": "Futuristic cityscape at dawn with data streams symbolizing information flow.",
  "insertAfterParagraphContaining": "The digital age has ushered in an unprecedented flow of information" 
} 
If no specific paragraph is suitable, 'insertAfterParagraphContaining' can be an empty string or null.
`,
});

const suggestImagesFlow = ai.defineFlow(
  {
    name: 'suggestImagesFlow',
    inputSchema: SuggestImagesInputSchema,
    outputSchema: SuggestImagesOutputSchema,
  },
  async (input) => {
    // Step 1: Generate image concepts including altText and placement hints
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
          model: 'googleai/gemini-2.0-flash-exp',
          prompt: concept.imageConcept,
          config: {
            responseModalities: ['TEXT', 'IMAGE'],
          },
        });

        if (media && media.url) {
          generatedImageSuggestions.push({
            imageConcept: concept.imageConcept,
            altText: concept.altText,
            imageDataUri: media.url,
            insertAfterParagraphContaining: concept.insertAfterParagraphContaining,
          });
        } else {
          console.warn(`SuggestImagesFlow: Image generation failed or returned no media for concept: "${concept.imageConcept}"`);
        }
      } catch (error) {
        console.error(`SuggestImagesFlow: Error generating image for concept "${concept.imageConcept}":`, error);
      }
    }
    
    if (generatedImageSuggestions.length === 0 && concepts.length > 0) {
        console.warn('SuggestImagesFlow: All image generations failed, though concepts were provided.');
    }

    return { imageSuggestions: generatedImageSuggestions };
  }
);
