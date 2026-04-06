import mongoose from 'mongoose';

export const connectMongoDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      console.warn('⚠️  MONGODB_URI no definida, omitiendo conexión MongoDB');
      return;
    }
    await mongoose.connect(uri);
    console.log('✅ MongoDB conectada correctamente');
  } catch (error) {
    console.error('❌ Error al conectar a MongoDB:', error.message);
    process.exit(1);
  }
};

export const disconnectMongoDB = async () => {
  await mongoose.disconnect();
};
