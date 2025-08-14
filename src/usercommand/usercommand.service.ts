import { Injectable } from '@nestjs/common';
import { CreateUsercommandDto } from './dto/create-usercommand.dto';
import { UpdateUsercommandDto } from './dto/update-usercommand.dto';

@Injectable()
export class UsercommandService {
  create(createUsercommandDto: CreateUsercommandDto) {
    return 'This action adds a new usercommand';
  }

  findAll() {
    return `This action returns all usercommand`;
  }

  findOne(id: number) {
    return `This action returns a #${id} usercommand`;
  }

  update(id: number, updateUsercommandDto: UpdateUsercommandDto) {
    return `This action updates a #${id} usercommand`;
  }

  remove(id: number) {
    return `This action removes a #${id} usercommand`;
  }
}
