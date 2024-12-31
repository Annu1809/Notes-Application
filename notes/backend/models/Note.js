const mongoose = require('mongoose');

// Define the Note schema
const noteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  image: { type: String }, // Field for storing image
  createdAt: { type: Date, default: Date.now },
});

// Create a Note model
const Note = mongoose.model('Note', noteSchema);

module.exports = Note;

