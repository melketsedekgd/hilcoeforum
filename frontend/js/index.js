// Function to load different HTML files into the main area
async function loadPage(fileName) {
    const display = document.getElementById('content-display');
    
    try {
        // Fetch the file (e.g., home.html or askquestions.html)
        const response = await fetch(fileName);
        
        if (!response.ok) throw new Error('File not found');
        
        const html = await response.text();
        
        // Inject the content into the display div
        display.innerHTML = html;
        
    } catch (err) {
        display.innerHTML = `<div style="padding:20px;">
            <h2>Content Not Found</h2>
            <p>Make sure ${fileName} is in the same folder as index.html.</p>
        </div>`;
    }
}

// Function to filter the questions (Search Bar)
function doSearch() {
    let input = document.getElementById('search').value.toLowerCase();
    // This looks for any element with the class 'question-card' inside the loaded HTML
    let cards = document.getElementsByClassName('question-card');
    
    for (let card of cards) {
        let text = card.innerText.toLowerCase();
        card.style.display = text.includes(input) ? "block" : "none";
    }
}

// Automatically load the Home page when the site first opens
window.onload = () => loadPage('home.html');