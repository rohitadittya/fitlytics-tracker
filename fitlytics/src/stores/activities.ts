import { computed, ref } from "vue";
import { defineStore } from "pinia";

import type { CreateActivityDto, UpdateActivityDto, UserActivityWithDetails } from "../../../server/types/activities.types";
import { useUserStore } from "./user";
import { addActivity, deleteActivity, getAllActivities, getLoggedInUserActivities, updateActivity } from "@/services/activities.services";
import { ActionType } from "../../../server/types/user-action.types";
import type { PaginationRequest } from "../../../server/types/api-response";

export const useActivitiesStore = defineStore("activities", () => {
  const userStore = useUserStore();
  const allActivities = ref<UserActivityWithDetails[]>([]);
  const allLoggedInUserActivities = ref<UserActivityWithDetails[]>([]);

  const limitAllActivities = 10;
  const offsetAllActivities = ref(0);
  const totalAllActivities = ref(0);

  const limitLoggedInUserActivities = 10;
  const offsetLoggedInUserActivities = ref(0);
  const totalLoggedInUserActivities = ref(0);

  const resetPagination = () => {
    offsetAllActivities.value = 0;
    offsetLoggedInUserActivities.value = 0;
    totalAllActivities.value = 0;
    totalLoggedInUserActivities.value = 0;
    allActivities.value = [];
    allLoggedInUserActivities.value = [];
  };

  const loadAllActivities = async (paginationRequest?: PaginationRequest) => {
    paginationRequest = paginationRequest ?? { limit: limitAllActivities, offset: offsetAllActivities.value };
    const response = await getAllActivities(paginationRequest);
    allActivities.value.push(...(response.data?.activities || []));
    offsetAllActivities.value += response.data?.activities.length || 0;
    totalAllActivities.value = response.data?.total || 0;
  };

  const loadLoggedInUserActivitiesByOffset = async (paginationRequest?: PaginationRequest) => {
    paginationRequest = paginationRequest ?? { limit: limitLoggedInUserActivities, offset: offsetLoggedInUserActivities.value };
    const response = await getLoggedInUserActivities(paginationRequest);
    allLoggedInUserActivities.value.push(...(response.data?.activities || []));
    offsetLoggedInUserActivities.value += response.data?.activities.length || 0;
    totalLoggedInUserActivities.value = response.data?.total || 0;
  };

  const activityFeed = computed(() => allActivities.value);
  const loggedInUserActivities = computed(() => allLoggedInUserActivities.value);

  const addUserActivity = async (activity: CreateActivityDto) => {
    const response = await addActivity(activity);
    const newActivity = response.data;
    if (newActivity) {
      allActivities.value.unshift({ ...newActivity, isLikedByUser: false, likesCount: 0, commentsCount: 0 });
      allLoggedInUserActivities.value.unshift({ ...newActivity, isLikedByUser: false, likesCount: 0, commentsCount: 0 });
    }
  };

  const deleteUserActivity = async (activityId: number) => {
    const response = await deleteActivity(activityId);
    if (response?.success) {
      allActivities.value = allActivities.value.filter(
        (activity) => activity.id !== activityId,
      );
      allLoggedInUserActivities.value = allLoggedInUserActivities.value.filter(
        (activity) => activity.id !== activityId,
      );
    }
  };

  const updateUserActivity = async (activityId: number, updatedActivity: UpdateActivityDto) => {
    const response = await updateActivity(activityId, updatedActivity);
    if (response?.success) {
      allActivities.value = allActivities.value.map((activity) => {
        if (activity.id === activityId) {
          return {
            ...activity,
            ...updatedActivity
          }
        }
        return activity
      });
      allLoggedInUserActivities.value = allLoggedInUserActivities.value.map((activity) => {
        if (activity.id === activityId) {
          return {
            ...activity,
            ...updatedActivity
          }
        }
        return activity
      });
    }
  };

  const updateUserActivityByAction = (activityId: number, type: ActionType, action: 'create' | 'delete') => {
    const activityIndex = allActivities.value.findIndex(a => a.id === activityId);

    if (activityIndex !== -1) {
      const activity = allActivities.value[activityIndex];
      if (!activity) return;

      if (type === ActionType.LIKE) {
        if (activity?.isLikedByUser) {
          activity.isLikedByUser = false;
          activity.likesCount--;
        } else {
          activity.isLikedByUser = true;
          activity.likesCount++;
        }
      }
      else if (type === ActionType.COMMENT) {
        if (action === 'create') {
          activity.commentsCount++;
        } else {
          activity.commentsCount--;
        }
      }
    }


    const userActivityIndex = allLoggedInUserActivities.value.findIndex(a => a.id === activityId);

    if (userActivityIndex !== -1) {
      const userActivity = allLoggedInUserActivities.value[userActivityIndex];
      if (!userActivity) return;

      if (type === ActionType.LIKE) {
        if (userActivity?.isLikedByUser) {
          userActivity.isLikedByUser = false;
          userActivity.likesCount--;
        } else {
          userActivity.isLikedByUser = true;
          userActivity.likesCount++;
        }
      }
      else if (type === ActionType.COMMENT) {
        if (action === 'create') {
          userActivity.commentsCount++;
        } else {
          userActivity.commentsCount--;
        }
      }
    }
  };

  const getUserActivityById = (activityId: number) => {
    return [...allActivities.value, ...allLoggedInUserActivities.value].find((activity) => activity.id === activityId);
  };

  return {
    activityFeed,
    loggedInUserActivities,
    deleteUserActivity,
    getUserActivityById,
    addUserActivity,
    updateUserActivity,
    loadAllActivities,
    updateUserActivityByAction,
    loadLoggedInUserActivitiesByOffset,
    totalAllActivities,
    totalLoggedInUserActivities,
    resetPagination
  };
});
