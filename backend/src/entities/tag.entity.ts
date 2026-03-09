import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Note } from './note.entity';
@Entity('tags')
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ default: '#6366f1' })
  color: string;

  @ManyToMany(() => Note, (note) => note.tags)
  notes: Note[];
}