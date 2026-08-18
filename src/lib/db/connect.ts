import mongoose from "mongoose";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache ?? {
  conn: null,
  promise: null,
};

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

function getMongoUri(): string {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("Please define MONGODB_URI in your .env file");
  }
  return uri;
}

function resetCache(): void {
  cached.conn = null;
  cached.promise = null;
}

function isConnected(): boolean {
  return mongoose.connection.readyState === 1;
}

export async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn && isConnected()) {
    return cached.conn;
  }

  if (cached.conn && !isConnected()) {
    resetCache();
  }

  if (!cached.promise) {
    const uri = getMongoUri();

    cached.promise = mongoose
      .connect(uri, {
        bufferCommands: false,
        serverSelectionTimeoutMS: 15000,
        socketTimeoutMS: 45000,
      })
      .catch((error) => {
        resetCache();
        throw error;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    resetCache();
    throw error;
  }

  return cached.conn;
}

export default connectDB;
