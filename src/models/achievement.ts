import mongoose from "mongoose"

interface AchievementType {
    name : string;
    iconPath : string;
}

const AchievementSchema = new mongoose.Schema<AchievementType>({
    name : {type : String, required : true,},
    iconPath: {type: String, required : true}
})

export default mongoose.model<AchievementType>("Achievement", AchievementSchema);
