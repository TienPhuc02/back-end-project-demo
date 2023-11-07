import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { UsersService } from 'src/users/users.service';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
import { Request, Response } from 'express';
import { IUser } from 'src/users/user.interface';


@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  @ResponseMessage('Login SuccessFull!')
  handleLogin(@Req() req, @Res({ passthrough: true }) response: Response) {
    return this.authService.login(req.user, response);
  }

  @Public()
  @Post('/register')
  @ResponseMessage('Register A New User')
  handleRegister(@Body() registerDto: RegisterUserDto) {
    return this.usersService.register(registerDto);
  }

  @ResponseMessage('Get Account Success!!')
  @Get('/account')
  handleGetAccount(@User() user: IUser) {
    return user;
  }

  @Public()
  @ResponseMessage('Refresh Account Success!!')
  @Get('/refresh')
  handleRefreshAccount(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const refreshToken = request.cookies['refresh_token'];
    console.log(
      '🚀 ~ file: auth.controller.ts:52 ~ AuthController ~ handleRefreshAccount ~ refreshToken:',
      refreshToken,
    );
    return this.authService.processNewToken(refreshToken, response);
  }

  @ResponseMessage('Logout Account Success!!')
  @Post('/logout')
  handleLogoutAccount(
    @User() user: IUser,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.logout(user, response);
  }
}
