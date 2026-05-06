import Student from '../../models/Student.model.js';
import Result from '../../models/Marks.model.js';
import Session from '../../models/Session.model.js';
import Subject from '../../models/Subject.model.js';

// @GET /api/teacher/dashboard
const getTeacherDashboard = async (req, res) => {
  try {
    const activeSession = await Session.findOne({ isActive: true });
    const totalStudents = await Student.countDocuments();
    const totalSubjects = await Subject.countDocuments();

    let passPercentage = 0;
    let averageScore = 0;
    let topPerformers = [];

    if (activeSession) {
      const results = await Result.find({ session: activeSession._id }).populate('student');
      if (results.length > 0) {
        const passed = results.filter(r => r.status === 'PASS').length;
        passPercentage = parseFloat(((passed / results.length) * 100).toFixed(1));
        averageScore = parseFloat((results.reduce((sum, r) => sum + r.percentage, 0) / results.length).toFixed(1));
        topPerformers = results
          .sort((a, b) => b.percentage - a.percentage)
          .slice(0, 5)
          .map(r => ({
            name: r.student.name,
            rollNumber: r.student.rollNumber,
            className: r.student.className,
            percentage: r.percentage,
            totalMarks: r.totalMarks,
            maxTotalMarks: r.maxTotalMarks,
          }));
      }
    }

    res.json({ totalStudents, totalSubjects, passPercentage, averageScore, topPerformers, activeSession });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @GET /api/teacher/analytics
const getAnalytics = async (req, res) => {
  try {
    const { sessionId } = req.query;
    const session = sessionId
      ? await Session.findById(sessionId)
      : await Session.findOne({ isActive: true });

    if (!session) return res.json({ session: null, subjectAnalytics: [], passFailData: { passed: 0, failed: 0 } });

    const results = await Result.find({ session: session._id }).populate('marks.subject');
    const subjects = await Subject.find();

    const subjectAnalytics = subjects.map(sub => {
      const subjectMarks = results
        .flatMap(r => r.marks)
        .filter(m => m.subject && m.subject._id.toString() === sub._id.toString());

      const avgMarks = subjectMarks.length
        ? parseFloat((subjectMarks.reduce((s, m) => s + m.marksObtained, 0) / subjectMarks.length).toFixed(1))
        : 0;
      const passRate = subjectMarks.length
        ? parseFloat(((subjectMarks.filter(m => m.marksObtained >= sub.passingMarks).length / subjectMarks.length) * 100).toFixed(1))
        : 0;

      return { code: sub.code, name: sub.name, avgMarks, passRate };
    });

    const passed = results.filter(r => r.status === 'PASS').length;
    const failed = results.length - passed;
    const overallPassRate = results.length ? parseFloat(((passed / results.length) * 100).toFixed(1)) : 0;
    const globalAverage = results.length
      ? parseFloat((results.reduce((s, r) => s + r.percentage, 0) / results.length).toFixed(1))
      : 0;

    res.json({
      session,
      subjectAnalytics,
      passFailData: { passed, failed },
      overallPassRate,
      globalAverage,
      totalSubjectsEvaluated: subjects.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { getTeacherDashboard, getAnalytics };