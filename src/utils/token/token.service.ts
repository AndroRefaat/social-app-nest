import { Injectable } from "@nestjs/common";
import { JwtService, JwtSignOptions } from "@nestjs/jwt";



@Injectable()
export class TokenService {

     constructor(
        private readonly jwtService : JwtService
     ){}

     async generateToken(payload: any , options :JwtSignOptions){
        return this.jwtService.sign(payload , options)
     }

     async verifyToken(token : string, options : JwtSignOptions){
        return this.jwtService.verify(token , options)
     }
}
