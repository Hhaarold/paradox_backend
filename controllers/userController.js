const User = require('../models/User');

const getProfile = async (req, res) => {
  try {
    const username = req.params.username || req.user?.username;

    if (!username) {
      return res.status(400).json({ message: 'Se requiere username' });
    }

    const user = await User.findOne({ username }).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ message: 'Error al obtener perfil', error: error.message });
  }
};

const getRanking = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ paradoxScore: -1, chaosIndex: -1 }).limit(20);
    return res.status(200).json({ ranking: users });
  } catch (error) {
    return res.status(500).json({ message: 'Error al obtener ranking', error: error.message });
  }
};

module.exports = { getProfile, getRanking };
