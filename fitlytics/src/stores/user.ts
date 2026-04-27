import { type CreateUserDTO, type SafeUser, type UpdateUserDTO, type User, UserRole } from '../../../server/types/user.types';
import { defineStore } from 'pinia'
import { computed, ref } from 'vue';
import { useActivitiesStore } from './activities';
import * as userServices from '@/services/user.services';

export const useUserStore = defineStore('user', () => {
    const users = ref<SafeUser[]>([]);
    const activitiesStore = useActivitiesStore();

    const loggedInUser = ref<SafeUser | null>(null);
    const allUsers = computed(() => users.value);

    const isAdminLoggedIn = computed(() =>
        loggedInUser.value?.role === UserRole.ROLE_ADMIN
    );

    const isUserLoggedIn = computed(() =>
        loggedInUser.value !== null
    );

    const setUserAndJWTToken = (user: SafeUser, token: string) => {
        if (user) {
            localStorage.setItem('jwt_token', token);
            loggedInUser.value = user;
        }
    };

    const getJWTToken = () => {
        return localStorage.getItem('jwt_token');
    };

    const autologinUsingToken = async () => {
        if (!loggedInUser.value && getJWTToken()) {
            const response = await userServices.validateToken();
            const { user, token } = response.data;
            setUserAndJWTToken(user, token);
        }
    };

    const login = async (email: string, password: string) => {
        const response = await userServices.login(email, password);
        const { user, token } = response.data;
        setUserAndJWTToken(user, token);
    };

    const loginDefaultUser = async (userId: number) => {
        const response = await userServices.loginDefaultUser(userId);
        const { user, token } = response.data;
        setUserAndJWTToken(user, token);
    };

    const logout = () => {
        loggedInUser.value = null;
        localStorage.removeItem('jwt_token');
    };

    const register = async (userObj: CreateUserDTO) => {
        const newUser = await userServices.register(userObj);
        const { user, token } = newUser.data;
        setUserAndJWTToken(user, token);
    };

    const updateUser = async (userId: number, user: UpdateUserDTO) => {
        const response = await userServices.updateUser(userId, user);
        const updatedUser: SafeUser = response.data;
        loggedInUser.value = updatedUser;
    };

    const loadAllUsers = async () => {
        if (!isAdminLoggedIn.value) return;

        const response = await userServices.getAllUsers();
        users.value = response.data;
    };

    const getUserByIdForAdmin = (id: number): SafeUser | null => {
        return users.value.find(u => u.id === id) || null;
    };

    const addUserByAdmin = async (user: CreateUserDTO) => {
        const response = await userServices.addUserByAdmin(user);
        const newUser: SafeUser = response.data;
        users.value.push(newUser);
    };

    const updateUserByAdmin = async (userId: number, user: UpdateUserDTO) => {
        const response = await userServices.updateUserByAdmin(userId, user);
        const updatedUser: SafeUser = response.data;
        users.value = users.value.map(user => user.id === updatedUser.id ? updatedUser : user);
    };

    const deleteUserByAdmin = async (userId: number) => {
        const response = await userServices.deleteUserByAdmin(userId);
        const isDeleted = response.data;
        if (isDeleted) {
            users.value = users.value.filter(u => u.id !== userId);
            activitiesStore.loadAllActivities();
        }
        return isDeleted;
    };

    const fetchDefaultUsers = async () => {
        const response = await userServices.fetchDefaultUsers();
        return response.data;
    };

    return {
        loggedInUser,
        login,
        logout,
        allUsers,
        loadAllUsers,
        isAdminLoggedIn,
        isUserLoggedIn,
        register,
        updateUser,
        getUserByIdForAdmin,
        addUserByAdmin,
        updateUserByAdmin,
        deleteUserByAdmin,
        getJWTToken,
        fetchDefaultUsers,
        loginDefaultUser,
        autologinUsingToken
    };
});