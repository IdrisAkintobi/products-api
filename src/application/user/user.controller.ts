import {
    Body,
    Controller,
    Delete,
    Headers,
    HttpCode,
    HttpStatus,
    Put,
    UseFilters,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiHeader, ApiTags } from '@nestjs/swagger';
import { User } from '../../db/schemas/user.schema';
import { ErrorExceptionFilter } from '../../exception/filters/error-exception-filter';
import { AuthGuard } from '../../guards/auth.guard';
import { HttpResponse } from '../../utils/resources/http-response';
import { HttpResponseMapper } from '../../utils/resources/http-response-mapper';
import { UpdateUserDto } from './dto/user.update.dto';
import { UserService } from './user.service';

@ApiTags('user')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('v1/user')
@UseFilters(ErrorExceptionFilter)
export class UserController {
    constructor(private readonly userService: UserService) {}

    @ApiHeader({ required: false, name: 'x-subject' })
    @ApiBody({ type: UpdateUserDto, description: 'Update user data' })
    @HttpCode(HttpStatus.OK)
    @Put('/update')
    async update(
        @Headers('x-subject') userId: string,
        @Body() user: UpdateUserDto,
    ): Promise<HttpResponse<User>> {
        const response = await this.userService.update(userId, user);
        return HttpResponseMapper.map(response);
    }

    @ApiHeader({ required: false, name: 'x-subject' })
    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete('/delete')
    async delete(@Headers('x-subject') userId: string): Promise<void> {
        await this.userService.delete(userId);
    }
}
