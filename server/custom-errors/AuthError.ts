export class AuthError extends Error {
    name = "AuthError";
    status: number;
    constructor(message: string, statusCode: number) {
        super(message);
        this.status = statusCode;
    }
}