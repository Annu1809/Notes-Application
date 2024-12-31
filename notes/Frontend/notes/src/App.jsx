import { useState, useEffect } from 'react';
import './App.css';
import Button from './Button';
import axios from 'axios';

function App() {
  const [notes, setNotes] = useState([]); // To store notes
  const [title, setTitle] = useState(''); // To capture title text
  const [content, setContent] = useState(''); // To capture content text
  const [image, setImage] = useState(''); // To capture image
  const [isEditing, setIsEditing] = useState(null); // Track index of note being edited
  const [editTitle, setEditTitle] = useState(''); // Store title for editing
  const [editContent, setEditContent] = useState(''); // Store content for editing
  const [editImage, setEditImage] = useState(''); // Store image for editing

  useEffect(() => {
    // Fetch notes from backend on component mount
    axios.get('http://localhost:5000/api/notes')
      .then(response => {
        setNotes(response.data);
      })
      .catch(err => {
        console.error('Error fetching notes:', err);
      });
  }, []);

  const handleCreate = () => {
    if (title.trim() && content.trim()) {
      axios.post('http://localhost:5000/api/notes', { title, content, image })
        .then(response => {
          setNotes([...notes, response.data]);
          setTitle('');
          setContent('');
          setImage(''); // Clear the image field after creating the note
        })
        .catch(err => {
          console.error('Error creating note:', err);
        });
    }
  };

  const handleDelete = (id) => {
    console.log('Deleting note with ID:', id); // Check the ID being passed
    axios.delete(`http://localhost:5000/api/notes/${id}`)
      .then(() => {
        // Filter out the note from the state after deleting
        setNotes(notes.filter(note => note._id !== id));
      })
      .catch(err => {
        console.error('Error deleting note:', err);
      });
  };

  const handleEdit = (id) => {
    setIsEditing(id);
    const noteToEdit = notes.find(note => note._id === id);
    setEditTitle(noteToEdit.title);
    setEditContent(noteToEdit.content);
    setEditImage(noteToEdit.image); // Set the image for editing
  };

  const saveEdit = (id) => {
    axios.put(`http://localhost:5000/api/notes/${id}`, { title: editTitle, content: editContent, image: editImage })
      .then(response => {
        // Update the frontend state with the updated note
        setNotes(notes.map(note => (note._id === id ? response.data : note)));
        setIsEditing(null); // Close the edit mode
      })
      .catch(err => {
        console.error('Error saving edit:', err);
      });
  };

  const handleImageUpload = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result); // For new notes (create) or set image for editing
    };
    reader.readAsDataURL(file);
  };

  const handleImageEdit = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setEditImage(reader.result); // Set image for editing
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="bg-gradient-to-r from-orange-300 to-rose-300 h-auto p-4">
      <div className="flex justify-center border-4 outline-double rounded-md ">
        <h1 className="p-6 text-xl font-bold">NOTES : Pin Your Thoughts Here</h1>
      </div>

      {/* Input Section */}
      <div className="mb-6 m-3">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="border-2 rounded-md p-2 w-full mb-2"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Content"
          className="border-2 rounded-md p-2 w-full mb-2"
        />
        {/* Image upload input */}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleImageUpload(e.target.files[0])}
          className="border-2 rounded-md p-2 w-full mb-2"
        />
        <div className='flex gap-6'>
          <Button b1="Create Note" onClick={handleCreate} />
          {/* <Button b1="Attach image" onClick={handleCreate} /> */}
        </div>
        
      </div>

      {/* Notes List */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {notes.map(note => (
          <div key={note._id} className="bg-yellow-200 p-4 rounded-md shadow-lg shadow-black border border-yellow-400 overflow-hidden break-words">
            {isEditing === note._id ? (
              <div>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="border-2 rounded-md p-2 w-full mb-2"
                />
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="border-2 rounded-md p-2 w-full mb-2"
                />
                {/* Image upload input for editing */}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageEdit(e.target.files[0])}
                  className="border-2 rounded-md p-2 w-full mb-2"
                />
                <div className="flex justify-end space-x-2 mt-2">
                  <Button b1="Save" onClick={() => saveEdit(note._id)} />
                  <Button b1="Cancel" onClick={() => setIsEditing(null)} />
                </div>
              </div>
            ) : (
              <>
                <h3 className="text-lg font-bold">{note.title}</h3>
                <p className="text-sm break-words">{note.content}</p>
                {note.image && <img src={note.image} alt="Note" className="w-full h-32 object-cover rounded-md mb-2" />}
                <div className="flex justify-end space-x-2 mt-4">
                  <Button b1="Edit" onClick={() => handleEdit(note._id)} />
                  <Button b1="Delete" onClick={() => handleDelete(note._id)} />
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
