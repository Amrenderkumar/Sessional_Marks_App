import mongoose from "mongoose";

const markSchema = new mongoose.Schema(
  {
    studentId:     { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    subjectId:     { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },
    sessionId:     { type: mongoose.Schema.Types.ObjectId, ref: "Session", required: true },
    marksObtained: { type: Number, required: true, min: 0 },
    grade:         { type: String, trim: true },
    remarks:       { type: String, trim: true },
  },
  { timestamps: true }
);

markSchema.index({ studentId: 1, subjectId: 1, sessionId: 1 }, { unique: true });

export default mongoose.model("Mark", markSchema);
