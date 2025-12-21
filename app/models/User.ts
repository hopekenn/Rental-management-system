import mongoose, { Schema, models, model } from "mongoose";

const UserSchema = new Schema(
  {
    roomNumber: { type: String, unique: true, sparse: true },
    adminId: { type: String, unique: true, sparse: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["tenant", "admin"],
      required: true,
    },
  },
  { timestamps: true }
);

// Prevent model overwrite in Next.js
export default models.User || model("User", UserSchema);
