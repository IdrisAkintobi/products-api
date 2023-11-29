import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../../db/repository/user.repository';
import { User } from '../../db/schemas/user.schema';
import { UpdateUserDto } from './dto/user.update.dto';

@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository) {}

    async update(id: string, user: UpdateUserDto): Promise<User> {
        const updatedUser = await this.userRepository.updateUser(id, user);
        if (!updatedUser) {
            throw new NotFoundException('User not found');
        }
        return updatedUser.toObject();
    }

    async delete(id: string): Promise<void> {
        const deletedUser = await this.userRepository.deleteUser(id);
        if (!deletedUser) {
            throw new NotFoundException('User not found');
        }
    }
}
