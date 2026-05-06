import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  year: { type: String, required: true },
  isActive: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.models.Session || mongoose.model('Session', sessionSchema);