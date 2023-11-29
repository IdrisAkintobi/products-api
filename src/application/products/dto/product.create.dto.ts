import { ApiProperty } from '@nestjs/swagger';
import {
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    IsUrl,
    Max,
    Min,
} from 'class-validator';

import { ProductCategoryEnum } from '../../../types/product.category.enum';

export class CreateProductDto {
    @ApiProperty({
        description: 'Product name',
        example: 'Samsung Galaxy S20',
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    readonly name: string;

    @ApiProperty({
        description: 'Product description',
        example: 'Samsung Galaxy S20 128GB Cosmic Gray',
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    readonly description: string;

    @ApiProperty({
        description: 'Product price',
        example: 100,
        required: true,
    })
    @IsNumber({ maxDecimalPlaces: 2, allowNaN: false, allowInfinity: false })
    @Min(0)
    @Max(9999999, { message: 'Price must be less than ten million' })
    readonly price: number;

    @ApiProperty({
        description: 'Product model',
        example: 'S20',
        required: true,
    })
    @IsString()
    readonly model: string;

    @ApiProperty({
        description: 'Product brand',
        example: 'Samsung',
        required: true,
    })
    @IsString()
    readonly brand: string;

    @ApiProperty({
        description: 'Product category',
        example: ProductCategoryEnum.Electronics,
        enum: ProductCategoryEnum,
        required: true,
    })
    @IsString()
    @IsEnum(ProductCategoryEnum)
    readonly category: ProductCategoryEnum;

    @ApiProperty({
        description: 'Product quantity',
        example: 100,
        required: true,
    })
    @IsNumber({ maxDecimalPlaces: 0, allowNaN: false, allowInfinity: false })
    @Min(0)
    @Max(999)
    readonly quantity: number;

    @ApiProperty({
        description: 'Product image',
        example: 'https://example.com/image.png',
        required: false,
    })
    @IsUrl()
    @IsOptional()
    readonly image?: string;
}
