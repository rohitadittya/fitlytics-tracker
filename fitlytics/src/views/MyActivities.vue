<script setup lang="ts">
import { useActivitiesStore } from "@/stores/activities"
import ActivityCard from "@/components/ActivityCard.vue"
import { computed, ref } from "vue"
import AddActivityModal from "@/components/AddActivityModal.vue"

const activitiesStore = useActivitiesStore();

const isModalOpen = ref(false);
const editActivityId = ref<number | undefined>(undefined);

const loggedInUserActivities = computed(() => activitiesStore.loggedInUserActivities);

const openModal = () => {
    isModalOpen.value = true;
}

const closeModal = () => {
    isModalOpen.value = false;
    editActivityId.value = undefined;
}

const editActivity = (activityId: number) => {
    isModalOpen.value = true;
    editActivityId.value = activityId;
}
</script>

<template>
    <section class="section">
        <div class="container">
            <div class="level mb-5">
                <div class="level-left">
                    <h1 class="title is-2">My Activities</h1>
                </div>

                <div class="level-right">
                    <button class="button is-primary" @click="openModal">
                        Add Fitness Activity
                    </button>
                </div>
            </div>

            <div class="notification is-link is-light has-text-centered mb-6">
                <span class="icon-text">
                    <span class="icon">
                        <i class="fas fa-chart-line"></i>
                    </span>
                    <span>
                        View your complete fitness statistics
                        <RouterLink class="has-text-weight-semibold ml-1" to="/stats">
                            here
                        </RouterLink>
                    </span>
                </span>
            </div>

            <div class="columns is-multiline">

                <div class="column is-8 is-offset-2" v-for="activity in loggedInUserActivities" :key="activity.id">
                    <ActivityCard :activity="activity" :canModify="true" @edit="editActivity(activity.id)"
                        @commentOnActivity="editActivity(activity.id)" />
                </div>

            </div>

        </div>

    </section>

    <AddActivityModal :isOpen="isModalOpen" :editActivityId="editActivityId" @close="closeModal" />
</template>

<style scoped>
.level {
    align-items: center;
}
</style>