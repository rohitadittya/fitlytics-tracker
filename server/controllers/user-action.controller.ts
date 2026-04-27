import { asyncHandler } from "../utils/async-handler";
import * as UserActionModel from "../models/user-action.model";
import { getLoggedInUserId } from "../utils/auth-helpers.utils";
import { ApiResponse, apiResponse } from "../types/api-response";
import { UserActions } from "../types/user-action.types";

const getAllUserActions = asyncHandler(async (req, res) => {
    const userActions = await UserActionModel.getAllUserActions();
    res.status(200).send(apiResponse(userActions));
});

const getUserActionsByActivityId = asyncHandler(async (req, res) => {
    const activityId = Number(req.params.activityId);

    if (isNaN(activityId)) {
        return res.status(400).send("Invalid activityId");
    }

    const userActions = await UserActionModel.getUserActionsByActivityId(activityId);
    const response: ApiResponse<UserActions[]> = apiResponse(userActions);
    res.status(200).send(response);
});

const upsertUserAction = asyncHandler(async (req, res) => {
    const userId = getLoggedInUserId(req);
    const activityId = Number(req.params.activityId);

    if (isNaN(activityId)) {
        return res.status(400).send("Invalid activityId");
    }

    if (!req.body?.type) {
        return res.status(400).send("Action type is required");
    }

    const userActions = await UserActionModel.upsertUserAction(userId, activityId, req.body);
    const response: ApiResponse<UserActions | boolean> = apiResponse(userActions);
    res.status(200).send(response);
});

const deleteComment = asyncHandler(async (req, res) => {
    const userId = getLoggedInUserId(req);
    const commentId = Number(req.params.commentId);

    if (isNaN(commentId)) {
        return res.status(400).send("Invalid commentId");
    }

    const userActions = await UserActionModel.deleteComment(userId, commentId);
    const response: ApiResponse<boolean> = apiResponse(userActions);
    res.status(200).send(response);
});

export { getAllUserActions, getUserActionsByActivityId, upsertUserAction, deleteComment };