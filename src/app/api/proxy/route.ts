import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { foodItem, userDiseases } = await req.json();

    const apiUrl =
      "https://api.clarifai.com/v2/users/openai/apps/chat-completion/models/GPT-4/versions/9e87c1d976fb490f8ee85bf858cee568/outputs";

    const apiKey = process.env.CLARIFAI_API_KEY; // Store your Clarifai API key in .env file for security

    const clarifaiResponse = await fetch(apiUrl, {
      method: "POST",
      headers: {
        Authorization: `Key ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: [
          {
            data: {
              text: {
                raw: `I have these Diseases: ${userDiseases.join(", ")} and my Food Item has ingrediants: ${foodItem.join(", ")} can I have it? Answer in this format you may/ may not eat this food item due to this disease`,
              },
            },
          },
        ],
      }),
    });

    if (!clarifaiResponse.ok) {
      return NextResponse.json(
        { success: false, message: "Clarifai API call failed" },
        { status: clarifaiResponse.status }
      );
    }

    const clarifaiData = await clarifaiResponse.json();

    return NextResponse.json(
      {
        success: true,
        data: clarifaiData.outputs[0]?.data?.text?.raw || "No result found.",
      },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { success: false, message: "An error occurred", error: err.message },
      { status: 500 }
    );
  }
}
