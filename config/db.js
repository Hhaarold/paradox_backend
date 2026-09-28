const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/paradox';

  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('MongoDB conectado');
  } catch (error) {
    console.warn('MongoDB no disponible, arrancando API sin base de datos.');
    console.warn(error.message);
  }
};

module.exports = connectDB;
