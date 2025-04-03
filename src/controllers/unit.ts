import { Request, Response, Router } from 'express';
import mongoose from 'mongoose';
import UnitModel from '../models/unit'; // Assuming your Unit model is in Unit.ts

const router = Router();



export const getUnitsWithExercises = async (req: Request, res: Response) => {
  try {
    const userExerciseLevel = parseInt(req.query.exerciseLevel as string) || 1;

    const units = await UnitModel.aggregate([
      {
        $lookup: {
          from: 'exercises',
          localField: '_id',
          foreignField: 'unitId',
          as: 'exercises',
        },
      },
      {
        $unwind: {
          path: '$exercises',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          'exercises.id': {
            $cond: {
              if: { $ne: ['$exercises', null] },
              then: '$exercises._id',
              else: null,
            },
          },
        },
      },
      {
        $lookup: {
          from: 'questions',
          localField: 'exercises.id', // Lookup questions based on exercise ID
          foreignField: 'exerciseId',
          as: 'exercises.questions',
        },
      },
      {
        $addFields: {
          'exercises.unlocked': {
            $cond: {
              if: {
                $and: [
                  { $lte: ['$exercises.level', userExerciseLevel] },
                  { $gt: [{ $size: '$exercises.questions' }, 0] }, // Check if there are questions
                ],
              },
              then: true,
              else: false,
            },
          },
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          'exercises.iconPath': 1,
          'exercises.level': 1,
          'exercises.id': 1,
          'exercises.unlocked': 1,
        },
      },
      {
        $group: {
          _id: '$_id',
          name: { $first: '$name' },
          exercises: { $push: '$exercises' },
        },
      },
      {
        $match: {
          $expr: { $gt: [{ $size: '$exercises' }, 1] },
        },
      },
      {
        $project: {
          _id: 0,
          name: 1,
          exercises: 1,
        },
      },
    ]);

    res.json(units);
  } catch (error) {
    console.error('Error fetching units with exercises:', error);
    res.status(500).json({ message: 'Failed to fetch units with exercises', error: error });
  }
};

// Create a new unit
 export const createUnit = async (req: Request, res: Response) => {
  try {
    const newUnit = new UnitModel(req.body);
    const savedUnit = await newUnit.save();
    res.status(201).json(savedUnit);
  } catch (error) {
    console.error("Error creating unit:", error);
    res.status(500).json({ message: 'Failed to create unit', error: error });
  }
}

// Get all units
 export const getUnits = async (req: Request, res: Response) => {
  try {
    const units = await UnitModel.find();
    res.json(units);
  } catch (error) {
    console.error("Error fetching units:", error);
    res.status(500).json({ message: 'Failed to fetch units', error: error });
  }
}

// Get a single unit by ID
export const getUnit = async (req: Request, res: any) => {
  try {
    const unit = await UnitModel.findById(req.params.id);
    if (!unit) {
      return res.status(404).json({ message: 'Unit not found' });
    }
    res.json(unit);
  } catch (error) {
    console.error("Error fetching unit by ID:", error);
    res.status(500).json({ message: 'Failed to fetch unit', error: error });
  }
}

// Update a unit by ID
export const editUnit = async (req: Request, res: any) => {
  try {
    const updatedUnit = await UnitModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // Return the updated document
    );
    if (!updatedUnit) {
      return res.status(404).json({ message: 'Unit not found' });
    }
    res.json(updatedUnit);
  } catch (error) {
    console.error("Error updating unit:", error);
    res.status(500).json({ message: 'Failed to update unit', error: error });
  }
};

// Delete a unit by ID
 export const deleteUnit = async (req: Request, res: any) => {
  try {
    const deletedUnit = await UnitModel.findByIdAndDelete(req.params.id);
    if (!deletedUnit) {
      return res.status(404).json({ message: 'Unit not found' });
    }
    res.json({ message: 'Unit deleted successfully' });
  } catch (error) {
    console.error("Error deleting unit:", error);
    res.status(500).json({ message: 'Failed to delete unit', error: error });
  }
};

export default router;