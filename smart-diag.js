window.DJARB = window.DJARB || {};

// Intelligent keyword matching for natural language processing
DJARB.KEYWORD_MAP = {
  // Connection issues
  'не подключается': ['v-conn-refused', 'v-conn-reset', 'v-deadline', 'i-clock', 'h-test-timeout'],
  'соединение оборвалось': ['v-conn-reset', 'v-random-drops', 'h-background-drop'],
  'нет интернета': ['h-connects-no-internet', 'i-routing-loop', 'v-tunnel-full'],
  'медленно': ['v-server-overload', 'v-throttle-speed', 'v-mtu', 'v-packet-loss-high'],
  'таймаут': ['v-deadline', 'v-conn-reset', 'h-test-timeout'],
  
  // Application issues
  'вылетает': ['h-crash-launch', 'i-test-fail-server'],
  'не запускается': ['h-crash-launch', 'i-connect-disabled'],
  'фон': ['h-background-drop', 'i-autoconnect', 'i-protected-apps-freeze'],
  'батарея': ['h-background-drop', 'i-battery-drain'],
  'уведомление': ['h-notify-missing', 'i-notification-stuck'],
  
  // Import/subscription issues
  'не импортируется': ['h-import', 'i-import', 'h-invalid-sub-url'],
  'подписка': ['h-sub-not-updating', 'i-subscription-update', 'h-profiles-lost'],
  'qr код': ['h-qr-camera-fail', 'i-qr-camera-fail'],
  'ссылка': ['h-invalid-sub-url', 'i-subscription-import'],
  
  // VLESS/REALITY specific
  'REALITY': ['v-reality-invalid', 'v-reality-dest-down', 'v-reality-version'],
  'TLS': ['v-tls-first-record', 'v-tls-wrong-version', 'v-cert'],
  'сертификат': ['v-cert', 'v-certificate-revoked'],
  'SNI': ['v-sni-empty', 'v-reality-fingerprint'],
  'UUID': ['v-invalid-user', 'v-access-expired'],
  
  // Device-specific
  'iphone': ['h-ios-profile', 'h-warp-conflict'],
  'ios': ['h-ios-profile', 'h-warp-conflict'],
  'android': ['h-parental-mdm-block', 'i-protected-apps-freeze'],
  'windows': ['h-macos-permission', 'h-system-proxy-conflict'],
  'mac': ['h-macos-permission', 'h-system-proxy-conflict'],
  'linux': ['v-ipv6-only-net', 'v-dns-hijack'],
  
  // Network issues
  'wi-fi': ['v-captive-portal', 'v-mobile-only'],
  'мобильный': ['v-mobile-only', 'v-throttle-speed'],
  'провайдер': ['v-ip-blacklisted', 'v-corp-firewall', 'v-geo-block'],
  'роутер': ['v-random-drops', 'v-heartbeat-fail'],
  
  // Common symptoms
  'красный': ['h-test-timeout', 'i-test-fail-server', 'v-conn-refused'],
  'ошибка': ['v-conn-refused', 'v-invalid-user', 'h-test-timeout'],
  'работает': ['v-mobile-only', 'v-captive-portal'],
  'не работает': ['h-connects-no-internet', 'i-routing-loop']
};

DJARB.intelligentSearch = function(query) {
  const normalizedQuery = query.toLowerCase().trim();
  const scores = {};
  
  // Direct keyword matching
  Object.keys(DJARB.KEYWORD_MAP).forEach(keyword => {
    if (normalizedQuery.includes(keyword)) {
      DJARB.KEYWORD_MAP[keyword].forEach(errorId => {
        scores[errorId] = (scores[errorId] || 0) + 10;
      });
    }
  });
  
  // Fuzzy word matching
  const words = normalizedQuery.split(/\s+/);
  const allItems = DJARB.allItems();
  
  allItems.forEach(item => {
    let score = 0;
    
    // Check title words
    const titleWords = item.title.toLowerCase().split(/\s+/);
    words.forEach(word => {
      titleWords.forEach(tw => {
        if (tw.includes(word) || word.includes(tw)) {
          score += 5;
        }
      });
    });
    
    // Check symptom
    if (item.symptom) {
      const symptomWords = item.symptom.toLowerCase().split(/\s+/);
      words.forEach(word => {
        symptomWords.forEach(sw => {
          if (sw.includes(word) || word.includes(sw)) {
            score += 3;
          }
        });
      });
    }
    
    // Check cause
    if (item.cause) {
      const causeWords = item.cause.toLowerCase().split(/\s+/);
      words.forEach(word => {
        causeWords.forEach(cw => {
          if (cw.includes(word) || word.includes(cw)) {
            score += 2;
          }
        });
      });
    }
    
    // Check code
    if (item.code && normalizedQuery.includes(item.code.toLowerCase())) {
      score += 15;
    }
    
    if (score > 0) {
      scores[item.id] = (scores[item.id] || 0) + score;
    }
  });
  
  // Sort by score
  const sortedIds = Object.keys(scores).sort((a, b) => scores[b] - scores[a]);
  
  return {
    results: sortedIds.slice(0, 5).map(id => allItems.find(item => item.id === id)).filter(Boolean),
    query: query,
    found: sortedIds.length > 0
  };
};

DJARB.generateContextualResponse = function(query, results) {
  if (!results || results.length === 0) {
    return {
      message: "Я не нашёл точного совпадения с вашей проблемой. Попробуйте описать её другими словами или выберите категорию:",
      suggestions: [
        "Подключение не устанавливается",
        "VPN работает медленно",
        "Приложение вылетает",
        "Проблемы с импортом конфигурации",
        "Ошибки на конкретном устройстве"
      ]
    };
  }
  
  const topResult = results[0];
  let response = "";
  
  // Generate contextual response based on the query
  if (query.includes('не подключается') || query.includes('соединение')) {
    response = `Судя по вашему описанию, проблема скорее всего связана с соединением. Вот что я нашёл:`;
  } else if (query.includes('медленно') || query.includes('тормозит')) {
    response = `Проблема со скоростью может быть вызвана несколькими причинами. Наиболее вероятные решения:`;
  } else if (query.includes('вылетает') || query.includes('приложение')) {
    response = `Проблемы с приложением часто решаются простыми действиями. Вот подходящие решения:`;
  } else {
    response = `По вашему запросу я нашёл следующие решения:`;
  }
  
  return {
    message: response,
    results: results,
    confidence: results.length > 0 ? 'high' : 'low'
  };
};

DJARB.initSmartDiagnostics = function() {
  const chatInput = document.querySelector('.diag-input-row input');
  const chatBody = document.querySelector('.diag-body');
  const sendBtn = document.querySelector('.diag-send');
  
  if (!chatInput || !chatBody) return;
  
  const originalHandler = chatInput.onkeydown;
  
  chatInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSmartQuery();
    }
  });
  
  if (sendBtn) {
    sendBtn.addEventListener('click', handleSmartQuery);
  }
  
  function handleSmartQuery() {
    const query = chatInput.value.trim();
    if (!query) return;
    
    // Add user message
    addMessage(query, 'user');
    chatInput.value = '';
    
    // Show typing indicator
    showTyping();
    
    // Process with intelligent search
    setTimeout(() => {
      const searchResults = DJARB.intelligentSearch(query);
      const response = DJARB.generateContextualResponse(query, searchResults.results);
      
      removeTyping();
      addMessage(response.message, 'bot');
      
      if (response.results && response.results.length > 0) {
        response.results.forEach((result, index) => {
          setTimeout(() => {
            addResultCard(result);
          }, index * 200);
        });
      }
      
      if (response.suggestions) {
        setTimeout(() => {
          addSuggestions(response.suggestions);
        }, response.results.length * 200 + 300);
      }
    }, 800);
  }
  
  function addMessage(text, type) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `diag-msg ${type}`;
    
    const avatar = document.createElement('div');
    avatar.className = 'avatar';
    avatar.textContent = type === 'bot' ? 'AI' : 'Вы';
    
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    bubble.innerHTML = `<p>${text}</p>`;
    
    msgDiv.appendChild(avatar);
    msgDiv.appendChild(bubble);
    chatBody.appendChild(msgDiv);
    
    chatBody.scrollTop = chatBody.scrollHeight;
  }
  
  function addResultCard(result) {
    const msgDiv = document.createElement('div');
    msgDiv.className = 'diag-msg bot';
    
    const avatar = document.createElement('div');
    avatar.className = 'avatar';
    avatar.textContent = 'AI';
    
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    
    const card = document.createElement('a');
    card.className = 'result-card';
    card.href = `#${result.id}`;
    card.dataset.resultId = result.id;
    
    const sevLabel = DJARB.sevLabel[result.sev] || '';
    card.innerHTML = `
      <span class="rc-tag">${sevLabel}</span>
      <span class="rc-title">${result.title}</span>
      <span class="rc-fix">${result.symptom || result.plain || 'Нажмите для подробностей'}</span>
    `;
    
    card.addEventListener('click', function(e) {
      e.preventDefault();
      const targetPage = result._page || 'vless.html';
      if (window.location.pathname.includes(targetPage)) {
        DJARB.openAndScroll(result.id);
      } else {
        window.location.href = `${targetPage}#${result.id}`;
      }
    });
    
    bubble.appendChild(card);
    msgDiv.appendChild(avatar);
    msgDiv.appendChild(bubble);
    chatBody.appendChild(msgDiv);
    
    chatBody.scrollTop = chatBody.scrollHeight;
  }
  
  function addSuggestions(suggestions) {
    const msgDiv = document.createElement('div');
    msgDiv.className = 'diag-msg bot';
    
    const avatar = document.createElement('div');
    avatar.className = 'avatar';
    avatar.textContent = 'AI';
    
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    
    const suggestionsHtml = suggestions.map(s => 
      `<button class="suggestion-chip" data-query="${s}">${s}</button>`
    ).join('');
    
    bubble.innerHTML = `
      <p>Попробуйте описать проблему так:</p>
      <div class="suggestions-container">${suggestionsHtml}</div>
    `;
    
    bubble.querySelectorAll('.suggestion-chip').forEach(chip => {
      chip.addEventListener('click', function() {
        chatInput.value = this.dataset.query;
        handleSmartQuery();
      });
    });
    
    msgDiv.appendChild(avatar);
    msgDiv.appendChild(bubble);
    chatBody.appendChild(msgDiv);
    
    chatBody.scrollTop = chatBody.scrollHeight;
  }
  
  function showTyping() {
    const msgDiv = document.createElement('div');
    msgDiv.className = 'diag-msg bot typing-msg';
    msgDiv.id = 'typingIndicator';
    
    const avatar = document.createElement('div');
    avatar.className = 'avatar';
    avatar.textContent = 'AI';
    
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    bubble.innerHTML = '<div class="thinking"><span></span><span></span><span></span></div>';
    
    msgDiv.appendChild(avatar);
    msgDiv.appendChild(bubble);
    chatBody.appendChild(msgDiv);
    
    chatBody.scrollTop = chatBody.scrollHeight;
  }
  
  function removeTyping() {
    const typing = document.getElementById('typingIndicator');
    if (typing) typing.remove();
  }
};