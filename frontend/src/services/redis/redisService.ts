import { createClient } from "redis";

let redisClient: ReturnType<typeof createClient> | null = null;

// Determine Redis URL based on environment
const redisUrl = process.env.DOCKER === "True"
  ? "redis://redis:6379" // Docker Redis service name
  : process.env.REDIS_URL || "redis://localhost:6379"; // Default to localhost if no env variable is set

/**
 * Connect to Redis
 * Handles reconnection attempts and logs connection state.
 */
export const connectRedis = async (): Promise<ReturnType<typeof createClient>> => {
  if (!redisClient) {
    redisClient = createClient({
      url: redisUrl,
    });

    redisClient.on("connect", () => {
      console.log(`Redis connected at ${redisUrl}`);
    });

    redisClient.on("ready", () => {
      console.log("Redis client is ready to execute commands");
    });

    redisClient.on("error", (err) => {
      console.error("Redis Client Error:", err);
    });

    redisClient.on("end", () => {
      console.warn("Redis connection has been closed");
    });

    try {
      await redisClient.connect();
    } catch (error) {
      console.error("Failed to connect to Redis:", error);
      throw error;
    }
  }

  return redisClient;
};

/**
 * Set data in Redis with optional expiration
 * @param key - Redis key
 * @param value - Redis value (stringified if object)
 * @param expiration - Time to live in seconds (default: 3600 seconds)
 */
export const setRedisData = async (key: string, value: string, expiration: number = 3600): Promise<void> => {
  const client = await connectRedis();
  try {
    await client.set(key, value, { EX: expiration }); // EX: expiration time
    console.log(`Data set in Redis: Key=${key}, Expiration=${expiration}`);
  } catch (error) {
    console.error(`Error setting data in Redis (Key=${key}):`, error);
    throw error;
  }
};

/**
 * Get data from Redis
 * @param key - Redis key
 * @returns Value associated with the key or null if not found
 */
export const getRedisData = async (key: string): Promise<string | null> => {
  const client = await connectRedis();
  try {
    const value = await client.get(key);
    console.log(`Data retrieved from Redis: Key=${key}, Value=${value}`);
    return value;
  } catch (error) {
    console.error(`Error getting data from Redis (Key=${key}):`, error);
    throw error;
  }
};

/**
 * Delete data from Redis
 * @param key - Redis key
 */
export const deleteRedisData = async (key: string): Promise<void> => {
  const client = await connectRedis();
  try {
    await client.del(key);
    console.log(`Data deleted from Redis: Key=${key}`);
  } catch (error) {
    console.error(`Error deleting data from Redis (Key=${key}):`, error);
    throw error;
  }
};
