import mongoose from "mongoose"

const UnitSchema = new mongoose.Schema({
    name : {type : String, required : true},
    // name : {type : String, required : true},
},{toJSON: {
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

export default mongoose.model("Unit", UnitSchema);