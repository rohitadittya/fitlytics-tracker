export enum ActivityType {
  Running = "Running",
  Cycling = "Cycling",
  Swimming = "Swimming",
  Yoga = "Yoga",
  StrengthTraining = "Strength Training"
};

export type UserActivity = {
  id: number;
  type: ActivityType;
  duration: number;
  caloriesBurned: number;
  date: string;
  description?: string;
  userId: number;
};

export type UserActivityWithDetails = UserActivity & {
  username: string,
  userImg: string,
  likesCount: number,
  isLikedByUser?: boolean,
  commentsCount: number
};

export type CreateActivityDto = {
  type: ActivityType;
  duration: number;
  caloriesBurned: number;
  description?: string;
};

export type UpdateActivityDto = {
  type?: ActivityType;
  duration?: number;
  caloriesBurned?: number;
  description?: string;
};