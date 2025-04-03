"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = require("../controllers/user");
const router = express_1.default.Router();
router.get("/", user_1.getAllUsers);
router.get("/:id", user_1.getUser);
router.get("/me/:id", user_1.getMe);
router.post("/", user_1.registerUser);
router.put("/edit-profile", user_1.editProfile);
router.put("/add-points", user_1.completeExercise);
router.put("/:id", user_1.editUser);
router.delete("/:id", user_1.deleteUser);
router.post("/login", user_1.loginUser);
exports.default = router;
