// /app/activity/markdown/page.jsx
'use client'

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import ReactMarkdown from 'react-markdown';

export default function MarkdownNotesPage() {
  const [notes, setNotes] = useState([]);
  const [noteContent, setNoteContent] = useState('');
  const [isPreview, setIsPreview] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState(null);

  // Fetch notes from Supabase
  const fetchNotes = async () => {
    const { data, error } = await supabase.from('markdown_notes').select('*').order('created_at', { ascending: false });
    if (!error) setNotes(data);
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleSaveNote = async () => {
    if (!noteContent.trim()) return;

    if (editingNoteId) {
      await supabase.from('markdown_notes').update({ content: noteContent }).eq('id', editingNoteId);
    } else {
      await supabase.from('markdown_notes').insert([{ content: noteContent }]);
    }

    setNoteContent('');
    setEditingNoteId(null);
    fetchNotes();
  };

  const handleEditNote = (note) => {
    setNoteContent(note.content);
    setEditingNoteId(note.id);
  };

  const handleDeleteNote = async (id) => {
    await supabase.from('markdown_notes').delete().eq('id', id);
    fetchNotes();
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Markdown Notes</h1>

      <div className="mb-4">
        <button
          onClick={() => setIsPreview(!isPreview)}
          className="mb-2 px-3 py-1 bg-purple-600 text-white rounded"
        >
          {isPreview ? 'Switch to Raw' : 'Switch to Preview'}
        </button>

        <textarea
          value={noteContent}
          onChange={(e) => setNoteContent(e.target.value)}
          className="w-full h-40 p-2 border rounded mb-2"
          placeholder="Write your note using Markdown..."
          style={{ display: isPreview ? 'none' : 'block' }}
        />

        {isPreview && (
          <div className="prose border p-2 rounded bg-white">
            <ReactMarkdown>{noteContent || '*Nothing to preview...*'}</ReactMarkdown>
          </div>
        )}

        <button
          onClick={handleSaveNote}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {editingNoteId ? 'Update Note' : 'Add Note'}
        </button>
      </div>

      <hr className="my-6" />

      <h2 className="text-xl font-semibold mb-2"> Your Notes</h2>
      <div className="space-y-4">
        {notes.map((note) => (
          <div key={note.id} className="p-4 border rounded bg-white shadow-sm">
            <div className="prose">
              <ReactMarkdown>{note.content}</ReactMarkdown>
            </div>
            <div className="mt-2 flex gap-2">
              <button onClick={() => handleEditNote(note)} className="text-blue-600 hover:underline">Edit</button>
              <button onClick={() => handleDeleteNote(note.id)} className="text-red-600 hover:underline">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
