import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShareDataService } from './share_data.service';
import { ShareDataController } from './share_data.controller';
import { ShareData } from './entities/share_data.entity';
import { User } from '../user/entities/user.entity';
import { Script } from '../script/entities/script.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ShareData, User, Script])],
  providers: [ShareDataService],
  controllers: [ShareDataController],
})
export class ShareDataModule {}
