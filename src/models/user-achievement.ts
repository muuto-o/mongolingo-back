import mongoose from "mongoose"

const userAchievementSchema = new mongoose.Schema({

  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  achievementId: { type: mongoose.Schema.Types.ObjectId, ref: "Achievement", required: true },
  acquiredAt: { type: Date, default: Date.now }
});

export default mongoose.model("UserAchievement", userAchievementSchema);
