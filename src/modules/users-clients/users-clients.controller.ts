import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UsersClientsService } from './users-clients.service';
import { CreateUsersClientDto } from './dto/create-users-client.dto';
import { UpdateUsersClientDto } from './dto/update-users-client.dto';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { AuthGuard } from '@nestjs/passport';
//import { RoleGuard } from '../auth/guards/role.guard';
import { Roles } from '../auth/decorators/role.decorator';
import { Role } from '../auth/Enums/role.enum';
import { RoleGuard } from '../auth/guards/role.guard';

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
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.usersClientsService.remove(+id);
  }
}
