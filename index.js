require('dotenv').config();

const app = require('./app');
const connectDB = require('./config/db');

const PORT = Number(process.env.PORT) || 3000;

if (!process.env.MONGODB_URI) {
  console.error('Error: MONGODB_URI no está definido. Agrega tu cadena de conexión en el archivo .env antes de iniciar la aplicación.');
  process.exit(1);
}

if (!process.env.JWT_SECRET) {
  console.error('Error: JWT_SECRET no está definido. Agrega una clave segura en tu archivo .env antes de iniciar la aplicación.');
  process.exit(1);
}

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
  });
};

startServer().catch((error) => {
  console.error('No se pudo iniciar el servidor:', error.message);
  process.exit(1);
});