import express from 'express';
import { protect, teacherOnly } from '../middleware/auth.js';
import { getTeacherDashboard, getAnalytics } from '../contollers/Teacher/dashboard.controller.js';
import { getMarksForEntry, saveMarks, getStudentResult } from '../contollers/Marks/Result.contoller.js';

const router = express.Router();

router.get('/dashboard', protect, teacherOnly, getTeacherDashboard);

router.get('/', protect, teacherOnly, getMarksForEntry);
router.post('/save', protect, teacherOnly, saveMarks);
router.get('/result/:studentId/:sessionId', protect, getStudentResult);

export default router;