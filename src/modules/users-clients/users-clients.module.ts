import { Module } from '@nestjs/common';
import { UsersClientsService } from './users-clients.service';
import { UsersClientsController } from './users-clients.controller';

@Module({
  controllers: [UsersClientsController],
  providers: [UsersClientsService],
})
export class UsersClientsModule {}
