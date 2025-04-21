import mongoose from "mongoose"

const UnitSchema = new mongoose.Schema({
    name : {type : String, required : true},
    unitLevel : {type : Number}
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

UnitSchema.pre("save", async function (next) {
  if (!this.unitLevel) {
    const count = await mongoose.model("Unit").countDocuments();
    this.unitLevel = (count + 1);
  }
  next();
});

export default mongoose.model("Unit", UnitSchema);