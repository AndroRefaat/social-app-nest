import { applyDecorators, SetMetadata, UseGuards } from "@nestjs/common";
import { Role } from "../enums/enums";
import { AuthGuard } from "../guards/auth.guard";
import { RolesGuard } from "../guards/authorization.guard";



export function Auth(...roles: Role[]){
    return applyDecorators(
        SetMetadata('roles',roles),
        UseGuards(AuthGuard,RolesGuard)
    )
}