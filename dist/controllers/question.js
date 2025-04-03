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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteQuestion = exports.updateQuestion = exports.getQuestion = exports.getQuestions = exports.createQuestion = exports.getQuestionsByExerciseId = void 0;
const question_1 = require("../models/question"); // Adjust paths as needed
const getQuestionsByExerciseId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id; // Get exerciseId from request params
        const questions = yield question_1.QuestionModel.find({ exerciseId: id });
        res.json(questions);
    }
    catch (error) {
        console.error('Error fetching questions:', error);
        res.status(500).json({ message: 'Failed to fetch questions', error: error });
    }
});
exports.getQuestionsByExerciseId = getQuestionsByExerciseId;
// Create a new question (general)
const createQuestion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let newQuestion;
        if (req.body.type === 'multiple_choice') {
            newQuestion = new question_1.MultipleChoice(req.body);
        }
        else if (req.body.type === 'matching') {
            newQuestion = new question_1.Matching(req.body);
        }
        else {
            newQuestion = new question_1.QuestionModel(req.body);
        }
        const savedQuestion = yield newQuestion.save();
        res.status(201).json(savedQuestion);
    }
    catch (error) {
        console.error('Error creating question:', error);
        res.status(500).json({ message: 'Failed to create question', error: error });
    }
});
exports.createQuestion = createQuestion;
// Get all questions
const getQuestions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const questions = yield question_1.QuestionModel.find().populate('type exerciseId');
        res.json(questions);
    }
    catch (error) {
        console.error('Error fetching questions:', error);
        res.status(500).json({ message: 'Failed to fetch questions', error: error });
    }
});
exports.getQuestions = getQuestions;
// Get a single question by ID
const getQuestion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const question = yield question_1.QuestionModel.findById(req.params.id).populate('type exerciseId');
        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }
        res.json(question);
    }
    catch (error) {
        console.error('Error fetching question by ID:', error);
        res.status(500).json({ message: 'Failed to fetch question', error: error });
    }
});
exports.getQuestion = getQuestion;
// Update a question by ID
const updateQuestion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let updatedQuestion;
        if (req.body.type === 'multiple_choice') {
            updatedQuestion = yield question_1.MultipleChoice.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('type exerciseId');
        }
        else if (req.body.type === 'matching') {
            updatedQuestion = yield question_1.Matching.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('type exerciseId');
        }
        else {
            updatedQuestion = yield question_1.QuestionModel.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('type exerciseId');
        }
        if (!updatedQuestion) {
            return res.status(404).json({ message: 'Question not found' });
        }
        res.json(updatedQuestion);
    }
    catch (error) {
        console.error('Error updating question:', error);
        res.status(500).json({ message: 'Failed to update question', error: error });
    }
});
exports.updateQuestion = updateQuestion;
// Delete a question by ID
const deleteQuestion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedQuestion = yield question_1.QuestionModel.findByIdAndDelete(req.params.id);
        if (!deletedQuestion) {
            return res.status(404).json({ message: 'Question not found' });
        }
        res.json({ message: 'Question deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting question:', error);
        res.status(500).json({ message: 'Failed to delete question', error: error });
    }
});
exports.deleteQuestion = deleteQuestion;
