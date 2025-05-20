import mongoose, { Types } from "mongoose";
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken'
import crypto from "crypto"

type AnswerType = {
  type : mongoose.Types.ObjectId;
  count : Number;
  isCorrect : Boolean | undefined;
}

export interface UserDocument extends Document{
  username : string;
  email: string;
  points: number;
  password : string;
  experience: number;
  accuracy: number;
  exerciseLevel: number;
  resetPasswordToken ?: string;
  resetPasswordExpire ?: Date;
  createdAt : Date;
  updatedAt : Date;

  comparePassword(candidatePassword: string): boolean;
  getToken(): string;
  generateResetPasswordToken() : string;
}

const answerSchema = new mongoose.Schema<AnswerType>({
  type : {type : mongoose.Schema.Types.ObjectId, ref : "Type"},
  count : {type : Number, default : 0},
})

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minLength : 8 },
  points: { type: Number, default: 0 },
  experience: { type: Number, default: 0 },
  accuracy : {type: Number, default: 0},
  exerciseLevel : {type : Number, default:1},  
  resetPasswordToken : String,
  resetPasswordExpire : Date,
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

userSchema.pre("save", async function (next){
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt);
})

userSchema.methods.getToken = function (){
  const token = jwt.sign({id : this._id}, process.env.JWT_SECRET!, {expiresIn: "30d"})
  return token;
}

userSchema.methods.comparePassword = async function (
  candidatePassword: string
) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.generateResetPasswordToken = function (){
  const resetToken = crypto.randomBytes(20).toString("hex")

  this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest("hex");
  this.resetPasswordExpire = Date.now() + 10*60*1000;

  return resetToken;
}
 
export default mongoose.model<UserDocument>("User", userSchema);
