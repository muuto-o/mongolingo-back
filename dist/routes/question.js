"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const question_1 = require("../controllers/question"); // Adjust paths as needed
const router = express_1.default.Router();
router.get('/exercise/:id', question_1.getQuestionsByExerciseId);
router.post('/', question_1.createQuestion);
router.get('/', question_1.getQuestions);
router.get('/:id', question_1.getQuestion);
router.put('/:id', question_1.updateQuestion);
router.delete('/:id', question_1.deleteQuestion);
exports.default = router;
