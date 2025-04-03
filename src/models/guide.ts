import mongoose from "mongoose";

const GuideSchema = new mongoose.Schema({
    title : {type : String},
    content : {type : String, required : true}
})

export default mongoose.model("Guide", GuideSchema);