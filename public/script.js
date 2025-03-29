let currentEditId = null;

// Load and display bookmarks
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

// Add new bookmark
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

// Edit bookmark (Bonus: Implement this yourself!)
function openEditForm(id) {
  // Challenge: Find the bookmark by ID, populate an edit form, and send a PUT request.
}

// Search (Bonus: Implement client-side filtering)
document.getElementById('search').addEventListener('input', (e) => {
  const searchTerm = e.target.value.toLowerCase();
  const bookmarks = document.querySelectorAll('.bookmark');
  bookmarks.forEach(bookmark => {
    const title = bookmark.querySelector('h3').textContent.toLowerCase();
    bookmark.style.display = title.includes(searchTerm) ? 'block' : 'none';
  });
});

// Initial load
loadBookmarks();