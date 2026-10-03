const mongoose = require('mongoose');
const User = require('../models/User');

const sanitizeUser = (user) => ({
  _id: user._id,
  username: user.username,
  email: user.email,
  school: user.school,
  paradoxScore: user.paradoxScore,
  chaosIndex: user.chaosIndex,
  role: user.role,
  isBanned: Boolean(user.isBanned),
  banExpiresAt: user.banExpiresAt || null,
  banReason: user.banReason || null,
  createdAt: user.createdAt,
});

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

    return res.status(200).json({ user: sanitizeUser(user) });
  } catch (error) {
    return res.status(500).json({ message: 'Error al obtener perfil', error: error.message });
  }
};

const getRanking = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ paradoxScore: -1, chaosIndex: -1 }).limit(20);
    return res.status(200).json({ ranking: users.map(sanitizeUser) });
  } catch (error) {
    return res.status(500).json({ message: 'Error al obtener ranking', error: error.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    return res.status(200).json({ users: users.map(sanitizeUser) });
  } catch (error) {
    return res.status(500).json({ message: 'Error al listar usuarios', error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID de usuario inválido' });
    }

    const targetUser = await User.findById(id);

    if (!targetUser) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    if (req.user._id.toString() === targetUser._id.toString()) {
      return res.status(400).json({ message: 'No puedes eliminar tu propia cuenta' });
    }

    if (targetUser.role === 'admin') {
      const adminCount = await User.countDocuments({ role: 'admin' });

      if (adminCount <= 1) {
        return res.status(400).json({ message: 'No puedes eliminar al único administrador del sistema' });
      }
    }

    const deletedUser = sanitizeUser(targetUser);
    await User.findByIdAndDelete(id);

    return res.status(200).json({
      message: 'Usuario eliminado correctamente',
      user: deletedUser,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error al eliminar usuario', error: error.message });
  }
};

const banUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { durationMinutes, reason } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID de usuario inválido' });
    }

    const minutes = Number(durationMinutes);

    if (!Number.isFinite(minutes) || minutes <= 0) {
      return res.status(400).json({ message: 'durationMinutes debe ser un número mayor que 0' });
    }

    const targetUser = await User.findById(id);

    if (!targetUser) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    if (req.user._id.toString() === targetUser._id.toString()) {
      return res.status(400).json({ message: 'No puedes banearte a ti mismo' });
    }

    const banExpiresAt = new Date(Date.now() + minutes * 60 * 1000);
    targetUser.isBanned = true;
    targetUser.banExpiresAt = banExpiresAt;
    targetUser.banReason = reason && String(reason).trim() ? String(reason).trim() : 'Sin motivo especificado';
    await targetUser.save();

    return res.status(200).json({
      message: 'Usuario baneado temporalmente',
      banExpiresAt: banExpiresAt.toISOString(),
      user: sanitizeUser(targetUser),
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error al banear usuario', error: error.message });
  }
};

const unbanUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID de usuario inválido' });
    }

    const targetUser = await User.findById(id);

    if (!targetUser) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    targetUser.isBanned = false;
    targetUser.banExpiresAt = null;
    targetUser.banReason = null;
    await targetUser.save();

    return res.status(200).json({
      message: 'Usuario desbaneado correctamente',
      user: sanitizeUser(targetUser),
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error al desbanear usuario', error: error.message });
  }
};

const changeUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID de usuario inválido' });
    }

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'role debe ser "user" o "admin"' });
    }

    const targetUser = await User.findById(id);

    if (!targetUser) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    if (req.user._id.toString() === targetUser._id.toString()) {
      return res.status(400).json({ message: 'No puedes cambiar tu propio rol' });
    }

    if (targetUser.role === role) {
      return res.status(200).json({
        message: `El usuario ya tiene el rol ${role}`,
        user: sanitizeUser(targetUser),
      });
    }

    if (targetUser.role === 'admin' && role === 'user') {
      const adminCount = await User.countDocuments({ role: 'admin' });

      if (adminCount <= 1) {
        return res.status(400).json({ message: 'No puedes dejar al sistema sin administradores' });
      }
    }

    targetUser.role = role;
    await targetUser.save();

    return res.status(200).json({
      message: 'Rol actualizado correctamente',
      user: sanitizeUser(targetUser),
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error al cambiar rol de usuario', error: error.message });
  }
};

module.exports = {
  getProfile,
  getRanking,
  getUsers,
  deleteUser,
  banUser,
  unbanUser,
  changeUserRole,
  sanitizeUser,
};
