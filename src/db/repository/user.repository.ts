import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../../db/schemas/user.schema';

@Injectable()
export class UserRepository {
    constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {}

    async createUser(user: User): Promise<UserDocument> {
        return await this.userModel.create(user);
    }

    async findByEmail(email: string): Promise<UserDocument> {
        return await this.userModel.findOne({ email }).exec();
    }

    async updateUser(id: string, user: Partial<User>): Promise<UserDocument> {
        return await this.userModel.findByIdAndUpdate(id, user, { new: true }).exec();
    }

    async deleteUser(id: string): Promise<User> {
        return this.userModel.findByIdAndDelete(id).exec();
    }
}
