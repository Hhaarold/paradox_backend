const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { generateToken } = require('../utils/token');

const sanitizeUser = (user) => ({
  _id: user._id,
  username: user.username,
  email: user.email,
  school: user.school,
  paradoxScore: user.paradoxScore,
  chaosIndex: user.chaosIndex,
  role: user.role,
  createdAt: user.createdAt,
});

const register = async (req, res) => {
  const { username, email, password, school } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'username, email y password son obligatorios' });
  }

  try {
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });

    if (existingUser) {
      return res.status(409).json({ message: 'El usuario o email ya existen' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      school: school || 'Skeptic',
      role: 'user',
    });

    const token = generateToken({ id: user._id });

    return res.status(201).json({
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error al registrar usuario', error: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'email y password son obligatorios' });
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const token = generateToken({ id: user._id });

    return res.status(200).json({
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error al iniciar sesión', error: error.message });
  }
};

const getMe = async (req, res) => {
  return res.status(200).json({ user: sanitizeUser(req.user) });
};

module.exports = { register, login, getMe };
