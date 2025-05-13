import { NextResponse, type NextRequest } from 'next/server';
import { ZodError } from 'zod';
import { SuggestImagesInputSchema, type SuggestImagesInput } from '@/ai/schemas/suggest-images-schemas';
import { suggestImages } from '@/ai/flows/suggest-images-flow';

export async function POST(request: NextRequest) {
  console.log('[API /api/suggest-images] Received POST request');
  try {
    const googleApiKey = process.env.GOOGLE_API_KEY;
    const genaiApiKey = process.env.GENAI_API_KEY;

    if (!googleApiKey && !genaiApiKey) {
      console.error('[API /api/suggest-images] CRITICAL: Genkit API key (GOOGLE_API_KEY or GENAI_API_KEY) is not configured.');
      return NextResponse.json({ error: 'AI service is not configured. Please contact support.' }, { status: 500 });
    }

    let body;
    try {
      body = await request.json();
      console.log('[API /api/suggest-images] Parsed request body:', body);
    } catch (jsonError: any) {
      console.error('[API /api/suggest-images] Error parsing request JSON:', jsonError.message);
      return NextResponse.json({ error: 'Invalid JSON in request body', details: jsonError.message }, { status: 400 });
    }

    const validationResult = SuggestImagesInputSchema.safeParse(body);

    if (!validationResult.success) {
      const zodError = validationResult.error as ZodError<SuggestImagesInput>;
      console.error('[API /api/suggest-images] Zod validation failed:', zodError.flatten());
      return NextResponse.json({ error: 'Invalid request body', details: zodError.flatten() }, { status: 400 });
    }

    const inputData: SuggestImagesInput = validationResult.data;
    console.log('[API /api/suggest-images] Validation successful. Calling suggestImages flow...');

    const result = await suggestImages(inputData);
    console.log('[API /api/suggest-images] suggestImages flow completed. Result:', result);

    return NextResponse.json(result, { status: 200 });

  } catch (error: any) {
    console.error('[API /api/suggest-images] Critical unhandled error in POST function:', error.message, error.stack);
    let errorMessage = 'An unexpected error occurred while suggesting images.';
    if (error instanceof ZodError) {
        errorMessage = 'Invalid data format from AI service.';
    } else if (error.message) {
        errorMessage = error.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
