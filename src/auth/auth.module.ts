import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
@Module({
  imports: [JwtModule.register({})],
  providers: [AuthService],
  exports:[JwtModule]
})
export class AuthModule {}
