import { Injectable, OnModuleInit } from '@nestjs/common';
import { UserService } from './user/user.service';
import { CreateUserDto } from './user/dto/create-user.dto';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(private readonly userService: UserService) {}

  async onModuleInit() {
    const email = 'admin@example.com';

    const existing = await this.userService.findByEmail(email);
    if (!existing) {
      const dto: CreateUserDto = {
        uid: 11,
        name: 'Admin',
        email: 'admin@example.com',
        contact: '1234567890',
        password: 'admin123', // Will be hashed
        role: 'admin',
        status: true,
      };

      await this.userService.create(dto);
      console.log('✅ Default admin user created!');
    } else {
      console.log('ℹ️ Admin user already exists');
    }
  }
  getHello(): string {
  return 'Hello World!';
}
}
