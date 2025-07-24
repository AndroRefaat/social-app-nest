import { IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class createCommentDto{
    
@IsOptional()    
@IsString()
@MinLength(3)
@MaxLength(20)
text:string
    
@IsOptional()
image?: {
    url: string;
    public_id: string;
  };

}

export class updateCommentDto{
    @IsOptional()    
@IsString()
@MinLength(3)
@MaxLength(20)
text:string
    
@IsOptional()
image?: {
    url: string;
    public_id: string;
  };

}
