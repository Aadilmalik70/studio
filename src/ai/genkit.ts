import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// The googleAI plugin typically looks for GOOGLE_API_KEY.
// The README might mention GENAI_API_KEY. Check for both to be safe.
const googleApiKey = process.env.GOOGLE_API_KEY;
const genaiApiKey = process.env.GENAI_API_KEY;

if (!googleApiKey && !genaiApiKey) {
  console.warn(
    'WARNING: Genkit/GoogleAI - GOOGLE_API_KEY (or GENAI_API_KEY) is not set in environment variables. ' +
    'Google AI features will likely fail to initialize or work correctly. ' +
    'Please ensure one of these is set with a valid API key in your .env file and restart the server.'
  );
} else if (genaiApiKey && !googleApiKey) {
  console.warn(
    'WARNING: Genkit/GoogleAI - GENAI_API_KEY is set, but the googleAI plugin typically uses GOOGLE_API_KEY. ' +
    'If issues occur, try renaming GENAI_API_KEY to GOOGLE_API_KEY in your .env file.'
  )
}


export const ai = genkit({
  plugins: [
    googleAI() // This will use GOOGLE_API_KEY from process.env by default if no apiKey is passed in options
  ],
  // The model property here sets a default model for ai.generate() if not specified at call time.
  // It does not affect plugin initialization directly.
  model: 'googleai/gemini-2.0-flash', 
});
