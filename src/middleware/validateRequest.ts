import { Request, Response, NextFunction } from "express";
import { ValidationChain, validationResult } from "express-validator";
import { APIError } from "../internal/error/APIError";

export function validateRequest(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        next(APIError.badRequest("invalid request data"));
        return;
    }
    next();
}

export function validateRequestData(validators: ValidationChain[]) {
    return async (req: Request, res: Response, next: NextFunction) => {
        await Promise.all(validators.map((validator) => validator.run(req)));

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorMessage = Object.entries(errors.mapped())
                .map(([field, error]) => `${field}: ${error.msg}`)
                .join(", ");
            return next(APIError.badRequest(errorMessage));
        }

        next();
    };
}
