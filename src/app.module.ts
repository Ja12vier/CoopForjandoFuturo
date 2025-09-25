import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { UsersModule } from './modules/users/users.module';
import { LoansModule } from './modules/loans/loans.module';
import { AuthModule } from './modules/auth/auth.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type:'postgres',
      url:process.env.DATABASE_URL,
      autoLoadEntities:true,
      synchronize:true
    }),
    ServeStaticModule.forRoot({
      rootPath:join(__dirname, '..','public'),
      renderPath:'/'
    }),
    UsersModule,
    LoansModule,
    AuthModule,
    
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
