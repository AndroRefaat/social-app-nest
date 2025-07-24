import { Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { CommentModel } from 'src/DB/models/comment.model';
import { PostModel } from 'src/DB/models/post.model';
import { PostRepositoryService } from 'src/DB/repositories/post.repository';
import { CloudinaryService } from 'src/utils/cloudinary/cloudinary.service';
import { CommentRepositoryService } from 'src/DB/repositories/comment.repository';
import { UserModel } from 'src/DB/models/user.model';
import { UserRepositoryService } from 'src/DB/repositories/user.repository';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from 'src/utils/token/token.service';

@Module({
  imports:[CommentModel,PostModel,UserModel],
  controllers: [CommentController],
  providers: [CommentService,CommentRepositoryService,JwtService,TokenService,PostRepositoryService,CloudinaryService,UserRepositoryService]
})
export class CommentModule {}
