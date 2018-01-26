const express = require('express');
const router = express.Router();
const upload = require('./upload');

router.post('/upload', upload);

module.exports = router;