import { createClient } from "redis";

const redisClient = createClient();

redisClient.on("error", (err) => console.log("Redis Client Error", err));

export async function connectToRedis() {
  await redisClient.connect();
  console.log("Connected to Redis");
}

export default redisClient;
