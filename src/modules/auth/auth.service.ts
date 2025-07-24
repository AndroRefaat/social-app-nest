import { ConflictException, Injectable } from '@nestjs/common';
import { accessTokenDTO, forgetPasswordDTO, loginDTO, resetPasswordDTO, signupDTO, verifyDTO } from './DTO/auth.dto';
import { UserRepositoryService } from 'src/DB/repositories/user.repository';
import { encrypt } from 'src/utils/encryption/encryption';
import * as randomstring from 'randomstring';
import { generateOTPTemplate } from 'src/utils/emails/email.template';
import { sendEmail } from 'src/utils/emails/sendEmail';
import { OTPRepositoryService } from 'src/DB/repositories/otp.repository';
import { compare } from 'bcrypt';
import { TokenService } from 'src/utils/token/token.service';
import { hash } from 'src/utils/bcrypt/bcrypt';
@Injectable()
export class AuthService {
    constructor(
        private readonly userRepositoryService: UserRepositoryService,
        private readonly otpRepositoryService: OTPRepositoryService,
        private readonly tokenService: TokenService
    ) { }




    async signup(body: signupDTO) {
        try {
            const { userName, email, password, confirmPassword, phone } = body

            const checkUser = await this.userRepositoryService.findOne({ filter: { email } })
            if (checkUser) {
                throw new ConflictException('User already exists')
            }

            const encryptedPhone = encrypt(phone)
            const user = await this.userRepositoryService.create({ userName, email, password, phone: encryptedPhone })

            const otp = randomstring.generate({ length: 6, charset: 'numeric' })
            const template = generateOTPTemplate(otp)
            await sendEmail({ to: email, subject: 'Verify Your Email', html: template })

            const otpUser = await this.otpRepositoryService.create({ otp, userId: user._id })

            return { message: 'please check your email for verification' }



        } catch (error) {
            throw new ConflictException('Error', error.message)
        }
    }


    async verify(body: verifyDTO) {
        try {

            const { email, otp } = body
            const checkUser = await this.userRepositoryService.findOne({ email, isActivated: false })

            if (!checkUser) {

                throw new ConflictException('User not found')
            }
            const checkOtp = await this.otpRepositoryService.findOne({ userId: checkUser._id })
            if (!checkOtp) {
                throw new ConflictException('Otp not found')
            }
            const isMatch = await compare(otp, checkOtp.otp)
            if (!isMatch) {
                throw new ConflictException('Invalid otp')
            }
            await this.userRepositoryService.findOneAndUpdate({ email }, { isActivated: true });
            await this.otpRepositoryService.findOneAndDelete({ userId: checkUser._id })


            return { message: 'User verified successfully' }



        } catch (error) {
            throw new ConflictException('Error', error.message)
        }
    }


    async login(body: loginDTO) {
        try {
            const { email, password } = body
            const checkUser = await this.userRepositoryService.findOne({ email, isActivated: true })
            if (!checkUser) throw new ConflictException('User not found')

            const isMatch = await compare(password, checkUser.password)

            if (!isMatch) throw new ConflictException('Invalid passwordd')

            const accessToken = await this.tokenService.generateToken({ userId: checkUser._id, role: checkUser.role }, { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN, secret: process.env.JWT_SECRET })
            const refreshToken = await this.tokenService.generateToken({ userId: checkUser._id, role: checkUser.role }, { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN, secret: process.env.JWT_SECRET })
            return { message: 'User logged in successfully', accessToken: accessToken, refreshToken: refreshToken }
        } catch (error) {
            throw new ConflictException('Error', error.message)
        }

    }


    async forgetPassword(body: forgetPasswordDTO) {
        const { email } = body
        const user = await this.userRepositoryService.findOne({ email })
        if (!user) {
            throw new ConflictException('User not found')
        }

        const otp = randomstring.generate({ length: 6, charset: 'numeric' })
        const template = generateOTPTemplate(otp)
        await sendEmail({ to: email, subject: 'Reset Password', html: template })

        const otpUser = await this.otpRepositoryService.create({ otp, userId: user._id })

        return { message: 'please check your email for reset password' }

    }


    async resetPassword(body: resetPasswordDTO) {
        const { email, otp, password, confirmPassword } = body
        const user = await this.userRepositoryService.findOne({ email })
        if (!user) {
            throw new ConflictException('User not found')
        }
        const checkOtp = await this.otpRepositoryService.findOne({ userId: user._id })
        if (!checkOtp) {
            throw new ConflictException('Otp not found')
        }
        const isMatch = await compare(otp, checkOtp.otp)
        if (!isMatch) {
            throw new ConflictException('Invalid otp')
        }

        await this.userRepositoryService.findOneAndUpdate({ email }, { password: hash(password) })
        await this.otpRepositoryService.findOneAndDelete({ userId: user._id })

        return { message: 'User reset password successfully' }
    }


    async accessToken(body: accessTokenDTO) {
        const { refreshToken } = body
        const checkToken = await this.tokenService.verifyToken(refreshToken, { secret: process.env.JWT_SECRET })
        const user = await this.userRepositoryService.findOne({ _id: checkToken.userId })
        if (!user) {
            throw new ConflictException('User not found')
        }
        const accessToken = await this.tokenService.generateToken({ userId: checkToken.userId, role: checkToken.role }, { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN, secret: process.env.JWT_SECRET })
        return { message: 'User logged in successfully', accessToken: accessToken }
    }

}
