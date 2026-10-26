window.DJARB = window.DJARB || {};

// Intelligent keyword matching for natural language processing
DJARB.KEYWORD_MAP = {
  // Подключение (ключи — только в нижнем регистре: запрос приводится к нижнему)
  'не подключается': ['v-conn-refused', 'v-conn-reset', 'v-deadline', 'i-clock', 'h-test-timeout', 'vx-timeout-handshake'],
  'соединение оборвалось': ['v-conn-reset', 'v-random-drops', 'h-background-drop', 'vx-16kb-cut'],
  'нет интернета': ['h-connects-no-internet', 'i-routing-loop', 'v-tunnel-full', 'vx-android-private-dns', 'vx-two-vpns'],
  'медленно': ['vx-speed-low', 'v-server-overload', 'v-throttle-speed', 'v-mtu', 'v-packet-loss-high'],
  'скорость': ['vx-speed-low', 'v-throttle-speed', 'v-server-overload'],
  'пинг': ['vx-ping-high', 'vx-ping-zero', 'h-ping-false'],
  'лаги': ['vx-ping-high', 'vx-youtube-quic'],
  'таймаут': ['vx-timeout-handshake', 'v-deadline', 'v-conn-reset', 'h-test-timeout'],

  // Приложения
  'вылетает': ['h-crash-launch', 'i-test-fail-server'],
  'не запускается': ['h-crash-launch', 'i-connect-disabled'],
  'фон': ['vx-android-doze', 'h-background-drop', 'i-autoconnect', 'ix-android-battery'],
  'батарея': ['hx-android-battery', 'ix-android-battery', 'hx-ios-low-power', 'i-battery-drain'],
  'уведомление': ['hx-notif-denied', 'ix-notif-android13', 'h-notify-missing', 'i-notification-stuck'],
  'блокировк': ['hx-ios-low-power', 'ix-ios-slow-lock', 'vx-android-doze'],

  // Импорт и подписка
  'не импортируется': ['vx-msg-broken-link', 'hx-import-file', 'ix-import-file', 'h-import', 'i-import', 'h-invalid-sub-url'],
  'подписка': ['vx-sub-https-redirect', 'vx-config-regenerated', 'h-sub-not-updating', 'h-profiles-lost'],
  'qr': ['hx-qr-fail', 'i-qr-camera-fail'],
  'ссылка': ['vx-msg-broken-link', 'vx-bad-scheme', 'h-invalid-sub-url'],
  'файл': ['hx-import-file', 'ix-import-file'],
  'устройств': ['vx-device-limit', 'ix-device-limit', 'v-multi-device-kick'],
  'лимит': ['vx-device-limit', 'ix-device-limit', 'v-quota'],
  'бот': ['hx-tg-bot-config', 'ix-bot-config-expired', 'vx-config-regenerated'],
  'конфиг': ['vx-config-regenerated', 'vx-json-parse', 'hx-import-file'],

  // VLESS / REALITY
  'reality': ['v-reality-invalid', 'v-reality-dest-down', 'v-reality-version'],
  'tls': ['v-tls-first-record', 'v-tls-wrong-version', 'v-cert'],
  'сертификат': ['v-cert', 'v-certificate-revoked'],
  'sni': ['v-sni-empty', 'v-tls-fingerprint-mismatch', 'vx-whitelist-mobile'],
  'uuid': ['v-uuid-empty', 'v-invalid-user', 'v-access-expired'],
  'json': ['vx-json-parse'],

  // Устройства
  'iphone': ['hx-ios-vpn-denied', 'h-ios-profile', 'vx-ios-wifi-assist', 'vx-ios-private-relay', 'hx-ios-not-in-store'],
  'ios': ['hx-ios-vpn-denied', 'h-ios-profile', 'vx-ios-wifi-assist', 'ix-ios-first-run'],
  'android': ['vx-android-doze', 'hx-android-battery', 'vx-android-private-dns', 'hx-android-always-on'],
  'xiaomi': ['hx-android-battery', 'ix-android-battery', 'vx-android-doze'],
  'redmi': ['hx-android-battery', 'ix-android-battery'],
  'samsung': ['hx-android-battery', 'ix-android-battery', 'vx-android-doze'],
  'windows': ['hx-win-admin-tun', 'ix-win-admin', 'hx-win-smartscreen', 'hx-win-after-sleep', 'h-system-proxy-conflict'],
  'mac': ['hx-mac-gatekeeper', 'ix-mac-open-anyway', 'hx-mac-extension', 'h-macos-permission'],
  'linux': ['v-ipv6-only-net', 'v-dns-hijack'],

  // Сеть и сервисы
  'wi-fi': ['v-captive-portal', 'vx-router-dns', 'vx-ios-wifi-assist'],
  'вайфай': ['v-captive-portal', 'vx-router-dns'],
  'мобильн': ['vx-whitelist-mobile', 'v-mobile-only', 'v-throttle-speed'],
  'lte': ['vx-whitelist-mobile', 'vx-16kb-cut'],
  'белые списки': ['vx-whitelist-mobile'],
  'провайдер': ['vx-16kb-cut', 'v-ip-blacklisted', 'v-corp-firewall', 'v-geo-block'],
  'оператор': ['vx-whitelist-mobile', 'vx-16kb-cut'],
  'роутер': ['vx-router-dns', 'v-random-drops', 'v-heartbeat-fail'],
  'банк': ['vx-banking-app', 'vx-ru-sites'],
  'госуслуги': ['vx-banking-app', 'vx-ru-sites'],
  'российские сайты': ['vx-ru-sites', 'vx-banking-app'],
  'телеграм': ['vx-telegram-own-proxy'],
  'telegram': ['vx-telegram-own-proxy'],
  'ютуб': ['vx-youtube-quic', 'vx-speed-low'],
  'youtube': ['vx-youtube-quic', 'vx-speed-low'],
  'видео': ['vx-youtube-quic'],
  'капча': ['vx-captcha-loop'],
  'другой vpn': ['vx-two-vpns', 'ix-tun-conflict'],

  // Общие симптомы
  'красный': ['vx-ping-zero', 'h-test-timeout', 'i-test-fail-server', 'v-conn-refused'],
  'ошибка': ['v-conn-refused', 'v-invalid-user', 'h-test-timeout'],
  'работает': ['vx-whitelist-mobile', 'v-mobile-only', 'v-captive-portal'],
  'не работает': ['h-connects-no-internet', 'i-routing-loop', 'vx-two-vpns']
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