import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { connectDB } from "../db/db.js";
import User from "../models/user.model.js";
import Student from "../models/Student.model.js";
import Subject from "../models/Subject.model.js";
import Session from "../models/Session.model.js";
import Mark from "../models/Marks.model.js";
import { calculateGrade } from "./grading.js";

dotenv.config();

async function seed() {
  await connectDB();
  console.log("Clearing old data...");
  await Promise.all([
    User.deleteMany({}), Student.deleteMany({}),
    Subject.deleteMany({}), Session.deleteMany({}), Mark.deleteMany({}),
  ]);

  const teacherPwd = await bcrypt.hash("teacher123", 10);
  const studentPwd = await bcrypt.hash("student123", 10);

  await User.create({ username: "teacher1", password: teacherPwd, name: "Mr. Sharma", role: "teacher" });

  const subjects = await Subject.insertMany([
    { name: "Mathematics", code: "MATH101", maxMarks: 100, passingMarks: 33 },
    { name: "Physics", code: "PHY101", maxMarks: 100, passingMarks: 33 },
    { name: "Chemistry", code: "CHEM101", maxMarks: 100, passingMarks: 33 },
    { name: "English", code: "ENG101", maxMarks: 100, passingMarks: 33 },
    { name: "Computer Science", code: "CS101", maxMarks: 100, passingMarks: 33 },
  ]);

  const sessions = await Session.insertMany([
    { name: "Sessional 1", year: "2024-25", isActive: false },
    { name: "Sessional 2", year: "2024-25", isActive: false },
    { name: "Final", year: "2024-25", isActive: true },
  ]);

  const studentData = [
    { roll: "S001", reg: "BRCM2024001", name: "Aarav Patel" },
    { roll: "S002", reg: "BRCM2024002", name: "Diya Sharma" },
    { roll: "S003", reg: "BRCM2024003", name: "Rohan Verma" },
    { roll: "S004", reg: "BRCM2024004", name: "Ishita Gupta" },
    { roll: "S005", reg: "BRCM2024005", name: "Karan Singh" },
  ];

  for (const sd of studentData) {
    const u = await User.create({ username: sd.roll, password: studentPwd, name: sd.name, role: "student" });
    const s = await Student.create({
      userId: u._id, rollNumber: sd.roll, registrationNumber: sd.reg,
      name: sd.name, className: "10", section: "A",
    });
    for (const subj of subjects) {
      for (const sess of sessions) {
        const marks = Math.floor(Math.random() * 50) + 45;
        await Mark.create({
          studentId: s._id, subjectId: subj._id, sessionId: sess._id,
          marksObtained: marks, grade: calculateGrade(marks, subj.maxMarks),
        });
      }
    }
  }

  console.log("✓ Seed complete!");
  console.log("  Teacher: teacher1 / teacher123");
  console.log("  Students: S001-S005 / student123");
  process.exit(0);
}

seed().catch((e) => { console.error(e); process.exit(1); });
