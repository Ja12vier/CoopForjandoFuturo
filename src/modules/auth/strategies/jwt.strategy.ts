import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "src/modules/users/entities/user.entity";
import { Repository } from "typeorm";

interface Payload{
    id:number;
}

@Injectable()
  export class JwtStrategy extends PassportStrategy(Strategy){
     constructor(
        @InjectRepository(User)
        private readonly userRepository:Repository<User>,
         configService:ConfigService
     ){
      const tokenSecret = configService.get<string>('TOKEN_SECRET');
       if (!tokenSecret) {
        throw new Error('TOKEN_SECRET is not defined in environment variables');
       }
        super({
            secretOrKey:tokenSecret,
            jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),
        })
     }

     async validate(payload:Payload):Promise<User>{
        const {id}=payload;
        const user= await this.userRepository.findOneBy({id});
        if(!user) throw new UnauthorizedException('Not authorized');
        return user
     }
  }
