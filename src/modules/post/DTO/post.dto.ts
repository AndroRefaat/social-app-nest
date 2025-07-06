import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";



export class createPostDto{

    @IsString()
    @IsOptional()
    @MinLength(3)
    @MaxLength(20)
    text:string

    @IsOptional()
    image:string
}


export class updatePostDto{

    @IsString()
    @IsOptional()
    @MinLength(3)
    @MaxLength(20)
    text:string

    @IsOptional()
    image:string
}