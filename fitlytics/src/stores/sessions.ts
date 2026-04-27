import { httpClient } from '@/services/http-api.services';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue'
import { useUserStore } from './user';


export type FeedbackMessage = {
    type: 'success' | 'danger' | 'info'
    text: string
};

export const useSessionStore = defineStore('session', () => {
    const userStore = useUserStore();
    const messages = ref<FeedbackMessage | null>(null);
    let timeout: ReturnType<typeof setTimeout> | null = null;
    const activeRequestCount = ref(0);
    const isLoading = computed(() => activeRequestCount.value > 0);

    function addMessage(text: string, type: FeedbackMessage['type'] = 'info') {
        if (timeout) {
            clearTimeout(timeout);
        }

        messages.value = { type, text };

        timeout = setTimeout(() => {
            messages.value = null;
        }, 5000);
    };

    function clearMessages() {
        if (timeout) {
            clearTimeout(timeout);
        }
        messages.value = null;
    }

    function handleError(error: Error | string) {
        const message = typeof error === 'string' ? error : error.message;
        addMessage(message, 'danger');
        console.error(error);
    };

    function httpClientApi<T>(endpoint: string, data?: unknown, options: RequestInit = {}, invalidateSessionOnFailure: boolean = false) {
        activeRequestCount.value++;

        return httpClient<T>(endpoint, data, options)
            .catch((error) => {
                if (invalidateSessionOnFailure) {
                    userStore.logout();
                }
                handleError(error);
                throw error;
            })
            .finally(() => {
                activeRequestCount.value--;
            });
    };

    return {
        messages,
        clearMessages,
        handleError,
        isLoading,
        httpClientApi,
    };
});