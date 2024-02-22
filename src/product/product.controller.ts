import { UUID, userId } from './../auth/types/user.type';
import { Body, Controller,Post } from '@nestjs/common';
import { ProductService } from './product.service';
import { ApiOperation } from '@nestjs/swagger';
import { v4 as uuidv4 } from 'uuid';
import { createProductDto } from './dtos/product.dto';

@Controller('product')
export class ProductController {
constructor(private readonly productService: ProductService){}
        
        @Post()
        @ApiOperation({
            summary: "제품 등록용",
            description:"제품 등록용 api, 초기엔 userId 인증 로직 간소화"
        })
        createProduct(@Body() body:createProductDto){
            // const userId = uuidv4();
            return this.productService.createProduct(body)
        }

}
