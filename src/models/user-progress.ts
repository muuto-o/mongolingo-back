import mongoose from "mongoose"

const UserProgressSchema = new mongoose.Schema({
    userId : {type : mongoose.Schema.Types.ObjectId, required : true},
    unitId : {type : mongoose.Schema.Types.ObjectId, required : true},
})