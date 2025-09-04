import { Router } from "express";
import { validateRequestData } from "../middleware/validateRequest";
import {
    createShortUrlValidation,
    updateShortUrlValidation,
    shortCodeParamValidation,
} from "../internal/validators/shortUrlValidation";
import {
    createShortUrl,
    deleteShortUrl,
    getOriginalUrl,
    updateShortUrl,
    getShortUrlStats,
} from "../controllers/shortUrl.controller";

const shortenRouter = Router();

shortenRouter.post(
    "/",
    validateRequestData(createShortUrlValidation),
    createShortUrl
);
shortenRouter.get(
    "/:shortCode",
    validateRequestData(shortCodeParamValidation),
    getOriginalUrl
);
shortenRouter.put(
    "/:shortCode",
    validateRequestData(updateShortUrlValidation),
    updateShortUrl
);
shortenRouter.delete(
    "/:shortCode",
    validateRequestData(shortCodeParamValidation),
    deleteShortUrl
);
shortenRouter.get(
    "/:shortCode/status",
    validateRequestData(shortCodeParamValidation),
    getShortUrlStats
);

export default shortenRouter;
