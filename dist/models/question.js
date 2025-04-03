"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Matching = exports.MultipleChoice = exports.QuestionModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const QuestionSchema = new mongoose_1.default.Schema({
    title: { type: String, required: true },
    type: { type: String, enum: ["multiple_choice", "matching"], required: true },
    exerciseId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Exercise", required: true },
}, { discriminatorKey: "type", toJSON: {
        transform: function (doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v; // Remove __v if you don't need it
            return ret;
        },
    },
    toObject: {
        transform: function (doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v; // Remove __v if you don't need it
            return ret;
        },
    },
});
exports.QuestionModel = mongoose_1.default.model("Question", QuestionSchema);
// Multiple Choice Schema
const MultipleChoiceSchema = new mongoose_1.default.Schema({
    options: [{ type: String, required: true }],
    correctAnswer: { type: String, required: true },
    audioPath: { type: String },
});
exports.MultipleChoice = exports.QuestionModel.discriminator("multiple_choice", MultipleChoiceSchema);
// Matching Schema
const MatchingSchema = new mongoose_1.default.Schema({
    pairs: [
        {
            word: { type: String, required: true },
            meaning: { type: String, required: true },
        },
    ],
    correctAnswer: { type: Map, of: String, required: true },
});
exports.Matching = exports.QuestionModel.discriminator("matching", MatchingSchema);
