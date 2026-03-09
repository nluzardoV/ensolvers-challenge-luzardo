import { useState, useEffect, useCallback } from 'react';
import type { Note, Tag } from '../services/api';
import * as notesApi from '../services/api';

export function useNotes() {
  const [activeNotes, setActiveNotes] = useState<Note[]>([]);
  const [archivedNotes, setArchivedNotes] = useState<Note[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [allActive, allArchived, allTags] = await Promise.all([
        notesApi.getNotes(false),  
        notesApi.getNotes(true),   
        notesApi.getTags()
      ]);

      setActiveNotes(allActive);
      setArchivedNotes(allArchived);
      setTags(allTags);
    } catch (err) {
      setError('Error al conectar con el servidor. ¿Está corriendo el backend?');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    activeNotes,
    archivedNotes,
    tags,
    loading,
    error,
    refetch: fetchData
  };
}