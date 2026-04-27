import { asyncHandler } from "../utils/async-handler";
import * as userModel from "../models/user.model";
import { getLoggedInUserId, getLoggedInUserIsAdmin } from "../utils/auth-helpers.utils";
import { AppError } from "../custom-errors";
import { ApiResponse, apiResponse } from "../types/api-response";
import { AuthResponse, SafeUser } from "../types/user.types";

export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const userWithJWT = await userModel.login(email, password);
    const response: ApiResponse<AuthResponse> = apiResponse(userWithJWT);
    return res.status(200).send(response);
});

export const loginDefaultUser = asyncHandler(async (req, res) => {
    const { userId } = req.body;
    const user = await userModel.loginDefaultUser(userId);
    const response: ApiResponse<AuthResponse> = apiResponse(user);
    return res.status(200).send(response);
});

export const validateTokenAndLogin = asyncHandler(async (req, res) => {
    const userId = getLoggedInUserId(req);
    const user = await userModel.validateTokenAndLogin(userId);
    const response: ApiResponse<AuthResponse> = apiResponse(user);
    return res.status(200).send(response);
});

export const register = asyncHandler(async (req, res) => {
    const user = await userModel.register(req.body);
    const response: ApiResponse<AuthResponse> = apiResponse(user);
    return res.status(200).send(response);
});

export const addUser = asyncHandler(async (req, res) => {
    const user = await userModel.addUser(req.body);
    const response: ApiResponse<SafeUser> = apiResponse(user);
    return res.status(200).send(response);
});

export const updateUser = asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        throw new AppError("Invalid user id", 400);
    }

    const isAdminUpdate = getLoggedInUserIsAdmin(req);
    const loggedInUserId = getLoggedInUserId(req);
    const user = await userModel.updateUser(id, req.body, loggedInUserId, isAdminUpdate);
    const response: ApiResponse<SafeUser> = apiResponse(user);
    return res.status(200).send(response);
});

export const deleteUser = asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        throw new AppError("Invalid user id", 400);
    }

    const isAdmin = getLoggedInUserIsAdmin(req);
    const loggedInUserId = getLoggedInUserId(req);
    const isDeleted = await userModel.deleteUser(id, loggedInUserId, isAdmin);
    const response: ApiResponse<boolean> = apiResponse(isDeleted);
    return res.status(200).send(response);
});

export const fetchDefaultUsers = asyncHandler(async (req, res) => {
    const defaultUsers = await userModel.fetchDefaultUsers();
    const response: ApiResponse<SafeUser[]> = apiResponse(defaultUsers);
    return res.status(200).send(response);
});

export const fetchAllUsers = asyncHandler(async (req, res) => {
    const users = await userModel.fetchAllUsers();
    const response: ApiResponse<SafeUser[]> = apiResponse(users);
    return res.status(200).send(response);
});