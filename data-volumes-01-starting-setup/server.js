const fs = require('fs').promises;
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static('public'));
app.use('/feedback', express.static('feedback'));

app.get('/', (req, res) => {
  const filePath = path.join(__dirname, 'pages', 'feedback.html');
  res.sendFile(filePath);
});

app.get('/exists', (req, res) => {
  const filePath = path.join(__dirname, 'pages', 'exists.html');
  res.sendFile(filePath);
});

app.post('/create', async (req, res) => {
  const title = req.body.title;
  const content = req.body.text;

  const adjTitle = title.toLowerCase().replace(/[^a-z0-9]/gi, '_'); // sanitize for Windows
  const feedbackDir = path.join(__dirname, 'feedback');
  const finalFilePath = path.join(feedbackDir, adjTitle + '.txt');
  const tempFilePath = path.join(feedbackDir, adjTitle + '.tmp');

  try {
    // Make sure feedback folder exists
    await fs.mkdir(feedbackDir, { recursive: true });

    // Check if final file already exists
    try {
      await fs.access(finalFilePath);
      // File exists
      return res.redirect('/exists');
    } catch (err) {
      // File does not exist
    }

    // Write temp file and move to final file
    await fs.writeFile(tempFilePath, content);
    await fs.rename(tempFilePath, finalFilePath);

    res.redirect('/');
  } catch (error) {
    console.error('Error writing file:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(80, () => {
  console.log('Server listening on port 80');
});
