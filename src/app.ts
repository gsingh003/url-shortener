import express from "express";
import shortenRouter from "./routes/shortUrl.router";
import { errorHandler } from "./middleware/errorHandler";
import helmet from "helmet";
import cors from "cors";

const app = express();

// global middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.get("/api/health", (req, res) => {
    res.status(200).json({
        message: "Hello API",
    });
});
app.use("/api/shorten", shortenRouter);

// global error handler
app.use(errorHandler);

export default app;
