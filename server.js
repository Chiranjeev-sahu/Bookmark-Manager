const express = require('express');
const app = express();
const port = 3000;

// In-memory "database"
let bookmarks = [
  { id: 1, title: "Google", url: "https://google.com" },
  { id: 2, title: "MDN Web Docs", url: "https://developer.mozilla.org" }
];

// Middleware to parse JSON
app.use(express.json());
// Serve static files (HTML/CSS/JS)
app.use(express.static('public'));

// Custom middleware to log requests (teach yourself middleware flow)
app.use((req, res, next) => {
  console.log(`${req.method} request to ${req.url}`);
  next();
});

// GET all bookmarks
app.get('/api/bookmarks', (req, res) => {
  res.json(bookmarks);
});

// POST a new bookmark
app.post('/api/bookmarks', (req, res) => {
  const { title, url } = req.body;
  if (!title || !url) {
    return res.status(400).json({ error: "Title and URL are required!" });
  }
  const newBookmark = { id: Date.now(), title, url };
  bookmarks.push(newBookmark);
  res.status(201).json(newBookmark); // 201 = Created
});

// PUT (update) a bookmark
app.put('/api/bookmarks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { title, url } = req.body;
  const index = bookmarks.findIndex(b => b.id === id);
  if (index === -1) return res.status(404).json({ error: "Bookmark not found" });
  bookmarks[index] = { ...bookmarks[index], title, url };
  res.json(bookmarks[index]);
});

// DELETE a bookmark
app.delete('/api/bookmarks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  bookmarks = bookmarks.filter(b => b.id !== id);
  res.sendStatus(204); // 204 = No Content
});

app.listen(port, () => {
  console.log(`Server: http://localhost:${port}`);
});