let currentEditId = null;

// Load bookmarks
async function loadBookmarks() {
  const response = await fetch('/api/bookmarks');
  const bookmarks = await response.json();
  const container = document.getElementById('bookmarks');
  
  container.innerHTML = bookmarks.map(bookmark => `
    <div class="bookmark" data-id="${bookmark.id}">
      <h3>${bookmark.title}</h3>
      <a href="${bookmark.url}" target="_blank">${bookmark.url}</a>
      <button onclick="deleteBookmark(${bookmark.id})">Delete</button>
      <button onclick="openEditForm(${bookmark.id})">Edit</button>
    </div>
  `).join('');
}

// Add bookmark
document.getElementById('addForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = document.getElementById('title').value;
  const url = document.getElementById('url').value;

  await fetch('/api/bookmarks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, url })
  });

  document.getElementById('addForm').reset();
  loadBookmarks();
});

// Delete bookmark
async function deleteBookmark(id) {
  await fetch(`/api/bookmarks/${id}`, { method: 'DELETE' });
  loadBookmarks();
}

// Edit bookmark
async function openEditForm(id) {
  // Fetch the existing bookmark data
  const response = await fetch(`/api/bookmarks/${id}`);
  const bookmark = await response.json();
  // Populate edit form
  document.getElementById('editTitle').value = bookmark.title; // <-- HERE'S editTitle!
  document.getElementById('editUrl').value = bookmark.url;     // <-- HERE'S editUrl!
  document.getElementById('editForm').style.display = 'block'; // Show form
  currentEditId = id;
}

// Handle edit form submission
document.getElementById('editForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = document.getElementById('editTitle').value;
  const url = document.getElementById('editUrl').value;

  await fetch(`/api/bookmarks/${currentEditId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, url })
  });

  document.getElementById('editForm').style.display = 'none';
  loadBookmarks();
});

// Cancel edit
document.getElementById('cancelEdit').addEventListener('click', () => {
  document.getElementById('editForm').style.display = 'none';
});

// Search
document.getElementById('search').addEventListener('input', (e) => {
  const searchTerm = e.target.value.toLowerCase();
  document.querySelectorAll('.bookmark').forEach(bookmark => {
    const title = bookmark.querySelector('h3').textContent.toLowerCase();
    bookmark.style.display = title.includes(searchTerm) ? 'block' : 'none';
  });
});

loadBookmarks();