import { createClient } from "redis";

let redisClient: ReturnType<typeof createClient> | null = null;

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

export const connectRedis = async () => {
  if (!redisClient) {
    redisClient = createClient({
      url: redisUrl,
    });

    redisClient.on("error", (err) => {
      console.error("Redis Client Error:", err);
    });

    await redisClient.connect();
    console.log("Connected to Redis at", redisUrl);
  }

  return redisClient;
};

// Установка данных в Redis
export const setRedisData = async (
  key: string,
  value: Record<string, unknown> | string,
  expiration: number = 3600
): Promise<void> => {
  const client = await connectRedis();

  try {
    const serializedValue =
      typeof value === "string" ? value : JSON.stringify(value);
    await client.set(key, serializedValue, { EX: expiration });
    console.log(`Data set in Redis: Key=${key}, Value=${serializedValue}`);
  } catch (error) {
    console.error(`Error setting data in Redis (Key=${key}):`, error);
    throw error;
  }
};

// Получение данных из Redis
export const getRedisData = async (
  key: string
): Promise<Record<string, unknown> | string | null> => {
  const client = await connectRedis();

  try {
    const value = await client.get(key);

    if (value) {
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    }

    return null;
  } catch (error) {
    console.error(`Error retrieving data from Redis (Key=${key}):`, error);
    throw error;
  }
};

