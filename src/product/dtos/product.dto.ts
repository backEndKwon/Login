import { UUID } from '../../auth/types/user.type';
import { ProductsEntity } from './../product.entity';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class createProductDto {
  userId: UUID;
  prodTitle: string;
  prodPrice: number;
  prodQuantity: number;
}
