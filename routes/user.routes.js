const express = require('express');
const mongoose = require('mongoose');
const { body, param, validationResult } = require('express-validator');

const {
  getProfile,
  getRanking,
  getUsers,
  deleteUser,
  banUser,
  unbanUser,
  changeUserRole,
} = require('../controllers/userController');

const protect = require('../middlewares/auth');
const { authorize } = require('../middlewares/auth');

const router = express.Router();

const validateMongoId = (fieldName) =>
  param(fieldName).custom((value) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      throw new Error('ID de MongoDB inválido');
    }
    return true;
  });

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array().map((error) => ({
        field: error.path,
        message: error.msg,
      })),
    });
  }

  return next();
};

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Información y perfiles de usuarios
 */

/**
 * @swagger
 * /api/users/ranking:
 *   get:
 *     summary: Obtener ranking de usuarios
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Ranking de usuarios obtenido correctamente
 *       500:
 *         description: Error interno del servidor
 */
router.get('/ranking', getRanking);

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Obtener perfil del usuario autenticado
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil obtenido correctamente
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.get('/profile', protect, getProfile);

/**
 * @swagger
 * /api/users/profile/{username}:
 *   get:
 *     summary: Obtener perfil por nombre de usuario
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: Nombre de usuario
 *     responses:
 *       200:
 *         description: Perfil obtenido correctamente
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.get('/profile/:username', getProfile);

/**
 * @swagger
 * /api/users/admin/users:
 *   get:
 *     summary: Listar todos los usuarios (solo admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida correctamente
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Requiere rol de administrador
 *       500:
 *         description: Error interno del servidor
 */
router.get('/admin/users', protect, authorize('admin'), getUsers);

/**
 * @swagger
 * /api/users/admin/users/{id}:
 *   delete:
 *     summary: Eliminar un usuario (solo admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario a eliminar
 *     responses:
 *       200:
 *         description: Usuario eliminado correctamente
 *       400:
 *         description: Solicitud inválida
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Requiere rol de administrador
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.delete('/admin/users/:id', protect, authorize('admin'), validateMongoId('id'), handleValidationErrors, deleteUser);

/**
 * @swagger
 * /api/users/admin/users/{id}/ban:
 *   patch:
 *     summary: Banear temporalmente un usuario (solo admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario a banear
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - durationMinutes
 *             properties:
 *               durationMinutes:
 *                 type: integer
 *                 example: 60
 *               reason:
 *                 type: string
 *                 example: Incumplimiento de las normas
 *     responses:
 *       200:
 *         description: Usuario baneado temporalmente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Requiere rol de administrador
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.patch(
  '/admin/users/:id/ban',
  protect,
  authorize('admin'),
  validateMongoId('id'),
  body('durationMinutes').exists({ checkNull: true }).withMessage('durationMinutes es obligatorio').isFloat({ gt: 0 }).withMessage('durationMinutes debe ser un número mayor que 0'),
  body('reason').optional().isString().trim().isLength({ min: 1, max: 200 }).withMessage('reason debe tener entre 1 y 200 caracteres'),
  handleValidationErrors,
  banUser
);

/**
 * @swagger
 * /api/users/admin/users/{id}/unban:
 *   patch:
 *     summary: Desbanear un usuario (solo admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario a desbanear
 *     responses:
 *       200:
 *         description: Usuario desbaneado correctamente
 *       400:
 *         description: Solicitud inválida
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Requiere rol de administrador
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.patch('/admin/users/:id/unban', protect, authorize('admin'), validateMongoId('id'), handleValidationErrors, unbanUser);

/**
 * @swagger
 * /api/users/admin/users/{id}/role:
 *   patch:
 *     summary: Cambiar el rol de un usuario (solo admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - role
 *             properties:
 *               role:
 *                 type: string
 *                 enum:
 *                   - user
 *                   - admin
 *                 example: admin
 *     responses:
 *       200:
 *         description: Rol actualizado correctamente
 *       400:
 *         description: Solicitud inválida
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Requiere rol de administrador
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.patch(
  '/admin/users/:id/role',
  protect,
  authorize('admin'),
  validateMongoId('id'),
  body('role').isIn(['user', 'admin']).withMessage('role debe ser "user" o "admin"'),
  handleValidationErrors,
  changeUserRole
);

module.exports = router;