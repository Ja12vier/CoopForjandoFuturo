import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { UserAuthorizationMiddleware } from './middlewares/user-authorization.middleware';
import { AuthModule } from '../auth/auth.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    AuthModule
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule{}  
// implements NestModule{
//   configure(consumer: MiddlewareConsumer) {
//     consumer
//     .apply(UserAuthorizationMiddleware)
//     .forRoutes({
//       path:'/users', method:RequestMethod.GET
//     })
//   }
// }
