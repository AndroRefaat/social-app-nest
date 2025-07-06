import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { PostModel } from 'src/DB/models/post.model';
import { UserModel } from 'src/DB/models/user.model';
import { CloudinaryService } from 'src/utils/cloudinary/cloudinary.service';
import { PostRepositoryService } from 'src/DB/repositories/post.repository';
import { UserRepositoryService } from 'src/DB/repositories/user.repository';
import { TokenService } from 'src/utils/token/token.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [PostModel,UserModel],
  controllers: [PostController],
  providers: [PostService,UserRepositoryService,CloudinaryService, PostRepositoryService,TokenService,JwtService]
})
export class PostModule {}
