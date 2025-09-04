import ShortUrl from "../models/ShortUrl";
import { generateShortCode } from "../internal/generateShortCode";
import redis from "../internal/cache/redis";
import { config } from "../internal/config/config";

const cache_ttl = config.redis.ttl;

class ShortUrlService {
    async createShortUrl(url: string): Promise<ShortUrl> {
        const shortCode = generateShortCode();
        const shortUrl = await ShortUrl.create({ url, shortCode });
        await redis.setEx(shortCode, cache_ttl, JSON.stringify(shortUrl));
        return shortUrl;
    }

    async getOriginalUrl(shortCode: string): Promise<ShortUrl | null> {
        const cachedShortUrl = await redis.get(shortCode);
        if (cachedShortUrl) {
            const shortUrl: ShortUrl = JSON.parse(cachedShortUrl);
            shortUrl.accessCount += 1;
            await redis.setEx(shortCode, cache_ttl, JSON.stringify(shortUrl));
            await ShortUrl.update(
                { accessCount: shortUrl.accessCount },
                { where: { shortCode } }
            );
            return shortUrl;
        }

        const shortUrl = await ShortUrl.findOne({ where: { shortCode } });
        if (!shortUrl) return null;

        shortUrl.accessCount += 1;
        await shortUrl.save();
        await redis.setEx(shortCode, cache_ttl, JSON.stringify(shortUrl));
        return shortUrl;
    }

    async updateShortUrl(
        shortCode: string,
        newUrl: string
    ): Promise<ShortUrl | null> {
        const shortUrl = await ShortUrl.findOne({ where: { shortCode } });
        if (!shortUrl) return null;

        shortUrl.url = newUrl;
        await shortUrl.save();

        await redis.setEx(shortCode, cache_ttl, JSON.stringify(shortUrl));
        return shortUrl;
    }

    async deleteShortUrl(shortCode: string): Promise<boolean> {
        const deletedCount = await ShortUrl.destroy({ where: { shortCode } });
        if (deletedCount > 0) {
            await redis.del(shortCode);
            return true;
        }
        return false;
    }

    async getShortUrlStats(shortCode: string): Promise<ShortUrl | null> {
        const cachedShortUrl = await redis.get(shortCode);
        if (cachedShortUrl) {
            return JSON.parse(cachedShortUrl);
        }

        const shortUrl = await ShortUrl.findOne({ where: { shortCode } });
        if (shortUrl) {
            await redis.setEx(shortCode, cache_ttl, JSON.stringify(shortUrl));
        }
        return shortUrl || null;
    }
}

export default new ShortUrlService();
