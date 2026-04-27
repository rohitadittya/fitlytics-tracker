import { asyncHandler } from "../utils/async-handler";
import * as ActivityModel from "../models/activities.model";
import { getLoggedInUserId } from "../utils/auth-helpers.utils";
import { ApiResponse, apiResponse } from "../types/api-response";
import { ActivityType, UserActivityWithDetails } from "../types/activities.types";


const getAllActivities = asyncHandler(async (req, res) => {
    const loggedInUserId = getLoggedInUserId(req);
    const activities = await ActivityModel.getAllActivities(loggedInUserId);
    const response: ApiResponse<UserActivityWithDetails[]> = apiResponse(activities);
    res.status(200).send(response);
});

const getAllActivityTypes = asyncHandler(async (req, res) => {
    const activityTypes = await ActivityModel.getAllActivityTypes();
    const response: ApiResponse<ActivityType[]> = apiResponse(activityTypes);
    res.status(200).send(response);
});

const getLoggedInUserActivities = asyncHandler(async (req, res) => {
    const userId = getLoggedInUserId(req);
    const activities = await ActivityModel.getLoggedInUserActivities(userId);
    const response: ApiResponse<UserActivityWithDetails[]> = apiResponse(activities);
    res.status(200).send(response);
});

const addActivity = asyncHandler(async (req, res) => {
    const userId = getLoggedInUserId(req);
    const activity = await ActivityModel.addActivity(userId, req.body);
    const response: ApiResponse<UserActivityWithDetails> = apiResponse(activity);
    res.status(200).send(response);
});

const updateActivity = asyncHandler(async (req, res) => {
    const userId = getLoggedInUserId(req);
    const activityId = Number(req.params.id);

    if (isNaN(activityId)) {
        return res.status(400).send("Invalid activityId");
    }

    const activity = await ActivityModel.updateActivity(userId, activityId, req.body);
    const response: ApiResponse<UserActivityWithDetails> = apiResponse(activity);
    res.status(200).send(response);
});

const deleteActivity = asyncHandler(async (req, res) => {
    const userId = getLoggedInUserId(req);
    const activityId = Number(req.params.id);

    if (isNaN(activityId)) {
        return res.status(400).send("Invalid activityId");
    }

    const activity = await ActivityModel.deleteActivity(userId, activityId);
    const response: ApiResponse<boolean> = apiResponse(activity);
    res.status(200).send(response);
});

export { getAllActivities, getAllActivityTypes, getLoggedInUserActivities, addActivity, updateActivity, deleteActivity };