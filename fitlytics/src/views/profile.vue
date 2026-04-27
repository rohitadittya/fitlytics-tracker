<script setup lang="ts">
import ProfileForm from '@/components/ProfileForm.vue';
import { useUserStore } from '@/stores/user';
import { computed } from 'vue';

const userStore = useUserStore();
const userId = computed(() => userStore.loggedInUser?.id);
</script>

<template>
    <div class="section">
        <div class="container">
            <h1 class="title mb-6">My Profile</h1>
            <ProfileForm :edit-user-id="userId" />
        </div>

        <div class="notification is-link is-light has-text-centered mb-6 mt-6">
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
    </div>
</template>

<style scoped></style>
