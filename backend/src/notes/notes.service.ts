import { Injectable, NotFoundException } from '@nestjs/common';
import { NotesRepository } from './notes.repository';
import { CreateNoteDto, UpdateNoteDto } from '../entities/dto/note.dto';
import { Note } from '../entities/note.entity';
@Injectable()
export class NotesService {
  constructor(private readonly notesRepository: NotesRepository) {}

  async findAll(archived = false, tagId?: number): Promise<Note[]> {
    if (tagId) {
      return this.notesRepository.findAllByTag(tagId, archived);
    }
    return this.notesRepository.findAll(archived);
  }

  async findOne(id: number): Promise<Note> {
    const note = await this.notesRepository.findOne(id);
    if (!note) throw new NotFoundException(`Note with ID ${id} not found`);
    return note;
  }

  async create(dto: CreateNoteDto): Promise<Note> {
    return this.notesRepository.create(dto.title, dto.content || '', dto.tagIds || []);
  }

  async update(id: number, dto: UpdateNoteDto): Promise<Note> {
    const note = await this.findOne(id);
    return this.notesRepository.update(note, dto.title, dto.content, dto.tagIds);
  }

  async toggleArchive(id: number): Promise<Note> {
    const note = await this.findOne(id);
    return this.notesRepository.toggleArchive(note);
  }

  async delete(id: number): Promise<{ message: string }> {
    await this.findOne(id);
    await this.notesRepository.delete(id);
    return { message: `Note ${id} deleted successfully` };
  }
}