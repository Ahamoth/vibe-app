// Проверка авторизации
async function checkAuth() {
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (user) {
    currentUser = user;
    showApp();
  } else {
    showAuth();
  }
}

// Показать основное приложение
function showApp() {
  const authSection = document.querySelector('.auth-section');
  if (authSection) {
    authSection.style.display = 'none';
  }
  setTab('home');
}

// Регистрация
async function signUp() {
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;
  const username = document.getElementById('register-username').value;

  if (!email || !password || !username) {
    alert('Заполните все поля');
    return;
  }

  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
    options: {
      data: {
        username: username
      }
    }
  });

  if (error) {
    alert('Ошибка регистрации: ' + error.message);
  } else {
    alert('Регистрация успешна! Проверьте email для подтверждения.');
    showAuthTab('login');
  }
}

// Вход
async function signIn() {
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  if (!email || !password) {
    alert('Заполните все поля');
    return;
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password
  });

  if (error) {
    alert('Ошибка входа: ' + error.message);
  } else {
    currentUser = data.user;
    showApp();
  }
}

// Выход
async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (!error) {
    currentUser = null;
    showAuth();
  }
}