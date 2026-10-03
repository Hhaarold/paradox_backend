const jwt = require('jsonwebtoken');
const User = require('../models/User');

const checkBanStatus = async (user) => {
  if (!user || !user.isBanned) {
    return { isBanned: false, banExpiresAt: null };
  }

  const banExpiresAt = user.banExpiresAt ? new Date(user.banExpiresAt) : null;

  if (banExpiresAt && banExpiresAt <= new Date()) {
    user.isBanned = false;
    user.banExpiresAt = null;
    user.banReason = null;
    await user.save();
    return { isBanned: false, banExpiresAt: null };
  }

  return {
    isBanned: true,
    banExpiresAt: banExpiresAt ? banExpiresAt.toISOString() : null,
  };
};

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: 'Token requerido' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'paradox-secret-key');
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'Usuario no válido' });
    }

    const banStatus = await checkBanStatus(user);

    if (banStatus.isBanned) {
      return res.status(403).json({
        message: 'Tu cuenta está temporalmente suspendida',
        banExpiresAt: banStatus.banExpiresAt,
      });
    }

    req.user = user;
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
};

const authorize = (...roles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Token requerido' });
  }

  if (!roles.length || !roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'No tienes permisos para realizar esta acción' });
  }

  return next();
};

module.exports = protect;
module.exports.authorize = authorize;
module.exports.checkBanStatus = checkBanStatus;
