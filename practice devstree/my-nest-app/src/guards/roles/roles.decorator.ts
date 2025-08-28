import { SetMetadata } from "@nestjs/common";

export const RolesKey = 'roles';

export const roles = (...roles: string[]) => SetMetadata(RolesKey, roles)

