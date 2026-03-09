import axios from 'axios';

export interface Tag { id: number; name: string; color: string; }

export interface Note {
  id: number;
  title: string;
  content: string;
  archived: boolean;
  tags: Tag[];
  createdAt: string;
  updatedAt: string;
}

const api = axios.create({ baseURL: 'http://192.168.50.236:3000/api' });

export const getNotes = (archived = false) =>
  api.get<Note[]>('/notes', { params: { archived, _t: Date.now() } }).then(res => res.data);

export const createNote = (data: any) => api.post<Note>('/notes', data).then(res => res.data);
export const updateNote = (id: number, data: any) => api.put<Note>(`/notes/${id}`, data).then(res => res.data);
export const deleteNote = (id: number) => api.delete(`/notes/${id}`).then(res => res.data);
export const toggleNoteArchive = (id: number) => api.patch<Note>(`/notes/${id}/archive`).then(res => res.data);
export const getTags = () => api.get<Tag[]>('/tags').then(res => res.data);

export default api;