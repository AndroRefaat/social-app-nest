import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Mongoose, Types } from "mongoose";
import { User } from "./user.model";
import { Post } from "@nestjs/common";


@Schema({ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } })
export class Comment {

  @Prop({ type: Types.ObjectId, ref: "Post" })
  post: Types.ObjectId

  @Prop({ type: String, minlength: 3, maxlength: 20 })
  text: string

  @Prop({ type: Types.ObjectId, ref: User.name })
  userId: Types.ObjectId

  @Prop({ type: [Types.ObjectId], ref: User.name })
  likes: Types.ObjectId[]

  @Prop({ type: Date })
  updatedAt: Date

  @Prop({ default: false, type: Boolean })
  isDeleted: boolean

  @Prop({ type: Types.ObjectId, ref: User.name })
  deletedBy: Types.ObjectId

  @Prop({
    type: {
      url: { type: String },
      public_id: { type: String },
    },
    default: null,
  })
  image: {
    url: string;
    public_id: string;
  };

  @Prop({ type: String })
  cloudinaryFolder: string
}

export type CommentDocument = HydratedDocument<Comment>
export const CommentSchema = SchemaFactory.createForClass(Comment)


export const CommentModel = MongooseModule.forFeature([
  { name: Comment.name, schema: CommentSchema }
]) 
