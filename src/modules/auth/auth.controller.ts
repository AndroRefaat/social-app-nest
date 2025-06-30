import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { accessTokenDTO, forgetPasswordDTO, loginDTO, resetPasswordDTO, signupDTO, verifyDTO } from './DTO/auth.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }


    @Post('signup')
    signup(@Body() body: signupDTO) {
        return this.authService.signup(body)
    }

    @Post('verify-otp')
    verify(@Body() body : verifyDTO){
        return this.authService.verify(body)
    }

    @Post('login')
    login(@Body() body : loginDTO){
        return this.authService.login(body)
    }


    @Post('forget-password')
    forgetPassword(@Body() body : forgetPasswordDTO){
        return this.authService.forgetPassword(body)
    }

    @Post('reset-password')
    resetPassword(@Body() body : resetPasswordDTO){
        return this.authService.resetPassword(body)
    }

@Post('access-token')
accessToken(@Body() body : accessTokenDTO){
    return this.authService.accessToken(body)
}

}
