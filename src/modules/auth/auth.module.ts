import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModel } from 'src/DB/models/user.model';
import { AuthController } from './auth.controller';
import { UserRepositoryService } from 'src/DB/repositories/user.repository';
import { OTPRepositoryService } from 'src/DB/repositories/otp.repository';
import { OTPModel } from 'src/DB/models/otp.model';
import { TokenService } from 'src/utils/token/token.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [UserModel,OTPModel],
  controllers: [AuthController],
  providers: [AuthService,UserRepositoryService,OTPRepositoryService,JwtService,TokenService]
})
export class AuthModule { }
