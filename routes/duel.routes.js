const express = require('express');

const {
  listDuels,
  createDuel,
  resolveDuel
} = require('../controllers/duelController');

const protect = require('../middleware/auth');

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
router.post('/', protect, createDuel);

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
router.patch('/:id', protect, resolveDuel);

module.exports = router;