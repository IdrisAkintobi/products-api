import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProductCategoryEnum } from 'src/types/product.category.enum';
import { Product, ProductDocument } from '../../db/schemas/product.schema';

@Injectable()
export class ProductRepository {
    constructor(@InjectModel(Product.name) private readonly productModel: Model<Product>) {}

    async createProduct(product: Product): Promise<ProductDocument> {
        return this.productModel.create(product);
    }

    async findProductById(id: string): Promise<ProductDocument> {
        return this.productModel.findById(id).exec();
    }

    async updateProduct(id: string, product: Partial<Product>): Promise<ProductDocument> {
        return this.productModel.findByIdAndUpdate(id, product, { new: true }).exec();
    }

    async deleteProduct(id: string): Promise<ProductDocument> {
        return this.productModel.findByIdAndDelete(id).exec();
    }

    async findAllProducts(page = 1, limit = 10): Promise<ProductDocument[]> {
        return this.productModel
            .find()
            .skip((page - 1) * limit)
            .limit(limit)
            .exec();
    }

    async findProductByName(name: string): Promise<ProductDocument> {
        return this.productModel.findOne({ name }).exec();
    }

    async findProductsByCategory(
        category: ProductCategoryEnum,
        page = 1,
        limit = 10,
    ): Promise<ProductDocument[]> {
        return this.productModel
            .find({ category })
            .skip((page - 1) * limit)
            .limit(limit)
            .exec();
    }

    async findProductsByBrand(brand: string, page = 1, limit = 10): Promise<ProductDocument[]> {
        return this.productModel
            .find({ brand })
            .skip((page - 1) * limit)
            .limit(limit)
            .exec();
    }
}
