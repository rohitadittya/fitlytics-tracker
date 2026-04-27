import type { ApiResponse } from "@/types/api-response";
import { httpClientWithSession } from "./http-api.services";
import type { CreateActionDto, UserActions, UserActionWithUser } from "../../../server/types/user-action.types";

const USER_ACTION_API_BASE_URL = '/action';

export const getUserActionsForActivity = async (activityId: number) => {
    return await httpClientWithSession<ApiResponse<UserActionWithUser[]>>(`${USER_ACTION_API_BASE_URL}/${activityId}`);
};

export const upsertUserAction = async (activityId: number, action: CreateActionDto) => {
    return await httpClientWithSession<ApiResponse<UserActions | boolean>>(`${USER_ACTION_API_BASE_URL}/${activityId}`, action, { method: "POST" });
};

export const deleteComment = async (commentId: number) => {
    return await httpClientWithSession<ApiResponse<boolean>>(`${USER_ACTION_API_BASE_URL}/${commentId}`, undefined, { method: "DELETE" });
};