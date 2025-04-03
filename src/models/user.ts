import { timeStamp } from "console";
import mongoose, { Types } from "mongoose";

type AnswerType = {
  type : mongoose.Types.ObjectId;
  count : Number;
  isCorrect : Boolean | undefined;
}

const answerSchema = new mongoose.Schema<AnswerType>({
  type : {type : mongoose.Schema.Types.ObjectId, ref : "Type"},
  count : {type : Number, default : 0},
})

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  points: { type: Number, default: 0 },
  experience: { type: Number, default: 0 },
  accuracy : {type: Number, default: 0},
  exerciseLevel : {type : Number, default:1},  
},{
  timestamps : true,
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
 
export default mongoose.model("User", userSchema);
