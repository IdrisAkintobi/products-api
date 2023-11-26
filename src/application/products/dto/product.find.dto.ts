import { IsMongoId } from 'class-validator';

export class ProductFindDto {
    @IsMongoId()
    readonly id: string;
}
