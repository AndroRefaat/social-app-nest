import { Body, Controller, Get, Param, Patch, Post, Request, UploadedFile, UseInterceptors } from '@nestjs/common';
import { PostService } from './post.service';
import { Auth } from 'src/utils/decorators/auth.decorator';
import { Role } from 'src/utils/enums/enums';
import { createPostDto, updatePostDto } from './DTO/post.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Types } from 'mongoose';


@Controller('post')
export class PostController {

constructor(
    private readonly postService:PostService
){}


@UseInterceptors(FileInterceptor('image'))
@Auth(Role.USER,Role.ADMIN)
@Post('create-post')
createPost(@Body() body:createPostDto , @UploadedFile() file:Express.Multer.File,@Request() req:Request){
    return this.postService.createPost(body,file,req)
}



@UseInterceptors(FileInterceptor('image'))
@Auth(Role.USER,Role.ADMIN)
@Patch('update-post/:id')
updatePost(@Body() body:updatePostDto , @UploadedFile() file:Express.Multer.File,@Param('id') id:Types.ObjectId){
    return this.postService.updatePost(body,file,id)
}




@Auth(Role.ADMIN)
@Patch('freeze-post/:id')
freezePost(@Param('id') id:Types.ObjectId){
    return this.postService.freezePost(id)
}

@Auth(Role.ADMIN)
@Patch('unfreeze-post/:id')
unfreezePost(@Param('id') id:Types.ObjectId){
    return this.postService.unfreezePost(id)
}


@Auth(Role.ADMIN,Role.USER)
@Get('/:id')
getPost(@Param('id') id:Types.ObjectId){
    return this.postService.getPost(id)
}


@Auth(Role.ADMIN)
@Get('all-posts')
getAllPosts(){
    return this.postService.getAllPosts()
}



@Auth(Role.USER,Role.ADMIN)
@Patch('like-unlike/:id')
likeUnlikePost(@Param('id') id:Types.ObjectId,@Request() req:Request){
    return this.postService.likeUnlikePost(id,req)
}

}
