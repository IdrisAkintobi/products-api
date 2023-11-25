import { ApiProperty } from '@nestjs/swagger';
import {
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsStrongPassword,
    Length,
} from 'class-validator';

export class UpdateUserDto {
    @ApiProperty({
        description: 'User first name',
        example: 'John',
        required: false,
    })
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    readonly firstName?: string;

    @ApiProperty({
        description: 'User last name',
        example: 'Doe',
        required: false,
    })
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    readonly lastName?: string;

    @ApiProperty({
        description: 'User email',
        example: 'example@mail.com',
        required: false,
    })
    @IsEmail()
    @IsOptional()
    readonly email?: string;

    @ApiProperty({
        description: 'User password',
        example: 'QWE123qwe!@#',
        required: false,
    })
    @IsString()
    @Length(8)
    @IsStrongPassword()
    @IsOptional()
    password?: string;
}
