import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Create a response object with a success message
    const response = NextResponse.json({
      message: "Logout successful",
      success: true,
    });

    // Clear the token cookie by setting it with an expired date
    response.cookies.set("signInToken", "", {
      httpOnly: true,
      expires: new Date(0), // Expire immediately
    });

    // Return the response
    return response;
  } catch (error: any) {
    // Handle any unexpected errors
    return NextResponse.json(
      {
        error: error.message || "Something went wrong",
      },
      { status: 500 } // Internal Server Error
    );
  }
}
