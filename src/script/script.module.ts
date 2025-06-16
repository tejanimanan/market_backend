import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScriptService } from './script.service';
import { ScriptController } from './script.controller';
import { Script } from './entities/script.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([Script]),ConfigModule,],
  providers: [ScriptService],
  controllers: [ScriptController],
})
export class ScriptModule {}
