import { getLoggedInUserId, setLoggedInUserIsAdmin } from "../utils/auth-helpers.utils";
import { getUserById } from "../models/user.model";
import { AuthError } from "../custom-errors";
import { UserRole } from "../types/user.types";

export const isAdmin = async (req, res, next) => {
    const userId = getLoggedInUserId(req);
    const user = await getUserById(userId);
    if (!user) {
        throw new AuthError("User not found - Unauthorized access", 404);
    }
    if (user.role !== UserRole.ROLE_ADMIN) {
        throw new AuthError("Unauthorized access", 401);
    }
    setLoggedInUserIsAdmin(req);
    next();
};