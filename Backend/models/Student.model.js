import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  rollNumber: { type: String, required: true, unique: true, trim: true },
  name: { type: String, required: true, trim: true },
  registrationNo: { type: String, required: true, unique: true },
  className: { type: String, required: true },
  section: { type: String, required: true },
  email: { type: String, trim: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

export default mongoose.models.Student || mongoose.model('Student', studentSchema);