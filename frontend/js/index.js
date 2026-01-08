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
  } catch (error) {
    console.error("Error loading page:", error);
    contentArea.innerHTML = "<h2>Error loading page</h2>";
  }
}

// theme toggle
const toggleBtn = document.getElementById('theme-toggle');
const icon = document.getElementById("theme-icon");

if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
        document.body.classList.toggle("dark");
        icon.textContent = document.body.classList.contains("dark") ? "light_mode" : "dark_mode";
    });
}

// defalult load home page
window.addEventListener("DOMContentLoaded", () => {
  loadPage("./home.html");
});