import { Injectable } from "@nestjs/common";
import { DatabaseRepository } from "./Database.repository";
import { Post, PostDocument } from "../models/post.model";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";


@Injectable()
export class PostRepositoryService extends DatabaseRepository<PostDocument>{
    constructor(
        @InjectModel(Post.name) readonly PostModel:Model<PostDocument>
    ){
        super(PostModel)
    }
}