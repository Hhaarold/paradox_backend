const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authorize = require('./authorize');

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
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: 'JWT_SECRET no está definido en las variables de entorno' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
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
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token inválido o expirado' });
    }

    return res.status(500).json({ message: 'Error al validar la sesión', error: error.message });
  }
};

module.exports = protect;
module.exports.authorize = authorize;
module.exports.checkBanStatus = checkBanStatus;
