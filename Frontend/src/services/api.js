import api from '../api/client';

// Auth API
export const login = (username, password, role) => api.post('/auth/login', { username, password, role });
export const getMe = () => api.get('/auth/me');

// Students API
export const getAllStudents = () => api.get('/students');
export const addStudent = (data) => api.post('/students', data);
export const getStudentById = (id) => api.get(`/students/${id}`);
export const updateStudent = (id, data) => api.put(`/students/${id}`, data);
export const deleteStudent = (id) => api.delete(`/students/${id}`);

// Student own API
export const getMyDashboard = () => api.get('/students/my/dashboard');
export const getMyResults = () => api.get('/students/my/results');
export const getMyPerformance = () => api.get('/students/my/performance');

// Subjects API
export const getAllSubjects = () => api.get('/subjects');
export const addSubject = (data) => api.post('/subjects', data);
export const updateSubject = (id, data) => api.put(`/subjects/${id}`, data);
export const deleteSubject = (id) => api.delete(`/subjects/${id}`);

// Sessions API
export const getAllSessions = () => api.get('/sessions');
export const createSession = (data) => api.post('/sessions', data);
export const activateSession = (id) => api.put(`/sessions/${id}/activate`);
export const deleteSession = (id) => api.delete(`/sessions/${id}`);

// Marks API
export const getMarksForEntry = (sessionId, subjectId) => api.get(`/marks?session=${sessionId}&subject=${subjectId}`);
export const saveMarks = (data) => api.post('/marks/save', data);

// Analytics API
export const getAnalytics = (sessionId) => api.get(`/students/analytics/overview?sessionId=${sessionId || ''}`);

// Teacher Dashboard API
export const getTeacherDashboard = () => api.get('/students/dashboard');