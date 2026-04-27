<script setup lang="ts">
import { useSessionStore } from '@/stores/sessions';

const sessionStore = useSessionStore();

const close = () => {
    sessionStore.clearMessages();
};
</script>

<template>
    <div v-if="sessionStore.messages" class="toast-container">
        <div class="notification" :class="`is-${sessionStore?.messages?.type}`">
            <button class="delete" @click="close"></button>

            <div class="content is-small">
                <p class="mb-0">
                    {{ sessionStore?.messages?.text }}
                </p>
            </div>

        </div>
    </div>
</template>

<style scoped>
.toast-container {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 9999;
    width: 320px;
}
</style>