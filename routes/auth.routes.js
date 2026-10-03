const express = require('express');
const { body } = require('express-validator');

const { register, login, getMe } = require('../controllers/authController');
const protect = require('../middlewares/auth');
const { handleValidationErrors } = require('../middlewares/validators');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Autenticación y usuarios
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: harold
 *               email:
 *                 type: string
 *                 example: harold@example.com
 *               password:
 *                 type: string
 *                 example: 12345678
 *     responses:
 *       201:
 *         description: Usuario registrado correctamente
 *       400:
 *         description: Datos inválidos
 */
router.post(
  '/register',
  [
    body('username').isString().trim().isLength({ min: 3 }).withMessage('username debe tener al menos 3 caracteres'),
    body('email').isEmail().normalizeEmail().withMessage('email inválido'),
    body('password').isString().isLength({ min: 6 }).withMessage('password debe tener al menos 6 caracteres'),
    body('role').not().exists().withMessage('El rol no se puede enviar en el registro'),
  ],
  handleValidationErrors,
  register
);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: harold@example.com
 *               password:
 *                 type: string
 *                 example: 12345678
 *     responses:
 *       200:
 *         description: Login exitoso
 *       401:
 *         description: Credenciales incorrectas
 */
router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail().withMessage('email inválido'),
    body('password').isString().isLength({ min: 6 }).withMessage('password debe tener al menos 6 caracteres'),
  ],
  handleValidationErrors,
  login
);


/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Obtener usuario autenticado
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Datos del usuario autenticado
 *       401:
 *         description: Token inválido o ausente
 */
router.get('/me', protect, getMe);

module.exports = router;