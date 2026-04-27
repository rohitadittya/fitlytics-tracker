import { AppError } from "../custom-errors";
import { dbClient } from "../db/db";
import { ActivityType, CreateActivityDto, UpdateActivityDto, UserActivity, UserActivityWithDetails } from "../types/activities.types";
import * as UserActionModel from "./user-action.model";
import { getUserById } from "./user.model";

const TABLE_NAME = "UserActivity";

/** Service Helpers */
const fetchActivityTypes = async (): Promise<ActivityType[]> => {
    return Promise.resolve(Object.values(ActivityType));
};

const _fetchActivityFromDBByClause = async (clause: string, value: string, selectors?: (keyof UserActivity)[]): Promise<UserActivity | null> => {
    const selectorsToQuery = selectors?.length ? selectors.join(", ") : "*";
    const { data, error } = await dbClient.from(TABLE_NAME).select(selectorsToQuery).eq(clause, value).maybeSingle();

    if (error) {
        throw new AppError("Error while fetching activity: " + error.message, 500);
    }

    return data as unknown as UserActivity | null;
};

/** ---- Service Functions --- */

const getAllActivityTypes = async (): Promise<ActivityType[]> => {
    return await fetchActivityTypes();
};

const getAllActivities = async (loggedInUserId: number): Promise<UserActivityWithDetails[]> => {
    const { data: activities, error } = await dbClient.from(TABLE_NAME).select("*").order("date", { ascending: false });

    if (error) {
        throw new AppError("Error while fetching activities: " + error.message, 500);
    }

    return await Promise.all(
        activities?.map(async (activity) => {
            const user = await getUserById(activity.userId, ["name", "image"]);
            const { likesCount, commentsCount, isLikedByUser } = await UserActionModel.getActionCountsByActivityId(activity.id, loggedInUserId);
            return {
                ...activity,
                username: user?.name ?? "N/A",
                userImg: user?.image ?? "/placeholder-image.png",
                likesCount,
                commentsCount,
                isLikedByUser
            }
        })
    );
};

const getLoggedInUserActivities = async (userId: number): Promise<UserActivityWithDetails[]> => {
    const { data: activities, error } = await dbClient.from(TABLE_NAME).select("*").eq("userId", userId).order("date", { ascending: false });

    if (error) {
        throw new AppError("Error while fetching activities: " + error.message, 500);
    }

    return await Promise.all(activities.map(async (activity) => {
        const user = await getUserById(activity.userId, ["name", "image"]);
        const { likesCount, commentsCount, isLikedByUser } = await UserActionModel.getActionCountsByActivityId(activity.id, userId);
        return {
            ...activity,
            username: user?.name ?? "N/A",
            userImg: user?.image ?? "/placeholder-image.png",
            likesCount,
            commentsCount,
            isLikedByUser
        }
    }));
};

const getActivityById = async (activityId: number, loggedInUserId: number): Promise<UserActivityWithDetails | null> => {
    const activity = await _fetchActivityFromDBByClause("id", activityId.toString());

    if (!activity) return null;

    const user = await getUserById(activity.userId, ["name", "image"]);
    const { likesCount, commentsCount, isLikedByUser } = await UserActionModel.getActionCountsByActivityId(activity.id, loggedInUserId);
    return {
        ...activity,
        username: user?.name ?? "N/A",
        userImg: user?.image ?? "/placeholder-image.png",
        likesCount,
        commentsCount,
        isLikedByUser
    };
};

const addActivity = async (userId: number, activityObj: CreateActivityDto): Promise<UserActivityWithDetails> => {
    const user = await getUserById(userId);

    if (!user) {
        throw new AppError("User not found", 404);
    }

    if (!Object.values(ActivityType).includes(activityObj.type)) {
        throw new AppError("Invalid activity type", 400);
    }

    const newActivityObj: Omit<UserActivity, "id"> = {
        type: activityObj.type,
        duration: activityObj.duration,
        caloriesBurned: activityObj.caloriesBurned,
        description: activityObj.description,
        date: new Date().toISOString(),
        userId: user.id
    };

    const { data: addedActivity, error } = await dbClient.from(TABLE_NAME).insert(newActivityObj).select("*").single();

    if (error) {
        throw new AppError("Error while adding activity: " + error.message, 500);
    }

    return {
        ...addedActivity,
        username: user.name,
        userImg: user.image
    };
};

const updateActivity = async (userId: number, activityId: number, activityObj: UpdateActivityDto): Promise<UserActivityWithDetails> => {
    const user = await getUserById(userId);

    if (!user) {
        throw new AppError("User not found", 404);
    }

    const activity = await _fetchActivityFromDBByClause("id", activityId.toString());

    if (!activity) {
        throw new AppError("Activity not found", 404);
    }

    if (activity.userId !== userId) {
        throw new AppError("Unauthorized access", 401);
    }

    if (activityObj.type && !Object.values(ActivityType).includes(activityObj.type)) {
        throw new AppError("Invalid activity type", 400);
    }

    const { id: _, ...existingDataWithoutId } = activity;
    const updatedActivityObj = {
        ...existingDataWithoutId,
        type: activityObj.type ?? activity.type,
        duration: activityObj.duration ?? activity.duration,
        caloriesBurned: activityObj.caloriesBurned ?? activity.caloriesBurned,
        description: activityObj.description ?? activity.description,
        userId: user.id
    };

    const { data: updatedActivity, error } = await dbClient.from(TABLE_NAME).update(updatedActivityObj).eq("id", activityId).select("*").single();

    if (error) {
        throw new AppError("Error while updating activity: " + error.message, 500);
    }

    return {
        ...updatedActivity,
        username: user.name,
        userImg: user.image
    };
};

const deleteActivity = async (userId: number, activityId: number): Promise<boolean> => {
    const user = await getUserById(userId);

    if (!user) {
        throw new AppError("User not found", 404);
    }

    const activity = await _fetchActivityFromDBByClause("id", activityId.toString());

    if (!activity) {
        throw new AppError("Activity not found", 404);
    }

    if (activity.userId !== userId) {
        throw new AppError("Unauthorized access", 401);
    }


    const { error } = await dbClient.from(TABLE_NAME).delete().eq("id", activityId);

    if (error) {
        throw new AppError("Error while deleting activity: " + error.message, 500);
    }

    return true;
};

export {
    getAllActivities,
    getLoggedInUserActivities,
    addActivity,
    updateActivity,
    deleteActivity,
    getAllActivityTypes,
    getActivityById
};