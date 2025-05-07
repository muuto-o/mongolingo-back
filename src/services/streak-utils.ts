// services/streakUtils.ts
import UserProgress from "@/models/user-progress";
import mongoose from "mongoose";


import dayjs from "dayjs";

export const getYearlyActivity = async (userId: string) => {
  const today = dayjs().endOf("day").toDate();
  const oneYearAgo = dayjs().subtract(364, "day").startOf("day").toDate();

  const progress = await UserProgress.aggregate([
    { 
      $match: { 
        userId: new mongoose.Types.ObjectId(userId), 
        completed: true,
        completedAt: { $gte: oneYearAgo, $lte: today } // Limit to last 1 year
      } 
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$completedAt" } },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  // Fill missing days with 0 for the last 365 days
  const result: { date: string; count: number }[] = [];
  for (let i = 0; i < 365; i++) {
    const date = dayjs().subtract(i, "day").format("YYYY-MM-DD");
    const found = progress.find(p => p._id === date);
    result.unshift({ date, count: found ? found.count : 0 });
  }

  return result;
};


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
