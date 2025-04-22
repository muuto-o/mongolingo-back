// services/streakUtils.ts
import UserProgress from "@/models/user-progress";
import mongoose from "mongoose";

export const calculateUserStreak = async (userId: string): Promise<number> => {
  // Get distinct days user completed an exercise (sorted DESC)
  const completions = await UserProgress.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId), completed: true } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$completedAt" } }, // Group by day
        count: { $sum: 1 },
      }
    },
    { $sort: { _id: -1 } }, // Latest date first
  ]);

  // Calculate streak
  let streak = 0;
  let today = new Date();
  today.setUTCHours(0, 0, 0, 0); // Normalize to 00:00 UTC

  for (const day of completions) {
    const date = new Date(day._id);
    if (date.getTime() === today.getTime()) {
      streak++;
      today.setDate(today.getDate() - 1); // Move to the previous day
    } else if (date.getTime() === today.getTime() - 86400000) { // Allow for 1-day gap
      streak++;
      today.setDate(today.getDate() - 1);
    } else {
      break; // Streak broken
    }
  }

  return streak;
};
