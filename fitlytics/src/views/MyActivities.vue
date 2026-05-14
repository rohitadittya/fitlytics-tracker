<script setup lang="ts">
import { useActivitiesStore } from "@/stores/activities"
import ActivityCard from "@/components/ActivityCard.vue"
import { computed, ref, onMounted } from "vue"
import { useInfiniteScroll } from "@vueuse/core";
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

const loading = ref(false);
const containerRef = ref<HTMLElement | null>(null);

const loadActivities = async () => {
    if (loading.value) return;
    loading.value = true;
    await activitiesStore.loadLoggedInUserActivitiesByOffset();
    loading.value = false;
};

onMounted(async () => {
    activitiesStore.resetPagination();
    await loadActivities();
});

useInfiniteScroll(
    containerRef,
    async () => {
        if (loggedInUserActivities.value.length >= activitiesStore.totalLoggedInUserActivities) return;
        await loadActivities();
    },
    {
        distance: 100,
    }
);
</script>

<template>
    <div ref="containerRef" style="height: 80vh; overflow-y: auto;">
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
                <div v-if="loading" class="p-4">
                    <div class="skeleton-block"></div>
                    <div class="skeleton-block mt-2"></div>
                </div>

            </div>

        </section>
    </div>
    <div class="has-text-centered my-4">
        Showing {{ loggedInUserActivities.length }} of {{ activitiesStore.totalLoggedInUserActivities }}
    </div>

    <AddActivityModal :isOpen="isModalOpen" :editActivityId="editActivityId" @close="closeModal" />
</template>

<style scoped>
.level {
    align-items: center;
}
</style>