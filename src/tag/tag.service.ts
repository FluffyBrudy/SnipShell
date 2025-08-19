import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from './entities/tag.entity';
import { In, Repository } from 'typeorm';

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

  async findManyByIds(ids: Array<Tag['id']>) {
    const tags = await this.tagRespository.findBy({ id: In(ids) });
    return tags;
  }
}
