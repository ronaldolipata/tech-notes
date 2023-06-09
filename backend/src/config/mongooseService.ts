import mongoose from 'mongoose';

export default async function connectToDatabase() {
  if (process.env.MONGODB_URI) {
    try {
      await mongoose.connect(process.env.MONGODB_URI);
    } catch (error) {
      console.log(error);
    }
  }
}
