const express = require('express');
const db = require('./db')
const server = express();
// When someone visits http://localhost:3000/, Express will look for public/index.html and send it automatically.
server.use(express.static('public'));
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


// TABLES - ONE
// questions
// - id          AUTOMATIC
// - title       REQ 
// - category    REQ
// - author_id   REQ
// - votes       DEFAULT = 0
// - created_at  AUTOMATIC TIMESTAMP

server.post('/questions', (req, res) => {
  // Extract data from the request body
  const title = req.body.title;
  const category = req.body.category;
  const author_id = req.body.author_id;

  // Validate required fields
  if (!title || !author_id || !category) {
    return res.status(400).json({ error: 'title, category and author_id are required' });
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


// TABLE - TWO
// answers
// - id             AUTOMATIC
// - question_id    REQ
// - author_id      AUTOMATIC
// - text           REQ
// - votes          DEFAULT = 0
// - accepted       DEFAULT = 0

server.post('/answers', (req,res)=> {
  const question_id = req.body.question_id
  const author_id = req.body.author_id
  const text = req.body.text

  if (!question_id || !author_id || !text)
    return res.status(400).json({ error: 'title, category and author_id are required' });

  db.run(
    'insert into answers(question_id,author_id,text) values (?,?,?)',
    [question_id,author_id,text],
    function(err) {
    if (err) {
      console.error('Database error:', err.message);
      return res.status(500).json({ error: 'Failed to create answer' });
    }
    // Success! We'll handle this in Step 4
    // For now, just send a basic success response
    res.status(201).json({ message: 'answer created', id: this.lastID });
  }

  )
});

server.get('/questions/:id', (req, res) => {
  const questionId = req.params.id;

  // Ensure it's a valid integer
  if (!questionId || isNaN(questionId)) {
    return res.status(400).json({ error: 'Valid question ID is required' });
  }

  // Fetch the question
  db.get('SELECT * FROM questions WHERE id = ?', [questionId], (err, question) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    // Fetch answers for this question
    db.all('SELECT * FROM answers WHERE question_id = ?', [questionId], (err, answers) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      // Combine question and answers into one response
      res.json({ ...question, answers });
    });
  });
});


server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});