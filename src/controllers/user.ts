import { Request, Response } from "express";
import User from "../models/user";
import Exercise from "../models/exercise";
import UserProgress from "@/models/user-progress";
import UserAchievement from "@/models/user-achievement"
import { calculateUserStreak } from "@/services/streak-utils";
import { addExperience } from "@/services/achievement-utils";
import { checkAchievements } from "@/services/check-achivements";
import { getExerciseCompletionReport } from "@/services/exercise-service";
import {getYearlyActivity} from "@/services/streak-utils"
import { sendEmail } from "@/services/email";
import crypto from "crypto";


interface Params {
  id: string;
}

export const getAllUsers = async (req: Request, res: Response) => {
    try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json(error);
  }
}

export const getUser = async (req : Request, res : any) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const editProfile = async (req: Request, res: any) => {
  try {
    const { email, username } = req.body;
    const user = await User.findOneAndUpdate({ email }, {email, username}, { new: true, runValidators: true });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    // const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    
    res.json(user);
  } catch (error) {
    res.status(400).json(error);
  }
}

export const editUser = async (req: Request, res: any) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!user) return res.status(404).json();
    res.json(user);
  } catch (error) {
    res.status(400).json(error);
  }
}

export const deleteUser = async (req: Request, res: any) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json();
    res.json(user);
  } catch (error) {
    res.status(500).json(error);
  }
}


export const registerUser = async (req:Request, res:any) => {
  try {
      const { username, email, password } = req.body;

      // Check if a user with the same username or email already exists
      const existingUser = await User.findOne({ $or: [{ username }, { email }] });

      if (existingUser) {
        return res.status(409).json({ message: "Бүртгэлтэй хэрэглэгч байна." });
      }

      const newUser = {
        username,
        email,
        password,
      };

      const user = new User(newUser);
      await user.save();
      res.status(201).json({ message: "Амжилттaй бүртгэлээ." });
  } catch (error) {
    res.status(400).json(error);
  }
}

export const loginUser = async (req:Request, res:any) => {
  try {
    const { email, password } = req.body;
    const userData = await User.findOne({ email });
    console.log(userData);
    if (!userData) return res.status(400).json({ message: 'Имэйл болон нууц үгээ зөв оруулна уу.' });
    const user = {
      id : userData.id,
      email : userData.email,
      username : userData.username,
      points : userData.points,
      experience : userData.experience,
      accuracy: userData.accuracy,
      exerciseLevel: userData.exerciseLevel,
      createdAt: userData.createdAt,
      updatedAt: userData.updatedAt
     }
    const isMatch = userData.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Имэйл болон нууц үгээ зөв оруулна уу.',
      body : req.body
     });
    
    const token = userData.getToken();
    res.json({user, token});
  } catch (error) {
    res.status(500).json({ message: 'Server error has occured', body: req.body });
  }

}

export const forgotPassword = async (req : Request, res : any) =>{
  if(!req.body.email){
    return res.status(400).json({
      message : "Нууц үг сэргээх имэйл оруулна уу"
    })
  }

  const user = await User.findOne({email : req.body.email});

  if(!user) {
    return res.status(400).json({
      message : "Хэрэглэгч олдсонгүй."
    })
  }

  const resetToken = user.generateResetPasswordToken();
  await user.save();

  const link = `http://localhost:5173/reset-password?${resetToken}`

  await sendEmail({
    email: user.email,
    subject : "Нууц үг өөрчлөх хүсэлт",
    message : `Сайн байна уу.<br><br>Та нууц үгээ дараах линк дээр даран өөрчилнө үү: <a href="${link}" target="_blank">${link}</a><br><br>Өдрийг сайхан өнгөрүүлээрэй.`
  });

  return res.status(200).json({
    token : resetToken,
  })
}

export const resetPassword = async (req : Request, res : any) =>{
  if(!req.body.resetToken || !req.body.password){
    return res.status(400).json({
      message : "Токен болон нууц үгээ дамжуулна уу."
    })
  }

  const encryptedPassword = crypto.createHash("sha256").update(req.body.resetToken).digest("hex");
  const user = await User.findOne({resetPasswordToken : encryptedPassword, resetPasswordExpire : {$gt: Date.now()}});

  if(!user) {
    return res.status(400).json({
      message : "Хүчингүй токен."
    })
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  user.save();

  res.status(201).json({ message: "Амжилттaй шинэчлэгдлээ." });
}


export const completeExercise = async (req: Request, res: any) => {
  try {
    const {email, points, experience, exerciseId } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    const exercise = await Exercise.findById(exerciseId)

    if (!user) {
      return res.status(404).json({ message: 'User not found' }); // User not found, return 404
    }
    if (!exercise) {
      return res.status(404).json({ message: 'Exericse not found' }); // User not found, return 404
    }

     await UserProgress.findOneAndUpdate(
      { userId: user._id, exerciseId },
      { completed: true, completedAt: new Date() },
      { upsert: true }
    );


    //  const {experience : xp, level, leveledUp, points : pts } = await addExperience(email, experience  || 20, points);
     const unlockedAchievements = await checkAchievements(user.id)
    // Add points and experience to the existing values
    user.points = (typeof user.points === 'number' ? user.points : 0) + (points || 0);
    user.experience = (typeof user.experience === 'number' ? user.experience : 0) + (experience || 0);
    user.exerciseLevel = (typeof exercise.level === 'number' ? exercise.level : 1) + 1;

    console.log(exercise)
    // Save the updated user
    const updatedUser = await user.save();

    res.json({message : "Амжиллттай.", 
      updatedUser,
      unlockedAchievements
    });
  } catch (error) {
    console.error('Error adding points:', error);
    res.status(500).json({ message: 'Server error has occurred' }); // Server error, return 500
  }
};

export const getActivity = async (req : Request, res : any) => {
  const { userId } = req.params;

  try {
    const activity = await getYearlyActivity(userId);
    res.json(activity);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch activity" });
  }
}

export const getMe = async (req:Request, res:any) =>{
  try {
    // console.log(req.params.id)
    const userData = await User.findById(req.params.id);
    
    if (!userData) return res.status(404).json({ message: "User not found" });

    const userAchievements = await UserAchievement.find({ userId: userData.id })
      .populate("achievementId", "name iconPath") // Populate achievement details
      .lean();

    const report = await getExerciseCompletionReport(userData.id);

    // 🎯 2. Map achievements to clean structure
   const achievements = userAchievements.map((ua) => {
      const achievement = ua.achievementId as unknown as { name: string; iconPath: string };
      return {
        name: achievement.name,
        iconPath: achievement.iconPath,
        acquiredAt: ua.acquiredAt,
      };
    });




    const user = {
      id : userData._id,
      email : userData.email,
      username : userData.username,
      points : userData.points,
      experience : userData.experience,
      achievements,
      report,
     }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}

export const leaderboard = async (req : Request, res : any) =>{
  try {
    const users = await User.find().sort({points : -1});
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json(error);
  }
}

export const userStreak =  async (req : Request, res : any) => {
  const { userId } = req.params;

  try {
    const streak = await calculateUserStreak(userId);
    res.json({ streak });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to calculate streak" });
  }
};