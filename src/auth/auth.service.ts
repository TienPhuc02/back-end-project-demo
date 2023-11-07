import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import ms from 'ms';
import { Response } from 'express';
import { IUser } from 'src/users/user.interface';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByUsername(username);

    if (user) {
      const isValid = this.usersService.isValidPassword(pass, user.password);
      if (isValid === true) {
        return user;
      }
    }
    return null;
  }
  async login(user: any, response: Response) {
    const { emailAddress, _id, role, name, age, gender, address } = user;
    const payload = {
      emailAddress,
      _id,
      age,
      gender,
      address,
      role,
      name,
      sub: 'token login',
      iss: 'from server',
    };
    const refresh_token = await this.createRefreshToken(payload);

    //update user with refreshtoken
    await this.usersService.updateUserToken(refresh_token, _id);

    //set cookie
    response.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      maxAge: ms(this.configService.get<string>('JWT_REFRESH_EXPIRE')), //miliseconds,
    });
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        emailAddress,
        _id,
        age,
        gender,
        address,
        role,
        name,
      },
    };
  }
  createRefreshToken = async (payload) => {
    const refresh_token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn:
        ms(this.configService.get<string>('JWT_REFRESH_EXPIRE')) / 1000,
    });
    return refresh_token;
  };
  async processNewToken(refreshToken: string, response: Response) {
    try {
      this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      });

      console.log(
        '🚀 ~ file: auth.service.ts:78 ~ AuthService ~ processNewToken ~ refreshToken:',
        refreshToken,
      );
      const user = await this.usersService.findUserByToken(refreshToken);
      if (user) {
        const { emailAddress, _id, userName, role, address } = user;
        const payload = {
          emailAddress,
          _id,
          userName,

          address,
          role,

          sub: 'refresh token',
          iss: 'from server',
        };
        const refresh_token = await this.createRefreshToken(payload);

        await this.usersService.updateUserToken(refresh_token, _id.toString());

        response.clearCookie('refresh_token');
        response.cookie('refresh_token', refresh_token, {
          httpOnly: true,
          maxAge: ms(this.configService.get<string>('JWT_REFRESH_EXPIRE')),
        });

        return {
          access_token: this.jwtService.sign(payload),
          user: {
            emailAddress,
            _id,
            address,
            role,
            userName,
          },
        };
      } else {
        throw new BadRequestException(
          `Refresh Token không hợp lệ. Vui lòng đăng nhập`,
        );
      }
    } catch (error) {
      throw new BadRequestException(`Refresh Token không hợp lệ`);
    }
  }
  async logout(user: IUser, response: Response) {
    await this.usersService.updateUserToken('', user._id);
    response.clearCookie('refresh_token');
    return 'Logout Success!!';
  }
}
