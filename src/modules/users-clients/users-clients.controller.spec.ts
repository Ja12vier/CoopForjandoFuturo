import { Test, TestingModule } from '@nestjs/testing';
import { UsersClientsController } from './users-clients.controller';
import { UsersClientsService } from './users-clients.service';

describe('UsersClientsController', () => {
  let controller: UsersClientsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersClientsController],
      providers: [UsersClientsService],
    }).compile();

    controller = module.get<UsersClientsController>(UsersClientsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
