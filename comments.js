
let openCommentsVibeId = null;

async function toggleComments(vibeId) {
  const commentsSection = document.getElementById(`comments-${vibeId}`);
  
  if (commentsSection) {
    if (commentsSection.style.display === 'block') {
      commentsSection.style.display = 'none';
      openCommentsVibeId = null;
    } else {
      // Скрываем другие открытые комментарии
      document.querySelectorAll('.comments-section').forEach(section => {
        section.style.display = 'none';
      });
      
      commentsSection.style.display = 'block';
      openCommentsVibeId = vibeId;
      await loadComments(vibeId);
    }
  } else {
    await showComments(vibeId);
  }
}

async function showComments(vibeId) {

  const vibeElement = document.querySelector(`[data-vibe-id="${vibeId}"]`);
  if (!vibeElement) return;


  document.querySelectorAll('.comments-section').forEach(section => {
    section.style.display = 'none';
  });

  const commentsSection = document.createElement('div');
  commentsSection.id = `comments-${vibeId}`;
  commentsSection.className = 'comments-section';
  commentsSection.style.display = 'block';
  
  commentsSection.innerHTML = `
    <div class="add-comment">
      <input type="text" id="comment-input-${vibeId}" placeholder="Напишите комментарий...">
      <button class="btn btn-small" onclick="addComment('${vibeId}')">Отправить</button>
    </div>
    <div id="comments-list-${vibeId}" class="comments-list">
      <div style="text-align: center; padding: 10px; opacity: 0.7;">Загрузка комментариев...</div>
    </div>
  `;

  vibeElement.appendChild(commentsSection);
  openCommentsVibeId = vibeId;
  

  await loadComments(vibeId);
  

  const commentInput = document.getElementById(`comment-input-${vibeId}`);
  if (commentInput) commentInput.focus();
}

async function loadComments(vibeId) {
  const commentsList = document.getElementById(`comments-list-${vibeId}`);
  if (!commentsList) return;

  try {
    const { data: comments, error } = await supabase
      .from('comments')
      .select('*')
      .eq('vibe_id', vibeId)
      .order('created_at', { ascending: true });

    if (error) throw error;

    if (!comments || comments.length === 0) {
      commentsList.innerHTML = '<div style="text-align: center; padding: 20px; opacity: 0.7;">Пока нет комментариев</div>';
      return;
    }

    commentsList.innerHTML = comments.map(comment => `
      <div class="comment">
        <div class="comment-header">
          <strong>${comment.username}</strong> • ${formatDate(comment.created_at)}
        </div>
        <div>${comment.text}</div>
      </div>
    `).join('');


    commentsList.scrollTop = commentsList.scrollHeight;
  } catch (error) {
    console.error('Ошибка загрузки комментариев:', error);
    commentsList.innerHTML = '<div style="text-align: center; padding: 20px; color: #ef4444;">Ошибка загрузки комментариев</div>';
  }
}

async function addComment(vibeId) {
  if (!currentUser) {
    alert('Войдите чтобы комментировать');
    showAuth();
    return;
  }

  const commentInput = document.getElementById(`comment-input-${vibeId}`);
  if (!commentInput) return;

  const text = commentInput.value.trim();

  if (!text) {
    alert('Введите текст комментария');
    return;
  }

  try {
    const { error } = await supabase
      .from('comments')
      .insert([
        {
          vibe_id: vibeId,
          user_id: currentUser.id,
          username: currentUser.user_metadata?.username || currentUser.email.split('@')[0],
          text: text
        }
      ]);

    if (error) throw error;


    commentInput.value = '';
    

    await loadComments(vibeId);
    

    await refreshVibeCommentsCount(vibeId);
  } catch (error) {
    console.error('Ошибка добавления комментария:', error);
    alert('Ошибка при добавлении комментария');
  }
}

async function refreshVibeCommentsCount(vibeId) {
  try {
    const { count, error } = await supabase
      .from('comments')
      .select('*', { count: 'exact', head: true })
      .eq('vibe_id', vibeId);

    if (error) throw error;

    const commentBtn = document.querySelector(`[onclick="toggleComments('${vibeId}')"]`);
    if (commentBtn) {
      commentBtn.innerHTML = `💬 ${count || 0}`;
    }
  } catch (error) {
    console.error('Ошибка обновления счетчика комментариев:', error);
  }
}

async function getVibeCommentsCount(vibeId) {
  try {
    const { count, error } = await supabase
      .from('comments')
      .select('*', { count: 'exact', head: true })
      .eq('vibe_id', vibeId);
    
    if (error) throw error;
    return count || 0;
  } catch (error) {
    console.error('Ошибка получения количества комментариев:', error);
    return 0;
  }
}
