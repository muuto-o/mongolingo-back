import { Request, Response } from 'express';
import ExerciseModel from '../models/exercise'; // Adjust the path as needed

// Create a new exercise
export const createExercise = async (req: Request, res: Response) => {
  try {
    const newExercise = new ExerciseModel(req.body);
    const savedExercise = await newExercise.save();
    res.status(201).json(savedExercise);
  } catch (error) {
    console.error('Error creating exercise:', error);
    res.status(500).json({ message: 'Failed to create exercise', error: error });
  }
};

// Get all exercises
export const getExercises = async (req: Request, res: Response) => {
  try {
    const exercises = await ExerciseModel.find().populate('unitId');
    res.json(exercises);
  } catch (error) {
    console.error('Error fetching exercises:', error);
    res.status(500).json({ message: 'Failed to fetch exercises', error: error });
  }
};

// Get a single exercise by ID
export const getExercise = async (req: Request, res: any) => {
  try {
    const exercise = await ExerciseModel.findById(req.params.id).populate('unitId');
    if (!exercise) {
      return res.status(404).json({ message: 'Exercise not found' });
    }
    res.json(exercise);
  } catch (error) {
    console.error('Error fetching exercise by ID:', error);
    res.status(500).json({ message: 'Failed to fetch exercise', error: error });
  }
};

// Update an exercise by ID
export const updateExercise = async (req: Request, res: any) => {
  try {
    const updatedExercise = await ExerciseModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('unitId');
    if (!updatedExercise) {
      return res.status(404).json({ message: 'Exercise not found' });
    }
    res.json(updatedExercise);
  } catch (error) {
    console.error('Error updating exercise:', error);
    res.status(500).json({ message: 'Failed to update exercise', error: error });
  }
};

// Delete an exercise by ID
export const deleteExercise = async (req: Request, res: any) => {
  try {
    const deletedExercise = await ExerciseModel.findByIdAndDelete(req.params.id);
    if (!deletedExercise) {
      return res.status(404).json({ message: 'Exercise not found' });
    }
    res.json({ message: 'Exercise deleted successfully' });
  } catch (error) {
    console.error('Error deleting exercise:', error);
    res.status(500).json({ message: 'Failed to delete exercise', error: error });
  }
};