import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
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
    readonly password: string;
}
