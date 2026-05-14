import type { ApiResponse } from "@/types/api-response";
import type { ActivityType, CreateActivityDto, UpdateActivityDto, UserActivitiesResponse, UserActivityWithDetails } from "../../../server/types/activities.types";
import { httpClientWithSession } from "./http-api.services";
import type { PaginationRequest } from "../../../server/types/api-response";

const ACTIVITIES_API_BASE_URL = '/activity';

export const getAllActivities = async (paginationRequest?: PaginationRequest) => {
    return await httpClientWithSession<ApiResponse<UserActivitiesResponse>>(`${ACTIVITIES_API_BASE_URL}`, undefined, {}, false, paginationRequest);
};

export const getAllActivityTypes = async () => {
    return await httpClientWithSession<ApiResponse<ActivityType[]>>(`${ACTIVITIES_API_BASE_URL}/types`);
};

export const getLoggedInUserActivities = async (paginationRequest?: PaginationRequest) => {
    return await httpClientWithSession<ApiResponse<UserActivitiesResponse>>(`${ACTIVITIES_API_BASE_URL}/self`, undefined, {}, false, paginationRequest);
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