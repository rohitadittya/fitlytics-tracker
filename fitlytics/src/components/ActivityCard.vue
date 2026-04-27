<script setup lang="ts">
import { upsertUserAction } from "@/services/user-action.services";
import type { UserActivityWithDetails } from "../../../server/types/activities.types";
import { useActivitiesStore } from "@/stores/activities";
import { ActionType } from "../../../server/types/user-action.types";

const props = defineProps({
    activity: {
        type: Object as () => UserActivityWithDetails,
        required: true
    },
    canModify: {
        type: Boolean,
        default: false
    }
})

const activitiesStore = useActivitiesStore();

const deleteActivity = () => {
    activitiesStore.deleteUserActivity(props.activity.id)
};

const toggleLike = async () => {
    await upsertUserAction(props.activity.id, { type: ActionType.LIKE });
    activitiesStore.updateUserActivityByAction(props.activity.id, ActionType.LIKE, 'create');
};

const emit = defineEmits(["edit", "commentOnActivity"]);

const editActivity = () => {
    emit("edit");
}

const commentOnActivity = () => {
    emit("commentOnActivity");
}

</script>

<template>
    <div class="card">
        <header class="card-header">
            <figure class="image is-48x48 avatar">
                <img :src="activity.userImg" alt="User Image">
            </figure>
            <div class="card-header-title">
                <article class="media">
                    <div class="media-content">
                        <p class="title is-6 mb-0">
                            {{ activity.username.split(" ")[0] }}
                        </p>
                        <p class="subtitle is-7 has-text-grey">
                            is {{ activity.type }}
                        </p>
                    </div>
                </article>
            </div>
        </header>
        <div class="card-content">
            <div class="content">
                <p class="is-size-5 has-text-weight-semibold">
                    {{ activity.description }}
                </p>
                <div class="mt-2">
                    <span class="icon-text mr-4">
                        <span class="icon">
                            <i class="fas fa-clock"></i>
                        </span>
                        <span>{{ activity.duration }} min</span>
                    </span>
                    <span class="icon-text">
                        <span class="icon">
                            <i class="fas fa-fire"></i>
                        </span>
                        <span>{{ activity.caloriesBurned }} cal</span>
                    </span>
                </div>
            </div>
            <time class="activity-date is-size-7">
                {{ new Date(activity.date).toDateString() }}
            </time>
        </div>
        <footer class="card-footer">
            <a href="#" :class="{ 'has-text-danger': activity.isLikedByUser }" class="card-footer-item"
                @click.prevent="toggleLike">
                <span class="icon mt-1">
                    <i class="fas fa-heart" aria-hidden="true"></i>
                </span>
                <span class="ml-1">{{ activity.likesCount }}</span>
            </a>
            <a href="#" class="card-footer-item" @click.prevent="commentOnActivity">
                <span class="icon mt-1">
                    <i class="fas fa-comment" aria-hidden="true"></i>
                </span>
                <span class="ml-1">{{ activity.commentsCount }}</span>
            </a>
            <a href="#" v-if="canModify" class="card-footer-item" @click.prevent="editActivity">
                <span class="icon">
                    <i class="fas fa-edit" aria-hidden="true"></i>
                </span>
            </a>
            <a href="#" v-if="canModify" class="card-footer-item" @click.prevent="deleteActivity">
                <span class="icon">
                    <i class="fas fa-trash" aria-hidden="true"></i>
                </span>
            </a>
        </footer>
    </div>
</template>

<style scoped>
.card {
    padding: 20px;
    margin: 20px;
    border-radius: 10px;
    transition: all 0.3s ease;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
}

.card:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 8px rgba(99, 96, 96, 0.3);
}

.activity-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.avatar img {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    object-fit: cover;
}
</style>
