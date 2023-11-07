import {
    ExecutionContext,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
  import { Reflector } from '@nestjs/core';
  import { AuthGuard } from '@nestjs/passport';
  import { Observable } from 'rxjs';
  import { IS_PUBLIC_KEY } from 'src/decorator/customize';
  
  @Injectable()
  export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private reflector: Reflector) {
      super();
    }
    canActivate(
      context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
      //logic lấy ra metadata
      const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);
      //nếu có metadata thì bỏ qua check guard
      if (isPublic) {
        return true;
      }
      return super.canActivate(context);
    }
    handleRequest(err: any, user: any) {
      if (err || !user) {
        throw (
          err ||
          new UnauthorizedException(
            'Token không hợp lệ or không có token ở Bearer Token ở Header Request',
          )
        );
      }
      return user;
    }
  }