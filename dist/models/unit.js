"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const UnitSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    // name : {type : String, required : true},
}, { toJSON: {
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
exports.default = mongoose_1.default.model("Unit", UnitSchema);
