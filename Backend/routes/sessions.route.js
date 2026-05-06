import express from 'express';
import { protect, teacherOnly } from '../middleware/auth.js';
import { getTeacherDashboard, getAnalytics } from '../contollers/Teacher/dashboard.controller.js';
import { getAllSessions, createSession, setActiveSession, deleteSession } from '../contollers/Session.controller.js';

const router = express.Router();

router.get('/dashboard', protect, teacherOnly, getTeacherDashboard);
router.get('/analytics', protect, teacherOnly, getAnalytics);

router.get('/', protect, getAllSessions);
router.post('/', protect, teacherOnly, createSession);
router.put('/:id/activate', protect, teacherOnly, setActiveSession);
router.delete('/:id', protect, teacherOnly, deleteSession);


export default router;