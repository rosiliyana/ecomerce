const express = require('express');
const multer = require('multer');
const { uploadFile } = require('../controllers/FileController');

// Middleware untuk upload file dengan multer
const upload = multer({ dest: 'uploads/' }); // Folder sementara disever

const router = express.Router();

router.post('/upload', upload.single('file'), uploadFile);

module.exports = router;