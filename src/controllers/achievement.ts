// controllers/achievementController.ts
import Achievement from "@/models/achievement";
import { Request } from "express";

// Create Achievement
export const createAchievement = async (req: Request, res: any) => {
  try {
    const { name, iconPath } = req.body;
    const achievement = new Achievement({ name, iconPath });
    await achievement.save();
    res.status(201).json(achievement);
  } catch (error) {
    res.status(500).json({ message: "Failed to create achievement", error });
  }
};

// Get all Achievements
export const getAchievements = async (_req: Request, res: any) => {
  try {
    const achievements = await Achievement.find();
    res.status(200).json(achievements);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch achievements", error });
  }
};

// Get one Achievement by ID
export const getAchievementById = async (req: Request, res: any) => {
  try {
    const { id } = req.params;
    const achievement = await Achievement.findById(id);
    if (!achievement) {
      return res.status(404).json({ message: "Achievement not found" });
    }
    res.status(200).json(achievement);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch achievement", error });
  }
};

// Update Achievement
export const updateAchievement = async (req: Request, res: any) => {
  try {
    const { id } = req.params;
    const { name, iconPath } = req.body;
    const achievement = await Achievement.findByIdAndUpdate(
      id,
      { name, iconPath },
      { new: true, runValidators: true }
    );
    if (!achievement) {
      return res.status(404).json({ message: "Achievement not found" });
    }
    res.status(200).json(achievement);
  } catch (error) {
    res.status(500).json({ message: "Failed to update achievement", error });
  }
};

// Delete Achievement
export const deleteAchievement = async (req: Request, res: any) => {
  try {
    const { id } = req.params;
    const achievement = await Achievement.findByIdAndDelete(id);
    if (!achievement) {
      return res.status(404).json({ message: "Achievement not found" });
    }
    res.status(200).json({ message: "Achievement deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete achievement", error });
  }
};
