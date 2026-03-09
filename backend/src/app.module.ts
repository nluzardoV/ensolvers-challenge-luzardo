import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotesModule } from './notes/notes.module';
import { TagsModule } from './tags/tags.module';
import { Note } from './entities/note.entity';
import { Tag } from './entities/tag.entity';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'notes.db',
      entities: [Note, Tag],
      synchronize: true,
      logging: false,
    }),
    NotesModule,
    TagsModule,
  ],
})
export class AppModule {}