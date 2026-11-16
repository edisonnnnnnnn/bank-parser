const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const { parseStatement } = require('./parser');

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(express.static('.'));

app.post('/api/parse', upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF uploaded' });
    }
    const data = await pdfParse(req.file.buffer);
    const result = parseStatement(data.text);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
