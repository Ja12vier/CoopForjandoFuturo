import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { LoginUserDto } from './dto/login-user.dtos';
import * as bcrypt from 'bcrypt'; 
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService
  ) {}  

  async create(createUserDto: CreateUserDto) {
    const newUser=this.userRepository.create(createUserDto);
    await this.userRepository.save(newUser);
    return newUser;
  }

  async findAll() {
    const users= await this.userRepository.find();
    return users;
    //`This action returns all users`;
  }

  async findOne(id: number) {
    const user=await this.userRepository.findOneBy({id});
    if(!user){
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
   const user=await this.userRepository.preload({
    id, ...updateUserDto
   });
     if(!user){
      throw new NotFoundException(`User with id ${id} not found`);
     }
    await this.userRepository.save(user);
    return user;
  }

  async remove(id: number) {
    const userdelete= await this.userRepository.delete(id);
    if(userdelete.affected===0){
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return `This action removes a #${id} user`;
  }

  async login(loginUserDto:LoginUserDto){
    const {email, password}=loginUserDto;
    const user=await this.userRepository.findOne({
      where:{email},
      select:['email', 'password']
    });
    if(!user){ 
      throw new NotFoundException(`User with email ${email} not found`);
    }
    const validatePassword= await bcrypt.compare(password, user.password);
    if(!validatePassword){
      throw new NotFoundException(`Invalid credentials`);
    }
    const token= this.jwtService.sign({id:user.id});
    return {user, token};
    
  }

}

