import {Router} from "express";

import {createUnit, deleteUnit, editUnit, getUnit, getUnits, getUnitsWithExercises} from "../controllers/unit"


const router = Router();

router.get('/exercises', getUnitsWithExercises);

router.get('/', getUnits);
router.get('/:id',getUnit)
router.post("/", createUnit);
router.put('/:id', editUnit);
router.delete('/units/:id', deleteUnit);



export default router;
