const Paradox = require('../models/Paradox');

const buildParadoxResponse = async (paradox) => {
  const populated = await paradox.populate('createdBy', 'username school paradoxScore chaosIndex');
  return {
    _id: populated._id,
    title: populated.title,
    statement: populated.statement,
    category: populated.category,
    status: populated.status,
    createdBy: populated.createdBy,
    layers: populated.layers,
    createdAt: populated.createdAt,
    updatedAt: populated.updatedAt,
  };
};

const listParadoxes = async (req, res) => {
  try {
    const { category, status } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (status) filter.status = status;

    const paradoxes = await Paradox.find(filter)
      .populate('createdBy', 'username school paradoxScore chaosIndex')
      .sort({ createdAt: -1 });

    return res.status(200).json({ paradoxes });
  } catch (error) {
    return res.status(500).json({ message: 'Error al listar paradojas', error: error.message });
  }
};

const getById = async (req, res) => {
  try {
    const paradox = await Paradox.findById(req.params.id).populate('createdBy', 'username school paradoxScore chaosIndex');

    if (!paradox) {
      return res.status(404).json({ message: 'Paradoja no encontrada' });
    }

    return res.status(200).json({ paradox });
  } catch (error) {
    return res.status(500).json({ message: 'Error al obtener la paradoja', error: error.message });
  }
};

const createParadox = async (req, res) => {
  const { title, statement, category, status } = req.body;

  if (!title || !statement) {
    return res.status(400).json({ message: 'title y statement son obligatorios' });
  }

  try {
    const paradox = await Paradox.create({
      title,
      statement,
      category: category || 'Reality',
      status: status || 'Active',
      createdBy: req.user._id,
      layers: [
        { question: '¿Cuál es el núcleo de la paradoja?', responses: [] },
        { question: '¿Qué supuesto debe cuestionarse?', responses: [] },
        { question: '¿Qué consecuencia tendría una resolución?', responses: [] },
      ],
    });

    return res.status(201).json({ paradox: await buildParadoxResponse(paradox) });
  } catch (error) {
    return res.status(500).json({ message: 'Error al crear la paradoja', error: error.message });
  }
};

const addLayer = async (req, res) => {
  const { question } = req.body;

  if (!question) {
    return res.status(400).json({ message: 'question es obligatorio' });
  }

  try {
    const paradox = await Paradox.findById(req.params.id);

    if (!paradox) {
      return res.status(404).json({ message: 'Paradoja no encontrada' });
    }

    paradox.layers.push({ question, responses: [] });
    await paradox.save();

    return res.status(200).json({ paradox });
  } catch (error) {
    return res.status(500).json({ message: 'Error al añadir la capa', error: error.message });
  }
};

const addResponse = async (req, res) => {
  const { text, type } = req.body;

  if (!text) {
    return res.status(400).json({ message: 'text es obligatorio' });
  }

  try {
    const paradox = await Paradox.findById(req.params.id);

    if (!paradox) {
      return res.status(404).json({ message: 'Paradoja no encontrada' });
    }

    const layerIndex = Number(req.params.layerIndex ?? 0);

    if (!paradox.layers[layerIndex]) {
      return res.status(404).json({ message: 'Capa no encontrada' });
    }

    paradox.layers[layerIndex].responses.push({
      authorId: req.user._id,
      text,
      type: type || 'resolve',
      votes: {},
      createdAt: new Date(),
    });

    await paradox.save();

    return res.status(201).json({ paradox });
  } catch (error) {
    return res.status(500).json({ message: 'Error al responder', error: error.message });
  }
};

const voteResponse = async (req, res) => {
  const { vote } = req.body;

  if (!vote || !['agree', 'disagree'].includes(vote)) {
    return res.status(400).json({ message: 'vote debe ser agree o disagree' });
  }

  try {
    const paradox = await Paradox.findById(req.params.id);

    if (!paradox) {
      return res.status(404).json({ message: 'Paradoja no encontrada' });
    }

    let found = false;

    for (const layer of paradox.layers) {
      const response = layer.responses.id(req.params.responseId);
      if (response) {
        response.votes.set(req.user._id.toString(), vote);
        found = true;
        break;
      }
    }

    if (!found) {
      return res.status(404).json({ message: 'Respuesta no encontrada' });
    }

    await paradox.save();

    return res.status(200).json({ message: 'Voto registrado', paradox });
  } catch (error) {
    return res.status(500).json({ message: 'Error al votar', error: error.message });
  }
};

module.exports = {
  listParadoxes,
  getById,
  createParadox,
  addLayer,
  addResponse,
  voteResponse,
};
