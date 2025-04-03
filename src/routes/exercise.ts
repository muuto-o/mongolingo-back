import express from 'express';
import {
  createExercise,
  getExercises,
  getExercise,
  updateExercise,
  deleteExercise,
} from '../controllers/exercise'; // Adjust the path as needed

const router = express.Router();

router.post('/', createExercise);
router.get('/', getExercises);
router.get('/:id', getExercise);
router.put('/:id', updateExercise);
router.delete('/:id', deleteExercise);

export default router;