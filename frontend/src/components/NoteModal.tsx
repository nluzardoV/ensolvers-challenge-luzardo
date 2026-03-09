import { useState } from 'react';
import * as notesApi from '../services/api';

interface Tag { id: number; name: string; color: string; }
interface Note {
  id: number;
  title: string;
  content: string;
  archived: boolean;
  tags: Tag[];
}

interface Props {
  note?: Note;
  tags: Tag[];
  onClose: () => void;
  onSave: () => void;
}

export function NoteModal({ note, tags, onClose, onSave }: Props) {
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>(
    note?.tags?.map(t => t.id) || []
  );

  const toggleTag = (id: number) => {
    setSelectedTagIds(prev =>
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    alert('Intentando guardar: ' + title);
    const data = { title, content, tagIds: selectedTagIds };
    try {
      if (note) {
        await notesApi.updateNote(note.id, data);
      } else {
        await notesApi.createNote(data);
      }
      alert('Guardado OK');
      onSave();
      onClose();
    } catch (err: any) {
      alert('Error: ' + JSON.stringify(err?.response?.data || err?.message));
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{note ? 'Editar Nota' : 'Nueva Nota'}</h2>
        <form onSubmit={handleSubmit}>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Título" required />
          <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Contenido..." required />

          {tags.length > 0 && (
            <div className="tag-selector">
              <p>Etiquetas:</p>
              <div className="tag-options">
                {tags.map(tag => (
                  <button
                    key={tag.id}
                    type="button"
                    className={selectedTagIds.includes(tag.id) ? 'tag-btn active' : 'tag-btn'}
                    style={{ borderColor: tag.color, color: selectedTagIds.includes(tag.id) ? '#fff' : tag.color, backgroundColor: selectedTagIds.includes(tag.id) ? tag.color : 'transparent' }}
                    onClick={() => toggleTag(tag.id)}
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="modal-actions">
            <button type="button" onClick={onClose}>Cancelar</button>
            <button type="button" className="btn-primary" onClick={handleSubmit}>Guardar</button>
          </div>
        </form>
      </div>
    </div>
  );
}