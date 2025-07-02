import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { Auth } from 'src/utils/decorators/auth.decorator';
import { Role } from 'src/utils/enums/enums';
import { Request } from 'express';
import { updatePasswordDTO, updateProfileDTO } from './DTO/user.dto';
import { Types } from 'mongoose';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('user')
export class UserController {
constructor(private readonly userService : UserService){}


@Auth(Role.ADMIN,Role.USER)
@Get('profile')
profile(@Req() req : Request){
    const user = req['user']
    return user
}


@Auth(Role.ADMIN,Role.USER)
@Patch('update-profile/:id')
updateProfile(@Body() body :updateProfileDTO ,@Param('id') id : Types.ObjectId){
  return this.userService.updateProfile(body,id)
}


@Auth(Role.ADMIN,Role.USER)
@Patch('update-password/:id')
updatePassword(@Body() body :updatePasswordDTO ,@Param('id') id : Types.ObjectId){
  return this.userService.updatePassword(body,id)
}


@Auth(Role.ADMIN,Role.USER)
@Patch('freeze-user')
freezeUser(@Req() req:Request){
  return this.userService.freezeUser(req['user']._id)
}


@Auth(Role.ADMIN,Role.USER)
@Patch('unfreeze-user')
unfreezeUser(@Req() req:Request){
  return this.userService.unfreezeUser(req['user']._id)
}

@Auth(Role.ADMIN,Role.USER)
@UseInterceptors(FileInterceptor('file'))
@Post('upload-image/:id')
uploadImage(@Param("id")id :Types.ObjectId,@UploadedFile() file: Express.Multer.File){
  return this.userService.uploadImage(id,file)
}


@Auth(Role.ADMIN,Role.USER)
@Delete('delete-image/:id')
deleteImage(@Param("id")id :Types.ObjectId){
  return this.userService.deleteImage(id)
}



}
