import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';


@Module({
  
  providers: [AuthService, JwtStrategy ],
  imports: [
    TypeOrmModule.forFeature([User]),
    ConfigModule,
    PassportModule.register({defaultStrategy:'jwt'}),
    JwtModule.registerAsync({
      useFactory:()=>({
        secret:process.env.TOKEN_SECRET,
        signOptions:{
          expiresIn:'2h'
        }
      })
    })
      
  ],
  exports: [PassportModule, JwtModule, AuthService]
})
export class AuthModule {  }
