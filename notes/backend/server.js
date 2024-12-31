const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const path = require('path');
const noteRoutes = require('./routes/notes');  // Import notes routes

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));  // Increase the limit for JSON payloads
app.use(express.urlencoded({ limit: '50mb', extended: true }));  // Increase the limit for urlencoded payloads

// Cloudinary configuration
cloudinary.config({
  cloud_name: 'dsm1gfaxi',
  api_key: '617532353542267',
  api_secret: 'wCt5-GwJLjUyaFvl4MGxo5SxOKk',
});

// Set up multer for file handling
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Folder for local storage, or use cloudinary directly for cloud storage
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique file name
  }
});
const upload = multer({ storage: storage });

// Routes
app.use('/api/notes', noteRoutes);  // Use notes routes

// MongoDB connection
mongoose.connect('mongodb+srv://annu18092003:tZJ5coqAL2xTmrX3@notesappdb.pezem.mongodb.net/?retryWrites=true&w=majority&appName=NotesAppDb', {
  // Removed deprecated options
})
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch(err => {
    console.log('MongoDB connection error:', err);
  });

// Route to handle note creation with image upload
app.post('/api/notes/upload', upload.single('image'), (req, res) => {
  if (req.file) {
    cloudinary.uploader.upload(req.file.path, { tags: 'notes' })
      .then(result => {
        res.json({
          imageUrl: result.secure_url, // URL of the uploaded image
        });
      })
      .catch(err => {
        res.status(500).json({ message: 'Error uploading image', error: err });
      });
  } else {
    res.status(400).json({ message: 'No file uploaded' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
