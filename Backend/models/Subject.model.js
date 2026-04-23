import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema(
  {
    name:         { type: String, required: true, trim: true },
    code:         { type: String, required: true, unique: true, trim: true, uppercase: true },
    maxMarks:     { type: Number, required: true, default: 100 },
    passingMarks: { type: Number, required: true, default: 33 },
  },
  { timestamps: true }
);

export default mongoose.model("Subject", subjectSchema);
