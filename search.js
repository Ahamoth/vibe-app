// Система поиска
let searchTimeout;

function renderSearch(content) {
  content.innerHTML = `
    <div class="search-header">
      <input 
        type="text" 
        class="input" 
        id="search-input" 
        placeholder="Поиск по вайбам и пользователям..."
        oninput="handleSearchInput()"
      >
    </div>
    <div id="search-results" class="search-results">
      <div class="card">Введите поисковый запрос...</div>
    </div>
  `;
}

async function handleSearchInput() {
  clearTimeout(searchTimeout);
  const searchInput = document.getElementById('search-input');
  const query = searchInput.value.trim();

  if (query.length < 2) {
    document.getElementById('search-results').innerHTML = '<div class="card">Введите минимум 2 символа...</div>';
    return;
  }

  searchTimeout = setTimeout(() => performSearch(query), 500);
}

async function performSearch(query) {
  const resultsContainer = document.getElementById('search-results');
  resultsContainer.innerHTML = '<div class="card">Поиск...</div>';

  try {
    // Ищем по тексту вайбов
    const { data: vibes, error: vibesError } = await supabase
      .from('vibes')
      .select('*')
      .or(`text.ilike.%${query}%,emoji.ilike.%${query}%,username.ilike.%${query}%`)
      .order('created_at', { ascending: false });

    if (vibesError) throw vibesError;

    if (vibes.length === 0) {
      resultsContainer.innerHTML = '<div class="card">Ничего не найдено</div>';
      return;
    }

    // Создаем HTML для результатов поиска
    let resultsHTML = '';
    for (const vibe of vibes) {
      const likesCount = await getVibeLikesCount(vibe.id);
      const commentsCount = await getVibeCommentsCount(vibe.id);
      
      resultsHTML += `
        <div class="card" data-vibe-id="${vibe.id}">
          <div class="card-emoji">${vibe.emoji || '✨'}</div>
          <div>${highlightText(vibe.text, query)}</div>
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

    resultsContainer.innerHTML = resultsHTML;

    // Обновляем кнопки лайков
    for (const vibe of vibes) {
      await refreshVibeLikes(vibe.id);
    }

  } catch (error) {
    console.error('Ошибка поиска:', error);
    resultsContainer.innerHTML = '<div class="card">Ошибка при поиске</div>';
  }
}

function highlightText(text, query) {
  if (!query) return text;
  const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
  return text.replace(regex, '<mark style="background: #8b5cf6; color: white;">$1</mark>');
}

function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
