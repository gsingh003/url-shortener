import { createClient, RedisClientType } from "redis";
import { config } from "../config/config";

const redis = createClient({
    url: config.redis.url,
    socket: {
        reconnectStrategy: (retries) => Math.min(retries * 100, 3000),
    },
});

redis.connect().catch((err) => {
    console.error("failed to connect to redis", err);
    process.exit(1);
});

redis.on("error", (err) => {
    console.error("redis server:", err);
});

export default redis;
