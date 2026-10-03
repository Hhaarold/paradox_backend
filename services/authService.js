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

module.exports = { sanitizeUser };
