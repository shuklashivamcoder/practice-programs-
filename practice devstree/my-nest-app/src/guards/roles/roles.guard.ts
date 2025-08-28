import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Roles } from './roles.enum';
import { RolesKey } from './roles.decorator';
import { stringify } from 'querystring';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector){}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const RequiredRoles = this.reflector.getAllAndOverride<Roles[]>(
     RolesKey, [
      context.getHandler(),
      context.getClass()
     ]
    );
    if(!RequiredRoles) return true;
    const request = context.switchToHttp().getRequest<{headers: Record<string, any>}>()
    const userroles = request.headers['y-user-role'] as Roles
    return RequiredRoles.includes(userroles)
    return true;
  }
}
