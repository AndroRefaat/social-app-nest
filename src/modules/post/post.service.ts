import { Injectable } from '@nestjs/common';
import { createPostDto, updatePostDto } from './DTO/post.dto';
import { CloudinaryService } from 'src/utils/cloudinary/cloudinary.service';
import { ConflictException } from '@nestjs/common';
import { PostRepositoryService } from 'src/DB/repositories/post.repository';
import { UserRepositoryService } from 'src/DB/repositories/user.repository';
import { Types } from 'mongoose';

@Injectable()
export class PostService {
constructor(
    private readonly userRepositoryService : UserRepositoryService,
    private readonly cloudinaryService:CloudinaryService,
    private readonly postRepositoryService:PostRepositoryService
){}




async createPost(body:createPostDto,file:Express.Multer.File,req:any){

    const userId = req.user._id;
    const user = await this.userRepositoryService.findById(userId);
    if (!user) {
      throw new ConflictException('User not found');
    }

    let image:any;
    const folder = `${process.env.FOLDER_NAME!}/posts/${user._id}`;
    if (file) {
  
        const uploadResult = await this.cloudinaryService
          .uploadImage(file, folder)
          .catch((error) => {
            throw new ConflictException('Error uploading image: ' + error.message);
          });
        image = {
            url: uploadResult.secure_url,
            public_id: uploadResult.public_id,
          };
    }
 

    const createdPost = await this.postRepositoryService.create({
      ...body,
      userId,
      image,
      cloudinaryFolder:folder,
    });

    return {message:"Post created successfully", post: createdPost };

}


async updatePost(body:updatePostDto,file:Express.Multer.File,id:Types.ObjectId){
    const post = await this.postRepositoryService.findById(id)
    if(!post){
        throw new ConflictException('Post not found')
    }
    let image:any;
    const folder = `${process.env.FOLDER_NAME!}/posts/${post.userId}`;
if(file){
    
    if(post.image?.public_id){
        await this.cloudinaryService.deleteImage(post.image.public_id).catch((error) => {
            console.error('Error deleting old image:', error.message);
          });
    }
    const uploadResult = await this.cloudinaryService
    .uploadImage(file, folder)
    .catch((error) => {
      throw new ConflictException('Error uploading image: ' + error.message);
    });
  image = {
      url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
    };
    post.image = image;
}
post.text = body.text;
await post.save();
return {message:"Post updated successfully", post: post };

}

async freezePost(id:Types.ObjectId){
    const post = await this.postRepositoryService.findOne({_id:id , isDeleted:false})
    if(!post){
        throw new ConflictException('Post not found')
    }
    post.isDeleted = true;
    await post.save();
    return {message:"Post frozen successfully", post: post };

}

async unfreezePost(id:Types.ObjectId){
    const post = await this.postRepositoryService.findOne({_id:id , isDeleted:true})
    if(!post){
        throw new ConflictException('Post not found')
    }
    post.isDeleted = false;
    await post.save();
    return {message:"Post unfrozen successfully", post: post };

}

async getAllPosts(){
    const posts =await this.postRepositoryService.findAll({isDeleted:false})
    return {message:"Posts fetched successfully", posts: posts };
}


async getPost(id:Types.ObjectId){
    const post = await this.postRepositoryService.findById(id)
    if(!post){
        throw new ConflictException('Post not found')
    }
    return {message:"Post fetched successfully", post: post };
}

async likeUnlikePost(id:Types.ObjectId,req:any){
    const userId = req.user._id;
    const post = await this.postRepositoryService.findOne({_id:id , isDeleted:false})
    if(!post){
        throw new ConflictException('Post not found')
    }
    
    const userExist = post.likes.find((user)=> user.toString() == userId.toString())
    if(!userExist){
        post.likes.push(userId)
        await post.save()
        //  {message:"Post liked successfully", post: post };
    }else{
        post.likes = post.likes.filter((user)=> user.toString() != userId.toString())
        await post.save()
        //  {message:"Post unliked successfully", post: post };
    }

const postPopulated = await this.postRepositoryService.findOne({_id:id , isDeleted:false},[{path:'userId',select:"-password -role -isActivated -isFreezed -createdAt -updatedAt -__v -phone "}])

return {message:"Post liked/unliked successfully", post: postPopulated };

}


}
