import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { ProductCategoryEnum } from '../../types/product.category.enum';

export type ProductDocument = HydratedDocument<Product>;

@Schema()
export class Product {
    @Prop({ virtuals: true })
    id: string;

    @Prop({ unique: true })
    name: string;

    @Prop()
    description: string;

    @Prop({ index: true })
    price: number;

    @Prop()
    model: string;

    @Prop({ index: true })
    brand: string;

    @Prop({
        default: 'Other',
        enum: ProductCategoryEnum,
        index: true,
    })
    category: ProductCategoryEnum;

    @Prop()
    quantity: number;

    @Prop()
    image: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
ProductSchema.set('toObject', {
    transform: function (doc, ret) {
        delete ret.__v;
        ret.id = ret._id.toHexString();
        delete ret._id;
    },
});
