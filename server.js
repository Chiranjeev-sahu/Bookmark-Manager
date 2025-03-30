const express = require('express');
const app = express();
const port = 3000;

// In-memory "database"
let bookmarks = [
  { id: 1, title: "Google", url: "https://google.com" },
  { id: 2, title: "MDN Web Docs", url: "https://developer.mozilla.org" }
];

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Routes
// GET all bookmarks
app.get('/api/bookmarks', (req, res) => {
  res.json(bookmarks);
});

// GET single bookmark
app.get('/api/bookmarks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const bookmark = bookmarks.find(b => b.id === id);
  if (!bookmark) return res.status(404).json({ error: "Bookmark not found" });
  res.json(bookmark);
});

// POST new bookmark
app.post('/api/bookmarks', (req, res) => {
  const { title, url } = req.body;
  if (!title || !url) return res.status(400).json({ error: "Title and URL required!" });
  const newBookmark = { id: Date.now(), title, url };
  bookmarks.push(newBookmark);
  res.status(201).json(newBookmark);
});

// PUT update bookmark
app.put('/api/bookmarks/:id', (req, res) => { // <-- PUT ROUTE IS HERE!
  const id = parseInt(req.params.id);
  const { title, url } = req.body;
  const index = bookmarks.findIndex(b => b.id === id);
  if (index === -1) return res.status(404).json({ error: "Bookmark not found" });
  bookmarks[index] = { ...bookmarks[index], title, url };
  res.json(bookmarks[index]);
});

// DELETE bookmark
app.delete('/api/bookmarks/:id', (req, res) => { // <-- DELETE ROUTE IS HERE!
  const id = parseInt(req.params.id);
  bookmarks = bookmarks.filter(b => b.id !== id);
  res.sendStatus(204);
});

// Start server
app.listen(port, () => {
  console.log(`Server: http://localhost:${port}`);
});