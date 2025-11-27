// Проверка авторизации
async function checkAuth() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('Ошибка проверки авторизации:', error);
      showAuth();
      return;
    }
    
    if (user) {
      currentUser = user;
      showApp();
    } else {
      showAuth();
    }
  } catch (error) {
    console.error('Ошибка при проверке авторизации:', error);
    showAuth();
  }
}

// Показать основное приложение
function showApp() {
  const content = document.getElementById("content");
  if (content.innerHTML.includes('auth-section')) {
    content.innerHTML = '';
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

  if (password.length < 6) {
    alert('Пароль должен быть не менее 6 символов');
    return;
  }

  try {
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
      // Очищаем поля формы
      document.getElementById('register-email').value = '';
      document.getElementById('register-password').value = '';
      document.getElementById('register-username').value = '';
      showAuthTab('login');
    }
  } catch (error) {
    alert('Ошибка регистрации: ' + error.message);
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

  try {
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
  } catch (error) {
    alert('Ошибка входа: ' + error.message);
  }
}

// Выход
async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      alert('Ошибка выхода: ' + error.message);
    } else {
      currentUser = null;
      showAuth();
    }
  } catch (error) {
    console.error('Ошибка при выходе:', error);
  }
}
