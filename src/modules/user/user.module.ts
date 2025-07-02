import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserModel } from 'src/DB/models/user.model';
import { UserRepositoryService } from 'src/DB/repositories/user.repository';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from 'src/utils/token/token.service';
import { CloudinaryModule } from 'src/utils/cloudinary/cloudinary.module';
import { CloudinaryService } from 'src/utils/cloudinary/cloudinary.service';

@Module({
  imports :[UserModel,CloudinaryModule],
  controllers: [UserController],
  providers: [UserService,UserRepositoryService,JwtService,TokenService,CloudinaryService]
})
export class UserModule {}
