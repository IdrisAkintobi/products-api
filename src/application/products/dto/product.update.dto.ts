import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class UpdateProductDto {
    @ApiProperty({ description: 'Product name', example: 'Samsung Galaxy S20', required: false })
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    readonly description?: string;

    @ApiProperty({ description: 'Product price', example: 500000, required: false })
    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 2, allowNaN: false, allowInfinity: false })
    @Min(0)
    @Max(9999999, { message: 'Price must be less than ten million' })
    readonly price?: number;

    @ApiProperty({ description: 'Product model', example: 12, required: false })
    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 0, allowNaN: false, allowInfinity: false })
    @Min(0)
    @Max(999)
    readonly quantity?: number;

    @ApiProperty({ description: 'Product brand', example: 'Samsung', required: false })
    @IsOptional()
    @IsString()
    readonly image?: string;
}
