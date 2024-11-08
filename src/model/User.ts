import mongoose, { Schema, Document } from "mongoose";
import moment from "moment-timezone";

export interface User extends Document {
  username: string;
  email: string;
  password: string;
  imageUrl?: string;
  diseases?: string[];
}

const UserSchema: Schema = new Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [/\S+@\S+\.\S+/, "Please enter a valid email"],
  },
  password: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
  },
  diseases: {
    type: String,
  },
});

const UserModel =
  (mongoose.models.users as mongoose.Model<User>) ||
  mongoose.model<User>("users", UserSchema);

export default UserModel;
