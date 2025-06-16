import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcryptjs';
import { createResponse } from 'src/response.util';
import { Messages } from 'src/constants/messages';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async resetPassword(email: string, newPassword: string) {
    return this.usersService.resetPassword(email, newPassword);
  }  

  async validateUser(email: string, pass: string): Promise<User | null> {
  const user = await this.usersService.findByEmail(email); 
  //console.log('Found user:', user);

  if (!user) return null;

    const passwordMatches = await bcrypt.compare(pass, user.password);
    //console.log('Password match:', passwordMatches);

  if (passwordMatches) {
    const { id, email, password, ...rest } = user;
    return { id, email, password, ...rest } as User;
  }

  return null;
}


  async login(user: User) {
    const payload = { email: user.email, sub: user.id };  
    const access_token = {access_token : this.jwtService.sign(payload)}   
    return createResponse(200,Messages.INFO.USER_LOGGED_IN,access_token);
  }
}
