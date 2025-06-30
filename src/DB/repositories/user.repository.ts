import { Injectable } from "@nestjs/common";
import { DatabaseRepository } from "./Database.repository";
import { User, UserDocument } from "../models/user.model";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";


@Injectable()
export class UserRepositoryService extends DatabaseRepository<UserDocument>{
    constructor(
        @InjectModel(User.name) readonly UserModel:Model<UserDocument>
    ){
        super(UserModel)
    }
}