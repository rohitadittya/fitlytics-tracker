import express from "express";
import { getAllActivities, getLoggedInUserActivities, addActivity, updateActivity, deleteActivity, getAllActivityTypes } from "../controllers/activities.controller";
import { isAuthorizedUser } from "../middlewares/authorization";

const router = express.Router();

// public routes
router.get("/types", getAllActivityTypes);

// authenticated routes
router.get("/", isAuthorizedUser, getAllActivities);
router.get("/self", isAuthorizedUser, getLoggedInUserActivities);
router.post("/", isAuthorizedUser, addActivity);
router.put("/:id", isAuthorizedUser, updateActivity);
router.delete("/:id", isAuthorizedUser, deleteActivity);


export default router;