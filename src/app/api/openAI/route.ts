import { NextResponse } from 'next/server';

const API_KEY = process.env.HUGINGFACE_API_KEY;  // Use your actual Hugging Face API key

export async function POST(request: Request) {
  try {
    const { question } = await request.json();

    const response = await fetch('https://api-inference.huggingface.co/models/gpt2', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: question,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch from Hugging Face');
    }

    const data = await response.json();
    const responseText = data.generated_text || 'No response';

    return NextResponse.json({ answer: responseText });
  } catch (error) {
    console.error("Error querying Hugging Face:", error);
    return NextResponse.json({ error: "Failed to fetch response from Hugging Face" }, { status: 500 });
  }
}
