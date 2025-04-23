// services/progressService.ts
import UserProgress from "@/models/user-progress";
import Exercise from "@/models/exercise";
import mongoose from "mongoose";

export const getExerciseCompletionReport = async (userId: string) => {
  // 1. Get total exercises grouped by unit
  const exercises = await Exercise.aggregate([
    { $group: { _id: "$unitId", total: { $sum: 1 } } }
  ]);

  // 2. Get user's completed exercises grouped by unit
  const progress = await UserProgress.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId), completed: true } },
    { $lookup: {
        from: "exercises",
        localField: "exerciseId",
        foreignField: "_id",
        as: "exercise"
      }
    },
    { $unwind: "$exercise" },
    { $group: { _id: "$exercise.unitId", completed: { $sum: 1 } } }
  ]);

  // 3. Merge unit-level data
  const unitReports = exercises.map((ex) => {
    const userCompleted = progress.find(p => String(p._id) === String(ex._id));
    return {
      unitId: ex._id,
      completed: userCompleted ? userCompleted.completed : 0,
      total: ex.total
    };
  });

  // 4. Calculate global totals
  const totalCompleted = unitReports.reduce((sum, unit) => sum + unit.completed, 0);
  const totalExercises = unitReports.reduce((sum, unit) => sum + unit.total, 0);

  return {
    units: unitReports,
    totalCompleted,
    totalExercises
  };
};
