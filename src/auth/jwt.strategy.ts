import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: '2ce45ce055a9f69ea27c8b4ee6a86747caa90ffde8bb9af37b9c42a74e0468b45869b04fe6bb71cc237e0be9fb0bff126e9c1e2a22f981241de6f485268fbf1a',
    });
  }

  async validate(payload: any) {
    return { email: payload.email };
  }
}
