import mongoose, { Schema, Document } from "mongoose";
import moment from "moment-timezone";

export interface User extends Document {
  name: string;
  email: string;
  password: string;
  diseases: string[];
}

const UserSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
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
  diseases: {
    type: [String],
    default: [],
  },
});

const UserModel =
  (mongoose.models.users as mongoose.Model<User>) ||
  mongoose.model<User>("users", UserSchema);

export default UserModel;
