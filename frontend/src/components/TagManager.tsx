import { useState } from 'react';
import type { Tag } from '../services/api';
import api from '../services/api';

const PRESET_COLORS = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#8b5cf6', '#14b8a6'];

interface Props {
  tags: Tag[];
  onChanged: () => void;
}

export function TagManager({ tags, onChanged }: Props) {
  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState(PRESET_COLORS[0]);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  const handleCreate = async () => {
    if (!newName.trim()) { setError('Nombre requerido'); return; }
    setCreating(true);
    setError('');
    try {
     
      await api.post('/tags', { name: newName.trim(), color: newColor });
      setNewName('');
      onChanged();
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Error al crear etiqueta');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar esta etiqueta?')) return;
    await api.delete(`/tags/${id}`);
    onChanged();
  };

  return (
    <div className="tag-manager">
      <h3>Gestionar Etiquetas</h3>
      <div className="tag-form">
        <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Nueva etiqueta..." />
        <div className="color-picker">
          {PRESET_COLORS.map(c => (
            <button key={c} onClick={() => setNewColor(c)} style={{ backgroundColor: c, border: newColor === c ? '2px solid black' : 'none' }} />
          ))}
        </div>
        <button onClick={handleCreate} disabled={creating}>Añadir</button>
      </div>
      {error && <p className="error">{error}</p>}
      <div className="tag-list">
        {tags.map(tag => (
          <div key={tag.id} className="tag-item" style={{ backgroundColor: tag.color }}>
            {tag.name}
            <button onClick={() => handleDelete(tag.id)}>×</button>
          </div>
        ))}
      </div>
    </div>
  );
}