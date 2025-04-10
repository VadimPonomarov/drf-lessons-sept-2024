export const baseUrl = process.env.VITE_API_URL || "https://dummyjson.com";
export const baseCarsUrl =
  process.env.VITE_API_URL || "http://185.69.152.209/carsAPI/v1";

export const headers_CORS = {
  "Access-Control-Allow-Origin": "http://localhost, http://0.0.0.0",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Origin, X-Requested-With, Content-Type, Accept, Authorization",
};


