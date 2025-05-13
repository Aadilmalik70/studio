'use server';
/**
 * @fileOverview AI flow to generate image suggestions for a blog post.
 *
 * - suggestImages - A function that generates image suggestions based on blog content.
 * - SuggestImagesInput - The input type for the suggestImages function.
 * - SuggestImagesOutput - The return type for the suggestImages function.
 */

import { ai } from '@/ai/genkit';
import {
  SuggestImagesInputSchema,
  type SuggestImagesInput,
  SuggestImagesOutputSchema,
  type SuggestImagesOutput,
} from '@/ai/schemas/suggest-images-schemas';

export type { SuggestImagesInput, SuggestImagesOutput };

export async function suggestImages(input: SuggestImagesInput): Promise<SuggestImagesOutput> {
  return suggestImagesFlow(input);
}

const suggestImagesPrompt = ai.definePrompt({
  name: 'suggestImagesPrompt',
  input: { schema: SuggestImagesInputSchema },
  output: { schema: SuggestImagesOutputSchema },
  prompt: `You are a Visual Content Strategist and Blog Post Illustrator.
Your task is to analyze the provided blog post content and generate 3-5 distinct image suggestions that would enhance its visual appeal and reader engagement.
For each suggestion, provide the following details:
1.  sectionContext: (Optional) Identify which part of the blog this image is best for (e.g., "Introduction", "Section: Understanding AI", "Conclusion"). If the image is generally applicable, you can omit this.
2.  imageConcept: A concise and descriptive visual idea for the image. Be specific enough that someone could visualize it or search for it.
3.  searchKeywords: An array of 3-5 relevant keywords that a user could use to find a similar image on a royalty-free stock photo website like Unsplash or Pexels.
4.  placementHint: (Optional) A brief suggestion on where this image could be placed within the article relative to the text or headings.

Focus on creating suggestions that are:
- Directly relevant to the content of the blog post or a specific section.
- Illustrative or metaphoric, helping to convey key messages.
- Visually engaging and of a professional or appropriate tone for a blog.
- Diverse in concept to offer variety.

Blog Post Title (Optional Context): {{{mainTitle}}}

Full Blog Post Content:
{{{blogPostContent}}}

Please ensure your output is a valid JSON object matching the provided schema.
Example for one suggestion:
{
  "sectionContext": "Introduction",
  "imageConcept": "A modern, minimalist workspace with a glowing brain icon seamlessly integrating with a traditional fountain pen and notepad, symbolizing the partnership between AI and human creativity in writing.",
  "searchKeywords": ["AI writing assistant", "creative process", "technology content creation", "future of writing", "human-AI collaboration"],
  "placementHint": "As a header image or after the first introductory paragraph to set the theme."
}
Provide an array of such suggestions under the 'imageSuggestions' key.
`,
});

const suggestImagesFlow = ai.defineFlow(
  {
    name: 'suggestImagesFlow',
    inputSchema: SuggestImagesInputSchema,
    outputSchema: SuggestImagesOutputSchema,
  },
  async (input) => {
    const { output } = await suggestImagesPrompt(input);
    if (!output || !output.imageSuggestions) {
      console.warn('SuggestImagesFlow: AI did not return valid image suggestions.');
      return { imageSuggestions: [] };
    }
    return { imageSuggestions: output.imageSuggestions };
  }
);
