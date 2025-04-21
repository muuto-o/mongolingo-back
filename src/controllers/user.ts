import { Request, Response } from "express";
import User from "../models/user";
import Exercise from "../models/exercise";

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
    return res.status(409).json({ message: "Username or email already exists." }); //409 conflict
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
    if (!userData) return res.status(400).json({ message: 'Invalid credentials' });
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
    const isMatch = password === userData.password ? true : false
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials',
      body : req.body
     });
    
    // const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error has occured', body: req.body });
  }

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
    // Add points and experience to the existing values
    user.points = (typeof user.points === 'number' ? user.points : 0) + (points || 0);
    user.experience = (typeof user.experience === 'number' ? user.experience : 0) + (experience || 0);
    user.exerciseLevel = (typeof exercise.level === 'number' ? exercise.level : 1) + 1;

    console.log(exercise)
    // Save the updated user
    const updatedUser = await user.save();

    res.json(updatedUser);
  } catch (error) {
    console.error('Error adding points:', error);
    res.status(500).json({ message: 'Server error has occurred' }); // Server error, return 500
  }
};

export const getMe = async (req:Request, res:any) =>{
  try {
    // console.log(req.params.id)
    const userData = await User.findById(req.params.id);
    
    if (!userData) return res.status(404).json({ message: "User not found" });
    const user = {
      id : userData._id,
      email : userData.email,
      username : userData.username,
      points : userData.points,
      experience : userData.experience
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