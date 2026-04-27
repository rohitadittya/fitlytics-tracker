import { apiError } from "../types/api-response";

export const errorHandler = (err, req, res, next) => {
    const errorName = err.name || '';
    const statusCode = err.status || 500;
    const message = statusCode === 500 ? "Internal Server Error" : err.message || "Something went wrong";

    console.error(`[${errorName}]: Error occurred with Status Code: ${statusCode} and Message: ${err.message}`);

    res.status(statusCode).send(apiError(message, statusCode));
};