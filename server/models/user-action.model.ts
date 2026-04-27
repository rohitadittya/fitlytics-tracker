import { AppError } from "../custom-errors";
import { dbClient } from "../db/db";
import { ActionType, CommentAction, CreateActionDto, UserActions, UserActionWithUser } from "../types/user-action.types";
import { getActivityById } from "./activities.model";
import { getUserById } from "./user.model";

const TABLE_NAME = "UserActions";

const getAllUserActions = async (): Promise<UserActions[]> => {
    const { data: userActions, error } = await dbClient.from(TABLE_NAME).select("*").order("createdAt", { ascending: false });

    if (error) {
        throw new AppError("Error while fetching user actions: " + error.message, 500);
    }

    return userActions;
};

const getUserActionsByActivityId = async (activityId: number): Promise<UserActionWithUser[]> => {
    const { data: userActions, error } = await dbClient.from(TABLE_NAME).select("*").eq("activityId", activityId).order("createdAt", { ascending: false });

    if (error) {
        throw new AppError("Error while fetching user actions: " + error.message, 500);
    }

    if (!userActions || userActions.length === 0) return [];

    return await Promise.all(userActions.map(async (action) => {
        const user = await getUserById(action.userId, ["name", "image"]);
        return {
            ...action,
            username: user?.name ?? "Unknown",
            userImg: user?.image ?? "/placeholder-image.png"
        };
    }));
};

const getActionCountsByActivityId = async (activityId: number, userId: number): Promise<{ likesCount: number, commentsCount: number, isLikedByUser: boolean }> => {
    const [likesRes, commentsRes, likedRes] = await Promise.all([
        dbClient
            .from(TABLE_NAME)
            .select("*", { count: "exact", head: true })
            .eq("activityId", activityId)
            .eq("type", ActionType.LIKE),

        dbClient
            .from(TABLE_NAME)
            .select("*", { count: "exact", head: true })
            .eq("activityId", activityId)
            .eq("type", ActionType.COMMENT),

        dbClient
            .from(TABLE_NAME)
            .select("id")
            .eq("activityId", activityId)
            .eq("userId", userId)
            .eq("type", ActionType.LIKE)
            .maybeSingle()
    ]);

    if (likesRes.error || commentsRes.error || likedRes.error) {
        throw new AppError("Error while fetching user actions: " + (likesRes.error?.message || commentsRes.error?.message || likedRes.error?.message), 500);
    }

    const likesCount = likesRes.count ?? 0;
    const commentsCount = commentsRes.count ?? 0;
    const isLikedByUser = likedRes.data !== null;

    return {
        likesCount,
        commentsCount,
        isLikedByUser
    };
};

const likeAction = async (userId: number, activityId: number): Promise<boolean> => {
    const { data: existingLike, error } = await dbClient.from(TABLE_NAME).select("*").eq("activityId", activityId).eq("userId", userId).eq("type", ActionType.LIKE).maybeSingle();

    if (error) {
        throw new AppError("Error while fetching user actions: " + error.message, 500);
    }

    if (existingLike) {
        const { error } = await dbClient.from(TABLE_NAME).delete().eq("id", existingLike.id);

        if (error) {
            throw new AppError("Error while deleting user action: " + error.message, 500);
        }

        return true;
    }

    const newLike: Omit<UserActions, "id"> = {
        type: ActionType.LIKE,
        userId,
        activityId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    const { error: insertError } = await dbClient.from(TABLE_NAME).insert(newLike);

    if (insertError) {
        throw new AppError("Error while inserting user action" + insertError.message, 500);
    }

    return true;
};

const commentAction = async (userId: number, activityId: number, action: Extract<CreateActionDto, { type: ActionType.COMMENT }>): Promise<CommentAction> => {
    if (!action.comment || action.comment.trim() === "") {
        throw new AppError("Comment cannot be empty", 400);
    }

    if (action?.id) {
        const { data: existingComment, error: fetchError } = await dbClient.from(TABLE_NAME).select("*").eq("id", action.id).maybeSingle();

        if (fetchError) {
            throw new AppError("Error while fetching user action: " + fetchError.message, 500);
        }

        if (!existingComment) {
            throw new AppError("Comment not found", 404);
        }

        const { id: _, ...rest } = existingComment;

        const updatedCommentObj: Omit<CommentAction, "id"> = {
            ...rest,
            comment: action.comment,
            updatedAt: new Date().toISOString()
        };

        const { data: updatedComment, error: updateError } = await dbClient.from(TABLE_NAME).update(updatedCommentObj).eq("id", action.id).select().single();

        if (updateError || !updatedComment) {
            throw new AppError("Error while updating user action" + updateError?.message, 500);
        }

        return updatedComment;
    }

    const newCommentObj: Omit<CommentAction, "id"> = {
        type: ActionType.COMMENT,
        comment: action.comment,
        userId,
        activityId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    const { data: newComment, error: insertError } = await dbClient.from(TABLE_NAME).insert(newCommentObj).select().single();

    if (insertError || !newComment) {
        throw new AppError("Error while inserting user action" + insertError?.message, 500);
    }

    return newComment;
};

const upsertUserAction = async (userId: number, activityId: number, action: CreateActionDto): Promise<UserActions | boolean> => {
    const user = await getUserById(userId);

    if (!user) {
        throw new AppError("User not found", 404);
    }

    const activity = await getActivityById(activityId, userId);

    if (!activity) {
        throw new AppError("Activity not found", 404);
    }

    if (!Object.values(ActionType).includes(action.type)) {
        throw new AppError("Invalid action type", 400);
    }

    switch (action.type) {
        case ActionType.LIKE:
            return likeAction(userId, activityId);

        case ActionType.COMMENT:
            return commentAction(userId, activityId, action);

        default:
            throw new AppError("Unsupported action type", 400);
    }
};

const deleteComment = async (userId: number, commentId: number): Promise<boolean> => {
    const { data: existingComment, error: fetchError } = await dbClient.from(TABLE_NAME).select("*").eq("id", commentId).maybeSingle();

    if (fetchError) {
        throw new AppError("Error while fetching user action: " + fetchError.message, 500);
    }

    if (!existingComment) {
        throw new AppError("Comment not found", 404);
    }

    if (existingComment.userId !== userId) {
        throw new AppError("Unauthorized to delete this comment", 403);
    }

    if (existingComment.type !== ActionType.COMMENT) {
        throw new AppError("This is not a comment", 400);
    }

    const { error: deleteError } = await dbClient.from(TABLE_NAME).delete().eq("id", commentId);

    if (deleteError) {
        throw new AppError("Error while deleting user action: " + deleteError.message, 500);
    }

    return true;
};

export {
    getAllUserActions,
    getUserActionsByActivityId,
    upsertUserAction,
    getActionCountsByActivityId,
    deleteComment
};