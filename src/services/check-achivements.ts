import { achievementRules } from "@/services/achievement-rules";
import { unlockAchievement } from "@/services/achievement-utils";

export const checkAchievements = async (userId: string) => {
  const unlocked = [];

  for (const rule of achievementRules) {
    const isUnlocked = await rule.condition(userId);
    if (isUnlocked) {
      const achievement = await unlockAchievement(userId, rule.name);
      if (achievement) {
        unlocked.push(achievement);
      }
    }
  }

  return unlocked;
};
