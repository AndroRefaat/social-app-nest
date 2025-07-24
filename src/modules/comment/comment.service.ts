import { ConflictException, Injectable } from '@nestjs/common';
import { createCommentDto, updateCommentDto } from './DTO/comment.dto';
import { Types } from 'mongoose';
import { PostRepositoryService } from 'src/DB/repositories/post.repository';
import { CloudinaryService } from 'src/utils/cloudinary/cloudinary.service';
import { CommentRepositoryService } from 'src/DB/repositories/comment.repository';

@Injectable()
export class CommentService {
    constructor(
        private readonly commentRepositoryService: CommentRepositoryService,
        private readonly postRepositoryService: PostRepositoryService,
        private readonly cloudinaryService: CloudinaryService
    ) { }

    async createComment(body: createCommentDto, file: Express.Multer.File, postId: Types.ObjectId) {

        const post = await this.postRepositoryService.findById(postId)
        if (!post) {
            throw new ConflictException('Post not found')
        }
        if (file) {
            const uploadResult = await this.cloudinaryService.uploadImage(file, `${process.env.FOLDER_NAME!}/comments/${post._id}`)
            body.image = {
                url: uploadResult.secure_url,
                public_id: uploadResult.public_id,
            }
        }
        const comment = await this.commentRepositoryService.create({ ...body, post: post._id, userId: post.userId, cloudinaryFolder: `${process.env.FOLDER_NAME!}/posts/comments/${post._id}` })

        return { message: "Comment created successfully", comment: comment }
    }



    async updateComment(body: updateCommentDto, file: Express.Multer.File, commentId: Types.ObjectId) {

        const comment = await this.commentRepositoryService.findById(commentId)
        if (!comment) {
            throw new ConflictException('Comment not found')
        }

        if (file) {
            if (comment.image?.public_id) {
                await this.cloudinaryService.deleteImage(comment.image.public_id).catch((error) => {
                    console.error('Error deleting old image:', error.message);
                });
            }
            const uploadResult = await this.cloudinaryService.uploadImage(file, `${process.env.FOLDER_NAME!}/comments/${comment.post._id}`)
            body.image = {
                url: uploadResult.secure_url,
                public_id: uploadResult.public_id,
            }

            comment.image = body.image;
        }

        comment.text = body.text;
        await comment.save();
        return { message: "Comment updated successfully", comment: comment };

    }
    async deleteComment(id: Types.ObjectId) {
        const comment = await this.commentRepositoryService.findById(id);
        if (!comment) throw new ConflictException('comment not found')

        if (comment.image) {
            await this.cloudinaryService.deleteImage(comment.image.public_id).catch((error) => {
                console.error('Error deleting old image:', error.message);
            });
        }
        await this.commentRepositoryService.findOneAndDelete({ _id: id })
        return { message: "Comment deleted successfully" }
    }


    async getComment(id: Types.ObjectId) {
        const comment = await this.commentRepositoryService.findById(id)
        if (!comment) {
            throw new ConflictException('Comment not found')
        }
        return { message: "Comment fetched successfully", comment: comment }
    }


    async getAllCommentsByPostId(postId: Types.ObjectId) {
        const comments = await this.commentRepositoryService.find({ post: postId } as any);
        if (!comments) {
            throw new ConflictException('No comments found')
        }
        return { message: "Comments fetched successfully", comments: comments }
    }


    async likeUnlike(commentId: Types.ObjectId, req: any) {
        const userId = req.user._id;
        const comment = await this.commentRepositoryService.findById(commentId)
        if (!comment) {
            throw new ConflictException('Comment not found')
        }

        const userExist = comment.likes.find((user) => user.toString() == userId.toString())
        if (!userExist) {
            comment.likes.push(userId)
            await comment.save()
        } else {
            comment.likes = comment.likes.filter((user) => user.toString() != userId.toString())
            await comment.save()
        }

        const commentPopulated = await this.commentRepositoryService.findOne({ _id: commentId, isDeleted: false }, [{ path: 'userId', select: "-password -role -isActivated -isFreezed -createdAt -updatedAt -__v -phone" }])

        return { message: "Comment liked/unliked successfully", comment: commentPopulated }
    }



    async replyComment(commentId: Types.ObjectId, body: createCommentDto, file: Express.Multer.File, req: any) {
        const userId = req.user._id;
        const comment = await this.commentRepositoryService.findById(commentId)
        if (!comment) {
            throw new ConflictException('Comment not found')
        }
        if (file) {
            const uploadResult = await this.cloudinaryService.uploadImage(file, `${process.env.FOLDER_NAME!}/comments/${comment.post._id}`)
            body.image = {
                url: uploadResult.secure_url,
                public_id: uploadResult.public_id,
            }
        }
        const reply = await this.commentRepositoryService.create({ ...body, post: comment.post, userId: userId, cloudinaryFolder: `${process.env.FOLDER_NAME!}/posts/comments/${comment.post._id}` })
        return { message: "Reply created successfully", reply: reply }
    }

}
