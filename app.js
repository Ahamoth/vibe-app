// Инициализация приложения
document.addEventListener('DOMContentLoaded', function() {
  initializeApp();
});

async function initializeApp() {
  // Проверяем авторизацию при загрузке
  await checkAuth();
  
  // Настраиваем обработчики вкладок
  setupTabHandlers();
}

function setupTabHandlers() {
  document.querySelectorAll(".tabs button").forEach(btn => {
    btn.onclick = () => setTab(btn.dataset.tab);
  });
}

function setTab(tab) {
  if (!currentUser && tab !== 'home') {
    showAuth();
    return;
  }

  const content = document.getElementById("content");

  if (tab === "home") {
    renderHome(content);
  } 
  else if (tab === "create") {
    renderCreate(content);
  }
  else if (tab === "search") {
    content.innerHTML = '<div class="card">Поиск пока недоступен</div>';
  }
  else if (tab === "chats") {
    content.innerHTML = '<div class="card">Чаты в разработке</div>';
  }
  else if (tab === "profile") {
    renderProfile(content);
  }
}

function showAuth() {
  const content = document.getElementById("content");
  content.innerHTML = `
    <div class="auth-section">
      <div class="auth-form">
        <div class="auth-tabs">
          <button class="auth-tab active" onclick="showAuthTab('login')">Вход</button>
          <button class="auth-tab" onclick="showAuthTab('register')">Регистрация</button>
        </div>
        <div id="auth-forms">
          <div id="login-form">
            <input class="input" id="login-email" placeholder="Email" type="email">
            <input class="input" id="login-password" placeholder="Пароль" type="password" style="margin-top: 10px;">
            <button class="btn" onclick="signIn()">Войти</button>
          </div>
          <div id="register-form" class="hidden">
            <input class="input" id="register-email" placeholder="Email" type="email">
            <input class="input" id="register-password" placeholder="Пароль" type="password" style="margin-top: 10px;">
            <input class="input" id="register-username" placeholder="Имя пользователя" style="margin-top: 10px;">
            <button class="btn" onclick="signUp()">Зарегистрироваться</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function showAuthTab(tab) {
  document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
  event.target.classList.add('active');
  
  document.getElementById('login-form').classList.toggle('hidden', tab !== 'login');
  document.getElementById('register-form').classList.toggle('hidden', tab !== 'register');
}

// Функция рендера профиля
function renderProfile(content) {
  if (!currentUser) {
    showAuth();
    return;
  }
  
  content.innerHTML = `
    <div class="card">
      <h3>Профиль</h3>
      <p><strong>Email:</strong> ${currentUser.email}</p>
      <p><strong>Имя пользователя:</strong> ${currentUser.user_metadata?.username || 'Не указано'}</p>
      <p><strong>ID:</strong> ${currentUser.id.substring(0, 8)}...</p>
      <button class="btn" onclick="signOut()" style="background: #ef4444;">Выйти</button>
    </div>
  `;
}

// Функция рендера создания вайба
function renderCreate(content) {
  content.innerHTML = `
    <div class="card">
      <textarea class="input" id="vibeText" placeholder="Какой у тебя вайб?"></textarea>
      <input class="input" id="emoji" placeholder="Эмодзи (например 😎)">
      <button class="btn" onclick="publishVibe()">Опубликовать</button>
    </div>
  `;
}
