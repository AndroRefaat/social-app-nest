import { Injectable } from "@nestjs/common";
import { DatabaseRepository } from "./Database.repository";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Comment, CommentDocument } from "../models/comment.model";


@Injectable()
export class CommentRepositoryService extends DatabaseRepository<CommentDocument>{
    constructor(
        @InjectModel(Comment.name) readonly CommentModel:Model<CommentDocument>
    ){
        super(CommentModel)
    }
}