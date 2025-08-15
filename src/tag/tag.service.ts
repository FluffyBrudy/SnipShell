import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from './entities/tag.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag) private readonly tagRespository: Repository<Tag>,
  ) {}

  async createMultiple(tags: string[]) {
    const insertedTags = await this.tagRespository
      .createQueryBuilder()
      .insert()
      .values(tags.map((name) => ({ name: name })))
      .orUpdate(['name'], ['name'])
      .returning('*')
      .execute();
    return insertedTags.raw as Tag[];
  }
}
