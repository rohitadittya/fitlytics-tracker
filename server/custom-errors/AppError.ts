export class AppError extends Error {
    name = "AppError";
    status: number;
    constructor(message: string, statusCode: number) {
        super(message);
        this.status = statusCode;
    }
}