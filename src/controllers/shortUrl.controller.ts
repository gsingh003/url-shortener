import { Request, Response, NextFunction } from "express";
import shortUrlService from "../services/shortUrl.service";
import { APIError } from "../internal/error/APIError";

export const createShortUrl = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { url } = req.body;
        const shortUrl = await shortUrlService.createShortUrl(url);
        res.status(201).json(shortUrl);
    } catch (error) {
        next(error);
    }
};

export const getOriginalUrl = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { shortCode } = req.params;
        const shortUrl = await shortUrlService.getOriginalUrl(shortCode);
        if (!shortUrl) {
            next(APIError.notFound("short url not found"));
            return;
        }
        res.status(200).json(shortUrl);
    } catch (error) {
        next(error);
    }
};

export const updateShortUrl = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { shortCode } = req.params;
        const { url } = req.body;

        const updatedShortUrl = await shortUrlService.updateShortUrl(
            shortCode,
            url
        );
        if (!updatedShortUrl) {
            next(APIError.notFound("short URL not found"));
            return;
        }
        res.status(200).json(updatedShortUrl);
    } catch (error) {
        next(error);
    }
};

export const deleteShortUrl = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { shortCode } = req.params;
        const deleted = await shortUrlService.deleteShortUrl(shortCode);
        if (!deleted) {
            next(APIError.notFound("short URL not found"));
            return;
        }
        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
};

export const getShortUrlStats = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { shortCode } = req.params;
        const shortUrl = await shortUrlService.getShortUrlStats(shortCode);
        if (!shortUrl) {
            next(APIError.notFound("short URL not found"));
            return;
        }
        res.status(200).json(shortUrl);
    } catch (error) {
        next(error);
    }
};
