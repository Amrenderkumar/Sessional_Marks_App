import express from 'express';
import { protect, teacherOnly, studentOnly } from '../middleware/auth.js';
import { getTeacherDashboard, getAnalytics } from '../contollers/Teacher/dashboard.controller.js';
import { getMyDashboard, getMyResults, getMyPerformance, getAllStudents, addStudent, getStudentById, updateStudent, deleteStudent } from '../contollers/Student.controller.js';

const router = express.Router();

// Student's own routes
router.get('/my/dashboard', protect, studentOnly, getMyDashboard);
router.get('/my/results', protect, studentOnly, getMyResults);
router.get('/my/performance', protect, studentOnly, getMyPerformance);

// Teacher routes - specific routes before generic ones
router.get('/analytics/overview', protect, teacherOnly, getAnalytics);
router.get('/', protect, teacherOnly, getAllStudents);
router.post('/', protect, teacherOnly, addStudent);
router.get('/:id', protect, teacherOnly, getStudentById);
router.put('/:id', protect, teacherOnly, updateStudent);
router.delete('/:id', protect, teacherOnly, deleteStudent);

export default router;