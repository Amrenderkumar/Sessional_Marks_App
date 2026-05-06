import mongoose from 'mongoose';
import Subject from './Subject.model.js';

const markEntrySchema = new mongoose.Schema({
  subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  marksObtained: { type: Number, required: true, min: 0 },
});

const resultSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  session: { type: mongoose.Schema.Types.ObjectId, ref: 'Session', required: true },
  marks: [markEntrySchema],
  totalMarks: { type: Number, default: 0 },
  maxTotalMarks: { type: Number, default: 0 },
  percentage: { type: Number, default: 0 },
  grade: { type: String, default: '' },
  status: { type: String, enum: ['PASS', 'FAIL'], default: 'FAIL' },
}, { timestamps: true });

// Auto calculate on save
resultSchema.pre('save', async function (next) {
  let total = 0;
  let maxTotal = 0;
  let failed = false;

  for (const entry of this.marks) {
    const subject = await Subject.findById(entry.subject);
    if (subject) {
      total += entry.marksObtained;
      maxTotal += subject.maxMarks;
      if (entry.marksObtained < subject.passingMarks) failed = true;
    }
  }

  this.totalMarks = total;
  this.maxTotalMarks = maxTotal;
  this.percentage = maxTotal > 0 ? parseFloat(((total / maxTotal) * 100).toFixed(1)) : 0;
  this.status = failed ? 'FAIL' : 'PASS';

  const p = this.percentage;
  if (p >= 90) this.grade = 'A+';
  else if (p >= 80) this.grade = 'A';
  else if (p >= 70) this.grade = 'B+';
  else if (p >= 60) this.grade = 'B';
  else if (p >= 50) this.grade = 'C';
  else if (p >= 33) this.grade = 'D';
  else this.grade = 'F';
});

export default mongoose.models.Result || mongoose.model('Result', resultSchema);