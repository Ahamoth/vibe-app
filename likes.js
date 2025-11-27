
async function toggleLike(vibeId) {
  if (!currentUser) {
    alert('Войдите чтобы ставить лайки');
    showAuth();
    return;
  }

  try {

    const { data: existingLike, error: checkError } = await supabase
      .from('likes')
      .select('id')
      .eq('vibe_id', vibeId)
      .eq('user_id', currentUser.id)
      .maybeSingle(); 

    if (checkError) throw checkError;

    if (existingLike) {

      const { error: deleteError } = await supabase
        .from('likes')
        .delete()
        .eq('id', existingLike.id);

      if (deleteError) throw deleteError;
    } else {

      const { error: insertError } = await supabase
        .from('likes')
        .insert([
          {
            vibe_id: vibeId,
            user_id: currentUser.id
          }
        ]);

      if (insertError) throw insertError;
    }


    await refreshVibeLikes(vibeId);
  } catch (error) {
    console.error('Ошибка при лайке:', error);
    alert('Ошибка при установке лайка');
  }
}

async function refreshVibeLikes(vibeId) {
  try {

    const { count, error: countError } = await supabase
      .from('likes')
      .select('*', { count: 'exact', head: true })
      .eq('vibe_id', vibeId);

    if (countError) throw countError;


    const { data: userLike, error: likeError } = await supabase
      .from('likes')
      .select('id')
      .eq('vibe_id', vibeId)
      .eq('user_id', currentUser.id)
      .maybeSingle();

    if (likeError) throw likeError;


    const likeBtn = document.querySelector(`[onclick="toggleLike('${vibeId}')"]`);
    if (likeBtn) {
      const likeCount = count || 0;
      likeBtn.innerHTML = userLike ? `❤️ ${likeCount}` : `🤍 ${likeCount}`;
      likeBtn.classList.toggle('liked', userLike);
    }
  } catch (error) {
    console.error('Ошибка обновления лайков:', error);
  }
}

async function getVibeLikesCount(vibeId) {
  try {
    const { count, error } = await supabase
      .from('likes')
      .select('*', { count: 'exact', head: true })
      .eq('vibe_id', vibeId);
    
    if (error) throw error;
    return count || 0;
  } catch (error) {
    console.error('Ошибка получения количества лайков:', error);
    return 0;
  }
}

async function hasUserLiked(vibeId) {
  if (!currentUser) return false;
  
  try {
    const { data, error } = await supabase
      .from('likes')
      .select('id')
      .eq('vibe_id', vibeId)
      .eq('user_id', currentUser.id)
      .maybeSingle();
    
    if (error) throw error;
    return !!data;
  } catch (error) {
    console.error('Ошибка проверки лайка:', error);
    return false;
  }
}
