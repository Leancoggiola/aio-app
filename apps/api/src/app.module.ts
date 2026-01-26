import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma/prisma.service.js';

@Module({
  imports: [ConfigModule.forRoot({isGlobal: true})],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
