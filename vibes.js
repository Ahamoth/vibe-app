// Рендер домашней страницы
async function renderHome(content) {
  content.innerHTML = '<div class="card">Загрузка вайбов...</div>';
  
  try {
    const vibes = await loadVibesFromSupabase();
    
    if (!vibes || vibes.length === 0) {
      content.innerHTML = '<div class="card">Пока нет вайбов. Нажми + чтобы создать первый!</div>';
      return;
    }

    // Создаем HTML для каждого вайба
    let vibesHTML = '';
    for (const vibe of vibes) {
      const likesCount = await getVibeLikesCount(vibe.id);
      const commentsCount = await getVibeCommentsCount(vibe.id);
      
      vibesHTML += `
        <div class="card" data-vibe-id="${vibe.id}">
          <div class="card-emoji">${vibe.emoji || '✨'}</div>
          <div>${vibe.text}</div>
          <small style="opacity:0.6;">@${vibe.username} • ${formatDate(vibe.created_at)}</small>
          <div class="vibe-actions">
            <button class="action-btn" onclick="toggleLike('${vibe.id}')" id="like-btn-${vibe.id}">
              🤍 ${likesCount}
            </button>
            <button class="action-btn" onclick="toggleComments('${vibe.id}')" id="comment-btn-${vibe.id}">
              💬 ${commentsCount}
            </button>
          </div>
        </div>
      `;
    }

    content.innerHTML = vibesHTML;

  } catch (error) {
    console.error('Error loading vibes:', error);
    content.innerHTML = '<div class="card">Ошибка загрузки. Проверьте подключение к интернету.</div>';
  }
}

// Загрузка вайбов из Supabase
async function loadVibesFromSupabase() {
  try {
    const { data: vibes, error } = await supabase
      .from('vibes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return vibes || [];
  } catch (error) {
    console.error('Ошибка загрузки вайбов:', error);
    throw error;
  }
}

// Публикация вайба
async function publishVibe() {
  if (!currentUser) {
    alert('Войдите чтобы публиковать вайбы');
    showAuth();
    return;
  }

  if (!supabase) {
    alert('Приложение не инициализировано');
    return;
  }

  const textElement = document.getElementById("vibeText");
  const emojiElement = document.getElementById("emoji");
  
  if (!textElement || !emojiElement) {
    console.error('Form elements not found');
    return;
  }

  const text = textElement.value.trim();
  const emoji = emojiElement.value.trim() || "✨";

  if (!text) {
    alert("Напишите текст вайба");
    return;
  }

  try {
    const { error } = await supabase
      .from('vibes')
      .insert([
        {
          user_id: currentUser.id,
          username: currentUser.user_metadata?.username || currentUser.email.split('@')[0],
          text: text,
          emoji: emoji
        }
      ]);

    if (error) throw error;

    // Очищаем форму
    textElement.value = '';
    emojiElement.value = '';
    
    // Переходим на ленту
    setTab("home");
    
  } catch (error) {
    console.error('Ошибка публикации:', error);
    alert('Ошибка публикации: ' + error.message);
  }
}

// Форматирование даты
function formatDate(dateString) {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    
    if (diffMins < 1) return 'только что';
    if (diffMins < 60) return `${diffMins} мин назад`;
    if (diffHours < 24) return `${diffHours} ч назад`;
    
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (e) {
    return 'недавно';
  }
}
