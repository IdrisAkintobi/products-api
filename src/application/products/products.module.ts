import { Module } from '@nestjs/common';
import { DBModule } from '../../db/db.module';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module({
    imports: [DBModule],
    providers: [ProductService],
    controllers: [ProductController],
})
export class ProductsModule {}
