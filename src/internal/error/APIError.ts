// src/internal/error/APIError.ts
export class APIError extends Error {
    public statusCode: number;
    public isOperational: boolean;

    constructor(message: string, statusCode = 500, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;

        Object.setPrototypeOf(this, new.target.prototype);
        Error.captureStackTrace(this);
    }

    // static factory methods for common errors
    static notFound(message = "resource not found") {
        return new APIError(message, 404);
    }

    static badRequest(message = "invalid request data") {
        return new APIError(message, 400);
    }

    static unauthorized(message = "unauthorized access") {
        return new APIError(message, 401);
    }

    static forbidden(message = "forbidden action") {
        return new APIError(message, 403);
    }

    static internal(message = "internal server error") {
        return new APIError(message, 500);
    }
}
