import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    userId:             { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    rollNumber:         { type: String, required: true, unique: true, trim: true },
    registrationNumber: { type: String, required: true, unique: true, trim: true },
    name:               { type: String, required: true, trim: true },
    email:              { type: String, trim: true },
    className:          { type: String, required: true, trim: true },
    section:            { type: String, trim: true },
  },
  { timestamps: true }
);

export default mongoose.model("Student", studentSchema);
