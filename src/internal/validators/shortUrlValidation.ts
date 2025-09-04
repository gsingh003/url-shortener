import { body, param } from "express-validator";

export const createShortUrlValidation = [
    body("url").trim().isURL().withMessage("invalid url format"),
];

export const updateShortUrlValidation = [
    param("shortCode")
        .trim()
        .isLength({ min: 6, max: 6 })
        .withMessage("invalid shortCode"),
    body("url").trim().isURL().withMessage("invalid url format"),
];

export const shortCodeParamValidation = [
    param("shortCode")
        .trim()
        .isLength({ min: 6, max: 6 })
        .withMessage("invalid shortCode"),
];
