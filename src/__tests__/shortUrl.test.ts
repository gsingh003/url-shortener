import app from "../app";
import request from "supertest";
import redis from "../internal/cache/redis";
import sql from "../internal/db/db";

beforeAll(async () => {
    await sql.sync({ force: true });
});

afterAll(async () => {
    await sql.transaction(async (t) => {
        await sql.query(
            `DO $$ DECLARE
                r RECORD;
            BEGIN
                FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
                    EXECUTE 'TRUNCATE TABLE ' || quote_ident(r.tablename) || ' CASCADE';
                END LOOP;
            END $$;`,
            { transaction: t }
        );
    });
    await redis.flushAll();
    await redis.quit();
    await sql.close();
});

async function parseCached(key: string) {
    const cachedURL = await redis.get(key);
    if (cachedURL) return JSON.parse(cachedURL);
    return "";
}

describe("/api/shorten test", () => {
    test("POST /api/shorten should create and return a ShortUrl object", async () => {
        const RequestPayload = {
            url: "https://example.com",
        };
        const response = await request(app)
            .post("/api/shorten")
            .send(RequestPayload);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("id");
    });

    test("GET /api/shorten/:shortCode should return an existing shortened url", async () => {
        // create resource
        const RequestPayload = {
            url: "https://example.com",
        };
        const response = await request(app)
            .post("/api/shorten")
            .send(RequestPayload);
        // retrieve resource from cache
        let cachedUrl = await parseCached(response.body.shortCode);
        expect(cachedUrl).toHaveProperty("id");
    });

    test("GET /api/shorten/:shortCode should return 404 if not found", async () => {
        const invalidShortCode = "abc123";
        const response = await request(app).get(
            `/api/shorten/${invalidShortCode}`
        );
        expect(response.status).toBe(404);
        const cachedUrl = await parseCached(invalidShortCode);
        // make sure caching does not occur for non-existent shortcodes
        expect(cachedUrl).toBe("");
    });

    test("UPDATE /api/shorten/:shortCode should correctly update the long url", async () => {
        const oldUrl = "https://example.com";
        const newUrl = "https://exampletwo.com";
        // create resource
        const response = await request(app)
            .post("/api/shorten")
            .send({ url: oldUrl });
        expect(response.status).toBe(201);
        expect(response.body.url).toBe(oldUrl);

        // update
        await request(app)
            .put(`/api/shorten/${response.body.shortCode}`)
            .send({ url: newUrl });

        // retrieve the resource to ensure it was correctly updated
        const updatedResponse = await request(app).get(
            `/api/shorten/${response.body.shortCode}`
        );

        expect(updatedResponse.status).toBe(200);
        expect(updatedResponse.body.url).toBe(newUrl);
    });
});
