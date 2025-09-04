import { Request, Response, NextFunction } from "express";
import { APIError } from "../internal/error/APIError";

export function errorHandler(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) {
    console.error(err);

    if (err instanceof APIError) {
        res.status(err.statusCode).json({ error: err.message });
        return;
    }

    res.status(500).json({ error: "Internal Server Error" });
}
