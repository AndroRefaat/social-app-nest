import { IsEmail, IsNotEmpty, IsString, IsStrongPassword, MaxLength, MinLength, Validate, ValidateIf } from "class-validator";
import { confirmPassword } from "src/utils/decorators/confirmPassword.decorators";



export class signupDTO {

    @IsString()
    @IsNotEmpty()
    @MinLength(3, {
        message: 'name is too short',
    })
    @MaxLength(20, {
        message: 'name is too long',
    })
    userName: string


    @IsEmail()
    @IsNotEmpty()
    @IsString()
    email: string

    @IsString()
    @IsNotEmpty()
    @IsStrongPassword()
    password: string

    @ValidateIf((args) => args.password)
    @Validate(confirmPassword)
    confirmPassword: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(10, {
        message: 'phone is too short',
    })
    @MaxLength(15, {
        message: 'phone is too long',
    })
    phone: string
}

export class verifyDTO {
    @IsEmail()
    @IsNotEmpty()
    @IsString()
    email:string
    
    @IsString()
    @IsNotEmpty()
    otp:string
}


export class loginDTO {
    @IsEmail()
    @IsNotEmpty()
    @IsString()
    email:string
    
    @IsString()
    @IsNotEmpty()
    password:string
}


export class forgetPasswordDTO{
    @IsEmail()
    @IsNotEmpty()
    @IsString()
    email:string
}


export class resetPasswordDTO{
    @IsEmail()
    @IsNotEmpty()
    @IsString()
    email:string


    @IsString()
    @IsNotEmpty()
    otp:string

    @IsString()
    @IsNotEmpty()
    password:string

    @ValidateIf((args) => args.password)
    @Validate(confirmPassword)
    confirmPassword: string;
}


export class accessTokenDTO{

    @IsString()
    @IsNotEmpty()
    refreshToken:string
}