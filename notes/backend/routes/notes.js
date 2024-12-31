// POST route for creating a new note
const express = require('express');
const router = express.Router(); // Initialize router

const Note = require('../models/Note');

// POST route for creating a new note
router.post('/', (req, res) => {
  const { title, content, image } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }

  const newNote = new Note({
    title,
    content,
    image, // Include the image field
  });

  newNote.save()
    .then(note => {
      res.status(201).json(note);
    })
    .catch(err => {
      res.status(500).json({ error: 'Error saving note' });
    });
});


router.delete('/:id', async (req, res) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);
    if (!note) {
      return res.status(404).send('Note not found');
    }
    res.status(200).send('Note deleted');
  } catch (err) {
    res.status(500).send('Error deleting note');
  }
});

router.put('/:id', async (req, res) => {
  const { title, content, image } = req.body;
  
  try {
    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id, 
      { title, content, image }, // Include the image field
      { new: true }
    );
    if (!updatedNote) {
      return res.status(404).send('Note not found');
    }
    res.status(200).json(updatedNote);
  } catch (err) {
    res.status(500).send('Error updating note');
  }
});

router.get('/', async (req, res) => {
  try {
    const notes = await Note.find(); // Fetch all notes from the database
    res.status(200).json(notes);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching notes' });
  }
});



// Export the router to be used in server.js
module.exports = router;
