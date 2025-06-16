import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { createResponse } from 'src/response.util';
import { UserService } from 'src/user/user.service';
import { Messages } from 'src/constants/messages';

@Controller('auth')
export class AuthController {
    constructor(
    private readonly authService: AuthService,
    private readonly usersService: UserService,
  ) { }

  @Post('reset_password')
  async resetPassword(@Body() body: { email: string; newPassword: string; oldPassword?: string }) {
    return this.usersService.resetPassword(body.email, body.newPassword, body.oldPassword);
  }


  @Post('login')
  async login(@Body() loginDto: { email: string; password: string }) {
    if (!loginDto || !loginDto.email || !loginDto.password) {
      return createResponse(400, Messages.ERROR.EMAIL_PASSWORD_REQUIRED, {});
    }
    const user = await this.authService.validateUser(loginDto.email, loginDto.password);

    if (!user) {
      return createResponse(400, Messages.ERROR.INVALID_CREDENTIALS, {});
    }

    return this.authService.login(user);
  }
}
