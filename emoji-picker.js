class EmojiPicker {
  constructor(containerId, onEmojiSelect) {
    this.container = document.getElementById(containerId);
    this.onEmojiSelect = onEmojiSelect;
    this.selectedEmoji = '✨';
    this.categories = {
      '😊': ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳'],
      '❤️': ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '♥️', '♦️', '♣️', '♠️'],
      '🐻': ['🐵', '🐒', '🦍', '🦧', '🐶', '🐕', '🦮', '🐩', '🐺', '🦊', '🦝', '🐱', '🐈', '🦁', '🐯', '🐅', '🐆', '🐴', '🐎', '🦄', '🦓', '🦌', '🐮', '🐂', '🐃', '🐄', '🐷', '🐖', '🐗', '🐽', '🐏', '🐑', '🐐', '🐪', '🐫', '🦙', '🦒', '🐘', '🦏', '🦛', '🐭', '🐁', '🐀', '🐹', '🐰', '🐇', '🐿️', '🦔', '🦇', '🐻', '🐨', '🐼', '🦥', '🦦', '🦨', '🦘'],
      '🌍': ['🌍', '🌎', '🌏', '🌐', '🗺️', '🗾', '🧭', '🏔️', '⛰️', '🌋', '🗻', '🏕️', '🏖️', '🏜️', '🏝️', '🏞️', '🏟️', '🏛️', '🏗️', '🧱', '🪨', '🪵', '🛖', '🏘️', '🏚️', '🏠', '🏡', '🏢', '🏣', '🏤', '🏥', '🏦', '🏨', '🏩', '🏪', '🏫', '🏬', '🏭', '🏯', '🏰', '💒', '🗼', '🗽', '⛪', '🕌', '🛕', '🕍', '⛩️', '🕋', '⛲', '⛺', '🌁', '🌃', '🏙️', '🌄', '🌅', '🌆', '🌇', '🌉', '♨️', '🎠', '🎡', '🎢', '💈', '🎪', '🚂', '🚃', '🚄', '🚅', '🚆', '🚇', '🚈', '🚉', '🚊', '🚝', '🚞', '🚋', '🚌', '🚍', '🚎', '🚐', '🚑', '🚒', '🚓', '🚔', '🚕', '🚖', '🚗', '🚘', '🚙', '🚚', '🚛', '🚜', '🏎️', '🏍️', '🛵', '🚲', '🛴', '🛹', '🚏', '🛣️', '🛤️', '🛢️', '⛽', '🚨', '🚥', '🚦', '🛑', '🚧', '⚓', '⛵', '🛶', '🚤', '🛳️', '⛴️', '🛥️', '🚢', '✈️', '🛩️', '🛫', '🛬', '🪂', '💺', '🚁', '🚟', '🚠', '🚡', '🛰️', '🚀', '🛸', '🎆', '🎇', '🎑', '💎'],
      '🎮': ['🎮', '🕹️', '🎲', '♟️', '🎯', '🎳', '🎪', '🎭', '🖼️', '🎨', '🧵', '🪡', '🧶', '🪢', '👓', '🕶️', '🥽', '🥼', '🦺', '👔', '👕', '👖', '🧣', '🧤', '🧥', '🧦', '👗', '👘', '🥻', '🩱', '🩲', '🩳', '👙', '👚', '👛', '👜', '👝', '🎒', '📿', '💄', '💍', '💎'],
      '🍕': ['🍏', '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑', '🥦', '🥬', '🥒', '🌶️', '🫑', '🌽', '🥕', '🫒', '🧄', '🧅', '🥔', '🍠', '🥐', '🥯', '🍞', '🥖', '🥨', '🧀', '🥚', '🍳', '🧈', '🥞', '🧇', '🥓', '🥩', '🍗', '🍖', '🦴', '🌭', '🍔', '🍟', '🍕', '🫓', '🥪', '🥙', '🧆', '🌮', '🌯', '🫔', '🥗', '🥘', '🫕', '🥫', '🍝', '🍜', '🍲', '🍛', '🍣', '🍱', '🥟', '🦪', '🍤', '🍙', '🍚', '🍘', '🍥', '🥠', '🥮', '🍢', '🍡', '🍧', '🍨', '🍦', '🥧', '🧁', '🍰', '🎂', '🍮', '🍭', '🍬', '🍫', '🍿', '🍩', '🍪', '🌰', '🥜', '🫘', '🍯', '🥛', '🍼', '🫖', '☕', '🍵', '🧃', '🥤', '🧋', '🍶', '🍺', '🍻', '🥂', '🍷', '🥃', '🍸', '🍹', '🧉', '🍾', '🧊', '🥄', '🍴', '🍽️', '🥣', '🥡', '🥢', '🧂'],
      '⚽': ['⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱', '🪀', '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '🪃', '🥅', '⛳', '🪁', '🏹', '🎣', '🤿', '🥊', '🥋', '🎽', '🛹', '🛼', '🛷', '⛸️', '🥌', '🎿', '⛷️', '🏂', '🪂', '🏋️', '🤼', '🤸', '⛹️', '🤾', '🏌️', '🏇', '🧘', '🏄', '🏊', '🤽', '🚣', '🧗', '🚵', '🚴', '🏆', '🥇', '🥈', '🥉', '🏅', '🎖️', '🏵️', '🎗️', '🎫', '🎟️', '🎪', '🤹', '🎭', '🩰', '🎬', '🎤', '🎧', '🎼', '🎹', '🥁', '🪘', '🎷', '🎺', '🎸', '🪕', '🎻', '🎲', '♟️', '🎯', '🎳', '🎮', '🎰']
    };
    
    this.init();
  }

  init() {
    this.render();
    this.bindEvents();
  }

  render() {
    this.container.innerHTML = `
      <div class="emoji-picker-container">
        <div class="emoji-trigger">
          <span class="selected-emoji-preview">${this.selectedEmoji}</span>
          <span>Выбрать эмодзи</span>
          <span style="margin-left: auto;">▼</span>
        </div>
        <div class="emoji-picker">
          <input type="text" class="emoji-search" placeholder="Поиск эмодзи...">
          <div class="emoji-categories">
            ${Object.keys(this.categories).map(emoji => `
              <button class="emoji-category" data-category="${emoji}">${emoji}</button>
            `).join('')}
          </div>
          <div class="emoji-grid" id="emoji-grid">
            ${this.renderEmojis('😊')}
          </div>
        </div>
      </div>
    `;
  }

  renderEmojis(category) {
    return this.categories[category].map(emoji => `
      <button class="emoji-item" data-emoji="${emoji}">${emoji}</button>
    `).join('');
  }

  bindEvents() {
    const trigger = this.container.querySelector('.emoji-trigger');
    const picker = this.container.querySelector('.emoji-picker');
    const search = this.container.querySelector('.emoji-search');
    const categories = this.container.querySelectorAll('.emoji-category');
    const emojiGrid = this.container.querySelector('#emoji-grid');


    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      picker.classList.toggle('active');
    });


    document.addEventListener('click', () => {
      picker.classList.remove('active');
    });


    search.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      if (query.length > 0) {
        this.filterEmojis(query);
      } else {
        const activeCategory = this.container.querySelector('.emoji-category.active');
        if (activeCategory) {
          this.showCategory(activeCategory.dataset.category);
        }
      }
    });


    categories.forEach(btn => {
      btn.addEventListener('click', () => {
        categories.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.showCategory(btn.dataset.category);
      });
    });


    emojiGrid.addEventListener('click', (e) => {
      if (e.target.classList.contains('emoji-item')) {
        this.selectEmoji(e.target.dataset.emoji);
        picker.classList.remove('active');
      }
    });


    if (categories[0]) {
      categories[0].classList.add('active');
    }
  }

  showCategory(category) {
    const emojiGrid = this.container.querySelector('#emoji-grid');
    emojiGrid.innerHTML = this.renderEmojis(category);
  }

  filterEmojis(query) {
    const allEmojis = Object.values(this.categories).flat();
    const filtered = allEmojis.filter(emoji => 
      emoji.toLowerCase().includes(query)
    );
    
    const emojiGrid = this.container.querySelector('#emoji-grid');
    emojiGrid.innerHTML = filtered.map(emoji => `
      <button class="emoji-item" data-emoji="${emoji}">${emoji}</button>
    `).join('');
  }

  selectEmoji(emoji) {
    this.selectedEmoji = emoji;
    this.container.querySelector('.selected-emoji-preview').textContent = emoji;
    
    if (this.onEmojiSelect) {
      this.onEmojiSelect(emoji);
    }
  }

  getSelectedEmoji() {
    return this.selectedEmoji;
  }

  setSelectedEmoji(emoji) {
    this.selectedEmoji = emoji;
    if (this.container) {
      const preview = this.container.querySelector('.selected-emoji-preview');
      if (preview) {
        preview.textContent = emoji;
      }
    }
  }
}


let emojiPickerInstance = null;

function initEmojiPicker(containerId, onEmojiSelect) {
  emojiPickerInstance = new EmojiPicker(containerId, onEmojiSelect);
  return emojiPickerInstance;
}

function getSelectedEmoji() {
  return emojiPickerInstance ? emojiPickerInstance.getSelectedEmoji() : '✨';
}

function setSelectedEmoji(emoji) {
  if (emojiPickerInstance) {
    emojiPickerInstance.setSelectedEmoji(emoji);
  }
}
