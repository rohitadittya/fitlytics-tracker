<script setup lang="ts">
import { computed, ref, watch } from "vue"
import { ActivityType } from "../../../server/types/activities.types"
import { useActivitiesStore } from "@/stores/activities"
import { useUserStore } from "@/stores/user"
import ActivityActions from "./ActivityActions.vue"

const props = defineProps({
    isOpen: Boolean,
    editActivityId: {
        type: Number,
        required: false
    },
    editOnlyActivityActions: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(["close"]);

const activitiesStore = useActivitiesStore();
const userStore = useUserStore();

const type = ref(ActivityType.Running);
const duration = ref(0);
const caloriesBurned = ref(0);
const description = ref("");
const isEditing = computed(() => !!props.editActivityId);
const activityTitle = computed(() => props.editOnlyActivityActions ? "Activity" : (isEditing.value ? "Edit Activity" : "Add Activity"));

const resetForm = () => {
    type.value = ActivityType.Running;
    duration.value = 0;
    caloriesBurned.value = 0;
    description.value = "";
}

watch(
    () => props.editActivityId,
    (id) => {
        if (!id) {
            resetForm();
            return;
        }

        const activity = activitiesStore.getUserActivityById(id);

        if (activity) {
            type.value = activity.type;
            duration.value = activity.duration;
            caloriesBurned.value = activity.caloriesBurned;
            description.value = activity.description || "";
        }
    },
    { immediate: true }
);

const submitActivity = async () => {
    if (!userStore.loggedInUser || props.editOnlyActivityActions) return;

    if (isEditing.value && props.editActivityId) {
        await activitiesStore.updateUserActivity(props.editActivityId, {
            type: type.value,
            duration: duration.value,
            caloriesBurned: caloriesBurned.value,
            description: description.value,
        });
    } else {
        await activitiesStore.addUserActivity({
            type: type.value,
            duration: duration.value,
            caloriesBurned: caloriesBurned.value,
            description: description.value,
        });
    }

    resetForm();
    emit("close")
}
</script>

<template>
    <div class="modal" :class="{ 'is-active': isOpen }">
        <div class="modal-background" @click="$emit('close')"></div>

        <div class="modal-card" :style="{ width: isEditing ? '900px' : '640px', maxWidth: '95vw' }">
            <header class="modal-card-head">
                <p class="modal-card-title">
                    {{ activityTitle }}
                </p>
                <button class="delete" @click="$emit('close')"></button>
            </header>

            <section class="modal-card-body">
                <div class="columns is-marginless" style="min-height: 400px;">
                    <div class="column p-5">
                        <div class="field">
                            <label class="label">Activity Type</label>
                            <div class="control">
                                <div class="select is-fullwidth">
                                    <select v-model="type" :disabled="editOnlyActivityActions">
                                        <option v-for="activityType in Object.values(ActivityType)" :key="activityType">
                                            {{ activityType }}
                                        </option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div class="field">
                            <label class="label">Duration (minutes)</label>
                            <input class="input" type="number" v-model="duration" :readonly="editOnlyActivityActions" />
                        </div>

                        <div class="field">
                            <label class="label">Calories Burned</label>
                            <input class="input" type="number" v-model="caloriesBurned"
                                :readonly="editOnlyActivityActions" />
                        </div>

                        <div class="field">
                            <label class="label">Description</label>
                            <textarea class="textarea" v-model="description" rows="3"
                                :readonly="editOnlyActivityActions"></textarea>
                        </div>
                    </div>

                    <div class="column box is-4 p-2 has-background-dark" v-if="isEditing && editActivityId">
                        <ActivityActions :activity-id="editActivityId" />
                    </div>
                </div>
            </section>

            <footer class="modal-card-foot" v-if="!props.editOnlyActivityActions">
                <button class="button is-success" @click="submitActivity">
                    Save Activity
                </button>

                <button class="button" @click="$emit('close')">
                    Cancel
                </button>
            </footer>
        </div>
    </div>
</template>

<style scoped>
.border-left {
    border-left: 1px solid #dbdbdb;
}
</style>