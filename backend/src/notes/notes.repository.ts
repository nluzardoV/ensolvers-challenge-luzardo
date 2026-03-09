import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Note } from '../entities/note.entity';
import { Tag } from '../entities/tag.entity';
@Injectable()
export class NotesRepository {
  constructor(
    @InjectRepository(Note)
    private readonly noteRepo: Repository<Note>,
    @InjectRepository(Tag)
    private readonly tagRepo: Repository<Tag>,
  ) {}

  async findAll(archived: boolean): Promise<Note[]> {
    return this.noteRepo.find({
      where: { archived },
      order: { updatedAt: 'DESC' },
    });
  }

  async findAllByTag(tagId: number, archived: boolean): Promise<Note[]> {
    return this.noteRepo
      .createQueryBuilder('note')
      .innerJoinAndSelect('note.tags', 'tag')
      .where('note.archived = :archived', { archived })
      .andWhere('tag.id = :tagId', { tagId })
      .orderBy('note.updatedAt', 'DESC')
      .getMany();
  }

  async findOne(id: number): Promise<Note | null> {
    return this.noteRepo.findOne({ where: { id } });
  }

  async create(title: string, content: string, tagIds: number[]): Promise<Note> {
    const tags = tagIds?.length ? await this.tagRepo.findBy({ id: In(tagIds) }) : [];
    const note = this.noteRepo.create({ title, content, tags });
    return this.noteRepo.save(note);
  }

  async update(note: Note, title: string, content: string, tagIds: number[]): Promise<Note> {
    if (title !== undefined) note.title = title;
    if (content !== undefined) note.content = content;
    if (tagIds !== undefined) {
      note.tags = tagIds.length ? await this.tagRepo.findBy({ id: In(tagIds) }) : [];
    }
    return this.noteRepo.save(note);
  }

  async toggleArchive(note: Note): Promise<Note> {
    note.archived = !note.archived;
    return this.noteRepo.save(note);
  }

  async delete(id: number): Promise<void> {
    await this.noteRepo.delete(id);
  }
}