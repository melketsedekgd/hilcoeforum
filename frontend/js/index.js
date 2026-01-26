// Simplified navigation & UI script
// Clear, minimal implementation that keeps the original features:
// - page loading into `#content-display`
// - question rendering from `QUESTIONS`
// - bookmarks saved in localStorage
// - sidebar + overlay for mobile
// - theme toggle persistence
// - basic auth demo (signup/signin)

const QUESTIONS = {
  q1: {
    id: 'q1',
    title: 'How do I center a div in CSS?',
    tag: 'CSS',
    author: 'student123',
    body: "What's the best modern approach to center a div both horizontally and vertically?",
    answers: [
      { id: 'a1', author: 'cssguru', text: 'Use Flexbox: display:flex; justify-content:center; align-items:center;', votes: 42, accepted: true },
      { id: 'a2', author: 'gridmaster', text: 'Or CSS Grid: display:grid; place-items:center;', votes: 12 }
    ]
  },
  q2: {
    id: 'q2',
    title: "What's the difference between let and const in JavaScript?",
    tag: 'JavaScript',
    author: 'john_d',
    body: 'When should I use let vs const in modern JS?',
    answers: [ { id: 'a3', author: 'mentor', text: 'Use const by default; use let for reassignments.', votes: 31 } ]
  }
};
window.QUESTIONS = QUESTIONS;

// small storage wrapper so we can replace localStorage easily later
const storage = {
  get(key, def) {
    try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : def; } catch (e) { return def; }
  },
  set(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {} },
  remove(key) { try { localStorage.removeItem(key); } catch (e) {} }
};

// lightweight app state object (clearer than a lone global variable)
window.hlState = window.hlState || { openQuestionId: null };
function openQuestion(id) { window.hlState.openQuestionId = id; loadPage('./questions.html'); }

// Bookmarks (simple localStorage array)
function getBookmarks() { 
  return storage.get('hl_bookmarks', []); 
}
function isBookmarked(id) { 
  return getBookmarks().includes(id); 
}
function toggleBookmark(id) {
  const list = getBookmarks();
  const idx = list.indexOf(id);
  if (idx === -1) {
    list.push(id); 
  }else{
    list.splice(idx, 1);
  }
  storage.set('hl_bookmarks', list);
}
function removeBookmark(id) { 
  storage.set('hl_bookmarks', getBookmarks().filter(x => x !== id)); 
}

// Update bookmark buttons shown in the DOM
function syncBookmarksInDOM() {
  document.querySelectorAll('.question-card[data-id]').forEach(card => {
    const id = card.getAttribute('data-id');
    const btn = card.querySelector('.bookmark');
    if (!btn) return;
    const icon = btn.querySelector('.material-icons');
    const active = isBookmarked(id);
    btn.classList.toggle('active', active);
    btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    if (icon) icon.textContent = active ? 'bookmark' : 'bookmark_border';
  });
}

// Render a question page using global QUESTIONS and a marker set by openQuestion()
function populateQuestionFromGlobals() {
  const id = window.hlState?.openQuestionId;
  if (!id) return;
  const q = QUESTIONS[id];
  if (!q) return;
  const titleEl = document.querySelector('.main-question-block h2');
  if (titleEl) titleEl.textContent = q.title;
  const tagEl = document.querySelector('.main-question-block .tag');
  if (tagEl) tagEl.textContent = q.tag; // fixed typo: was ragEl
  const authorMeta = document.querySelector('.main-question-block .author-meta'); 
  if (authorMeta) authorMeta.textContent = 'By ' + q.author;
  const bodyEl = document.querySelector('.main-question-block .full-text'); 
  if (bodyEl) bodyEl.textContent = q.body;

  // ensure we have an answers container to append into
  let answersSection = document.querySelector('.answers-section');
  if (!answersSection) {
    const container = document.querySelector('.main-question-block');
    if (container) {
      answersSection = document.createElement('div');
      answersSection.className = 'answers-section';
      answersSection.innerHTML = '<h3 id="answers-heading"></h3>';
      container.appendChild(answersSection);
    }
  }

  if (answersSection) {
    const heading = answersSection.querySelector('#answers-heading'); 
    if (heading) heading.textContent = `${q.answers.length} Answers`;
    answersSection.querySelectorAll('.answer-card').forEach(n => n.remove());
    const tpl = document.getElementById('answer-template');
    q.answers.forEach(ans => {
      if (tpl && tpl.content) {
        const node = tpl.content.firstElementChild.cloneNode(true);
        if (ans.accepted) {
          node.classList.add('accepted');
          const badge = node.querySelector('.badge-accepted'); 
          if (badge) badge.style.display = '';
        }
        const text = node.querySelector('.answer-text'); 
        if (text) text.textContent = ans.text;
        const count = node.querySelector('.count'); 
        if (count) count.textContent = String(ans.votes);
        const author = node.querySelector('.author'); 
        if (author) author.textContent = 'By ' + ans.author;
        answersSection.appendChild(node);
      } else {
        // fallback to simple DOM creation if template missing
        const card = document.createElement('div');
        card.className = 'answer-card' + (ans.accepted ? ' accepted' : '');
        card.innerHTML = `${ans.accepted ? '<div class="badge-accepted">✓ Accepted</div>' : ''}
          <p>${ans.text}</p>
          <div class="votes-section">
            <button class="upvote" title="Upvote"><span class="material-icons">arrow_upward</span></button>
            <span class="count">${ans.votes}</span>
            <button class="downvote" title="Downvote"><span class="material-icons">arrow_downward</span></button>
          </div>
          <div class="author">By ${ans.author}</div>`;
        answersSection.appendChild(card);
      }
    });
  }
  window.hlState.openQuestionId = null;
}

// Simple page loader: fetches an HTML fragment and injects into #content-display
async function loadPage(pageUrl) {
  const contentArea = document.getElementById('content-display');
  if (!contentArea || pageUrl === '#') return;
  contentArea.classList.add('fade-out');
  try {
    const res = await fetch(pageUrl);
    if (!res.ok) throw new Error('Not found');
    const html = await res.text();
    contentArea.innerHTML = html;
    // populate dynamic content and sync UI
    populateQuestionFromGlobals();
    syncBookmarksInDOM();
    // small delay so CSS transitions can run
    requestAnimationFrame(() => {
      contentArea.classList.remove('fade-out');
      contentArea.classList.add('fade-in');
      setTimeout(() => contentArea.classList.remove('fade-in'), 300);
    });
    // focus first meaningful element for accessibility
    setTimeout(() => {
      const first = contentArea.querySelector('h1, h2, h3, a, button, input, [tabindex]:not([tabindex="-1"])');
      if (first) { 
        if (!first.hasAttribute('tabindex')) first.setAttribute('tabindex', '-1'); first.focus(); 
      }
      const live = document.getElementById('hl-aria-live'); 
      if (live) live.textContent = `Loaded ${pageUrl.split('/').pop()}`;
    }, 50);
    // close mobile UI and mark active nav
    document.querySelector('.sidebar')?.classList.remove('open');
    document.getElementById('mobile-overlay')?.classList.remove('visible');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setActiveNav(pageUrl);
  } catch (err) {
    console.error('loadPage error', err);
    contentArea.classList.remove('fade-out');
    contentArea.innerHTML = '<h2>Error loading page</h2>';
  }
}

// Sidebar & overlay
const overlay = document.getElementById('mobile-overlay') || (function () { const d = document.createElement('div'); d.id = 'mobile-overlay'; document.body.appendChild(d); return d; })();
function openSidebar() { document.querySelector('.sidebar')?.classList.add('open'); overlay.classList.add('visible'); }
function closeSidebar() { document.querySelector('.sidebar')?.classList.remove('open'); overlay.classList.remove('visible'); }
document.getElementById('sidebar-toggle')?.addEventListener('click', () => {
  const sidebar = document.querySelector('.sidebar');
  if (sidebar?.classList.contains('open')) closeSidebar(); else openSidebar();
});
overlay.addEventListener('click', closeSidebar);
document.addEventListener('keydown', (e) => { 
  if (e.key === 'Escape') closeSidebar(); 
});

// Mark active navigation item
function setActiveNav(pageUrl) {
  document.querySelectorAll('.nav-item').forEach(n => { n.classList.remove('active'); n.removeAttribute('aria-current'); });
  const match = Array.from(document.querySelectorAll('.nav-item')).find(n => n.getAttribute('onclick')?.includes(pageUrl));
  if (match) { 
    match.classList.add('active'); match.setAttribute('aria-current', 'page'); 
  }
}

// Global click handler for small interactive pieces (upvote, downvote, bookmark, auth tabs, nav close)
document.addEventListener('click', (e) => {
  const up = e.target.closest('.upvote');
  const down = e.target.closest('.downvote');
  const bookmark = e.target.closest('.bookmark');
  const panelBtn = e.target.closest('[data-panel-target]');
  const navBtn = e.target.closest('button[onclick], a[onclick]');

  if (up) { 
    const count = up.parentElement.querySelector('.count'); 
    if (count) count.textContent = String(Number(count.textContent || 0) + 1); 
  }
  if (down) { 
    const count = down.parentElement.querySelector('.count');
    if (count) count.textContent = String(Math.max(0, Number(count.textContent || 0) - 1)); 
  }

  if (bookmark) {
    const card = bookmark.closest('.question-card'); const id = card?.getAttribute('data-id');
    if (id) { toggleBookmark(id); const active = isBookmarked(id); bookmark.classList.toggle('active', active); bookmark.setAttribute('aria-pressed', active ? 'true' : 'false'); const icon = bookmark.querySelector('.material-icons'); if (icon) icon.textContent = active ? 'bookmark' : 'bookmark_border'; }
    else { const newState = !(bookmark.getAttribute('aria-pressed') === 'true'); bookmark.classList.toggle('active', newState); bookmark.setAttribute('aria-pressed', newState ? 'true' : 'false'); const icon = bookmark.querySelector('.material-icons'); if (icon) icon.textContent = newState ? 'bookmark' : 'bookmark_border'; }
  }

  if (panelBtn) {
    const target = panelBtn.getAttribute('data-panel-target');
    const container = document.querySelector('.auth-slides');
    if (container) container.setAttribute('data-state', target);
    document.querySelectorAll('.auth-panel').forEach(p => p.classList.remove('active'));
    document.querySelector(`.auth-panel[data-panel="${target}"]`)?.classList.add('active');
    panelBtn.setAttribute('aria-selected', 'true');
    panelBtn.parentElement?.querySelectorAll('[data-panel-target]')?.forEach(b => { if (b !== panelBtn) b.setAttribute('aria-selected', 'false'); });
  }

  if (navBtn && navBtn.getAttribute('onclick')?.includes('loadPage')) closeSidebar();
});

// Theme toggle
const toggleBtn = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
function applyTheme(theme) { if (theme === 'dark') { document.body.setAttribute('data-theme', 'dark'); if (themeIcon) themeIcon.textContent = 'light_mode'; } else { document.body.removeAttribute('data-theme'); if (themeIcon) themeIcon.textContent = 'dark_mode'; } }
const stored = localStorage.getItem('hl_theme'); if (stored) applyTheme(stored);
toggleBtn?.addEventListener('click', () => { const isDark = document.body.getAttribute('data-theme') === 'dark'; const next = isDark ? 'light' : 'dark'; applyTheme(next); localStorage.setItem('hl_theme', next); });

// Auth forms (demo only)
document.addEventListener('submit', (e) => {
  const form = e.target;
  if (form.id === 'signup-form') {
    e.preventDefault();
    const fm = new FormData(form); const name = fm.get('name')?.toString() || ''; const email = fm.get('email')?.toString() || ''; const password = fm.get('password')?.toString() || '';
    if (!email || !password) { 
      alert('Please provide email and password'); return; 
    }
    const accounts = JSON.parse(localStorage.getItem('hl_accounts') || '{}'); accounts[email] = { name, password }; localStorage.setItem('hl_accounts', JSON.stringify(accounts));
    document.querySelectorAll('.auth-panel').forEach(p => p.classList.remove('active'));
    const signin = document.querySelector('.auth-panel[data-panel="signin"]'); signin?.classList.add('active');
    const msg = document.createElement('div'); msg.className = 'surface'; msg.style.margin = '8px 0'; msg.textContent = `Welcome ${name || email}! Account created — sign in to continue.`; signin?.insertBefore(msg, signin.firstChild); setTimeout(() => msg.remove(), 5000);
  }
  if (form.id === 'signin-form') {
    e.preventDefault();
    const fm = new FormData(form); const email = fm.get('email')?.toString() || ''; const password = fm.get('password')?.toString() || '';
    const accounts = JSON.parse(localStorage.getItem('hl_accounts') || '{}');
    if (accounts[email] && accounts[email].password === password) {
      const container = document.querySelector('.auth-slides'); container.innerHTML = `<div class="surface" style="padding:1rem"><h2>Hi ${accounts[email].name || email}</h2><p class="muted">You're signed in (demo). Close this to continue.</p></div>`;
      localStorage.setItem('hl_session', JSON.stringify({ email }));
    } else {
      alert('Invalid credentials (demo).');
    }
  }
});

// Single DOMContentLoaded: initialize UI and load home
window.addEventListener('DOMContentLoaded', () => {
  const contentArea = document.getElementById('content-display'); 
  if (contentArea) {
    contentArea.classList.add('fade-in');
  }
  // ensure auth slides default state
const authSlides = document.querySelector('.auth-slides'); 
if (authSlides && !authSlides.getAttribute('data-state')){ 
  authSlides.setAttribute('data-state', 'signin');
}
  loadPage('./home.html');
});
