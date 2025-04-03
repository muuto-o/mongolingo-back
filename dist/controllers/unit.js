"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUnit = exports.editUnit = exports.getUnit = exports.getUnits = exports.createUnit = exports.getUnitsWithExercises = void 0;
const express_1 = require("express");
const unit_1 = __importDefault(require("../models/unit")); // Assuming your Unit model is in Unit.ts
const router = (0, express_1.Router)();
const getUnitsWithExercises = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userExerciseLevel = parseInt(req.query.exerciseLevel) || 1;
        const units = yield unit_1.default.aggregate([
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
    }
    catch (error) {
        console.error('Error fetching units with exercises:', error);
        res.status(500).json({ message: 'Failed to fetch units with exercises', error: error });
    }
});
exports.getUnitsWithExercises = getUnitsWithExercises;
// Create a new unit
const createUnit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newUnit = new unit_1.default(req.body);
        const savedUnit = yield newUnit.save();
        res.status(201).json(savedUnit);
    }
    catch (error) {
        console.error("Error creating unit:", error);
        res.status(500).json({ message: 'Failed to create unit', error: error });
    }
});
exports.createUnit = createUnit;
// Get all units
const getUnits = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const units = yield unit_1.default.find();
        res.json(units);
    }
    catch (error) {
        console.error("Error fetching units:", error);
        res.status(500).json({ message: 'Failed to fetch units', error: error });
    }
});
exports.getUnits = getUnits;
// Get a single unit by ID
const getUnit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const unit = yield unit_1.default.findById(req.params.id);
        if (!unit) {
            return res.status(404).json({ message: 'Unit not found' });
        }
        res.json(unit);
    }
    catch (error) {
        console.error("Error fetching unit by ID:", error);
        res.status(500).json({ message: 'Failed to fetch unit', error: error });
    }
});
exports.getUnit = getUnit;
// Update a unit by ID
const editUnit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedUnit = yield unit_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true } // Return the updated document
        );
        if (!updatedUnit) {
            return res.status(404).json({ message: 'Unit not found' });
        }
        res.json(updatedUnit);
    }
    catch (error) {
        console.error("Error updating unit:", error);
        res.status(500).json({ message: 'Failed to update unit', error: error });
    }
});
exports.editUnit = editUnit;
// Delete a unit by ID
const deleteUnit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedUnit = yield unit_1.default.findByIdAndDelete(req.params.id);
        if (!deletedUnit) {
            return res.status(404).json({ message: 'Unit not found' });
        }
        res.json({ message: 'Unit deleted successfully' });
    }
    catch (error) {
        console.error("Error deleting unit:", error);
        res.status(500).json({ message: 'Failed to delete unit', error: error });
    }
});
exports.deleteUnit = deleteUnit;
exports.default = router;
