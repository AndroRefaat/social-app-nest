import {
    CanActivate,
    ExecutionContext,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { TokenService } from '../token/token.service';
import { UserRepositoryService } from 'src/DB/repositories/user.repository';


@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private tokenService: TokenService,
        private readonly userRepositoryService: UserRepositoryService
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers['authorization'];
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new UnauthorizedException('Access token is required');
        }

        const accessToken = authHeader.split(' ')[1];
        let data;
        try {
            data = await this.tokenService.verifyToken(accessToken, {
                secret: process.env.JWT_SECRET,
            });
        } catch (err) {
            throw new UnauthorizedException('Invalid or expired token');
        }

        const user = await this.userRepositoryService.findOne({ _id: data.userId });
        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        if (user.passwordChangedAt && user.passwordChangedAt.getTime() !== data.passwordChangedAt) {
            throw new UnauthorizedException('Token is no longer valid');
        }

        request.user = user;
        return true;
    }
}