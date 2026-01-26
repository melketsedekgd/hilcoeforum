// Enhanced navigation and UI interactions (vanilla JS)
// Handles page fetch/load transitions, mobile sidebar, overlay, and theme persistence

// Small client-side dataset for demo question rendering
const QUESTIONS = {
  q1: {
    id: 'q1',
    title: 'How do I center a div in CSS?',
    tag: 'CSS',
    author: 'student123',
    body: "What's the best modern approach to center a div both horizontally and vertically?",
    answers: [
      {id:'a1', author:'cssguru', text:'Use Flexbox: display:flex; justify-content:center; align-items:center;', votes:42, accepted:true},
      {id:'a2', author:'gridmaster', text:'Or CSS Grid: display:grid; place-items:center;', votes:12}
    ]
  },
  q2: {
    id: 'q2',
    title: "What's the difference between let and const in JavaScript?",
    tag: 'JavaScript',
    author: 'john_d',
    body: "When should I use let vs const in modern JS?",
    answers: [ {id:'a3', author:'mentor', text:'Use const by default for bindings that do not change; use let when you need reassignment.', votes:31} ]
  }
};

// expose QUESTIONS for pages loaded into the content area
window.QUESTIONS = QUESTIONS;

function openQuestion(id){
  window.__openQuestionId = id;
  loadPage('./questions.html');
}

// Bookmark persistence helpers
function getBookmarks(){
  return JSON.parse(localStorage.getItem('hl_bookmarks')||'[]');
}
function toggleBookmark(id){
  const list = getBookmarks();
  const idx = list.indexOf(id);
  if(idx === -1) list.push(id); else list.splice(idx,1);
  localStorage.setItem('hl_bookmarks', JSON.stringify(list));
}

function removeBookmark(id){
  const list = getBookmarks();
  const filtered = list.filter(x=> x !== id);
  localStorage.setItem('hl_bookmarks', JSON.stringify(filtered));
}
function isBookmarked(id){
  return getBookmarks().indexOf(id) !== -1;
}

// sync bookmark buttons shown on home or other pages
function syncBookmarksInDOM(){
  try{
    const cards = document.querySelectorAll('.question-card[data-id]');
    cards.forEach(card=>{
      const id = card.getAttribute('data-id');
      const btn = card.querySelector('.bookmark');
      if(!btn) return;
      const icon = btn.querySelector('.material-icons');
      if(isBookmarked(id)) { btn.classList.add('active'); if(icon) icon.textContent='bookmark'; }
      else { btn.classList.remove('active'); if(icon) icon.textContent='bookmark_border'; }
    });
  }catch(e){/* ignore */}
}

function populateQuestionFromGlobals(){
  const id = window.__openQuestionId;
  if(!id) return;
  const q = QUESTIONS[id];
  if(!q) return;
  // title
  const titleEl = document.querySelector('.main-question-block h2');
  if(titleEl) titleEl.textContent = q.title;
  // tag and author
  const tagEl = document.querySelector('.main-question-block .tag');
  if(tagEl) tagEl.textContent = q.tag;
  const authorMeta = document.querySelector('.main-question-block .author-meta');
  if(authorMeta) authorMeta.textContent = 'By ' + q.author;
  // body
  const bodyEl = document.querySelector('.main-question-block .full-text');
  if(bodyEl) bodyEl.textContent = q.body;
  // answers
  const answersSection = document.querySelector('.answers-section');
  if(answersSection){
    const heading = answersSection.querySelector('#answers-heading');
    if(heading) heading.textContent = `${q.answers.length} Answers`;
    // remove existing answer cards
    const existing = answersSection.querySelectorAll('.answer-card');
    existing.forEach(n=>n.remove());
    // append answers
    q.answers.forEach(ans=>{
      const card = document.createElement('div');
      card.className = 'answer-card' + (ans.accepted ? ' accepted' : '');
      card.innerHTML = `${ans.accepted?'<div class="badge-accepted">✓ Accepted</div>':''}
        <p>${ans.text}</p>
        <div class="votes-section">
          <button class="upvote" title="Upvote"><span class="material-icons">arrow_upward</span></button>
          <span class="count">${ans.votes}</span>
          <button class="downvote" title="Downvote"><span class="material-icons">arrow_downward</span></button>
        </div>
        <div class="author">By ${ans.author}</div>`;
      answersSection.appendChild(card);
    });
  }
  // clear marker
  window.__openQuestionId = null;
}

async function loadPage(pageUrl) {
  const contentArea = document.getElementById('content-display');
  if (!contentArea) return;
  if (pageUrl === '#') return;

  // graceful fade-out
  contentArea.classList.add('fade-out');
  try {
    await new Promise(r => setTimeout(r, 160));
    const response = await fetch(pageUrl);
    if (!response.ok) throw new Error('Page not found');
    const html = await response.text();
    contentArea.innerHTML = html;
    // if a question id was set before loading, populate dynamic content
    setTimeout(()=> populateQuestionFromGlobals(), 50);
    // sync bookmarks/buttons once DOM is injected
    setTimeout(()=> syncBookmarksInDOM(), 80);
    // fade in new content
    contentArea.classList.remove('fade-out');
    contentArea.classList.add('fade-in');
    setTimeout(() => contentArea.classList.remove('fade-in'), 300);

    // move keyboard focus into content area for screen readers/keyboard users
    setTimeout(()=>{
      const first = contentArea.querySelector('h1, h2, h3, a, button, input, [tabindex]:not([tabindex="-1"])');
      if(first){
        if(!first.hasAttribute('tabindex')) first.setAttribute('tabindex','-1');
        first.focus();
      }
      // announce load to assistive tech
      const live = document.getElementById('hl-aria-live');
      if(live) live.textContent = `Loaded ${pageUrl.split('/').pop()}`;
    }, 140);

    // close mobile nav after navigation
    document.querySelector('.sidebar')?.classList.remove('open');
    overlay.classList.remove('visible');

    // scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // mark active nav button
    setActiveNav(pageUrl);
  } catch (error) {
    console.error('Error loading page:', error);
    contentArea.classList.remove('fade-out');
    contentArea.innerHTML = '<h2>Error loading page</h2>';
  }
}

// sidebar toggle and overlay
const sidebarToggle = document.getElementById('sidebar-toggle');
const overlay = document.createElement('div');
overlay.id = 'mobile-overlay';
document.body.appendChild(overlay);

function openSidebar() {
  const sidebar = document.querySelector('.sidebar');
  sidebar?.classList.add('open');
  overlay.classList.add('visible');
}
function closeSidebar() {
  const sidebar = document.querySelector('.sidebar');
  sidebar?.classList.remove('open');
  overlay.classList.remove('visible');
}

if (sidebarToggle) {
  sidebarToggle.addEventListener('click', () => {
    const sidebar = document.querySelector('.sidebar');
    const isOpen = sidebar?.classList.contains('open');
    if (isOpen) closeSidebar(); else openSidebar();
  });
  sidebarToggle.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); sidebarToggle.click(); }
  });
}

overlay.addEventListener('click', closeSidebar);

// allow Esc to close mobile menu
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeSidebar();
});

// when a nav link triggers loadPage, close mobile sidebar (covers both buttons and anchors)
document.addEventListener('click', (e) => {
  const btn = e.target.closest('button[onclick], a[onclick]');
  if (!btn) return;
  if (btn.getAttribute('onclick')?.includes('loadPage')) {
    closeSidebar();
  }
});

// highlight active nav item based on loaded page
function setActiveNav(pageUrl){
  const navs = document.querySelectorAll('.nav-item');
  navs.forEach(n => { n.classList.remove('active'); n.removeAttribute('aria-current'); });
  const match = Array.from(navs).find(n => n.getAttribute('onclick')?.includes(pageUrl));
  if(match) { match.classList.add('active'); match.setAttribute('aria-current','page'); }
}

// event delegation for interactive elements inside loaded pages
document.addEventListener('click', (e)=>{
  const up = e.target.closest('.upvote');
  const down = e.target.closest('.downvote');
  const bookmark = e.target.closest('.bookmark');
  if(up){
    const count = up.parentElement.querySelector('.count');
    if(count) count.textContent = String(Number(count.textContent||0)+1);
  }
  if(down){
    const count = down.parentElement.querySelector('.count');
    if(count) count.textContent = String(Math.max(0, Number(count.textContent||0)-1));
  }
  if(bookmark){
    const card = bookmark.closest('.question-card');
    const id = card?.getAttribute('data-id');
    if(id){
      toggleBookmark(id);
      // update UI state and aria-pressed
      const active = isBookmarked(id);
      bookmark.classList.toggle('active', active);
      bookmark.setAttribute('aria-pressed', active ? 'true' : 'false');
      const icon = bookmark.querySelector('.material-icons');
      if(icon) icon.textContent = active ? 'bookmark' : 'bookmark_border';
    } else {
      // fallback toggle
      const newState = !(bookmark.getAttribute('aria-pressed') === 'true');
      bookmark.classList.toggle('active', newState);
      bookmark.setAttribute('aria-pressed', newState ? 'true' : 'false');
      const icon = bookmark.querySelector('.material-icons');
      if(icon) icon.textContent = newState ? 'bookmark' : 'bookmark_border';
    }
  }
});

// auth panel toggle (delegated since login page loads into content area)
document.addEventListener('click', (e)=>{
  const btn = e.target.closest('[data-panel-target]');
  if(!btn) return;
  const target = btn.getAttribute('data-panel-target');
  // toggle visual panel and set slide state on container for animation
  const container = document.querySelector('.auth-slides');
  if(container) container.setAttribute('data-state', target);
  document.querySelectorAll('.auth-panel').forEach(p=> p.classList.remove('active'));
  const panel = document.querySelector(`.auth-panel[data-panel="${target}"]`);
  panel?.classList.add('active');
  btn.setAttribute('aria-selected','true');
  // update siblings
  btn.parentElement.querySelectorAll('[data-panel-target]').forEach(b=>{ if(b!==btn) b.setAttribute('aria-selected','false'); });
});

// theme toggle with persistence
const toggleBtn = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
function applyTheme(theme) {
  if (theme === 'dark') {
    document.body.setAttribute('data-theme', 'dark');
    if (themeIcon) themeIcon.textContent = 'light_mode';
  } else {
    document.body.removeAttribute('data-theme');
    if (themeIcon) themeIcon.textContent = 'dark_mode';
  }
}

// init theme from localStorage
const stored = localStorage.getItem('hl_theme');
if (stored) applyTheme(stored);

if (toggleBtn) {
  toggleBtn.addEventListener('click', () => {
    const isDark = document.body.getAttribute('data-theme') === 'dark';
    const next = isDark ? 'light' : 'dark';
    applyTheme(next === 'dark' ? 'dark' : 'light');
    localStorage.setItem('hl_theme', next === 'dark' ? 'dark' : 'light');
  });
}

// default load home page
window.addEventListener('DOMContentLoaded', () => {
  // make sure content area exists and is visible before loading
  const contentArea = document.getElementById('content-display');
  if (contentArea) contentArea.classList.add('fade-in');
  loadPage('./home.html');
});

// ensure auth slides initial state (if login page loaded later, this will be used)
document.addEventListener('DOMContentLoaded', ()=>{
  const authSlides = document.querySelector('.auth-slides');
  if(authSlides && !authSlides.getAttribute('data-state')) authSlides.setAttribute('data-state','signin');
});

// handle auth form submissions (signup/signin) in loaded auth panels
document.addEventListener('submit', (e)=>{
  const form = e.target;
  if(form.id === 'signup-form'){
    e.preventDefault();
    const fm = new FormData(form);
    const name = fm.get('name')?.toString() || '';
    const email = fm.get('email')?.toString() || '';
    const password = fm.get('password')?.toString() || '';
    if(!email || !password){ alert('Please provide email and password'); return; }
    // save simple account (no security, demo only)
    const accounts = JSON.parse(localStorage.getItem('hl_accounts') || '{}');
    accounts[email] = { name, password };
    localStorage.setItem('hl_accounts', JSON.stringify(accounts));
    // switch to signin panel and show temporary message
    document.querySelectorAll('.auth-panel').forEach(p=> p.classList.remove('active'));
    const signin = document.querySelector('.auth-panel[data-panel="signin"]');
    signin?.classList.add('active');
    const msg = document.createElement('div'); msg.className='surface'; msg.style.margin='8px 0'; msg.textContent = `Welcome ${name || email}! Account created — sign in to continue.`;
    signin?.insertBefore(msg, signin.firstChild);
    setTimeout(()=> msg.remove(), 5000);
  }
  if(form.id === 'signin-form'){
    e.preventDefault();
    const fm = new FormData(form);
    const email = fm.get('email')?.toString() || '';
    const password = fm.get('password')?.toString() || '';
    const accounts = JSON.parse(localStorage.getItem('hl_accounts') || '{}');
    if(accounts[email] && accounts[email].password === password){
      // simple signed-in state: show greeting
      const container = document.querySelector('.auth-slides');
      container.innerHTML = `<div class="surface" style="padding:1rem"><h2>Hi ${accounts[email].name || email}</h2><p class="muted">You're signed in (demo). Close this to continue.</p></div>`;
      // optionally persist session
      localStorage.setItem('hl_session', JSON.stringify({email}));
    } else {
      alert('Invalid credentials (demo).');
    }
  }
});
// defalult load home page
window.addEventListener("DOMContentLoaded", () => {
  loadPage("./home.html");
});


// MELKE MELKE MELKE MELKE MELKE MELKE MELKE MELKE MELKE

// MELKE MELKE MELKE MELKE MELKE MELKE MELKE MELKE MELKE

// MELKE MELKE MELKE MELKE MELKE MELKE MELKE MELKE MELKE

// MELKE MELKE MELKE MELKE MELKE MELKE MELKE MELKE MELKE

// MELKE MELKE MELKE MELKE MELKE MELKE MELKE MELKE MELKE
