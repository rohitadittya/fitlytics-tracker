import { computed, ref } from "vue";
import { defineStore } from "pinia";

import type { CreateActivityDto, UpdateActivityDto, UserActivityWithDetails } from "../../../server/types/activities.types";
import { useUserStore } from "./user";
import { addActivity, deleteActivity, getAllActivities, updateActivity } from "@/services/activities.services";
import { ActionType } from "../../../server/types/user-action.types";

export const useActivitiesStore = defineStore("activities", () => {
  const userStore = useUserStore();
  const allActivities = ref<UserActivityWithDetails[]>([]);

  const loadAllActivities = async () => {
    const response = await getAllActivities();
    allActivities.value = response.data || [];
  };

  const activityFeed = computed(() => allActivities.value);
  const loggedInUserActivities = computed(() => {
    const user = userStore.loggedInUser;
    if (!user) return [];
    return allActivities.value.filter(
      (activity) => activity.userId === user.id
    );
  });

  const addUserActivity = async (activity: CreateActivityDto) => {
    const response = await addActivity(activity);
    const newActivity = response.data;
    if (newActivity) {
      allActivities.value.unshift({ ...newActivity, isLikedByUser: false, likesCount: 0, commentsCount: 0 });
    }
  };

  const deleteUserActivity = async (activityId: number) => {
    const response = await deleteActivity(activityId);
    if (response?.success) {
      allActivities.value = allActivities.value.filter(
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
    }
  };

  const updateUserActivityByAction = (activityId: number, type: ActionType, action: 'create' | 'delete') => {
    const activityIndex = allActivities.value.findIndex(a => a.id === activityId);
    if (activityIndex === -1) return;

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
  };

  const getUserActivityById = (activityId: number) => {
    return allActivities.value.find((activity) => activity.id === activityId);
  };

  return {
    activityFeed,
    loggedInUserActivities,
    deleteUserActivity,
    getUserActivityById,
    addUserActivity,
    updateUserActivity,
    loadAllActivities,
    updateUserActivityByAction
  };
});
