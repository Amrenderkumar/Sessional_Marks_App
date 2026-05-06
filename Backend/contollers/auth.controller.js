
import User from '../models/user.model.js';
import Student from '../models/Student.model.js';
import generateToken from '../JWT/generate.Token.js';

const login = async (req, res) => {
  try {
    const { username, password, role } = req.body;
    const user = await User.findOne({ username, role });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    let profileData = null;
    if (role === 'student') {
      profileData = await Student.findOne({ userId: user._id });
    }
    res.json({
      _id: user._id, name: user.name,
      username: user.username, role: user.role,
      token: generateToken(user._id, user.role),
      studentProfile: profileData,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const register = async (req, res) => {
  try {
    const { name, username, password, role, rollNumber, registrationNo, className, section, email } = req.body;

    if (!name || !username || !password || !role)
      return res.status(400).json({ message: 'Name, username, password and role are required' });

    if (!['student', 'teacher'].includes(role))
      return res.status(400).json({ message: 'Role must be student or teacher' });

    const existing = await User.findOne({ username, role });
    if (existing)
      return res.status(400).json({ message: 'Username already taken for this role' });

    const user = await User.create({ username, password, role, name });

    let studentProfile = null;
    if (role === 'student') {
      if (!rollNumber || !registrationNo || !className || !section)
        return res.status(400).json({ message: 'Roll number, registration no, class and section are required for students' });

      const rollExists = await Student.findOne({ rollNumber });
      if (rollExists) {
        await User.findByIdAndDelete(user._id);
        return res.status(400).json({ message: 'Roll number already exists' });
      }

      studentProfile = await Student.create({
        rollNumber,
        name,
        registrationNo,
        className,
        section,
        email: email || '',
        userId: user._id,
      });
    }

    res.status(201).json({
      _id: user._id, name: user.name,
      username: user.username, role: user.role,
      token: generateToken(user._id, user.role),
      studentProfile,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMe = async (req, res) => {
  try {
    const user = req.user;
    let profileData = null;
    if (user.role === 'student') {
      profileData = await Student.findOne({ userId: user._id });
    }
    res.json({ ...user._doc, studentProfile: profileData });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { login, register, getMe };
