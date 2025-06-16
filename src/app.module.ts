import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ScriptModule } from './script/script.module';
import { ShareDataModule } from './share_data/share_data.module';

@Module({
  
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5433,
      username: 'postgres',
      password: '1234',
      database: 'market_data',
      autoLoadEntities: true,
      synchronize: true, // false in production
      entities: ['dist/**/*.entity.js'],
    }),
    UserModule,
    AuthModule,
    ScriptModule,
    ShareDataModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
