import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Script } from 'src/script/entities/script.entity';
import { ShareData } from 'src/share_data/entities/share_data.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Script, ShareData])],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
