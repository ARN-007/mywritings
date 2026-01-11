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

  if (editIndex !== null) {
    // EDIT MODE
    posts[editIndex].title = titleInput.value;
    posts[editIndex].content = contentInput.value;
    editIndex = null;
  } else {
    // NEW POST
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
}


function renderPosts() {
  postsDiv.innerHTML = "";
  posts.forEach((p, i) => {
    postsDiv.innerHTML += `
    <div class="post">
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
              onkeydown="if(event.key==='Enter') reply(${i},'${c.text}',this.value)">
          </div>
        </div>
      `).join("")}
    </div>`;
  });
}


function comment(i, text) {
  if (!text) return;
  posts[i].comments.push({ text, replies: [] });
  save();
}

function reply(i, commentText, replyText) {
  const c = posts[i].comments.find(c => c.text === commentText);
  if (c && replyText) c.replies.push(replyText);
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
  posts.splice(deleteIndex, 1);
  deleteIndex = null;
  deleteModal.classList.remove("show");
  save();
}
