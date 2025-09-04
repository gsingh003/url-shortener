import dotenv from "dotenv";
dotenv.config();

export const config = {
    postgres: {
        user: process.env.POSTGRES_USER || "admin",
        password: process.env.POSTGRES_PASSWORD || "adminpassword",
        host: process.env.POSTGRES_HOST || "localhost",
        port: process.env.POSTGRES_PORT
            ? Number(process.env.POSTGRES_PORT)
            : 5432,
        name: process.env.POSTGRES_DB_NAME || "shorten_db",
        get url() {
            return `postgres://${this.user}:${this.password}@${this.host}:${this.port}/${this.name}`;
        },
        maxConnections: process.env.POSTGRES_MAX_CONNS
            ? Number(process.env.POSTGRES_MAX_CONNS)
            : 20,
    },
    redis: {
        host: process.env.REDIS_HOST || "localhost",
        port: process.env.REDIS_PORT ? Number(process.env.REDIS_PORT) : 6379,
        password: process.env.REDIS_PASSWORD || "redispassword",
        get url() {
            return `redis://${this.password ? `:${this.password}@` : ""}${
                this.host
            }:${this.port}`;
        },
        ttl: process.env.REDIS_CACHE_TTL
            ? Number(process.env.REDIS_CACHE_TTL)
            : 3000,
    },
};
