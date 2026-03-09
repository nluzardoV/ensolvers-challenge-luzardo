import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from '../entities/tag.entity';

@Injectable()
export class TagsRepository {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepo: Repository<Tag>,
  ) {}

  async findAll(): Promise<Tag[]> {
    return this.tagRepo.find({ order: { name: 'ASC' } });
  }

  async findOne(id: number): Promise<Tag | null> {
    return this.tagRepo.findOne({ where: { id } });
  }

  async findByName(name: string): Promise<Tag | null> {
    return this.tagRepo.findOne({ where: { name } });
  }

  async create(name: string, color: string): Promise<Tag> {
    const tag = this.tagRepo.create({ name, color });
    return this.tagRepo.save(tag);
  }

  async update(tag: Tag, name?: string, color?: string): Promise<Tag> {
    if (name !== undefined) tag.name = name;
    if (color !== undefined) tag.color = color;
    return this.tagRepo.save(tag);
  }

  async delete(id: number): Promise<void> {
    await this.tagRepo.delete(id);
  }
}