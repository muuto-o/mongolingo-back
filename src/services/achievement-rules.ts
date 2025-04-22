import UserProgress from "@/models/user-progress";
import User from "@/models/user";
import { calculateUserStreak } from "./streak-utils";

export const achievementRules = [
  {
    name: "First Exercise Complete",
    condition: async (userId: string) => {
      const completedExercises = await UserProgress.countDocuments({ userId, completed: true });
      return completedExercises >= 1;
    },
  },
  {
    name: "10 Exercises Completed",
    condition: async (userId: string) => {
      const completedExercises = await UserProgress.countDocuments({ userId, completed: true });
      return completedExercises >= 10;
    },
  },
  {
    name: "100 XP Reached",
    condition: async (userId: string) => {
      const user = await User.findById(userId);
      if (!user) return false; // No user? Can't unlock achievement.
      return user.experience as number >= 100;

    },
  },
  {
    name: "7 Day Streak",
    condition: async (userId: string) => {
      const streak = await calculateUserStreak(userId); // You’ll implement this function
      return streak >= 7;
    },
  },
];
