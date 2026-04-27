<script setup lang="ts">
import ProfileForm from "@/components/ProfileForm.vue";
import { useUserStore } from "@/stores/user"
import { computed, onMounted, ref } from "vue";

const userStore = useUserStore();
const users = computed(() => userStore.allUsers);
const loggedInAdmin = computed(() => userStore.loggedInUser);
const editUserId = ref<number | undefined>(undefined);

onMounted(async () => {
    await userStore.loadAllUsers();
});

const editUser = (userId: number) => {
    editUserId.value = userId;
};

const resetEdit = () => {
    editUserId.value = undefined;
};

const deleteUser = (userId: number) => {
    userStore.deleteUserByAdmin(userId);
};  
</script>

<template>
    <section class="section">
        <div class="container">
            <h1 class="title">Admin Panel</h1>
            <p class="subtitle">Manage users</p>

            <ProfileForm :isAdminEditing="true" :editUserId="editUserId" @reset="resetEdit" />

            <div class="box">
                <h2 class="title is-5">Users</h2>
                <table class="table is-fullwidth is-striped">
                    <thead>
                        <tr>
                            <th></th>
                            <th>Users</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="user in users" :key="user.id">
                            <td>
                                <figure class="image is-48x48 avatar">
                                    <img :src="user.image" />
                                </figure>
                            </td>
                            <td>{{ user.name }}</td>
                            <td>{{ user.email }}</td>
                            <td>{{ user.role }}</td>
                            <td v-if="user.id !== loggedInAdmin?.id">
                                <button class="button is-primary is-small mr-2" @click="editUser(user.id)">
                                    Edit
                                </button>
                                <button class="button is-danger is-small" @click="deleteUser(user.id)">
                                    Delete
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </section>
</template>

<style scoped>
.avatar {
    width: 48px;
    height: 48px;
}

.avatar img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
}
</style>