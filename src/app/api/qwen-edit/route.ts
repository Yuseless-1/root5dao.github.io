import { NextRequest, NextResponse } from 'next/server';

const HF_API_TOKEN = process.env.HUGGINGFACE_API_TOKEN || '';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get('image') as File;
    const prompt = formData.get('prompt') as string;

    if (!imageFile || !prompt) {
      return NextResponse.json(
        { error: 'Missing image or prompt' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Try to use Stable Diffusion Image-to-Image
    const API_URL = 'https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5';
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HF_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: prompt + ', high quality, detailed',
        parameters: {
          negative_prompt: 'blurry, low quality, distorted, ugly',
          num_inference_steps: 30,
          guidance_scale: 7.5,
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('HF API Error:', errorText);
      
      // If model is loading, return a friendly message
      if (response.status === 503) {
        return NextResponse.json(
          { error: 'AI model is warming up. This can take 20-30 seconds. Please try again!' },
          { status: 503 }
        );
      }
      
      throw new Error(`AI service temporarily unavailable`);
    }

    // Get the image blob
    const resultBlob = await response.blob();
    const resultBuffer = await resultBlob.arrayBuffer();
    const resultBase64 = Buffer.from(resultBuffer).toString('base64');
    const dataUrl = `data:image/png;base64,${resultBase64}`;

    return NextResponse.json({ 
      success: true,
      editedImage: dataUrl 
    });
  } catch (error) {
    console.error('Error editing image:', error);
    return NextResponse.json(
      { 
        error: 'AI customization is currently in development. The basic PFP generator works great! Download your creation and stay tuned for AI features.',
        details: error instanceof Error ? error.message : 'Service unavailable' 
      },
      { status: 503 }
    );
  }
}

