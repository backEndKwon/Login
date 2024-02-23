import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from '../common/entities/user.entity';
// import { ProductsEntity } from 'src/product/product.entity';
@Module({
  imports: [JwtModule.register({}), TypeOrmModule.forFeature([UsersEntity])],

  providers: [AuthService],
  exports: [JwtModule],
})
export class AuthModule {}
