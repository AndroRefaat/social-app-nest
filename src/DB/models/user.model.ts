import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Mongoose } from "mongoose";
import { hash } from "src/utils/bcrypt/bcrypt";
import { Role } from "src/utils/enums/enums";


@Schema({ timestamps: true ,toJSON:{virtuals:true} , toObject:{virtuals:true} })
export class User {
    @Prop({required:true , type:String , minlength:3 , maxlength:20})
    userName:string
    

    @Prop({required:true , type:String , unique:true })
    email:string

    @Prop({required:true , type:String})
    password:string

    @Prop({default:false , type:Boolean})
    isActivated:boolean

    @Prop({default:Role.USER , type:String})
    role:Role

    @Prop({required:true , type:String})
    phone:string

@Prop({type:Date})
    updatedAt:Date


    @Prop({type:Date})
    passwordChangedAt:Date


    @Prop({default:false , type:Boolean})
    isFreezed:boolean

   
    @Prop({
        type: {
          url: { type: String },
          public_id: { type: String },
        },
        default: null,
      })
      profileImg: {
        url: string;
        public_id: string;
      };
      
}

export type UserDocument = HydratedDocument<User>
export const UserSchema = SchemaFactory.createForClass(User)

UserSchema.pre('save',async function(next){
    if(this.isModified('password')){
        this.password = await hash(this.password)
    }
    next()
})

export const UserModel = MongooseModule.forFeature([
    {name:User.name , schema:UserSchema}
]) 
