import { IsNotEmpty, IsOptional, IsString, IsStrongPassword, Validate, ValidateIf } from "class-validator"
import { confirmPassword } from "src/utils/decorators/confirmPassword.decorators"

export class updateProfileDTO{

    @IsString()
    @IsOptional()
    username:string

 

    @IsString()
    @IsOptional()
    password:string

    @IsString()
    @IsOptional()
    phone:string
}



export class updatePasswordDTO{
    @IsString()
    @IsNotEmpty()
    oldPassword:string

    @IsString()
    @IsNotEmpty()
    @IsStrongPassword()
    password:string

    @IsString()
    @IsNotEmpty()
    @ValidateIf((o)=>o.password)
    @Validate(confirmPassword)
    confirmPassword:string
}