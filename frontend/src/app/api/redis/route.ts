import { NextResponse } from "next/server";
import { getRedisData, setRedisData } from "@/services/redis/redisService.ts";

// POST: Сохранение данных в Redis
export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const { key, value } = body;

    if (!key || !value) {
      return NextResponse.json(
        { error: "Key and value are required" },
        { status: 400 }
      );
    }

    // Сохранение данных в Redis
    await setRedisData(key, value);

    return NextResponse.json({ message: "Data successfully saved to Redis" });
  } catch (error) {
    console.error("Error saving data to Redis:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};

// GET: Извлечение данных из Redis
export const GET = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const key = searchParams.get("key");

    if (!key) {
      return NextResponse.json(
        { error: "Key is required" },
        { status: 400 }
      );
    }

    // Извлечение значения из Redis
    const value = await getRedisData(key);

    if (!value) {
      return NextResponse.json(
        { error: `Data not found for key: ${key}` },
        { status: 404 }
      );
    }

    return NextResponse.json({ key, value });
  } catch (error) {
    console.error("Error retrieving data from Redis:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};

