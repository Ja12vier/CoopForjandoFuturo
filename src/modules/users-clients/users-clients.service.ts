import { Injectable } from '@nestjs/common';
import { CreateUsersClientDto } from './dto/create-users-client.dto';
import { UpdateUsersClientDto } from './dto/update-users-client.dto';

@Injectable()
export class UsersClientsService {
  create(createUsersClientDto: CreateUsersClientDto) {
    return 'This action adds a new usersClient';
  }

  findAll() {
    return `This action returns all usersClients`;
  }

  findOne(id: number) {
    return `This action returns a #${id} usersClient`;
  }

  update(id: number, updateUsersClientDto: UpdateUsersClientDto) {
    return `This action updates a #${id} usersClient`;
  }

  remove(id: number) {
    return `This action removes a #${id} usersClient`;
  }
}
