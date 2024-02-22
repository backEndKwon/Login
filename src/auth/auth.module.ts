import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from './user.entity';
@Module({
  imports: [JwtModule.register({}), TypeOrmModule.forFeature([UsersEntity])],

  providers: [AuthService],
  exports: [JwtModule],
})
export class AuthModule {}
