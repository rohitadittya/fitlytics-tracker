import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { User, AuthResponse, UserRole, CreateUserDTO, UpdateUserDTO, SafeUser } from "../types/user.types";
import { AuthError, AppError } from "../custom-errors";
import { dbClient } from "../db/db";

const TABLE_NAME = "User"

/** Service Helpers */
const _findUserByClause = async (clause: string, value: string, selectors?: (keyof User)[]): Promise<User | null> => {
    const selectorsToQuery = selectors?.length ? selectors.join(", ") : "*";
    const { data, error } = await dbClient.from(TABLE_NAME).select(selectorsToQuery).eq(clause, value).maybeSingle();

    if (error) {
        throw new AppError("Error while fetching user: " + error.message, 500);
    }

    return data as unknown as User | null;
};

const _hashPassword = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, 10);
};

const _getSafeUser = (user: User): SafeUser => {
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
};

const _createSignToken = async (user: User): Promise<AuthResponse> => {
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
        throw new AppError("JWT secret not found", 500);
    }

    const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: '1h' });
    return { user: _getSafeUser(user), token };
};

/** Service functions */
const login = async (email: string, password: string): Promise<AuthResponse> => {
    const user = await _findUserByClause("email", email);
    if (!user) {
        throw new AuthError("User not found with the given credentials", 404);
    }

    if (!user.isDefaultUser) {
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            throw new AuthError("Invalid password", 401);
        }
    }

    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
        throw new AppError("JWT secret not found", 500);
    }

    return _createSignToken(user);
};

const validateTokenAndLogin = async (userId: number): Promise<AuthResponse> => {
    const user = await _findUserByClause("id", userId.toString());
    if (!user) {
        throw new AuthError("User not found", 404);
    }
    return _createSignToken(user);
};

const loginDefaultUser = async (userId: number): Promise<AuthResponse> => {
    const user = await _findUserByClause("id", userId.toString());

    if (!user) {
        throw new AuthError("User not found", 404);
    }

    if (!user.isDefaultUser) {
        throw new AuthError("User is not a default user", 403);
    }

    return _createSignToken(user);
};

const register = async (userObj: CreateUserDTO): Promise<AuthResponse> => {
    const user = await _findUserByClause("email", userObj.email);

    if (user) {
        throw new AuthError("User already exists with the given email", 409);
    }

    const hashedPassword = await _hashPassword(userObj.password);

    const newUserObj: Omit<User, "id"> = {
        ...userObj,
        password: hashedPassword,
        role: UserRole.ROLE_USER,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isDefaultUser: false
    };

    const { data: newUser, error } = await dbClient.from(TABLE_NAME).insert(newUserObj).select().single();

    if (error || !newUser) {
        throw new AppError("Failed to create user: " + error?.message, 500);
    }

    return _createSignToken(newUser);
};

const addUser = async (userObj: CreateUserDTO): Promise<SafeUser> => {
    const user = await _findUserByClause("email", userObj.email);

    if (user) {
        throw new AuthError("User already exists with the given credentials", 409);
    }

    const hashedPassword = await _hashPassword(userObj.name);

    const newUserObj: Omit<User, "id"> = {
        ...userObj,
        password: hashedPassword,
        role: userObj.role || UserRole.ROLE_USER,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isDefaultUser: true
    };

    const { data: newUser, error } = await dbClient.from(TABLE_NAME).insert(newUserObj).select().single();

    if (error || !newUser) {
        throw new AppError("Failed to add user: " + error?.message, 500);
    }

    return _getSafeUser(newUser);
};

const updateUser = async (userId: number, userObj: UpdateUserDTO, loggedInUserId: number, isAdminUpdate: boolean = false): Promise<SafeUser> => {
    if (!isAdminUpdate && userId !== loggedInUserId) {
        throw new AuthError("Unauthorized access", 401);
    }

    const user = await _findUserByClause("id", userId.toString());
    if (!user) {
        throw new AppError("User not found", 404);
    }

    if (userObj.email && userObj.email !== user.email) {
        const emailFoundForOtherUser = await _findUserByClause("email", userObj.email);
        if (emailFoundForOtherUser && emailFoundForOtherUser.id !== userId) {
            throw new AppError("Email already taken", 409);
        }
    }

    const hashedPassword = userObj.password ? await _hashPassword(userObj.password) : user.password;
    const { id: _, ...existingDataWithoutId } = user;
    const updatedUserObj = {
        ...existingDataWithoutId,
        name: userObj.name || user.name,
        email: userObj.email || user.email,
        password: hashedPassword,
        age: userObj.age || user.age,
        gender: userObj.gender || user.gender,
        height: userObj.height || user.height,
        weight: userObj.weight || user.weight,
        image: userObj.image || user.image,
        updatedAt: new Date().toISOString()
    };

    if (isAdminUpdate) {
        updatedUserObj.role = userObj.role || user.role;
    }

    const { data: updatedUser, error } = await dbClient.from(TABLE_NAME).update(updatedUserObj).eq("id", userId).select().single();

    if (error || !updatedUser) {
        throw new AppError("Failed to update user: " + error?.message, 500);
    }

    return _getSafeUser(updatedUser);
};

const deleteUser = async (userId: number, loggedInUserId: number, isAdmin: boolean): Promise<boolean> => {
    const user = await _findUserByClause("id", userId.toString());
    if (!user) {
        throw new AppError("User not found", 404);
    }

    if (!isAdmin && loggedInUserId !== userId) {
        throw new AppError("Unauthorized access", 401);
    }

    const { error } = await dbClient.from(TABLE_NAME).delete().eq("id", userId);
    if (error) {
        throw new AppError("Failed to delete user: " + error.message, 500);
    }

    return true;
};

const fetchDefaultUsers = async (): Promise<SafeUser[]> => {
    const { data: defaultUsers, error } = await dbClient.from(TABLE_NAME).select("*").eq("isDefaultUser", true);
    if (error) {
        throw new AppError("Failed to fetch default users: " + error?.message, 500);
    }

    if (!defaultUsers) {
        return [];
    }

    return defaultUsers?.map((user) => _getSafeUser(user));
};

const fetchAllUsers = async (): Promise<SafeUser[]> => {
    const { data: allUsers, error } = await dbClient.from(TABLE_NAME).select("*");
    if (error) {
        throw new AppError("Failed to fetch all users: " + error?.message, 500);
    }
    if (!allUsers) {
        return [];
    }

    return allUsers?.map((user) => _getSafeUser(user));
};

const getUserById = async (id: number, selectors?: (keyof User)[]): Promise<SafeUser | null> => {
    const user = await _findUserByClause("id", id.toString(), selectors);
    if (!user) {
        return null;
    }

    return _getSafeUser(user);
};

export {
    login,
    register,
    addUser,
    updateUser,
    deleteUser,
    fetchDefaultUsers,
    getUserById,
    fetchAllUsers,
    loginDefaultUser,
    validateTokenAndLogin
};