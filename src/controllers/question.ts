import { Request, Response } from 'express';
import { QuestionModel, MultipleChoice, Matching } from '../models/question'; // Adjust paths as needed


export const getQuestionsByExerciseId = async (req: Request, res: Response) => {
  try {
    const id = req.params.id; // Get exerciseId from request params

    const questions = await QuestionModel.find({ exerciseId: id });

    res.json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ message: 'Failed to fetch questions', error: error });
  }
};


// Create a new question (general)
export const createQuestion = async (req: Request, res: Response) => {
  try {
    let newQuestion;

    if (req.body.type === 'multiple_choice') {
      newQuestion = new MultipleChoice(req.body);
    } else if (req.body.type === 'matching') {
      newQuestion = new Matching(req.body);
    } else {
      newQuestion = new QuestionModel(req.body);
    }

    const savedQuestion = await newQuestion.save();
    res.status(201).json(savedQuestion);
  } catch (error) {
    console.error('Error creating question:', error);
    res.status(500).json({ message: 'Failed to create question', error: error });
  }
};

// Get all questions
export const getQuestions = async (req: Request, res: Response) => {
  try {
    const questions = await QuestionModel.find().populate('type exerciseId');
    res.json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ message: 'Failed to fetch questions', error: error });
  }
};

// Get a single question by ID
export const getQuestion = async (req: Request, res: any) => {
  try {
    const question = await QuestionModel.findById(req.params.id).populate('type exerciseId');
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    res.json(question);
  } catch (error) {
    console.error('Error fetching question by ID:', error);
    res.status(500).json({ message: 'Failed to fetch question', error: error });
  }
};

// Update a question by ID
export const updateQuestion = async (req: Request, res: any) => {
  try {
    let updatedQuestion;
    if(req.body.type === 'multiple_choice'){
      updatedQuestion = await MultipleChoice.findByIdAndUpdate(req.params.id, req.body, {new: true}).populate('type exerciseId');
    } else if (req.body.type === 'matching'){
      updatedQuestion = await Matching.findByIdAndUpdate(req.params.id, req.body, {new: true}).populate('type exerciseId');
    } else {
      updatedQuestion = await QuestionModel.findByIdAndUpdate(req.params.id, req.body, {new: true}).populate('type exerciseId');
    }

    if (!updatedQuestion) {
      return res.status(404).json({ message: 'Question not found' });
    }
    res.json(updatedQuestion);
  } catch (error) {
    console.error('Error updating question:', error);
    res.status(500).json({ message: 'Failed to update question', error: error });
  }
};

// Delete a question by ID
export const deleteQuestion = async (req: Request, res: any) => {
  try {
    const deletedQuestion = await QuestionModel.findByIdAndDelete(req.params.id);
    if (!deletedQuestion) {
      return res.status(404).json({ message: 'Question not found' });
    }
    res.json({ message: 'Question deleted successfully' });
  } catch (error) {
    console.error('Error deleting question:', error);
    res.status(500).json({ message: 'Failed to delete question', error: error });
  }
};
