"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const answerSchema = new mongoose_1.default.Schema({
    type: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Type" },
    count: { type: Number, default: 0 },
});
const userSchema = new mongoose_1.default.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    points: { type: Number, default: 0 },
    experience: { type: Number, default: 0 },
    accuracy: { type: Number, default: 0 },
    exerciseLevel: { type: Number, default: 1 },
}, {
    timestamps: true,
    toJSON: {
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
exports.default = mongoose_1.default.model("User", userSchema);
