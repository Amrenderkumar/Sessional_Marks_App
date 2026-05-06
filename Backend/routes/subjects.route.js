import express from 'express';
import { protect, teacherOnly } from '../middleware/auth.js';
import { getTeacherDashboard, getAnalytics } from '../contollers/Teacher/dashboard.controller.js';
import { getAllSubjects, addSubject, updateSubject, deleteSubject } from '../contollers/Marks.controoler.js';

const router = express.Router();

router.get('/dashboard', protect, teacherOnly, getTeacherDashboard);
router.get('/analytics', protect, teacherOnly, getAnalytics);

router.get('/', protect, getAllSubjects);
router.post('/', protect, teacherOnly, addSubject);
router.put('/:id', protect, teacherOnly, updateSubject);
router.delete('/:id', protect, teacherOnly, deleteSubject);


export default router;