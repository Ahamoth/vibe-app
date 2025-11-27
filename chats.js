// Система чатов
let currentChat = null;
let chatMessages = [];

function renderChats(content) {
  if (!currentUser) {
    showAuth();
    return;
  }

  content.innerHTML = `
    <div class="chat-list">
      <div class="card">
        <h3>Чаты</h3>
        <div id="chats-list">
          <div style="text-align: center; padding: 20px; opacity: 0.7;">
            Загрузка чатов...
          </div>
        </div>
      </div>
    </div>
  `;

  loadChats();
}

async function loadChats() {
  try {
    // Получаем список пользователей для чатов
    const { data: users, error } = await supabase
      .from('vibes')
      .select('username, user_id')
      .neq('user_id', currentUser.id)
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) throw error;

    const uniqueUsers = users.filter((user, index, self) => 
      index === self.findIndex(u => u.user_id === user.user_id)
    );

    const chatsList = document.getElementById('chats-list');
    
    if (uniqueUsers.length === 0) {
      chatsList.innerHTML = '<div style="text-align: center; padding: 20px; opacity: 0.7;">Нет пользователей для чата</div>';
      return;
    }

    chatsList.innerHTML = uniqueUsers.map(user => `
      <div class="chat-item" onclick="openChat('${user.user_id}', '${user.username}')">
        <div class="chat-avatar">
          ${user.username.charAt(0).toUpperCase()}
        </div>
        <div class="chat-info">
          <div class="chat-name">${user.username}</div>
          <div class="chat-last-message">Нажмите чтобы начать чат</div>
        </div>
        <div class="chat-time"></div>
      </div>
    `).join('');
  } catch (error) {
    console.error('Ошибка загрузки чатов:', error);
    document.getElementById('chats-list').innerHTML = '<div style="text-align: center; padding: 20px; color: #ef4444;">Ошибка загрузки чатов</div>';
  }
}

function openChat(userId, username) {
  currentChat = { userId, username };
  
  const content = document.getElementById("content");
  content.innerHTML = `
    <div class="chat-messages" id="chat-messages">
      <div style="text-align: center; padding: 20px; opacity: 0.7;">
        Загрузка сообщений...
      </div>
    </div>
    <div class="message-input">
      <input type="text" id="message-input" placeholder="Введите сообщение..." onkeypress="handleMessageKeypress(event)">
      <button class="btn btn-small" onclick="sendMessage()">Отправить</button>
    </div>
  `;

  loadChatMessages(userId);
  setupChatRealtime(userId);
}

async function loadChatMessages(otherUserId) {
  try {
    const { data: messages, error } = await supabase
      .from('messages')
      .select('*')
      .or(`and(sender_id.eq.${currentUser.id},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${currentUser.id})`)
      .order('created_at', { ascending: true });

    if (error) throw error;

    chatMessages = messages || [];
    displayChatMessages();
  } catch (error) {
    console.error('Ошибка загрузки сообщений:', error);
  }
}

function displayChatMessages() {
  const messagesContainer = document.getElementById('chat-messages');
  
  if (chatMessages.length === 0) {
    messagesContainer.innerHTML = '<div style="text-align: center; padding: 20px; opacity: 0.7;">Нет сообщений. Начните общение!</div>';
    return;
  }

  messagesContainer.innerHTML = chatMessages.map(message => `
    <div class="message ${message.sender_id === currentUser.id ? 'own' : 'other'}">
      ${message.sender_id !== currentUser.id ? `<div class="message-sender">${currentChat.username}</div>` : ''}
      <div>${message.text}</div>
      <div style="font-size: 10px; opacity: 0.5; text-align: right; margin-top: 4px;">
        ${formatTime(message.created_at)}
      </div>
    </div>
  `).join('');

  // Прокручиваем к последнему сообщению
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

async function sendMessage() {
  if (!currentChat) return;

  const messageInput = document.getElementById('message-input');
  const text = messageInput.value.trim();

  if (!text) return;

  try {
    const { error } = await supabase
      .from('messages')
      .insert([
        {
          sender_id: currentUser.id,
          receiver_id: currentChat.userId,
          text: text
        }
      ]);

    if (error) throw error;

    messageInput.value = '';
  } catch (error) {
    console.error('Ошибка отправки сообщения:', error);
    alert('Ошибка отправки сообщения');
  }
}

function handleMessageKeypress(event) {
  if (event.key === 'Enter') {
    sendMessage();
  }
}

function setupChatRealtime(otherUserId) {
  // Реальная время подписка на новые сообщения
  const subscription = supabase
    .channel('chat-messages')
    .on('postgres_changes', 
      { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages',
        filter: `or(and(sender_id.eq.${currentUser.id},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${currentUser.id}))`
      }, 
      (payload) => {
        chatMessages.push(payload.new);
        displayChatMessages();
      }
    )
    .subscribe();

  return subscription;
}

function formatTime(dateString) {
  return new Date(dateString).toLocaleTimeString('ru-RU', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
}
