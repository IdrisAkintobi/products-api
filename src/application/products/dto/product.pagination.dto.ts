import { IsNumberString } from 'class-validator';

export class ProductPaginationDto {
    @IsNumberString()
    readonly page: number;

    @IsNumberString()
    readonly limit: number;
}
