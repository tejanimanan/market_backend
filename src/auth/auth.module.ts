import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      secret: '2ce45ce055a9f69ea27c8b4ee6a86747caa90ffde8bb9af37b9c42a74e0468b45869b04fe6bb71cc237e0be9fb0bff126e9c1e2a22f981241de6f485268fbf1a',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
