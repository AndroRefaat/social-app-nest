import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Mongoose, Types } from "mongoose";
import { hash } from "src/utils/bcrypt/bcrypt";
import { User } from "./user.model";


@Schema({ timestamps: true ,toJSON:{virtuals:true} , toObject:{virtuals:true} })
export class OTP {
    @Prop({required:true , type:Types.ObjectId , ref:User.name})
    userId:Types.ObjectId

    @Prop({required:true , type:String})
    otp:string

    @Prop({ type: Date, default: Date.now })
  createdAt: Date;


}

export type OTPDocument = HydratedDocument<OTP>
export const OTPSchema = SchemaFactory.createForClass(OTP)

OTPSchema.pre('save',async function(next){
    if(this.isModified('otp')){
        this.otp = await hash(this.otp)
    }
    next()
})
OTPSchema.index({ createdAt: 1 }, { expireAfterSeconds: 600 });

export const OTPModel = MongooseModule.forFeature([
    {name:OTP.name , schema:OTPSchema}
]) 
