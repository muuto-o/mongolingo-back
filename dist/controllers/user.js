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
exports.getMe = exports.completeExercise = exports.loginUser = exports.registerUser = exports.deleteUser = exports.editUser = exports.editProfile = exports.getUser = exports.getAllUsers = void 0;
const user_1 = __importDefault(require("../models/user"));
const exercise_1 = __importDefault(require("../models/exercise"));
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user_1.default.find();
        res.status(200).json(users);
    }
    catch (error) {
        res.status(500).json(error);
    }
});
exports.getAllUsers = getAllUsers;
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_1.default.findById(req.params.id);
        if (!user)
            return res.status(404).json({ message: "User not found" });
        res.status(200).json(user);
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});
exports.getUser = getUser;
const editProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, username } = req.body;
        const user = yield user_1.default.findOneAndUpdate({ email }, { email, username }, { new: true, runValidators: true });
        if (!user)
            return res.status(400).json({ message: 'Invalid credentials' });
        // const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        res.json(user);
    }
    catch (error) {
        res.status(400).json(error);
    }
});
exports.editProfile = editProfile;
const editUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!user)
            return res.status(404).json();
        res.json(user);
    }
    catch (error) {
        res.status(400).json(error);
    }
});
exports.editUser = editUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_1.default.findByIdAndDelete(req.params.id);
        if (!user)
            return res.status(404).json();
        res.json(user);
    }
    catch (error) {
        res.status(500).json(error);
    }
});
exports.deleteUser = deleteUser;
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, email, password } = req.body;
        // Check if a user with the same username or email already exists
        const existingUser = yield user_1.default.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(409).json({ message: "Username or email already exists." }); //409 conflict
        }
        const newUser = {
            username,
            email,
            password,
        };
        const user = new user_1.default(newUser);
        yield user.save();
        res.status(201).json({ message: "Амжилттaй бүртгэлээ." });
    }
    catch (error) {
        res.status(400).json(error);
    }
});
exports.registerUser = registerUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const userData = yield user_1.default.findOne({ email });
        console.log(userData);
        if (!userData)
            return res.status(400).json({ message: 'Invalid credentials' });
        const user = {
            id: userData.id,
            email: userData.email,
            username: userData.username,
            points: userData.points,
            experience: userData.experience,
            accuracy: userData.accuracy,
            exerciseLevel: userData.exerciseLevel,
            createdAt: userData.createdAt,
            updatedAt: userData.updatedAt
        };
        const isMatch = password === userData.password ? true : false;
        if (!isMatch)
            return res.status(400).json({ message: 'Invalid credentials',
                body: req.body
            });
        // const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error has occured', body: req.body });
    }
});
exports.loginUser = loginUser;
const completeExercise = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, points, experience, exerciseId } = req.body;
        // Find the user by email
        const user = yield user_1.default.findOne({ email });
        const exercise = yield exercise_1.default.findById(exerciseId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' }); // User not found, return 404
        }
        if (!exercise) {
            return res.status(404).json({ message: 'Exericse not found' }); // User not found, return 404
        }
        // Add points and experience to the existing values
        user.points = (typeof user.points === 'number' ? user.points : 0) + (points || 0);
        user.experience = (typeof user.experience === 'number' ? user.experience : 0) + (experience || 0);
        user.exerciseLevel = (typeof exercise.level === 'number' ? exercise.level : 1) + 1;
        console.log(exercise);
        // Save the updated user
        const updatedUser = yield user.save();
        res.json(updatedUser);
    }
    catch (error) {
        console.error('Error adding points:', error);
        res.status(500).json({ message: 'Server error has occurred' }); // Server error, return 500
    }
});
exports.completeExercise = completeExercise;
const getMe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log(req.params.id)
        const userData = yield user_1.default.findById(req.params.id);
        if (!userData)
            return res.status(404).json({ message: "User not found" });
        const user = {
            id: userData._id,
            email: userData.email,
            username: userData.username,
            points: userData.points,
            experience: userData.experience
        };
        res.status(200).json(user);
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});
exports.getMe = getMe;
