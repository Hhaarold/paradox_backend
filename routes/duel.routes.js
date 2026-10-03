const express = require('express');
const { body } = require('express-validator');

const {
  listDuels,
  createDuel,
  resolveDuel,
} = require('../controllers/duelController');

const protect = require('../middlewares/auth');
const { handleValidationErrors, validateObjectId } = require('../middlewares/validators');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Duels
 *   description: Gestión de duelos entre usuarios
 */

/**
 * @swagger
 * /api/duels:
 *   get:
 *     summary: Obtener lista de duelos
 *     tags: [Duels]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de duelos obtenida correctamente
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 */
router.get('/', protect, listDuels);

/**
 * @swagger
 * /api/duels:
 *   post:
 *     summary: Crear un nuevo duelo
 *     tags: [Duels]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Duelo creado correctamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 */
router.post(
  '/',
  protect,
  [
    body('paradoxId').isString().custom((value) => /^[a-fA-F0-9]{24}$/.test(value)).withMessage('paradoxId debe ser un ObjectId válido'),
    body('opponentId').isString().custom((value) => /^[a-fA-F0-9]{24}$/.test(value)).withMessage('opponentId debe ser un ObjectId válido'),
  ],
  handleValidationErrors,
  createDuel
);

/**
 * @swagger
 * /api/duels/{id}:
 *   patch:
 *     summary: Resolver un duelo
 *     tags: [Duels]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del duelo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Duelo resuelto correctamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Duelo no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.patch(
  '/:id',
  protect,
  validateObjectId('id'),
  body('winnerId').optional().isString().custom((value) => /^[a-fA-F0-9]{24}$/.test(value)).withMessage('winnerId debe ser un ObjectId válido'),
  body('status').optional().isIn(['active', 'completed', 'cancelled']).withMessage('status inválido'),
  handleValidationErrors,
  resolveDuel
);

module.exports = router;