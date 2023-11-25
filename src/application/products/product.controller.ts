import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Post,
    Put,
    Query,
    UseFilters,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ProductCategoryEnum } from 'src/types/product.category.enum';
import { Product } from '../../db/schemas/product.schema';
import { ErrorExceptionFilter } from '../../exception/filters/error-exception-filter';
import { AuthGuard } from '../../guards/auth.guard';
import { HttpResponse } from '../../resources/http-response';
import { HttpResponseMapper } from '../../resources/http-response-mapper';
import { CreateProductDto } from './dto/product.create.dto';
import { ProductPaginationDto } from './dto/product.pagination.dto';
import { UpdateProductDto } from './dto/product.update.dto';
import { ProductService } from './product.service';

@ApiTags('product')
@ApiBearerAuth()
@Controller('v1/products')
@UseGuards(AuthGuard)
@UseFilters(ErrorExceptionFilter)
export class ProductController {
    constructor(private readonly productService: ProductService) {}

    @ApiBody({ type: CreateProductDto, description: 'Create product data' })
    @HttpCode(HttpStatus.CREATED)
    @Post('/create')
    async create(@Body() product: CreateProductDto): Promise<HttpResponse<Product>> {
        const response = await this.productService.create(product);
        return HttpResponseMapper.map(response);
    }

    @ApiQuery({ name: 'page', description: 'Page number' })
    @ApiQuery({ name: 'limit', description: 'Number of items per page' })
    @HttpCode(HttpStatus.OK)
    @Get('/all')
    async findAll(
        @Query() { page, limit }: ProductPaginationDto,
    ): Promise<HttpResponse<Product[]>> {
        const response = await this.productService.findAll(page, limit);
        return HttpResponseMapper.map(response);
    }

    @ApiParam({ name: 'id', description: 'Product id' })
    @HttpCode(HttpStatus.OK)
    @Get('/product/:id')
    async findById(@Param('id') id: string): Promise<HttpResponse<Product>> {
        const response = await this.productService.findById(id);
        return HttpResponseMapper.map(response);
    }

    @ApiBody({ type: UpdateProductDto, description: 'Update product data' })
    @ApiParam({ name: 'id', description: 'Product id' })
    @HttpCode(HttpStatus.OK)
    @Put('/update/:id')
    async update(
        @Param('id') id: string,
        @Body() product: UpdateProductDto,
    ): Promise<HttpResponse<Product>> {
        const response = await this.productService.update(id, product);
        return HttpResponseMapper.map(response);
    }

    @ApiParam({ name: 'id', description: 'Product id' })
    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete('/delete/:id')
    async delete(@Param('id') id: string): Promise<void> {
        await this.productService.delete(id);
    }

    @ApiQuery({ name: 'name', description: 'Product name' })
    @HttpCode(HttpStatus.OK)
    @Get('/search')
    async findByName(@Query('name') name: string): Promise<HttpResponse<Product>> {
        const response = await this.productService.findByName(name);
        return HttpResponseMapper.map(response);
    }

    @ApiQuery({ name: 'page', description: 'Page number' })
    @ApiQuery({ name: 'limit', description: 'Number of items per page' })
    @ApiParam({ name: 'category', required: true })
    @HttpCode(HttpStatus.OK)
    @Get('/category/:category')
    async findByCategory(
        @Param('category') category: ProductCategoryEnum,
        @Query() { page, limit }: ProductPaginationDto,
    ): Promise<HttpResponse<Product[]>> {
        const response = await this.productService.findByCategory(category, page, limit);
        return HttpResponseMapper.map(response);
    }

    @ApiQuery({ name: 'page', description: 'Page number' })
    @ApiQuery({ name: 'limit', description: 'Number of items per page' })
    @ApiParam({ name: 'brand', description: 'Product brand' })
    @HttpCode(HttpStatus.OK)
    @Get('/brand/:brand')
    async findByBrand(
        @Param('brand') brand: string,
        @Query() { page, limit }: ProductPaginationDto,
    ): Promise<HttpResponse<Product[]>> {
        const response = await this.productService.findByBrand(brand, page, limit);
        return HttpResponseMapper.map(response);
    }
}
