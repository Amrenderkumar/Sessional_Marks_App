import Session from '../models/Session.model.js';

const getAllSessions = async (req, res) => {
  try {
    const sessions = await Session.find().sort({ createdAt: -1 });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createSession = async (req, res) => {
  try {
    const { name, year, isActive } = req.body;
    if (isActive) await Session.updateMany({}, { isActive: false });
    const session = await Session.create({ name, year, isActive });
    res.status(201).json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const setActiveSession = async (req, res) => {
  try {
    await Session.updateMany({}, { isActive: false });
    const session = await Session.findByIdAndUpdate(req.params.id, { isActive: true }, { new: true });
    if (!session) return res.status(404).json({ message: 'Session not found' });
    res.json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteSession = async (req, res) => {
  try {
    await Session.findByIdAndDelete(req.params.id);
    res.json({ message: 'Session deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { getAllSessions, createSession, setActiveSession, deleteSession };