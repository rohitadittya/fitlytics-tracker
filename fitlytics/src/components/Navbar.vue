<script setup lang="ts">
import { useUserStore } from '@/stores/user';
import { computed } from 'vue';
import { RouterLink, useRouter } from 'vue-router';

const userStore = useUserStore();
const router = useRouter();

const isAdminLoggedIn = computed(() => userStore.isAdminLoggedIn);
const isUserLoggedIn = computed(() => userStore.isUserLoggedIn);

const logout = () => {
  userStore.logout();
  router.push("/login");
};
</script>

<template>
  <nav class="navbar is-primary">
    <div class="navbar-brand">
      <a class="navbar-item">
        <strong>Fitlytics</strong>
      </a>
    </div>

    <div class="navbar-menu">
      <div class="navbar-start">
        <RouterLink class="navbar-item" to="/">Dashboard</RouterLink>
        <RouterLink class="navbar-item" to="/activities">Activities</RouterLink>
        <RouterLink class="navbar-item" to="/admin" v-if="isAdminLoggedIn">Admin</RouterLink>
      </div>
      <div class="navbar-end">
        <div class="navbar-item has-dropdown is-hoverable" v-if="isUserLoggedIn">
          <a class="navbar-link user-profile">
            <figure class="image is-32x32 avatar">
              <img :src="userStore.loggedInUser?.image" />
            </figure>
            <span class="ml-2">
              {{ userStore.loggedInUser?.name }}
            </span>
          </a>
          <div class="navbar-dropdown is-right">
            <RouterLink class="navbar-item" to="/profile">Profile</RouterLink>
            <button class="navbar-item" @click="logout">
              Logout
            </button>
          </div>
        </div>

        <RouterLink class="navbar-item" to="/login" v-if="!isUserLoggedIn">Login</RouterLink>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.avatar img {
  border-radius: 50%;
  object-fit: cover;
}

.user-profile {
  display: flex;
  align-items: center;
}
</style>
