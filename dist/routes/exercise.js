"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const exercise_1 = require("../controllers/exercise"); // Adjust the path as needed
const router = express_1.default.Router();
router.post('/', exercise_1.createExercise);
router.get('/', exercise_1.getExercises);
router.get('/:id', exercise_1.getExercise);
router.put('/:id', exercise_1.updateExercise);
router.delete('/:id', exercise_1.deleteExercise);
exports.default = router;
