import express from "express";
import { deleteComment, getAllUserActions, getUserActionsByActivityId, upsertUserAction } from "../controllers/user-action.controller";
import { isAuthorizedUser } from "../middlewares/authorization";

const router = express.Router();

router.get("/", isAuthorizedUser, getAllUserActions);
router.get("/:activityId", isAuthorizedUser, getUserActionsByActivityId);
router.post("/:activityId", isAuthorizedUser, upsertUserAction);
router.delete("/:commentId", isAuthorizedUser, deleteComment);

export default router;