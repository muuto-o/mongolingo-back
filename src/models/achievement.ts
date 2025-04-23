import mongoose from "mongoose"

interface AchievementType {
    name : string;
    iconPath : string;
}

const AchievementSchema = new mongoose.Schema<AchievementType>({
    name : {type : String, required : true,},
    iconPath: {type: String, required : true}
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

export default mongoose.model<AchievementType>("Achievement", AchievementSchema);
