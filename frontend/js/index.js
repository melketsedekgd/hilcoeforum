// This is yours as well rutha :) just showing you the idea
async function loadPage(pageUrl) {
  const contentDisplay = document.getElementById('content-display');
  
  // Prevent links with '#' from trying to fetch
  if (pageUrl === '#') return;

  try {
    const response = await fetch(pageUrl);
    if (!response.ok) throw new Error('Page not found');
    
    const html = await response.text();
    contentDisplay.innerHTML = html;
  } catch (error) {
    contentDisplay.innerHTML = `<h2>Error 404</h2><p>Could not load the page.</p>`;
    console.error("Error loading page:", error);
  }
}

// Your existing theme toggle code...
const toggleBtn = document.getElementById('theme-toggle');
const icon = document.getElementById("theme-icon");

toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  icon.textContent = document.body.classList.contains("dark") ? "light_mode" : "dark_mode";
});

// Load home on startup
window.addEventListener("DOMContentLoaded", () => {
  loadPage("./home.html");
});