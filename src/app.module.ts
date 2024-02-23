import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './common/exceptions/filterException';
import { ProductModule } from './product/product.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { typeORMConfig } from "./common/configs/typeorm.config"
import { ProductsEntity } from './common/entities/product.entity';
import { ProductController } from './product/product.controller';
import { ProductService } from './product/product.service';
import { UsersEntity } from './common/entities/user.entity';
@Module({
  imports: [  ConfigModule.forRoot({
    isGlobal: true,
  
  }),
  TypeOrmModule.forRootAsync({
    imports: [ConfigModule], // ConfigModule을 import
    useFactory: (configService: ConfigService) =>
      typeORMConfig(configService), // ConfigService 주입하여 typeORMConfig 함수 호출
    inject: [ConfigService], // ConfigService 주입
  }),AuthModule, ProductModule,
  TypeOrmModule.forFeature([ProductsEntity,UsersEntity])],
  controllers: [AppController, AuthController,ProductController],
  providers: [
    AppService,
    AuthService,
    ProductService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
