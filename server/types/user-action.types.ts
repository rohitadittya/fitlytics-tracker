
export enum ActionType {
    LIKE = "Like",
    COMMENT = "Comment"
};

type UserAction = {
    id: number;
    activityId: number;
    userId: number;
    createdAt: string;
    updatedAt: string;
};

export type LikeAction = UserAction & {
    type: ActionType.LIKE
};

export type CommentAction = UserAction & {
    type: ActionType.COMMENT;
    comment: string;
};

export type UserActions = LikeAction | CommentAction;

export type CreateActionDto = { type: ActionType.LIKE; } | { id?: number; type: ActionType.COMMENT; comment: string; };

export type UserActionWithUser = UserActions & {
    username: string;
    userImg: string;
};