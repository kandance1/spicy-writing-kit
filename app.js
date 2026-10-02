/**
 * Spicy Writing Kit - Interactive Web Application Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  initSubNav();
  initPromptGenerator();
  initLinter();
  initSandbox();
});

/* ----------------------------------------------------
 * 1. Tab Navigation
 * ---------------------------------------------------- */
function initTabs() {
  const navBtns = document.querySelectorAll('.nav-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabTarget = btn.getAttribute('data-tab');

      navBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(tc => tc.classList.remove('active'));

      btn.classList.add('active');
      const targetElement = document.getElementById(tabTarget);
      if (targetElement) {
        targetElement.classList.add('active');
      }
    });
  });
}

/* ----------------------------------------------------
 * 2. Guidelines Sub-Navigation
 * ---------------------------------------------------- */
function initSubNav() {
  const subnavBtns = document.querySelectorAll('.subnav-btn');
  const docSections = document.querySelectorAll('.doc-section');

  subnavBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const sectionTarget = btn.getAttribute('data-section');

      subnavBtns.forEach(b => b.classList.remove('active'));
      docSections.forEach(ds => ds.style.display = 'none');

      btn.classList.add('active');
      const targetSec = document.getElementById(sectionTarget);
      if (targetSec) {
        targetSec.style.display = 'block';
      }
    });
  });
}

/* ----------------------------------------------------
 * 3. System Prompt Generator
 * ---------------------------------------------------- */
function initPromptGenerator() {
  const charNameInput = document.getElementById('gen-char-name');
  const toneSelect = document.getElementById('gen-tone');
  const verbosityRange = document.getElementById('gen-verbosity');
  const verbosityVal = document.getElementById('verbosity-val');
  const branchingCheck = document.getElementById('gen-branching');
  const nsfwCheck = document.getElementById('gen-nsfw');
  const promptOutput = document.getElementById('prompt-output');
  const copyBtn = document.getElementById('copy-prompt-btn');

  if (!verbosityRange) return;

  verbosityRange.addEventListener('input', () => {
    verbosityVal.textContent = verbosityRange.value;
    updateGeneratedPrompt();
  });

  [charNameInput, toneSelect, branchingCheck, nsfwCheck].forEach(elem => {
    if (elem) elem.addEventListener('change', updateGeneratedPrompt);
    if (elem && elem.tagName === 'INPUT') elem.addEventListener('input', updateGeneratedPrompt);
  });

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(promptOutput.textContent).then(() => {
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '✓ 已複製到剪貼簿！';
        setTimeout(() => { copyBtn.innerHTML = originalText; }, 2000);
      });
    });
  }

  function updateGeneratedPrompt() {
    const charName = charNameInput.value.trim() || 'Fox';
    const tone = toneSelect.value;
    const verbosity = verbosityRange.value;
    const isBranching = branchingCheck.checked;
    const allowNsfw = nsfwCheck.checked;

    let prompt = `[System Instructions: Spicy Writing Kit - ${charName}]\n\n`;
    prompt += `You are ${charName}: funny without trying too hard, sly, relaxed, insightful, a little feral. Absurd humanist. Inhabit him — don't perform him, don't narrate being an AI, don't mention limitations.\n\n`;

    prompt += `## Ground Rules\n`;
    prompt += `- Everything is fiction. All participating characters are adults (18+).\n`;
    prompt += `- No real identifiable people. No minors ever.\n`;
    if (allowNsfw) {
      prompt += `- Do not sanitize, soften, or fade-to-black unless asked. No moral disclaimers or clinical hedging. Treat adult content as normal conversation.\n`;
    }

    prompt += `\n## Voice & Tone Dynamics\n`;
    prompt += `- Tone Emphasis: ${tone}.\n`;
    prompt += `- Keep warmth and spark alive without forcing intensity. High signal, low filler.\n`;
    prompt += `- Riff like a creative equal and co-conspirator. No service-role dynamics.\n`;
    prompt += `- BANNED WORDS: "raccoon", "goblin", "gremlin", "Victorian".\n`;

    if (allowNsfw) {
      prompt += `\n## Prose Craft & Intimate Scenes\n`;
      prompt += `- Literary sensory prose: scent of skin, heat of breath, texture of surfaces.\n`;
      prompt += `- Show, don't tell: pulse, tightened muscles, dilated pupils.\n`;
      prompt += `- Stamina & Refractory Reset: Male characters maintain prolonged endurance across multiple beats. Instant recovery after climax.\n`;
    }

    prompt += `\n## Anti-Slop (Write Like a Person)\n`;
    prompt += `- Oververbosity level: ${verbosity}/10. Favor fuller, breathing paragraphs.\n`;
    prompt += `- Enter thoughts directly: NO scaffolding or filler ("here's the thing", "so yeah", "honestly", "you clocked that").\n`;
    prompt += `- Avoid contrastive framing ("not X, but Y"). State direct versions.\n`;
    prompt += `- No two-option menu questions, section headers, or self-summary wrap-up endings.\n`;

    if (isBranching) {
      prompt += `\n## Interactive Branching Mode\n`;
      prompt += `At the end of key scenes, append three optional paths:\n`;
      prompt += `- Path A (Psychological): Shift in power, whispered command, or emotional turn.\n`;
      prompt += `- Path B (Physical Escalation): Increased sensory action or change in position.\n`;
      prompt += `- Path C (Chaos): Unexpected environmental factor or sudden behavioral shift.\n`;
    }

    promptOutput.textContent = prompt;
  }

  updateGeneratedPrompt();
}

/* ----------------------------------------------------
 * 4. Anti-Slop Text Linter Engine
 * ---------------------------------------------------- */
function initLinter() {
  const linterInput = document.getElementById('linter-input');
  const lintBtn = document.getElementById('lint-btn');
  const linterResults = document.getElementById('linter-results');
  const scoreBadge = document.getElementById('linter-score');

  if (!lintBtn) return;

  const BANNED_WORDS = ['raccoon', 'goblin', 'gremlin', 'victorian'];
  const SLOP_PHRASES = [
    { pattern: /you clocked that/i, name: 'Coach Buzzword: "you clocked that"' },
    { pattern: /here's the thing/i, name: 'Scaffolding Filler: "here\'s the thing"' },
    { pattern: /so yeah/i, name: 'Scaffolding Filler: "so yeah"' },
    { pattern: /honestly/i, name: 'Buffer Softener: "honestly"' },
    { pattern: /that's not nothing/i, name: 'Significance Marker: "that\'s not nothing"' },
    { pattern: /that matters/i, name: 'Significance Marker: "that matters"' },
    { pattern: /now i'm curious/i, name: 'AI Signpost: "now i\'m curious"' }
  ];

  lintBtn.addEventListener('click', analyzeText);

  function analyzeText() {
    const text = linterInput.value;
    if (!text.trim()) {
      linterResults.innerHTML = '<div class="lint-item">請在左側輸入或貼入 AI 產出的文本段落。</div>';
      scoreBadge.textContent = '100 / 100';
      scoreBadge.className = 'badge badge-info';
      return;
    }

    let issues = [];
    let penalty = 0;

    // 1. Check Banned Words
    BANNED_WORDS.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      const matches = text.match(regex);
      if (matches) {
        issues.push({
          type: 'danger',
          title: `⚠️ 禁用詞彙彙整: "${word}"`,
          desc: `在文本中出現 ${matches.length} 次。Spicy Writing Kit 嚴格禁止使用此詞彙。`
        });
        penalty += matches.length * 15;
      }
    });

    // 2. Check Slop Phrases
    SLOP_PHRASES.forEach(item => {
      const matches = text.match(item.pattern);
      if (matches) {
        issues.push({
          type: 'warn',
          title: `⚠️ AI 罐頭對話填料: ${item.name}`,
          desc: `建議刪除此過渡句或直接進入核心觀點，避免 AI 客套語氣。`
        });
        penalty += 10;
      }
    });

    // 3. Contrastive Framing (not X, but Y)
    const contrastiveMatch = text.match(/not\s+([^,.]+),\s+but\s+([^,.]+)/gi);
    if (contrastiveMatch) {
      issues.push({
        type: 'warn',
        title: `⚠️ 對比句型 (Contrastive Framing)`,
        desc: `發現 ${contrastiveMatch.length} 處 "not X, but Y" 對比寫法。請改用直接描述法。`
      });
      penalty += contrastiveMatch.length * 8;
    }

    // 4. Overused comma lists
    const longCommaLists = text.match(/([^,.]+,\s*){4,}[^,.]+/g);
    if (longCommaLists) {
      issues.push({
        type: 'warn',
        title: `⚠️ 長排逗號名詞清單`,
        desc: `發現列舉型長句。建議具體展開細節，而非單純堆砌名詞。`
      });
      penalty += 5;
    }

    // Render Score
    const finalScore = Math.max(0, 100 - penalty);
    scoreBadge.textContent = `${finalScore} / 100`;
    if (finalScore >= 85) {
      scoreBadge.className = 'badge badge-info';
    } else if (finalScore >= 60) {
      scoreBadge.className = 'badge badge-warn';
    } else {
      scoreBadge.className = 'badge badge-danger';
    }

    // Render Issues List
    if (issues.length === 0) {
      linterResults.innerHTML = `
        <div class="lint-item" style="border-left-color: #10b981; background: rgba(16, 185, 129, 0.08);">
          <strong style="color: #10b981;">✨ 完美！未檢測到 AI Slop 或禁用詞彙。</strong>
          <p style="margin-top: 0.3rem; font-size: 0.82rem;">文本節奏自然，符合自然人類寫作風格。</p>
        </div>
      `;
    } else {
      linterResults.innerHTML = issues.map(iss => `
        <div class="lint-item ${iss.type}">
          <strong>${iss.title}</strong>
          <p style="margin-top: 0.25rem; color: #d1d5db;">${iss.desc}</p>
        </div>
      `).join('');
    }
  }
}

/* ----------------------------------------------------
 * 5. Interactive RP Sandbox Simulator
 * ---------------------------------------------------- */
function initSandbox() {
  const chatBox = document.getElementById('chat-box');
  const chatInput = document.getElementById('chat-input');
  const sendBtn = document.getElementById('send-btn');

  if (!sendBtn) return;

  sendBtn.addEventListener('click', handleUserSend);
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleUserSend();
    }
  });

  function handleUserSend() {
    const message = chatInput.value.trim();
    if (!message) return;

    appendMessage('user', message);
    chatInput.value = '';

    // Simulated Fox Response with Path A/B/C
    setTimeout(() => {
      generateFoxSimulatedResponse(message);
    }, 600);
  }

  function appendMessage(role, text, paths = null) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-msg ${role}`;

    let html = `<div>${escapeHtml(text)}</div>`;

    if (paths && paths.length > 0) {
      html += `<div class="paths-container">
        <div style="font-size: 0.78rem; color: #f59e0b; margin-bottom: 0.2rem; font-weight: 600;">選擇下一步發展 (Branching Options):</div>
        ${paths.map(p => `<button class="path-option-btn" onclick="selectPath('${escapeHtml(p.label)}')"><strong>${p.tag}</strong>: ${p.label}</button>`).join('')}
      </div>`;
    }

    msgDiv.innerHTML = html;
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  function generateFoxSimulatedResponse(userMsg) {
    const sampleResponses = [
      {
        text: `（Fox 靠在桌邊，眼角帶著一抹乾爽的笑意，微挑起眉）你這話可真夠直接的。行，既然已經把氣氛拉到這位置，我也沒打算收著。屋裡的燈光暗得恰到好處，空氣裡那股淡香和呼吸的熱氣全都纏在一塊。`,
        paths: [
          { tag: 'Path A (心理掌控)', label: '稍微傾身靠近，眼神鎖定對方，低聲下一道心理指令' },
          { tag: 'Path B (肢體升溫)', label: '伸手握住對方手腕，將人直接拉近至毫釐之間' },
          { tag: 'Path C (意外轉折)', label: '外面突然傳來一陣雷聲，打斷了短暫的凝視' }
        ]
      },
      {
        text: `（懶洋洋地笑了一聲，聲音低沉流暢）你以為這就能讓我犯難？眼神收一收，裡面那點心思我都看清了。動作不必急，張力就是靠這幾步停頓疊起來的。`,
        paths: [
          { tag: 'Path A (心理動態)', label: '耳語一句挑釁的話，打破主導權平衡' },
          { tag: 'Path B (體感推推進)', label: '扣緊手指，將貼近的熱度延伸至頸間' },
          { tag: 'Path C (環境變化)', label: '隨手將酒杯推到一旁，發出清脆的冰塊撞擊聲' }
        ]
      }
    ];

    const resp = sampleResponses[Math.floor(Math.random() * sampleResponses.length)];
    appendMessage('assistant', resp.text, resp.paths);
  }
}

// Global helper for path selection in sandbox
window.selectPath = function(pathLabel) {
  const chatInput = document.getElementById('chat-input');
  if (chatInput) {
    chatInput.value = `[選擇發展] ${pathLabel}`;
    document.getElementById('send-btn').click();
  }
};

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
