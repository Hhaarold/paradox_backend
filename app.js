const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');

const swagger = require('./config/swagger');
const authRoutes = require('./routes/auth.routes');
const paradoxRoutes = require('./routes/paradox.routes');
const userRoutes = require('./routes/user.routes');
const duelRoutes = require('./routes/duel.routes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swagger));

app.get('/', (req, res) => {
  res.json({
    message: 'API de ParadoX funcionando',
    version: '1.0.0',
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({
    ok: true,
    service: 'paradox-backend',
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({
    ok: true,
    service: 'paradox-backend',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/paradoxes', paradoxRoutes);
app.use('/api/users', userRoutes);
app.use('/api/duels', duelRoutes);

app.use(errorHandler);

module.exports = app;