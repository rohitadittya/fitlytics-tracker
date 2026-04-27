<script setup lang="ts">
import router from '@/router';
import { useUserStore } from '@/stores/user';
import { Gender, UserRole, type CreateUserDTO, type SafeUser } from '../../../server/types/user.types';
import { onMounted, ref } from 'vue';

const userStore = useUserStore();

const activeTab = ref<"login" | "register" | "default">("default");

const name = ref("");
const email = ref("");
const password = ref("");
const age = ref(0);
const gender = ref(Gender.Male);
const height = ref(0);
const weight = ref(0);
const image = ref("");
const defaultImage = "https://www.kindpng.com/picc/m/664-6643641_avatar-transparent-background-user-icon-hd-png-download.png";

const defaultUsers = ref<SafeUser[]>([]);

const handleDefaultUserLogin = async (id: number) => {
    await userStore.loginDefaultUser(id);
    router.push({ name: 'Dashboard' });
};

const handleLogin = async () => {
    await userStore.login(email.value, password.value);
    router.push({ name: 'Dashboard' });
};

const autologinIfTokenExists = async () => {
    await userStore.autologinUsingToken();
    router.push({ name: 'Dashboard' });
};

const handleRegister = async () => {
    const user: CreateUserDTO = {
        name: name.value,
        email: email.value,
        password: password.value,
        age: age.value,
        gender: gender.value,
        height: height.value,
        weight: weight.value,
        image: image.value || defaultImage,
        role: UserRole.ROLE_USER
    };
    await userStore.register(user);
    router.push({ name: 'Dashboard' });
};

onMounted(async () => {
    await autologinIfTokenExists();
    defaultUsers.value = await userStore.fetchDefaultUsers();
});

</script>

<template>
    <section class="section">
        <div class="container">
            <h1 class="title has-text-centered">Fitlytics</h1>
            <p class="subtitle has-text-centered">
                Login, register, or choose a default profile
            </p>

            <div>
                <div class="tabs is-centered is-boxed">
                    <ul>
                        <li :class="{ 'is-active': activeTab === 'default' }">
                            <a @click="activeTab = 'default'">Default Profiles</a>
                        </li>
                        <li :class="{ 'is-active': activeTab === 'login' }">
                            <a @click="activeTab = 'login'">Login</a>
                        </li>
                        <li :class="{ 'is-active': activeTab === 'register' }">
                            <a @click="activeTab = 'register'">Register</a>
                        </li>
                    </ul>
                </div>

                <div v-if="activeTab === 'default'" class="columns is-multiline">
                    <div class="column is-4" v-for="user in defaultUsers" :key="user.id">
                        <div class="card user-card" @click="handleDefaultUserLogin(user.id)">
                            <div class="card-content has-text-centered">
                                <figure class="avatar mb-3">
                                    <img :src="user.image || defaultImage" />
                                </figure>
                                <p class="title is-5">{{ user.name }}</p>
                                <p class="is-size-7 has-text-grey">
                                    {{ user.role === UserRole.ROLE_ADMIN ? 'Admin' : 'User' }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="columns is-centered">
                    <div class="column is-6">
                        <form v-if="activeTab === 'login'" @submit.prevent="handleLogin" class="box">
                            <div class="field">
                                <label class="label">Email</label>
                                <input v-model="email" class="input" type="email" required />
                            </div>

                            <div class="field">
                                <label class="label">Password</label>
                                <input v-model="password" class="input" type="password" required />
                            </div>

                            <button class="button is-primary is-fullwidth">Login</button>
                        </form>
                    </div>
                </div>

                <form v-if="activeTab === 'register'" @submit.prevent="handleRegister" class="box">
                    <div class="columns">
                        <div class="column">
                            <label class="label">Name</label>
                            <input class="input" v-model="name" />
                        </div>
                        <div class="column">
                            <label class="label">Email</label>
                            <input class="input" v-model="email" />
                        </div>
                        <div class="column">
                            <label class="label">Password</label>
                            <input type="password" class="input" v-model="password" />
                        </div>
                    </div>

                    <div class="columns">
                        <div class="column">
                            <label class="label">Age</label>
                            <input type="number" class="input" v-model="age" />
                        </div>
                        <div class="column">
                            <label class="label">Height</label>
                            <input type="number" class="input" v-model="height" />
                        </div>
                        <div class="column">
                            <label class="label">Weight</label>
                            <input type="number" class="input" v-model="weight" />
                        </div>
                    </div>

                    <div class="columns">
                        <div class="column">
                            <label class="label">Gender</label>
                            <div class="select is-fullwidth">
                                <select v-model="gender">
                                    <option v-for="gndr in Object.values(Gender)" :key="gndr">
                                        {{ gndr }}
                                    </option>
                                </select>
                            </div>
                        </div>

                        <div class="column">
                            <label class="label">Image URL</label>
                            <input class="input" v-model="image" />
                        </div>
                    </div>

                    <button class="button is-success is-fullwidth">Register</button>
                </form>
            </div>
        </div>
    </section>
</template>

<style scoped>
.user-card {
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.user-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 18px rgba(0, 0, 0, 0.15);
}

.avatar {
    width: 96px;
    height: 96px;
    margin: 0 auto;
}

.avatar img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
}
</style>