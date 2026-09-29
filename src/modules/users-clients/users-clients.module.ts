import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersClientsService } from './users-clients.service';
import { UsersClientsController } from './users-clients.controller';
import { UsersClient } from './entities/users-client.entity';
import { Counter } from './entities/counter.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UsersClient, Counter])],
  controllers: [UsersClientsController],
  providers: [UsersClientsService],
})
export class UsersClientsModule {}
