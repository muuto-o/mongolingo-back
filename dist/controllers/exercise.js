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
exports.deleteExercise = exports.updateExercise = exports.getExercise = exports.getExercises = exports.createExercise = void 0;
const exercise_1 = __importDefault(require("../models/exercise")); // Adjust the path as needed
// Create a new exercise
const createExercise = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newExercise = new exercise_1.default(req.body);
        const savedExercise = yield newExercise.save();
        res.status(201).json(savedExercise);
    }
    catch (error) {
        console.error('Error creating exercise:', error);
        res.status(500).json({ message: 'Failed to create exercise', error: error });
    }
});
exports.createExercise = createExercise;
// Get all exercises
const getExercises = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const exercises = yield exercise_1.default.find().populate('unitId');
        res.json(exercises);
    }
    catch (error) {
        console.error('Error fetching exercises:', error);
        res.status(500).json({ message: 'Failed to fetch exercises', error: error });
    }
});
exports.getExercises = getExercises;
// Get a single exercise by ID
const getExercise = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const exercise = yield exercise_1.default.findById(req.params.id).populate('unitId');
        if (!exercise) {
            return res.status(404).json({ message: 'Exercise not found' });
        }
        res.json(exercise);
    }
    catch (error) {
        console.error('Error fetching exercise by ID:', error);
        res.status(500).json({ message: 'Failed to fetch exercise', error: error });
    }
});
exports.getExercise = getExercise;
// Update an exercise by ID
const updateExercise = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedExercise = yield exercise_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('unitId');
        if (!updatedExercise) {
            return res.status(404).json({ message: 'Exercise not found' });
        }
        res.json(updatedExercise);
    }
    catch (error) {
        console.error('Error updating exercise:', error);
        res.status(500).json({ message: 'Failed to update exercise', error: error });
    }
});
exports.updateExercise = updateExercise;
// Delete an exercise by ID
const deleteExercise = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedExercise = yield exercise_1.default.findByIdAndDelete(req.params.id);
        if (!deletedExercise) {
            return res.status(404).json({ message: 'Exercise not found' });
        }
        res.json({ message: 'Exercise deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting exercise:', error);
        res.status(500).json({ message: 'Failed to delete exercise', error: error });
    }
});
exports.deleteExercise = deleteExercise;
