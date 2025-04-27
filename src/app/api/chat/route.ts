import { NextRequest, NextResponse } from 'next/server';
import { defaultModels } from '@/lib/models';
import { generateCompletion } from '@/lib/server-api-service';

export async function POST(req: NextRequest) {
  try {
    const { prompt, modelId, apiKey } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    if (!modelId) {
      return NextResponse.json(
        { error: 'Model ID is required' },
        { status: 400 }
      );
    }

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key is required' },
        { status: 400 }
      );
    }

    const model = defaultModels.find((m) => m.id === modelId);
    if (!model) {
      return NextResponse.json(
        { error: 'Invalid model ID' },
        { status: 400 }
      );
    }

    try {
      // Use the server-side API service to get responses from the actual AI providers
      const content = await generateCompletion(model, prompt, apiKey);
      return NextResponse.json({ content });
    } catch (error) {
      console.error(`Error calling ${model.provider} API:`, error);
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Error calling the AI service' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in chat API route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 