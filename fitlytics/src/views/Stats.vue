<script setup lang="ts">
import { computed } from "vue"
import { useUserStore } from "@/stores/user"
import { useActivitiesStore } from "@/stores/activities"

const userStore = useUserStore();
const activitiesStore = useActivitiesStore();

const user = computed(() => userStore.loggedInUser);

const userActivities = computed(() => activitiesStore.loggedInUserActivities);

const userTotalWorkouts = computed(() => userActivities.value.length);

const userTotalDuration = computed(() =>
    userActivities.value.reduce((totalDuration, activity) => totalDuration + activity.duration, 0)
);

const userTotalCalories = computed(() =>
    userActivities.value.reduce((totalCalories, activity) => totalCalories + activity.caloriesBurned, 0)
);

const userMostFrequentActivity = computed(() => {
    const counts: Record<string, number> = {};

    userActivities.value.forEach((activity) => {
        counts[activity.type] = (counts[activity.type] || 0) + 1
    })

    let max = 0;
    let result = "N/A";

    Object.entries(counts).forEach(([type, count]) => {
        if (count > max) {
            max = count
            result = type
        }
    })

    return result;
});
</script>

<template>
    <section class="section">
        <div class="container">

            <h1 class="title">My Stats</h1>
            <p class="subtitle">
                Fitness summary for {{ user?.name }}
            </p>

            <div class="columns">

                <div class="column">
                    <div class="box has-text-centered">
                        <p class="heading">Workouts</p>
                        <p class="title">{{ userTotalWorkouts }}</p>
                    </div>
                </div>

                <div class="column">
                    <div class="box has-text-centered">
                        <p class="heading">Total Duration</p>
                        <p class="title">{{ userTotalDuration }} min</p>
                    </div>
                </div>

                <div class="column">
                    <div class="box has-text-centered">
                        <p class="heading">Calories Burned</p>
                        <p class="title">{{ userTotalCalories }}</p>
                    </div>
                </div>

                <div class="column">
                    <div class="box has-text-centered">
                        <p class="heading">You rock at</p>
                        <p class="title">{{ userMostFrequentActivity }}</p>
                    </div>
                </div>

            </div>

            <div class="box mt-5">
                <h2 class="title is-5">Activity History</h2>

                <table class="table is-fullwidth is-striped">
                    <thead>
                        <tr>
                            <th>Type</th>
                            <th>Duration</th>
                            <th>Calories</th>
                            <th>Date</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr v-for="activity in userActivities" :key="activity.id">
                            <td>{{ activity.type }}</td>
                            <td>{{ activity.duration }} min</td>
                            <td>{{ activity.caloriesBurned }}</td>
                            <td>{{ new Date(activity.date).toLocaleDateString() }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

        </div>
    </section>
</template>

<style scoped>
.box {
    transition: transform 0.2s ease;
}

.box:hover {
    transform: translateY(-4px);
}
</style>