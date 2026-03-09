import type { Note } from '../services/api';
interface Props {
  note: Note;
  onEdit: (note: Note) => void;
  onArchive: (id: number) => void;
  onDelete: (id: number) => void;
}

export function NoteCard({ note, onEdit, onArchive, onDelete }: Props) {
  const preview = note.content?.slice(0, 120) || '';

  return (
    <div className="note-card" onClick={() => onEdit(note)}>
      <div className="note-header">
        <h3 className="note-title">{note.title}</h3>
        <div className="note-actions" onClick={(e) => e.stopPropagation()}>
          <button className="btn-icon" title="Editar" onClick={() => onEdit(note)}>✏️</button>
          <button 
  className="btn-icon" 
  title={note.archived ? 'Desarchivar' : 'Archivar'}
  onClick={(e) => {
    e.stopPropagation();
    onArchive(note.id);
  }}
>
  {note.archived ? '📥' : '📦'} 
</button>
          <button className="btn-icon btn-danger" title="Eliminar" onClick={() => onDelete(note.id)}>🗑️</button>
        </div>
      </div>

      {preview && <p className="note-preview">{preview}{note.content.length > 120 ? '…' : ''}</p>}

      {note.tags?.length > 0 && (
        <div className="note-tags">
          {note.tags.map((tag) => (
            <span key={tag.id} className="tag-chip" style={{ backgroundColor: tag.color + '22', color: tag.color, borderColor: tag.color + '55' }}>
              {tag.name}
            </span>
          ))}
        </div>
      )}

      <div className="note-date">
        {new Date(note.updatedAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
      </div>
    </div>
  );
}