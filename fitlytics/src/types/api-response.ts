export type ApiResponse<T> = {
    data: T;
    message?: string;
    success: boolean;
    status?: number;
};

export const apiResponse = <T>(data: T, message?: string, success: boolean = true): ApiResponse<T> => {
    return {
        data,
        message,
        success
    };
};

export const apiError = <T>(message: string, status: number): ApiResponse<T> => {
    return {
        data: null as T,
        message,
        success: false,
        status
    };
};