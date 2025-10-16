import { PartialType } from '@nestjs/mapped-types';
import { CreateUsersClientDto } from './create-users-client.dto';

export class UpdateUsersClientDto extends PartialType(CreateUsersClientDto) {}
