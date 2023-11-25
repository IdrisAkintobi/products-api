import { Product } from '../../src/db/schemas/product.schema';
import { ProductCategoryEnum } from '../../src/types/product.category.enum';

export class ProductBuilder {
    private product: Product = {
        id: 'Product Id',
        name: 'Product Name',
        description: 'Product Description',
        price: 1.99,
        brand: 'Product Brand',
        category: ProductCategoryEnum.Other,
        model: 'Product Model',
        quantity: 1,
        image: 'Product Image',
    };

    constructor() {}

    public withName(name: string): ProductBuilder {
        this.product.name = name;
        return this;
    }

    public withoutId(): ProductBuilder {
        this.product.id = undefined;
        return this;
    }

    public withPrice(price: number): ProductBuilder {
        this.product.price = price;
        return this;
    }

    public build(): Product {
        return this.product;
    }

    public toObject(): Product {
        return this.product;
    }
}
