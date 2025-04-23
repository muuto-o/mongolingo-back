import express from 'express';
import {
  createQuestion,
  getQuestions,
  getQuestion,
  updateQuestion,
  deleteQuestion,
  getQuestionsByExerciseId,
  getQuestionByExcerciseLevel,
} from '../controllers/question'; // Adjust paths as needed

const router = express.Router();

router.get('/exercise/:id', getQuestionsByExerciseId);
router.get('/exercise/level/:id', getQuestionByExcerciseLevel);

router.post('/', createQuestion);
router.get('/', getQuestions);
router.get('/:id', getQuestion);
router.put('/:id', updateQuestion);
router.delete('/:id', deleteQuestion);

export default router;