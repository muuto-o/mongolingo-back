import express from "express";
import { completeExercise, deleteUser, editProfile, editUser, getAllUsers, getMe, getUser, loginUser, registerUser } from "../controllers/user";

const router = express.Router();

router.get("/", getAllUsers);
router.get("/:id", getUser);
router.get("/me/:id", getMe);
router.post("/", registerUser);
router.put("/edit-profile", editProfile);
router.put("/add-points", completeExercise);
router.put("/:id", editUser);
router.delete("/:id", deleteUser);

router.post("/login", loginUser);

export default router;
