import mongoose from "mongoose"

const ExerciseSchema = new mongoose.Schema({
    unitId : {type: mongoose.Schema.Types.ObjectId, ref: "Unit", required: true},
    iconPath : {type : String, required:true},
    level : {type : Number, required: true}
},{
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
})

export default mongoose.model("Exercise", ExerciseSchema);