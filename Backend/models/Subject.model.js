import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true, trim: true },
  name: { type: String, required: true, trim: true },
  maxMarks: { type: Number, required: true, default: 100 },
  passingMarks: { type: Number, required: true, default: 33 },
}, { timestamps: true });

export default mongoose.models.Subject || mongoose.model('Subject', subjectSchema);