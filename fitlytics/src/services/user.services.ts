import type { AuthResponse, CreateUserDTO, SafeUser, UpdateUserDTO, User } from "../../../server/types/user.types";
import { httpClientWithSession } from "./http-api.services";
import type { ApiResponse } from "@/types/api-response";


const USER_API_BASE_URL = '/users';
const ADMIN_API_BASE_URL = `${USER_API_BASE_URL}/admin`;

export const fetchDefaultUsers = async () => {
    return await httpClientWithSession<ApiResponse<SafeUser[]>>(`${USER_API_BASE_URL}/default`);
};

export const login = async (email: string, password: string) => {
    return await httpClientWithSession<ApiResponse<AuthResponse>>(`${USER_API_BASE_URL}/login`, { email, password });
};

export const validateToken = async () => {
    return await httpClientWithSession<ApiResponse<AuthResponse>>(`${USER_API_BASE_URL}/validate-token`, undefined, {}, true);
};

export const loginDefaultUser = async (userId: number) => {
    return await httpClientWithSession<ApiResponse<AuthResponse>>(`${USER_API_BASE_URL}/login-default`, { userId }, { method: "POST" });
};

export const register = async (user: CreateUserDTO) => {
    return await httpClientWithSession<ApiResponse<AuthResponse>>(`${USER_API_BASE_URL}/register`, user, { method: "POST" });
};

export const updateUser = async (userId: number, user: UpdateUserDTO) => {
    return await httpClientWithSession<ApiResponse<SafeUser>>(`${USER_API_BASE_URL}/${userId}`, user, { method: "PUT" });
};

export const deleteUser = async (userId: number) => {
    return await httpClientWithSession<ApiResponse<boolean>>(`${USER_API_BASE_URL}/${userId}`, undefined, { method: "DELETE" });
};

export const addUserByAdmin = async (user: CreateUserDTO) => {
    return await httpClientWithSession<ApiResponse<SafeUser>>(`${ADMIN_API_BASE_URL}/add`, user, { method: "POST" });
};

export const updateUserByAdmin = async (userId: number, user: UpdateUserDTO) => {
    return await httpClientWithSession<ApiResponse<SafeUser>>(`${ADMIN_API_BASE_URL}/${userId}`, user, { method: "PUT" });
};

export const deleteUserByAdmin = async (userId: number) => {
    return await httpClientWithSession<ApiResponse<boolean>>(`${ADMIN_API_BASE_URL}/${userId}`, undefined, { method: "DELETE" });
};

export const getAllUsers = async () => {
    return await httpClientWithSession<ApiResponse<SafeUser[]>>(`${ADMIN_API_BASE_URL}/all`);
};