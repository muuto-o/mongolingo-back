import mongoose from "mongoose"

const QuestionSchema = new mongoose.Schema({
    title : {type : String, required : true},
    type : {type : String, enum : ["multiple_choice", "matching"], required : true},
    exerciseId : {type : mongoose.Schema.Types.ObjectId, ref : "Exercise", required : true},
},{discriminatorKey : "type", toJSON: {
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
  })

export const QuestionModel =  mongoose.model("Question", QuestionSchema);


// Multiple Choice Schema
const MultipleChoiceSchema = new mongoose.Schema({
  options : [{ type: String, required: true }],
  correctAnswer : {type : String, required : true},
  audioPath: { type: String },
});

export const MultipleChoice = QuestionModel.discriminator("multiple_choice", MultipleChoiceSchema);

// Matching Schema
const MatchingSchema = new mongoose.Schema({
  pairs: [
    {
      word: { type: String, required: true },
      meaning: { type: String, required: true },
    },
  ],
  correctAnswer: { type: Map, of: String, required: true },
});

export const Matching = QuestionModel.discriminator("matching", MatchingSchema);
