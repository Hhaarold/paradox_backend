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

const canDeleteAdmin = async (UserModel, targetUser) => {
  if (targetUser.role !== 'admin') {
    return true;
  }

  const adminCount = await UserModel.countDocuments({ role: 'admin' });
  return adminCount > 1;
};

const canDemoteAdmin = async (UserModel, targetUser, nextRole) => {
  if (targetUser.role !== 'admin' || nextRole !== 'user') {
    return true;
  }

  const adminCount = await UserModel.countDocuments({ role: 'admin' });
  return adminCount > 1;
};

module.exports = { sanitizeUser, canDeleteAdmin, canDemoteAdmin };
