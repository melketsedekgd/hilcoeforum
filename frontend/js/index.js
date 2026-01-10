// This is yours as well rutha :) just showing you the idea
// This function handles loading the "home.html", "about.html", etc.
async function loadPage(pageUrl) {
  const contentArea = document.getElementById('content-display');
  
  if (pageUrl === '#') return;

  try {
    const response = await fetch(pageUrl);
    if (!response.ok) throw new Error('Page not found');
    
    const html = await response.text();
    contentArea.innerHTML = html;
    // close sidebar on mobile after navigation
    document.querySelector('.sidebar')?.classList.remove('open');
    // scroll to top of loaded content
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (error) {
    console.error("Error loading page:", error);
    contentArea.innerHTML = "<h2>Error loading page</h2>";
  }
}

// sidebar toggle (button #sidebar-toggle) + overlay behavior
const sidebarToggle = document.getElementById('sidebar-toggle');
const overlay = document.createElement('div');
overlay.id = 'mobile-overlay';
document.body.appendChild(overlay);

if (sidebarToggle) {
  sidebarToggle.addEventListener('click', () => {
    const sidebar = document.querySelector('.sidebar');
    sidebar?.classList.toggle('open');
    overlay.classList.toggle('visible');
  });
}

// clicking overlay closes mobile nav
overlay.addEventListener('click', () => {
  document.querySelector('.sidebar')?.classList.remove('open');
  overlay.classList.remove('visible');
});

// when loadPage is invoked from nav, ensure mobile sidebar closes
document.addEventListener('click', (e) => {
  const btn = e.target.closest('button[onclick], a[onclick]');
  if (!btn) return;
  if (btn.getAttribute('onclick')?.includes('loadPage')) {
    document.querySelector('.sidebar')?.classList.remove('open');
    overlay.classList.remove('visible');
  }
});

// theme toggle: use data-theme on body so CSS override applies (prefers-color-scheme still active otherwise)
const toggleBtn = document.getElementById('theme-toggle');
const themeIcon = document.getElementById("theme-icon");
if (toggleBtn) {
  toggleBtn.addEventListener('click', () => {
    const isDark = document.body.getAttribute('data-theme') === 'dark';
    if (isDark) {
      document.body.removeAttribute('data-theme');
      themeIcon.textContent = 'dark_mode';
    } else {
      document.body.setAttribute('data-theme', 'dark');
      themeIcon.textContent = 'light_mode';
    }
  });
}

// defalult load home page
window.addEventListener("DOMContentLoaded", () => {
  loadPage("./home.html");
});