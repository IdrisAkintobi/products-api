import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductRepository } from './repository/product.repository';
import { UserRepository } from './repository/user.repository';
import { Product, ProductSchema } from './schemas/product.schema';
import { User, UserSchema } from './schemas/user.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Product.name, schema: ProductSchema },
            { name: User.name, schema: UserSchema },
        ]),
    ],
    providers: [UserRepository, ProductRepository],
    exports: [UserRepository, ProductRepository],
})
export class DBModule {}
