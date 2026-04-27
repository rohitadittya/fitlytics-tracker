import express from "express";
import { login, register, updateUser, deleteUser, fetchDefaultUsers, addUser, fetchAllUsers, loginDefaultUser, validateTokenAndLogin } from "../controllers/user.controller";
import { isAuthorizedUser } from "../middlewares/authorization";
import { isAdmin } from "../middlewares/isAdmin";

const router = express.Router();

// Public routes
router.post("/login", login);
router.post("/login-default", loginDefaultUser);
router.post("/register", register);
router.get("/default", fetchDefaultUsers);

// Authenticated routes
router.put("/:id", isAuthorizedUser, updateUser);
router.get("/validate-token", isAuthorizedUser, validateTokenAndLogin);

// Admin routes
router.get("/admin/all", isAuthorizedUser, isAdmin, fetchAllUsers);
router.post("/admin/add", isAuthorizedUser, isAdmin, addUser);
router.put("/admin/:id", isAuthorizedUser, isAdmin, updateUser);
router.delete("/admin/:id", isAuthorizedUser, isAdmin, deleteUser);

export default router;