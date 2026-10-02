const express = require('express');

const { getProfile, getRanking } = require('../controllers/userController');

const protect = require('../middleware/auth');

const router = express.Router();

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

module.exports = router;