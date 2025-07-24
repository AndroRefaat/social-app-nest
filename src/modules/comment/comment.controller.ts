import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { CommentService } from './comment.service';
import { Auth } from 'src/utils/decorators/auth.decorator';
import { Role } from 'src/utils/enums/enums';
import { createCommentDto, updateCommentDto } from './DTO/comment.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Types } from 'mongoose';

@Controller('comment')
export class CommentController {

    constructor(
        private readonly commentService: CommentService
    ) { }

    @UseInterceptors(FileInterceptor('image'))
    @Auth(Role.USER, Role.ADMIN)
    @Post('/:postId/create-comment')
    createComment(@Body() body: createCommentDto, @UploadedFile() file: Express.Multer.File, @Param('postId') postId: Types.ObjectId) {
        return this.commentService.createComment(body, file, postId)
    }

    @UseInterceptors(FileInterceptor('image'))
    @Auth(Role.USER, Role.ADMIN)
    @Patch('/update-comment/:commentId')
    updateComment(@Body() body: updateCommentDto, @UploadedFile() file: Express.Multer.File, @Param('commentId') commentId: Types.ObjectId) {
        return this.commentService.updateComment(body, file, commentId)
    }


    @Auth(Role.USER, Role.ADMIN)
    @Delete('delete-comment/:id')
    deleteComment(@Param('id') id: Types.ObjectId) {
        return this.commentService.deleteComment(id)
    }

    @Auth(Role.USER, Role.ADMIN)
    @Get('get-comment/:id')
    getComment(@Param('id') id: Types.ObjectId) {
        return this.commentService.getComment(id)
    }

    @Auth(Role.USER, Role.ADMIN)
    @Get('get-all-comments/:postId')
    getAllComments(@Param('postId') postId: Types.ObjectId) {
        return this.commentService.getAllCommentsByPostId(postId)
    }



    @Auth(Role.USER, Role.ADMIN)
    @Post('like-unlike/:commentId')
    likeUnlike(@Param('commentId') commentId: Types.ObjectId, @Req() req: any) {
        return this.commentService.likeUnlike(commentId, req)
    }

    @Auth(Role.USER, Role.ADMIN)
    @UseInterceptors(FileInterceptor('image'))
    @Post('reply-comment/:commentId')
    replyComment(@Param('commentId') commentId: Types.ObjectId, @Body() body: createCommentDto, @UploadedFile() file: Express.Multer.File, @Req() req: any) {
        return this.commentService.replyComment(commentId, body, file, req)
    }

}
