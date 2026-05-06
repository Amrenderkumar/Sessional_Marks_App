import Student from '../models/Student.model.js';
import User from '../models/user.model.js';
import Result from '../models/Marks.model.js';
import Session from '../models/Session.model.js';

// @GET /api/students - All students (teacher)
const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().sort({ name: 1 });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @GET /api/students/:id
const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @POST /api/students - Add student (teacher)
const addStudent = async (req, res) => {
  try {
    const { rollNumber, name, registrationNo, className, section, email, password } = req.body;

    const existingStudent = await Student.findOne({ $or: [{ rollNumber }, { registrationNo }] });
    if (existingStudent) return res.status(400).json({ message: 'Roll number or registration already exists' });

    // Create user account for student
    const user = await User.create({
      username: rollNumber,
      password: password || rollNumber,
      role: 'student',
      name,
    });

    const student = await Student.create({
      rollNumber, name, registrationNo, className, section, email,
      userId: user._id,
    });

    res.status(201).json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @PUT /api/students/:id
const updateStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @DELETE /api/students/:id
const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    if (student.userId) await User.findByIdAndDelete(student.userId);
    res.json({ message: 'Student deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @GET /api/students/my/dashboard - Student's own dashboard
const getMyDashboard = async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user._id });
    if (!student) return res.status(404).json({ message: 'Student profile not found' });

    const activeSession = await Session.findOne({ isActive: true });
    if (!activeSession) return res.json({ student, activeSession: null, result: null });

    const result = await Result.findOne({ student: student._id, session: activeSession._id })
      .populate('marks.subject')
      .populate('session');

    res.json({ student, activeSession, result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @GET /api/students/my/results - All results for student
const getMyResults = async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user._id });
    if (!student) return res.status(404).json({ message: 'Student profile not found' });

    const results = await Result.find({ student: student._id })
      .populate('marks.subject')
      .populate('session')
      .sort({ createdAt: -1 });

    res.json({ student, results });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @GET /api/students/my/performance - Performance trend
const getMyPerformance = async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user._id });
    if (!student) return res.status(404).json({ message: 'Student profile not found' });

    const results = await Result.find({ student: student._id })
      .populate('session')
      .sort({ createdAt: 1 });

    const performanceData = results.map(r => ({
      session: r.session.name,
      year: r.session.year,
      percentage: r.percentage,
      grade: r.grade,
      totalMarks: r.totalMarks,
      maxTotalMarks: r.maxTotalMarks,
    }));

    res.json({ student, performanceData });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  getAllStudents, getStudentById, addStudent, updateStudent, deleteStudent,
  getMyDashboard, getMyResults, getMyPerformance,
};