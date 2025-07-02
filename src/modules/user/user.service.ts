import { ConflictException, Injectable } from '@nestjs/common';
import { UserRepositoryService } from 'src/DB/repositories/user.repository';
import { updatePasswordDTO, updateProfileDTO } from './DTO/user.dto';
import { Types } from 'mongoose';
import { compare } from 'src/utils/bcrypt/bcrypt';
import { CloudinaryService } from 'src/utils/cloudinary/cloudinary.service';


@Injectable()
export class UserService {
constructor(
    private readonly userRepositoryService : UserRepositoryService,
    private readonly cloudinaryService : CloudinaryService
){}


async updateProfile(body:updateProfileDTO,id:Types.ObjectId){

    const {username,password,phone} = body
    
  const user = await this.userRepositoryService.findById(id)
    if(!user){
        throw new ConflictException('User not found')
    }

    if(!username && !password && !phone){
        throw new ConflictException('No data to update')
    }
    if(username){
        user.userName = username
    }

    if(password){
        user.password = password
    }

    if(phone){
        user.phone = phone
    }
    user.updatedAt = new Date()
    await user.save()
    return {message : 'User updated successfully'}
}


async updatePassword(body:updatePasswordDTO,id:Types.ObjectId){
    const {oldPassword,password,confirmPassword} = body
    const user = await this.userRepositoryService.findById(id)
    if(!user){
        throw new ConflictException('User not found')
    }
    const isMatch = await compare(oldPassword, user.password)
    if(!isMatch){
        throw new ConflictException('Invalid password')
    }
    user.password = password
    user.passwordChangedAt = new Date()
    await user.save()
    return {message : 'User password updated successfully'}
}


async freezeUser(id:Types.ObjectId){
    const user = await this.userRepositoryService.findById(id)
    if(!user){
        throw new ConflictException('User not found')
    }
    user.isFreezed = true
    await user.save()
    return {message : 'User frozen successfully'}
}

async unfreezeUser(id:Types.ObjectId){
    const user = await this.userRepositoryService.findById(id)
    if(!user){
        throw new ConflictException('User not found')
    }
    user.isFreezed = false
    await user.save()
    return {message : 'User unfrozen successfully'}
}

async uploadImage(id: Types.ObjectId, file: Express.Multer.File) {
    if (!file) {
      throw new ConflictException('No file uploaded');
    }
  
    const user = await this.userRepositoryService.findById(id);
    if (!user) {
      throw new ConflictException('User not found');
    }
  

    if (user.profileImg?.public_id) {
      await this.cloudinaryService.deleteImage(user.profileImg.public_id).catch((error) => {
        console.error('Error deleting old image:', error.message);
      });
    }
  
    const folder = `${process.env.FOLDER_NAME!}/users/${user._id}`;
  
    const uploadResult = await this.cloudinaryService
      .uploadImage(file, folder)
      .catch((error) => {
        throw new ConflictException('Error uploading image: ' + error.message);
      });
  
    user.profileImg = {
      url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
    };
  
    await user.save();
  
    return { message: 'User image uploaded successfully' };
  }
  

  async deleteImage(id: Types.ObjectId) {
    const user = await this.userRepositoryService.findById(id);
    if (!user) {
      throw new ConflictException('User not found');
    }
  
    if (!user.profileImg?.public_id) {
      throw new ConflictException('User has no image to delete');
    }
  
   
    await this.cloudinaryService.deleteImage(user.profileImg.public_id).catch((error) => {
      throw new ConflictException('Error deleting image: ' + error.message);
    });
  

    user.profileImg = {
        url: '',
        public_id: '',
      };
    await user.save();
  
    return { message: 'User image deleted successfully' };
  }
  

}
