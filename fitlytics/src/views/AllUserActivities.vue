<script setup lang="ts">
import { useActivitiesStore } from "@/stores/activities"
import ActivityCard from "@/components/ActivityCard.vue"
import { computed, onMounted, ref } from "vue"
import { useInfiniteScroll } from "@vueuse/core";
import AddActivityModal from "@/components/AddActivityModal.vue"


const activitiesStore = useActivitiesStore();
const isModalOpen = ref(false);
const commentOnActivity = ref(false);
const editActivityId = ref<number | undefined>(undefined);
const feed = computed(() => {
    console.log("activitiesStore.activityFeed", activitiesStore.activityFeed);
    return activitiesStore.activityFeed
});
const loading = ref(false);

const containerRef = ref<HTMLElement | null>(null);

const loadActivities = async () => {
    if (loading.value) return;
    loading.value = true;

    await activitiesStore.loadAllActivities();
    loading.value = false;
};

onMounted(async () => {
    activitiesStore.resetPagination();
    await loadActivities();
});

useInfiniteScroll(
    containerRef,
    async () => {
        if (feed.value.length >= activitiesStore.totalAllActivities) return;

        await loadActivities();
    },
    {
        distance: 100,
    }
);

const addActivityModal = () => {
    isModalOpen.value = true;
};

const commentOnActivityModal = (activityId: number) => {
    isModalOpen.value = true;
    commentOnActivity.value = true;
    editActivityId.value = activityId;
};

const closeModal = () => {
    isModalOpen.value = false;
    commentOnActivity.value = false;
    editActivityId.value = undefined;
};
</script>

<template>
    <div ref="containerRef" style="height: 80vh; overflow-y: auto;">
        <section class="section">
            <div class="container">
                <div class="level mb-5">
                    <div class="level-left">
                        <h1 class="title is-2">Feed</h1>
                    </div>
                    <div class="level-right">
                        <button class="button is-primary" @click="addActivityModal">
                            Add Fitness Activity
                        </button>
                    </div>
                </div>
                <div class="columns is-multiline">
                    <div class="column is-8 is-offset-2" v-for="activity in feed" :key="activity.id">
                        <ActivityCard :activity="activity" @commentOnActivity="commentOnActivityModal(activity.id)" />
                    </div>
                </div>
                <div class="has-text-centered my-4">
                    Showing {{ feed.length }} of {{ activitiesStore.totalAllActivities }}
                </div>
                <div v-if="loading" class="p-4">
                    <div class="skeleton-block"></div>
                    <div class="skeleton-block mt-2"></div>
                </div>
            </div>
        </section>
    </div>

    <AddActivityModal :isOpen="isModalOpen" :editOnlyActivityActions="commentOnActivity"
        :editActivityId="editActivityId" @close="closeModal" />
</template>

<style scoped>
.level {
    align-items: center;
}
</style>