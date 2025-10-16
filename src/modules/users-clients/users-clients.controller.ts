import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersClientsService } from './users-clients.service';
import { CreateUsersClientDto } from './dto/create-users-client.dto';
import { UpdateUsersClientDto } from './dto/update-users-client.dto';

@Controller('users-clients')
export class UsersClientsController {
  constructor(private readonly usersClientsService: UsersClientsService) {}

  @Post()
  create(@Body() createUsersClientDto: CreateUsersClientDto) {
    return this.usersClientsService.create(createUsersClientDto);
  }

  @Get()
  findAll() {
    return this.usersClientsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersClientsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUsersClientDto: UpdateUsersClientDto) {
    return this.usersClientsService.update(+id, updateUsersClientDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersClientsService.remove(+id);
  }
}
