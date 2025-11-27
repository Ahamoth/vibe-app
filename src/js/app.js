// Конфигурация Supabase
const SUPABASE_URL = 'https://fureiffcxnqgoiejukmm.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ1cmVpZmZjeG5xZ29pZWp1a21tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQyNjExNzgsImV4cCI6MjA3OTgzNzE3OH0.nT_mulmlukW3twj7-nmoILWQ8_AvbRpidhsWO5FpSHY';

// Инициализация Supabase клиента
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Основное состояние приложения
let currentUser = null;

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
  document.querySelector(`.auth-tab[onclick="showAuthTab('${tab}')"]`).classList.add('active');
  
  document.getElementById('login-form').classList.toggle('hidden', tab !== 'login');
  document.getElementById('register-form').classList.toggle('hidden', tab !== 'register');
}