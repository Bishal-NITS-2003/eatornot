import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { base64Image, confidenceThreshold = 0.1 } = await req.json();

    if (!base64Image) {
      return NextResponse.json(
        { success: false, message: "No image data provided" },
        { status: 400 }
      );
    }

    const clarifaiAPIKey = process.env.FOOD_CLARIFAI_API_KEY;
    const clarifaiURL = `https://api.clarifai.com/v2/users/clarifai/apps/main/models/food-item-recognition/versions/1d5fd481e0cf4826aa72ec3ff049e044/outputs`;

    const response = await fetch(clarifaiURL, {
      method: "POST",
      headers: {
        "Authorization": `Key ${clarifaiAPIKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: [
          {
            data: {
              image: {
                base64: base64Image,
              },
            },
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { success: false, message: "Clarifai API error", details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();
    // Filter ingredients based on confidence score
    const ingredients =
      data?.outputs?.[0]?.data?.concepts
        ?.filter((concept: any) => concept.value >= confidenceThreshold) // Only include concepts with high confidence
        .map((concept: any) => concept.name) || []; // Extract their names

    return NextResponse.json({ success: true, ingredients }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "An unexpected error occurred", error },
      { status: 500 }
    );
  }
}
