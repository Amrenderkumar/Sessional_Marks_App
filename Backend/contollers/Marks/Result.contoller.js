import Result from '../../models/Marks.model.js';
import Student from '../../models/Student.model.js';
import Subject from '../../models/Subject.model.js';
import Session from '../../models/Session.model.js';

// @GET /api/marks?sessionId=&subjectId= - Get marks for entry table
const getMarksForEntry = async (req, res) => {
  try {
    const { sessionId, subjectId } = req.query;
    if (!sessionId || !subjectId) return res.status(400).json({ message: 'sessionId and subjectId required' });

    const students = await Student.find().sort({ rollNumber: 1 });
    const subject = await Subject.findById(subjectId);

    const marksData = await Promise.all(students.map(async (student) => {
      const result = await Result.findOne({ student: student._id, session: sessionId });
      const markEntry = result?.marks.find(m => m.subject.toString() === subjectId);
      return {
        studentId: student._id,
        rollNumber: student.rollNumber,
        name: student.name,
        marksObtained: markEntry ? markEntry.marksObtained : null,
      };
    }));

    res.json({ students: marksData, subject, maxMarks: subject?.maxMarks || 100 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @POST /api/marks/save - Save marks for multiple students
const saveMarks = async (req, res) => {
  try {
    const { sessionId, subjectId, marksData } = req.body;
    // marksData = [{ studentId, marksObtained }]

    const savedCount = await Promise.all(marksData.map(async ({ studentId, marksObtained }) => {
      let result = await Result.findOne({ student: studentId, session: sessionId });
      if (!result) {
        result = new Result({ student: studentId, session: sessionId, marks: [] });
      }

      const existingIdx = result.marks.findIndex(m => m.subject.toString() === subjectId);
      if (existingIdx >= 0) {
        result.marks[existingIdx].marksObtained = marksObtained;
      } else {
        result.marks.push({ subject: subjectId, marksObtained });
      }

      await result.save();
      return true;
    }));

    res.json({ message: `Marks saved for ${savedCount.length} students` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @GET /api/marks/result/:studentId/:sessionId
const getStudentResult = async (req, res) => {
  try {
    const result = await Result.findOne({
      student: req.params.studentId,
      session: req.params.sessionId,
    }).populate('marks.subject').populate('session').populate('student');

    if (!result) return res.status(404).json({ message: 'Result not found' });
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { getMarksForEntry, saveMarks, getStudentResult };