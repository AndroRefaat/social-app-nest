import { Injectable } from "@nestjs/common";
import { DatabaseRepository } from "./Database.repository";
import { OTP, OTPDocument } from "../models/otp.model";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";


@Injectable()
export class OTPRepositoryService extends DatabaseRepository<OTPDocument>{
    constructor(
        @InjectModel(OTP.name) readonly OTPModel:Model<OTPDocument>
    ){
        super(OTPModel)
    }
}