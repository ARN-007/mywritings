const postsDiv = document.getElementById("posts");
const titleInput = document.getElementById("titleInput");
const contentInput = document.getElementById("contentInput");
const newPostBtn = document.getElementById("newPostBtn");
const deleteModal = document.getElementById("deleteModal");
let posts = JSON.parse(localStorage.getItem("posts")) || [];
let editIndex = null;
let deleteIndex = null;

const postForm = document.getElementById("postForm");
const themeToggle = document.getElementById("themeToggle");

document.body.dataset.theme = localStorage.getItem("theme") || "dark";

themeToggle.onclick = () => {
  const t = document.body.dataset.theme === "dark" ? "love" : "dark";
  document.body.dataset.theme = t;
  localStorage.setItem("theme", t);
};

newPostBtn.onclick = () => {
  postForm.classList.toggle("show");
  setTimeout(() => titleInput.focus(), 200);
};

function savePost() {
  if (!titleInput.value || !contentInput.value) return;

  const isEdit = editIndex !== null;

  if (isEdit) {
    posts[editIndex].title = titleInput.value;
    posts[editIndex].content = contentInput.value;
    editIndex = null;
  } else {
    posts.unshift({
      title: titleInput.value,
      content: contentInput.value,
      comments: []
    });
  }

  titleInput.value = "";
  contentInput.value = "";
  postForm.classList.remove("show");

  save();
  showToast(isEdit ? "Post updated" : "Post saved");
}



function renderPosts() {
  if (posts.length === 0) {
  postsDiv.innerHTML = `<p style="text-align:center; opacity:0.6;">
    No posts yet. Click “New Post” to start writing ✍️
  </p>`;
  return;
}

  postsDiv.innerHTML = "";
  posts.forEach((p, i) => {
    postsDiv.innerHTML += `
    <div class="post" data-index="${i}">
      <h3>${p.title}</h3>
      <p>${p.content}</p>

     <div class="actions">        
        <button class="edit" onclick="editPost(${i})">✏️ Edit</button>
        <button class="delete" onclick="deletePost(${i})">🗑 Delete</button>
      </div>


      <input placeholder="Comment..." onkeydown="if(event.key==='Enter') comment(${i},this.value)">
     ${p.comments.map(c => `
  <div class="comment">
    ${c.text}
    <div class="reply">
      ${c.replies.map(r => `<div>↳ ${r}</div>`).join("")}
      <input placeholder="Reply..."
        onkeydown="if(event.key==='Enter') reply(${i}, ${c.id}, this.value)">
    </div>
  </div>
`).join("")}

    </div>`;
  });
}


function comment(i, text) {
  if (!text.trim()) return;

  posts[i].comments.push({
    id: Date.now(),   // ✅ unique comment id
    text,
    replies: []
  });

  save();
}


function reply(i, commentId, replyText) {
  if (!replyText.trim()) return;

  const c = posts[i].comments.find(c => c.id === commentId);
  if (c) c.replies.push(replyText);

  save();
}


function save() {
  localStorage.setItem("posts", JSON.stringify(posts));
  renderPosts();
}

renderPosts();

function editPost(i) {
  titleInput.value = posts[i].title;
  contentInput.value = posts[i].content;
  editIndex = i;

  postForm.classList.add("show");
  titleInput.focus();

  const postEl = document.querySelector(`.post[data-index="${i}"]`);
  postEl.classList.add("editing");

  setTimeout(() => postEl.classList.remove("editing"), 600);
}


function deletePost(i) {
  deleteIndex = i;
  deleteModal.classList.add("show");
}


function cancelPost() {
  titleInput.value = "";
  contentInput.value = "";
  editIndex = null;
  postForm.classList.remove("show");
}

function closeDeleteModal() {
  deleteIndex = null;
  deleteModal.classList.remove("show");
}

function confirmDelete() {
  if (deleteIndex === null) return;

  const postEl = document.querySelector(
    `.post[data-index="${deleteIndex}"]`
  );

  postEl.classList.add("removing");

  setTimeout(() => {
    posts.splice(deleteIndex, 1);
    deleteIndex = null;
    deleteModal.classList.remove("show");
    save();
    showToast("Post deleted");
  }, 350);
}

const toast = document.getElementById("toast");

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2000);
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeDeleteModal();
    cancelPost();
  }
});

deleteModal.addEventListener("click", (e) => {
  if (e.target === deleteModal) closeDeleteModal();
});
