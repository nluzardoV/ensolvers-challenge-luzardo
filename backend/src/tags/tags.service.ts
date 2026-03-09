import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { TagsRepository } from './tags.repository';
import { CreateTagDto, UpdateTagDto } from './tag.dto';
import { Tag } from '../entities/tag.entity';

@Injectable()
export class TagsService {
  constructor(private readonly tagsRepository: TagsRepository) {}

  async findAll(): Promise<Tag[]> {
    return this.tagsRepository.findAll();
  }

  async findOne(id: number): Promise<Tag> {
    const tag = await this.tagsRepository.findOne(id);
    if (!tag) throw new NotFoundException(`Tag with ID ${id} not found`);
    return tag;
  }

  async create(dto: CreateTagDto): Promise<Tag> {
    const existing = await this.tagsRepository.findByName(dto.name);
    if (existing) throw new ConflictException(`Tag "${dto.name}" already exists`);
    return this.tagsRepository.create(dto.name, dto.color || '#6366f1');
  }

  async update(id: number, dto: UpdateTagDto): Promise<Tag> {
    const tag = await this.findOne(id);
    if (dto.name && dto.name !== tag.name) {
      const existing = await this.tagsRepository.findByName(dto.name);
      if (existing) throw new ConflictException(`Tag "${dto.name}" already exists`);
    }
    return this.tagsRepository.update(tag, dto.name, dto.color);
  }

  async delete(id: number): Promise<{ message: string }> {
    await this.findOne(id);
    await this.tagsRepository.delete(id);
    return { message: `Tag ${id} deleted successfully` };
  }
}