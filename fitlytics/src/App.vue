<script setup lang="ts">
import { RouterView } from 'vue-router';
import Navbar from './components/Navbar.vue';
import { useSessionStore } from './stores/sessions';
import Loader from './components/Loader.vue';
import NotificationToast from './components/NotificationToast.vue';

const sessionStore = useSessionStore();
</script>

<template>

  <Navbar />
  <NotificationToast />
  <div v-if="sessionStore.isLoading" class="loader-overlay">
    <Loader />
  </div>
  <div class="container">
    <RouterView />
  </div>

</template>

<style scoped>
.loader-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  z-index: 9999;

  display: flex;
  align-items: center;
  justify-content: center;

  background: rgba(10, 10, 10, 0.5);
}
</style>
