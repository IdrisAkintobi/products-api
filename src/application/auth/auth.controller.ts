import { Body, Controller, HttpCode, HttpStatus, Post, UseFilters } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { ErrorExceptionFilter } from '../../exception/filters/error-exception-filter';
import { HttpResponseMapper } from '../../resources/http-response-mapper';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@ApiTags('auth')
@Controller('v1/auth')
@UseFilters(ErrorExceptionFilter)
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @ApiBody({ type: LoginDto, description: 'Login data' })
    @HttpCode(HttpStatus.OK)
    @Post('login')
    async login(@Body() credentials: LoginDto) {
        const response = await this.authService.login(credentials);
        return HttpResponseMapper.map(response);
    }

    @ApiBody({ type: RegisterDto, description: 'Register data' })
    @HttpCode(HttpStatus.CREATED)
    @Post('register')
    async register(@Body() userData: RegisterDto) {
        const response = await this.authService.register(userData);
        return HttpResponseMapper.map(response);
    }
}
