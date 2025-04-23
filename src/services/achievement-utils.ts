import User, { UserDocument }  from "@/models/user"
import Achievement from "@/models/achievement"
import UserAchievement from "@/models/user-achievement"

// services/levelUtils.ts
export const getXpThreshold = (level: number): number => {
  return Math.floor(50 * Math.pow(level, 1.5)); // Example XP formula
};

/**
 * Check if a user has unlocked a specific achievement
 * @param userId - The user's ID
 * @param achievementName - The name of the achievement
 * @returns true if acquired, false otherwise
 */
export const hasAchievement = async (userId: string, achievementName: string): Promise<boolean> => {
  const achievement = await Achievement.findOne({ name: achievementName });
  if (!achievement) return false; // If achievement doesn't exist, return false

  const existing = await UserAchievement.findOne({
    userId,
    achievementId: achievement._id
  });

  return !!existing;
};

/**
 * Unlock an achievement for a user.
 * @param userId - The user's ID
 * @param achievementName - The name of the achievement to unlock
 * @returns The unlocked achievement object or null if already unlocked
 */
export const unlockAchievement = async (userId: string, achievementName: string) => {
  // 1. Find the achievement
  const achievement = await Achievement.findOne({ name: achievementName });
  if (!achievement) throw new Error(`Achievement '${achievementName}' not found`);

  // 2. Check if user already has it
  const existing = await UserAchievement.findOne({
    userId,
    achievementId: achievement._id
  });

  if (existing) {
    // Already unlocked
    return null;
  }

  // 3. Unlock achievement
  const newUnlock = new UserAchievement({
    userId,
    achievementId: achievement._id,
    acquiredAt: new Date()
  });

  await newUnlock.save();

  return achievement; // Return achievement details for frontend (optional)
};


export const addExperience = async (email: string, xpEarned: number, points:number, exerciseLevel : number) => {
     const user = await User.findOne({ email });
//   const user = await User.findById(userId) as UserDocument | null;
  if (!user) throw new Error("User not found");

  user.experience += xpEarned;
  let leveledUp = false;
  let levelsGained = 0;

  while (user.experience >= getXpThreshold(user.exerciseLevel)) {
    user.experience -= getXpThreshold(user.exerciseLevel);
    user.exerciseLevel = exerciseLevel + 1;
    leveledUp = true;
    levelsGained++;

    // Add coins per level-up
    user.points = (user.points || 0) + points; 
  }

  await user.save();

  return {
    experience: user.experience,
    level: user.exerciseLevel,
    leveledUp,
    points: user.points
  };
};
