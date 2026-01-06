const express = require('express');
const db = require('./db')
const server = express();
const port = 3000;

// This creates an Express application instance.
server.use(express.json());

// to check the connection is valid and the servers is responding to get request.
server.get('/', (req, res) => {
  res.send('Hello from Express + SQLite!');
});

server.get('/questions', (req, res) => {
  db.all('SELECT * FROM questions', (err, rows) => {
    if (err) {
      // If something goes wrong, send an error
      return res.status(500).json({ error: err.message });
    }
    // If successful, send the data
    res.json(rows);
  });
});

server.get('/db-test', (req, res) => {
  db.get("PRAGMA database_list;", (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ database_file: row.file });
  });
});


// questions
// - id
// - title
// - category
// - author_id
// - votes
// - created_at
server.post('/questions', (req, res) => {
  // Extract data from the request body
  const title = req.body.title;
  const category = req.body.category;
  const author_id = req.body.author_id;

  // Validate required fields
  if (!title || !author_id) {
    return res.status(400).json({ error: 'title and author_id are required' });
  }

  db.run(
  'INSERT INTO questions (title, category, author_id) VALUES (?, ?, ?)',
  [title, category, author_id],
  // callback function — it runs after the database finishes
  function(err) {
    if (err) {
      console.error('Database error:', err.message);
      return res.status(500).json({ error: 'Failed to create question' });
    }

    // Success! We'll handle this in Step 4
    // For now, just send a basic success response
    res.status(201).json({ message: 'Question created', id: this.lastID });
  }
);
});

// answers
// - id
// - question_id
// - author_id
// - text
// - votes
// - accepted
server.post('./answers', (req,res)=> {
  const question_id
  const author_id
  const text
  const votes
  const accepted
});




server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});