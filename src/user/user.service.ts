import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    const user = this.userRepository.create(createUserDto);
    return await this.userRepository.save(user);
  }

  async findUserBy(
    uniqueIdentifier: Partial<Omit<User, 'password' | 'displayName' | 'role'>>,
  ) {
    if (uniqueIdentifier.email) {
      const user = await this.userRepository.findOneBy({
        email: uniqueIdentifier.email,
      });
      return user;
    } else if (uniqueIdentifier.id) {
      const user = await this.userRepository.findOneBy({
        id: uniqueIdentifier.id,
      });
      return user;
    }
  }
}
