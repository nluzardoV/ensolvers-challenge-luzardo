import { useState } from 'react';
import { useNotes } from './hooks/useNotes';
import { NoteCard } from './components/NoteCard';
import { NoteModal } from './components/NoteModal';
import { TagManager } from './components/TagManager';
import * as notesApi from './services/api';
import type { Note } from './services/api';
import './App.css';

export default function App() {
 const { activeNotes, archivedNotes, tags, loading, refetch } = useNotes();
  const [view, setView] = useState<'active' | 'archived'>('active');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [selectedTag, setSelectedTag] = useState<number | null>(null);
  const [showTagManager, setShowTagManager] = useState(false);

  const displayedNotes = (view === 'active' ? activeNotes : archivedNotes)
    .filter(note => selectedTag === null || note.tags.some(t => t.id === selectedTag));

  const handleArchive = async (id: number) => {
    try {
      await notesApi.toggleNoteArchive(id);
      await refetch();
    } catch (error) {
      console.error("Error al archivar:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar nota?')) return;
    await notesApi.deleteNote(id);
    refetch();
  };

  const handleEdit = (note: Note) => {
    setEditingNote(note);
    setModalOpen(true);
  };

  const handleNew = () => {
    setEditingNote(null);
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
    setEditingNote(null);
  };

  const handleSave = async () => {
    await refetch();
    handleClose();
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <div className="container">
      <header className="header">
        <h1>NoteFlow</h1>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={() => setShowTagManager(!showTagManager)} className="btn-secondary">
            🏷️ Etiquetas
          </button>
          <button onClick={handleNew} className="btn-primary">Nueva Nota</button>
        </div>
      </header>

      {}
      {showTagManager && (
        <TagManager tags={tags} onChanged={refetch} />
      )}

      <nav className="nav-tabs">
        <button className={view === 'active' ? 'active' : ''} onClick={() => { setView('active'); setSelectedTag(null); }}>Activas</button>
        <button className={view === 'archived' ? 'active' : ''} onClick={() => { setView('archived'); setSelectedTag(null); }}>Archivadas</button>
      </nav>

      <div className="filter-bar">
        <select
          value={selectedTag ?? ''}
          onChange={e => setSelectedTag(e.target.value ? Number(e.target.value) : null)}
        >
          <option value="">Todas las etiquetas</option>
          {tags.map(tag => (
            <option key={tag.id} value={tag.id}>{tag.name}</option>
          ))}
        </select>
      </div>

      <main className="notes-grid">
        {displayedNotes.map((note) => (
          <NoteCard
            key={note.id}
            note={note}
            onEdit={() => handleEdit(note)}
            onArchive={handleArchive}
            onDelete={() => handleDelete(note.id)}
          />
        ))}
      </main>

      {modalOpen && (
        <NoteModal
          note={editingNote ?? undefined}
          tags={tags || []}
          onClose={handleClose}
          onSave={handleSave}
        />
      )}
    </div>
  );
}