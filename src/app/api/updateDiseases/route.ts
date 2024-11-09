import dbConnect from '../../../lib/dbConnect';
import UserModel from '../../../model/User';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(req: NextRequest) {
  try {
    const { userId, diseases } = await req.json(); // Get userId and diseases from the request body

    // Connect to the database
    await dbConnect();

    // Find the user by userId and update the diseases array
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { diseases },
      { new: true } // Return the updated user document
    );

    // If user is not found
    if (!updatedUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Return the updated user data
    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export const config = {
  api: {
    bodyParser: true,
  },
};
