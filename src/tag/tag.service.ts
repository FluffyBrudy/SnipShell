import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from './entities/tag.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag) private readonly tagRespository: Repository<Tag>,
  ) {}

  async createMultiple(tags: string[], selectUserCommand?: false) {
    const otherSelectable = selectUserCommand ? ['userCommands'] : [];
    const insertedTags = await this.tagRespository
      .createQueryBuilder()
      .select(['id', 'name', ...otherSelectable])
      .insert()
      .values(tags.map((name) => ({ name: name })))
      .orUpdate(['name'], ['name'])
      .returning(['id', 'name', ...otherSelectable])
      .execute();
    return insertedTags.raw as Tag[];
  }

  async findManyByIds(ids: Array<Tag['id']>) {
    const tags = await this.tagRespository.findBy({ id: In(ids) });
    return tags;
  }
}
