<script setup lang="ts">
import { computed, ref, watch } from "vue"
import { useUserStore } from "@/stores/user"
import { Gender, UserRole, type CreateUserDTO, type SafeUser } from "../../../server/types/user.types"

const userStore = useUserStore();

const name = ref("");
const email = ref("");
const age = ref(0);
const gender = ref(Gender.Male);
const height = ref(0);
const weight = ref(0);
const image = ref("");
const role = ref(UserRole.ROLE_USER);
const defaultImage = "https://www.kindpng.com/picc/m/664-6643641_avatar-transparent-background-user-icon-hd-png-download.png";

const props = defineProps({
    editUserId: {
        type: Number,
        required: false
    },
    isAdminEditing: {
        type: Boolean,
        required: false
    }
});

const emit = defineEmits(["reset"]);
const showSuccessNotification = ref(false);
const isEdit = computed(() => props.editUserId !== undefined)

watch(() => props.editUserId, (userId) => {
    if (!userId) {
        return;
    }

    let user: SafeUser | null = null;

    if (props.isAdminEditing) {
        user = userStore.getUserByIdForAdmin(userId);
    } else if (props.editUserId && userStore.loggedInUser?.id === props.editUserId) {
        user = userStore.loggedInUser;
    }

    if (user) {
        name.value = user.name;
        email.value = user.email;
        age.value = user.age;
        gender.value = user.gender;
        height.value = user.height;
        weight.value = user.weight;
        image.value = user.image;
        role.value = user.role;
    }
}, { immediate: true });

const upsertUser = async () => {
    const isNewUser = props.editUserId ? false : true;
    const userPayload: CreateUserDTO = {
        name: name.value,
        email: email.value,
        password: name.value,
        age: age.value,
        gender: gender.value,
        height: height.value,
        weight: weight.value,
        image: image.value || defaultImage,
        role: role.value,
    };

    if (props.isAdminEditing) {
        if (isNewUser) {
            await userStore.addUserByAdmin(userPayload);
        } else if (props.editUserId) {
            await userStore.updateUserByAdmin(props.editUserId, userPayload);
        }
    } else if (props.editUserId) {
        // Update non-admin user
        await userStore.updateUser(props.editUserId, userPayload);
    }

    showSuccessNotification.value = true;

    setTimeout(() => {
        showSuccessNotification.value = false;
    }, 3000);

    if (props.isAdminEditing) {
        resetForm();
    }
};

const resetForm = () => {
    name.value = ""
    email.value = ""
    age.value = 0
    gender.value = Gender.Male
    height.value = 0
    weight.value = 0
    image.value = ""
    role.value = UserRole.ROLE_USER

    emit("reset")
}
</script>

<template>
    <div class="box">
        <h2 class="title is-5">{{ isEdit ? 'Update User' : 'Add New User' }}</h2>

        <div class="columns">
            <div class="column">
                <div class="field">
                    <label class="label">Name</label>
                    <input class="input" v-model="name" />
                </div>
            </div>
            <div class="column">
                <div class="field">
                    <label class="label">Email</label>
                    <input class="input" v-model="email" />
                </div>
            </div>
        </div>

        <div class="columns">
            <div class="column">
                <div class="field">
                    <label class="label">Age</label>
                    <input type="number" class="input" v-model="age" />
                </div>
            </div>
            <div class="column">
                <div class="field">
                    <label class="label">Height</label>
                    <input type="number" class="input" v-model="height" />
                </div>
            </div>
            <div class="column">
                <div class="field">
                    <label class="label">Weight</label>
                    <input type="number" class="input" v-model="weight" />
                </div>
            </div>
        </div>

        <div class="columns">
            <div class="column">
                <div class="field">
                    <label class="label">Gender</label>
                    <div class="select">
                        <select v-model="gender">
                            <option v-for="gender in Object.values(Gender)" :key="gender">
                                {{ gender }}
                            </option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="column" v-if="isAdminEditing">
                <div class="field">
                    <label class="label">Role</label>
                    <div class="select">
                        <select v-model="role">
                            <option v-for="role in Object.values(UserRole)" :key="role">
                                {{ role }}
                            </option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="column">
                <div class="field">
                    <label class="label">Image URL</label>
                    <input class="input" v-model="image" />
                </div>
            </div>
        </div>

        <div class="notification is-success is-light mb-4" v-if="showSuccessNotification">
            <button class="delete" @click="showSuccessNotification = false"></button>

            <span class="icon-text">
                <span class="icon">
                    <i class="fas fa-check-circle"></i>
                </span>

                <span>
                    Operation completed successfully!
                </span>
            </span>
        </div>

        <div class="field is-grouped">
            <div class="control">
                <button class="button is-primary" @click="upsertUser">
                    {{ isEdit ? 'Update' : 'Add User' }}
                </button>
            </div>
            <div class="control">
                <button v-if="isAdminEditing" class="button is-danger" @click="resetForm">
                    Cancel
                </button>
            </div>
        </div>
    </div>
</template>