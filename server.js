const express = require('express');
const server = express();
const port = 3000;

server.use(express.json());

server.get('/', (req, res) => {
  res.send('Hello from Express + SQLite!');
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});