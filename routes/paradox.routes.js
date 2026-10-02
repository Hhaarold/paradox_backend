const express = require('express');

const {
  listParadoxes,
  getById,
  createParadox,
  updateParadox,
  deleteParadox,
  addLayer,
  addResponse,
  voteResponse,
} = require('../controllers/paradoxController');

const protect = require('../middleware/auth');
const { authorize } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Paradoxes
 *   description: Gestión de paradojas
 */

/**
 * @swagger
 * /api/paradoxes:
 *   get:
 *     summary: Obtener todas las paradojas
 *     tags: [Paradoxes]
 *     responses:
 *       200:
 *         description: Lista de paradojas
 *       500:
 *         description: Error interno del servidor
 */
router.get('/', listParadoxes);

/**
 * @swagger
 * /api/paradoxes/{id}:
 *   get:
 *     summary: Obtener una paradoja por ID
 *     tags: [Paradoxes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la paradoja
 *     responses:
 *       200:
 *         description: Paradoja encontrada
 *       404:
 *         description: Paradoja no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.get('/:id', getById);

/**
/**
 * @swagger
 * /api/paradoxes:
 *   post:
 *     summary: Crear una nueva paradoja
 *     tags: [Paradoxes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - statement
 *               - category
 *             properties:
 *               title:
 *                 type: string
 *                 example: El barco de Teseo
 *               statement:
 *                 type: string
 *                 example: Si reemplazas todas las partes de un objeto, ¿sigue siendo el mismo objeto?
 *               category:
 *                 type: string
 *                 enum:
 *                   - Time
 *                   - Space
 *                   - Identity
 *                   - Knowledge
 *                   - Ethics
 *                   - Reality
 *                 example: Identity
 *     responses:
 *       201:
 *         description: Paradoja creada correctamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 */
router.post('/', protect, createParadox);
 


/**
 * @swagger
 * /api/paradoxes/{id}/layers:
 *   post:
 *     summary: Agregar una capa a una paradoja
 *     tags: [Paradoxes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la paradoja
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Capa agregada correctamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Paradoja no encontrada
 */
router.post('/:id/layers', protect, addLayer);

/**
 * @swagger
 * /api/paradoxes/{id}/layers/{layerIndex}/responses:
 *   post:
 *     summary: Agregar una respuesta a una capa
 *     tags: [Paradoxes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: layerIndex
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Respuesta agregada correctamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Paradoja o capa no encontrada
 */
router.post('/:id/layers/:layerIndex/responses', protect, addResponse);

/**
 * @swagger
 * /api/paradoxes/{id}/responses/{responseId}/vote:
 *   post:
 *     summary: Votar una respuesta
 *     tags: [Paradoxes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: responseId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Voto registrado correctamente
 *       400:
 *         description: Solicitud inválida
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Paradoja o respuesta no encontrada
 */
router.post('/:id/responses/:responseId/vote', protect, voteResponse);

/**
 * @swagger
 * /api/paradoxes/{id}:
 *   put:
 *     summary: Actualizar una paradoja
 *     tags: [Paradoxes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la paradoja
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: El barco de Teseo actualizado
 *               statement:
 *                 type: string
 *                 example: Si todas las piezas cambian, ¿sigue siendo el mismo barco?
 *               category:
 *                 type: string
 *                 enum:
 *                   - Time
 *                   - Space
 *                   - Identity
 *                   - Knowledge
 *                   - Ethics
 *                   - Reality
 *                 example: Identity
 *               status:
 *                 type: string
 *                 example: Active
 *     responses:
 *       200:
 *         description: Paradoja actualizada correctamente
 *       403:
 *         description: No tienes permiso para modificar la paradoja
 *       404:
 *         description: Paradoja no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.put('/:id', protect, updateParadox);
router.put('/admin/:id', protect, authorize('admin'), updateParadox);

/**
 * @swagger
 * /api/paradoxes/{id}:
 *   delete:
 *     summary: Eliminar una paradoja
 *     tags: [Paradoxes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la paradoja
 *     responses:
 *       200:
 *         description: Paradoja eliminada correctamente
 *       403:
 *         description: No tienes permiso para eliminar la paradoja
 *       404:
 *         description: Paradoja no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.delete('/:id', protect, deleteParadox);
router.delete('/admin/:id', protect, authorize('admin'), deleteParadox);

module.exports = router;