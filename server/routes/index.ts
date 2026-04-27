import express from "express";
import userRoute from "./user.route";
import activitiesRoute from "./activities.route";
import userActionRoute from "./user-action.route";

const router = express.Router();

router.use("/users", userRoute);
router.use("/activity", activitiesRoute);
router.use("/action", userActionRoute);

export default router;