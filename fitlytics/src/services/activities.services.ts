import type { ApiResponse } from "@/types/api-response";
import type { ActivityType, CreateActivityDto, UpdateActivityDto, UserActivityWithDetails } from "../../../server/types/activities.types";
import { httpClientWithSession } from "./http-api.services";

const ACTIVITIES_API_BASE_URL = '/activity';

export const getAllActivities = async () => {
    return await httpClientWithSession<ApiResponse<UserActivityWithDetails[]>>(`${ACTIVITIES_API_BASE_URL}`);
};

export const getAllActivityTypes = async () => {
    return await httpClientWithSession<ApiResponse<ActivityType[]>>(`${ACTIVITIES_API_BASE_URL}/types`);
};

export const getLoggedInUserActivities = async () => {
    return await httpClientWithSession<ApiResponse<UserActivityWithDetails[]>>(`${ACTIVITIES_API_BASE_URL}/self`);
};

export const addActivity = async (activity: CreateActivityDto) => {
    return await httpClientWithSession<ApiResponse<UserActivityWithDetails>>(`${ACTIVITIES_API_BASE_URL}`, activity, { method: "POST" });
};

export const updateActivity = async (activityId: number, activity: UpdateActivityDto) => {
    return await httpClientWithSession<ApiResponse<UserActivityWithDetails>>(`${ACTIVITIES_API_BASE_URL}/${activityId}`, activity, { method: "PUT" });
};

export const deleteActivity = async (activityId: number) => {
    return await httpClientWithSession<ApiResponse<boolean>>(`${ACTIVITIES_API_BASE_URL}/${activityId}`, undefined, { method: "DELETE" });
};