import { userId } from './../auth/types/user.type';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductsEntity } from '../common/entities/product.entity';
import { Repository } from 'typeorm';
import { createProductDto } from './dtos/product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductsEntity)
    private readonly productRepository: Repository<ProductsEntity>,
  ) {}

  async createProduct(body: createProductDto):Promise<void> {
    //차후 userId가 db에 있는 지 확인하는 로직 추가
    const createProductInfo = {
      userId: body.userId,
      prodTitle: body.prodTitle,
      prodPrice: body.prodPrice,
      prodQuantity: body.prodQuantity,
    };
    const newProduct = this.productRepository.create(createProductInfo);
    await this.productRepository.save(newProduct);
  }
}
