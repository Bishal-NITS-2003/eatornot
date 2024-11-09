import bcrypt from "bcryptjs";
import dbConnect from "../../../lib/dbConnect";
import UserModel from "../../../model/User";

export async function POST(req: Request) {
  await dbConnect();
  try {
    const { name, email, password} = await req.json();


    const existingUserByEmail = await UserModel.findOne({ email });

    if (existingUserByEmail) {
      return Response.json(
        {
          success: false,
          message: "Email already exists. Please login with your credentials",
        },
        { status: 400 },
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new UserModel({
      name,
      email,
      password: hashedPassword,
      diseases: [],
    });

    await newUser.save();

    return Response.json(
      { success: true, message: "User created successfully" },
      { status: 201 },
    );
  } catch (error) {
    return Response.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
