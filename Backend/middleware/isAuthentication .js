import jwt from 'jsonwebtoken';

const isAuthentication = (req, res, next) => {
  try {
    const token = req.cookies.token || req.header('Authorization')?.replace('Bearer ', '');
    if(!token) {
      return res.status(401).json({ message: 'token missing' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if(!decoded) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    req.id = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized' });
  }
};

export default isAuthentication;