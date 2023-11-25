import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, IsStrongPassword, Length } from 'class-validator';

export class RegisterDto {
    @ApiProperty({
        description: 'User first name',
        example: 'John',
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    readonly firstName: string;

    @ApiProperty({
        description: 'User last name',
        example: 'Doe',
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    readonly lastName: string;

    @ApiProperty({
        description: 'User email',
        example: 'example@mail.com',
        required: true,
    })
    @IsEmail()
    readonly email: string;

    @ApiProperty({
        description: 'User password',
        example: 'QWE123qwe!@#',
        required: true,
    })
    @IsString()
    @Length(8)
    @IsStrongPassword()
    password: string;
}
