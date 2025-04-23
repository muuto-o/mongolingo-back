// routes/achievementRoutes.ts
import { Router } from "express";
import {
  createAchievement,
  getAchievements,
  getAchievementById,
  updateAchievement,
  deleteAchievement,
} from "@/controllers/achievement";

const router = Router();

router.post("/", createAchievement); // Create
router.get("/", getAchievements); // Read all
router.get("/:id", getAchievementById); // Read one
router.put("/:id", updateAchievement); // Update
router.delete("/:id", deleteAchievement); // Delete

export default router;
