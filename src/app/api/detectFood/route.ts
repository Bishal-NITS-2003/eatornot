import { NextResponse } from 'next/server';
import { Clarifai } from 'clarifai';

const PAT = 'your_personal_access_token'; // Replace with your personal access token
const MODEL_ID = 'food-item-recognition'; // The model you want to use
const MODEL_VERSION_ID = '1d5fd481e0cf4826aa72ec3ff049e044'; // Optional version ID, replace with the correct one

const clarifaiApp = new Clarifai.App({ apiKey: PAT });

export async function POST(req: Request) {
  try {
    const { imageBase64 } = await req.json();

    const response = await clarifaiApp.models.predict(
      MODEL_ID, 
      { base64: imageBase64 }, 
      { model_version: MODEL_VERSION_ID }
    );

    if (response.status.code !== 10000) {
      return NextResponse.json(
        { message: 'Failed to analyze the image' },
        { status: 400 }
      );
    }

    // Get the concepts from the response
    const concepts = response.outputs[0].data.concepts;

    return NextResponse.json({ concepts });
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to detect food item', error: error.message },
      { status: 500 }
    );
  }
}
