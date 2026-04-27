<script setup lang="ts">
import { useActivitiesStore } from "@/stores/activities"
import ActivityCard from "@/components/ActivityCard.vue"
import { computed, onMounted, ref } from "vue"
import AddActivityModal from "@/components/AddActivityModal.vue"


const activitiesStore = useActivitiesStore();
const isModalOpen = ref(false);
const commentOnActivity = ref(false);
const editActivityId = ref<number | undefined>(undefined);
const feed = computed(() => activitiesStore.activityFeed);

onMounted(async () => {
    await activitiesStore.loadAllActivities();
});

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
        </div>

    </section>

    <AddActivityModal :isOpen="isModalOpen" :editOnlyActivityActions="commentOnActivity"
        :editActivityId="editActivityId" @close="closeModal" />
</template>

<style scoped>
.level {
    align-items: center;
}
</style>