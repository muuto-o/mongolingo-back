import express from "express";
import { completeExercise, deleteUser, editProfile, editUser, forgotPassword, getActivity, getAllUsers, getMe, getUser, leaderboard, loginUser, registerUser, resetPassword, userStreak } from "@/controllers/user";

const router = express.Router();

router.get("/", getAllUsers);
router.get("/leaderboard", leaderboard);
router.get("/:id", getUser);
router.get("/me/:id", getMe);
router.get("/:userId/streak", userStreak);

router.post("/", registerUser);
router.put("/edit-profile", editProfile);
router.put("/add-points", completeExercise);
router.put("/:id", editUser);
router.delete("/:id", deleteUser);

router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

router.get("/:userId/activity", getActivity);

export default router;