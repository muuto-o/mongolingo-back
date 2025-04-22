import mongoose from "mongoose"

const UserProgressSchema = new mongoose.Schema({
    userId : {type : mongoose.Schema.Types.ObjectId, required : true},
    unitId : {type : mongoose.Schema.Types.ObjectId, required : true},
    exerciseId : {type : mongoose.Schema.Types.ObjectId, required : true},
    completed : {type : Boolean, default : false},
    score : {type : Number, default : 0},
    completedAt : {type : Date, default : Date.now}
})

export default mongoose.model("UserProgress", UserProgressSchema);