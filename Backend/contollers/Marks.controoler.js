import Subject from '../models/Subject.model.js';

const getAllSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find().sort({ code: 1 });
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addSubject = async (req, res) => {
  try {
    const { code, name, maxMarks, passingMarks } = req.body;
    const exists = await Subject.findOne({ code: code.toUpperCase() });
    if (exists) return res.status(400).json({ message: 'Subject code already exists' });
    const subject = await Subject.create({ code, name, maxMarks, passingMarks });
    res.status(201).json(subject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateSubject = async (req, res) => {
  try {
    const subject = await Subject.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!subject) return res.status(404).json({ message: 'Subject not found' });
    res.json(subject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteSubject = async (req, res) => {
  try {
    await Subject.findByIdAndDelete(req.params.id);
    res.json({ message: 'Subject deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { getAllSubjects, addSubject, updateSubject, deleteSubject };