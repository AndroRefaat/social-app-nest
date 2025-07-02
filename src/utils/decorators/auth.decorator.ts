import { applyDecorators, SetMetadata, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../guards/auth.guard";
import { AuthorizationGuard } from "../guards/authorization.guard";
import { Role } from "../enums/enums";

export const Auth = (...roles: Role[]) => {
    return applyDecorators(
        SetMetadata('roles', roles),
        UseGuards(AuthGuard, AuthorizationGuard)
    );
};
