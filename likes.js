// Система лайков
async function toggleLike(vibeId) {
  if (!currentUser) {
    alert('Войдите чтобы ставить лайки');
    showAuth();
    return;
  }

  try {
    // Проверяем, лайкал ли уже пользователь
    const { data: existingLike } = await supabase
      .from('likes')
      .select('id')
      .eq('vibe_id', vibeId)
      .eq('user_id', currentUser.id)
      .single();

    if (existingLike) {
      // Удаляем лайк
      await supabase
        .from('likes')
        .delete()
        .eq('id', existingLike.id);
    } else {
      // Добавляем лайк
      await supabase
        .from('likes')
        .insert([
          {
            vibe_id: vibeId,
            user_id: currentUser.id
          }
        ]);
    }

    // Обновляем отображение
    refreshVibeLikes(vibeId);
  } catch (error) {
    console.error('Ошибка при лайке:', error);
  }
}

async function refreshVibeLikes(vibeId) {
  // Получаем обновленное количество лайков
  const { count } = await supabase
    .from('likes')
    .select('*', { count: 'exact', head: true })
    .eq('vibe_id', vibeId);

  // Получаем лайк текущего пользователя
  const { data: userLike } = await supabase
    .from('likes')
    .select('id')
    .eq('vibe_id', vibeId)
    .eq('user_id', currentUser.id)
    .single();

  // Обновляем кнопку лайка
  const likeBtn = document.querySelector(`[onclick="toggleLike('${vibeId}')"]`);
  if (likeBtn) {
    likeBtn.innerHTML = userLike ? `❤️ ${count}` : `🤍 ${count}`;
    likeBtn.classList.toggle('liked', userLike);
  }
}

async function getVibeLikesCount(vibeId) {
  const { count } = await supabase
    .from('likes')
    .select('*', { count: 'exact', head: true })
    .eq('vibe_id', vibeId);
  
  return count || 0;
}

async function hasUserLiked(vibeId) {
  if (!currentUser) return false;
  
  const { data } = await supabase
    .from('likes')
    .select('id')
    .eq('vibe_id', vibeId)
    .eq('user_id', currentUser.id)
    .single();
  
  return !!data;
}
