import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/user.model.js';
import Student from '../models/Student.model.js';
import Subject from '../models/Subject.model.js';
import Session from '../models/Session.model.js';
import Result from '../models/Marks.model.js';

dotenv.config();

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB...');

  // Drop old collections to clear indexes
  try {
    await mongoose.connection.collection('users').drop();
    await mongoose.connection.collection('students').drop();
    await mongoose.connection.collection('subjects').drop();
    await mongoose.connection.collection('sessions').drop();
    await mongoose.connection.collection('results').drop();
  } catch (e) {
    // Collections might not exist yet
  }

  // Clear all documents
  await Promise.all([User.deleteMany(), Student.deleteMany(), Subject.deleteMany(), Session.deleteMany(), Result.deleteMany()]);
  console.log('Cleared existing data...');

  // Create teacher
  const teacher = await User.create({ username: 'teacher', password: 'teacher123', role: 'teacher', name: 'Ramesh Kumar' });
  console.log('Teacher created: username=teacher, password=teacher123');

  // Create subjects
  const subjects = await Subject.insertMany([
    { code: 'ENG', name: 'English', maxMarks: 100, passingMarks: 33 },
    { code: 'HIN', name: 'Hindi', maxMarks: 100, passingMarks: 33 },
    { code: 'MATH', name: 'Mathematics', maxMarks: 100, passingMarks: 33 },
    { code: 'SCI', name: 'Science', maxMarks: 100, passingMarks: 33 },
    { code: 'SST', name: 'Social Studies', maxMarks: 100, passingMarks: 33 },
  ]);
  console.log('Subjects created...');

  // Create sessions
  const session2425 = await Session.create({ name: '2024-25 Annual Exam', year: '2024-2025', isActive: true });
  const session2324Annual = await Session.create({ name: '2023-24 Annual Exam', year: '2023-2024', isActive: false });
  const session2324HY = await Session.create({ name: '2023-24 Half Yearly', year: '2023-2024', isActive: false });
  console.log('Sessions created...');

  // Create students with user accounts
  const studentData = [
    { rollNumber: 'S001', name: 'Arjun Singh', registrationNo: 'REG2024001', className: '10th', section: 'A', email: 'arjun@school.com', password: 'student123' },
    { rollNumber: 'S002', name: 'Priya Patel', registrationNo: 'REG2024002', className: '10th', section: 'A', email: 'priya@school.com', password: 'student123' },
    { rollNumber: 'S003', name: 'Rahul Gupta', registrationNo: 'REG2024003', className: '10th', section: 'B', email: 'rahul@school.com', password: 'student123' },
    { rollNumber: 'S004', name: 'Anjali Sharma', registrationNo: 'REG2024004', className: '10th', section: 'B', email: 'anjali@school.com', password: 'student123' },
    { rollNumber: 'S005', name: 'Vikram Kumar', registrationNo: 'REG2024005', className: '10th', section: 'A', email: 'vikram@school.com', password: 'student123' },
    { rollNumber: '22-CSE-4944', name: 'Amrender kumar', registrationNo: '87876755', className: 'B.Tech', section: 'A', email: 'amrender@school.com', password: 'student123' },
  ];

  const students = [];
  for (const sd of studentData) {
    const user = await User.create({ username: sd.rollNumber, password: sd.password, role: 'student', name: sd.name });
    const student = await Student.create({ ...sd, userId: user._id });
    students.push(student);
    console.log(`Student created: username=${sd.rollNumber}, password=${sd.password}`);
  }

  // Seed results for 2024-25
  const marks2425 = [
    [82, 79, 88, 82, 85], // Arjun  - 425/500
    [95, 90, 95, 91, 94], // Priya  - 465/500
    [60, 62, 65, 63, 66], // Rahul  - 316/500
    [78, 80, 77, 79, 78], // Anjali - 392/500
    [70, 72, 68, 75, 73], // Vikram - 358/500
    [60, 65, 62, 60, 65], // Amrender - 312/500
  ];

  const subjectOrder = ['SCI', 'HIN', 'MATH', 'ENG', 'SST'];
  const orderedSubjects = subjectOrder.map(code => subjects.find(s => s.code === code));

  for (let i = 0; i < students.length; i++) {
    const result = new Result({
      student: students[i]._id,
      session: session2425._id,
      marks: orderedSubjects.map((sub, idx) => ({ subject: sub._id, marksObtained: marks2425[i][idx] })),
    });
    await result.save();
  }

  // Seed older results for Arjun (performance trend)
  const arjun = students[0];
  const result2324Annual = new Result({
    student: arjun._id, session: session2324Annual._id,
    marks: orderedSubjects.map((sub, idx) => ({ subject: sub._id, marksObtained: [78, 79, 77, 76, 80][idx] })),
  });
  await result2324Annual.save();

  const result2324HY = new Result({
    student: arjun._id, session: session2324HY._id,
    marks: orderedSubjects.map((sub, idx) => ({ subject: sub._id, marksObtained: [72, 73, 74, 71, 75][idx] })),
  });
  await result2324HY.save();

  console.log('\n✅ SEED COMPLETE!');
  console.log('==============================================');
  console.log('Teacher Login: username=teacher  password=teacher123');
  console.log('Student Login: username=S001     password=student123');
  console.log('==============================================');
  mongoose.disconnect();
};

seed().catch(err => { console.error(err); mongoose.disconnect(); });