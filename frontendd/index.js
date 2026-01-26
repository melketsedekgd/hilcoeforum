
    // Frontend API client for the local backend
    const API_BASE = 'http://localhost:3000';

    // Load questions when page loads
    async function loadQuestions() {
      const container = document.getElementById('bottom');
      try {
        const response = await fetch(`${API_BASE}/questions`);
        if (!response.ok) throw new Error('Network response was not ok');
        const questions = await response.json();
        container.innerHTML = '';

        if (!questions || questions.length === 0) {
          container.innerHTML = '<p style="padding: 20px;">No questions found. Be the first to ask!</p>';
          return;
        }

        questions.forEach(q => {
          const card = document.createElement('div');
          card.className = 'question-card';
          card.innerHTML = `
            <div class="card-header">
              <span class="category-tag">${q.category || 'uncategorized'}</span>
              <span id="question-votes-${q.id}" class="vote-count">${q.votes} votes</span>
            </div>
            <h3 class="question-title">${q.title}</h3>
            <div class="card-footer">
              <span>Asked by: <strong>${q.username}</strong></span>
              <span>${q.answer_count} answers</span>
            </div>
            <div style="margin-top:8px;">
              <button onclick="vote(${q.id}, 'up')">▲</button>
              <button onclick="vote(${q.id}, 'down')">▼</button>
            </div>
          `;
          card.onclick = () => console.log('Viewing question ID:', q.id);
          container.appendChild(card);
        });

      } catch (error) {
        console.error('Oops, something went wrong:', error);
        container.innerHTML = `<p style="color: red; padding: 20px;">Error connecting to server. Is the backend running?</p>`;
      }
    }

    async function viewAnswers(questionId) {
      const container = document.getElementById(`answers-${questionId}`);
      if (!container) return;
      container.style.display = 'block';
      container.innerHTML = '<em>Loading answers...</em>';

      try {
        const response = await fetch(`${API_BASE}/questions/${questionId}`);
        if (!response.ok) throw new Error('Failed to load answers');
        const data = await response.json();
        if (!data.answers || data.answers.length === 0) {
          container.innerHTML = '<em>No answers yet.</em>';
        } else {
          container.innerHTML = data.answers.map(a => `
            <div style="border-top: 1px solid #eee; padding-top: 8px; margin-top: 8px;">
              <div>${a.text}</div>
              <div style="font-size:0.9em; color:#666;">Answered by: <strong>${a.answer_author}</strong> • Votes: ${a.votes} • ${a.accepted ? '✅ Accepted' : ''}</div>
            </div>
          `).join('');
        }
      } catch (err) {
        container.innerHTML = `<em>Error: ${err.message}</em>`;
        console.error('Failed to load answers:', err);
      }
    }

    // Vote using POST to the API
    async function vote(id, direction) {
      try {
        const res = await fetch(`${API_BASE}/questions/${id}/vote`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ direction })
        });
        if (!res.ok) throw new Error('Vote request failed');
        const data = await res.json();
        const el = document.getElementById(`question-votes-${id}`);
        if (el) el.textContent = `${data.votes} votes`;
      } catch (err) {
        console.error('Vote failed:', err);
      }
    }

    // Handle form submission if form exists
    const qForm = document.getElementById('questionForm');
    if (qForm) {
      qForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('title').value;
        const category = document.getElementById('category').value || null;
        const author_id = parseInt(document.getElementById('authorId').value, 10);

        const response = await fetch(`${API_BASE}/questions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, category, author_id })
        });

        if (response.ok) {
          alert('Question posted!');
          qForm.reset();
          loadQuestions();
        } else {
          const error = await response.json().catch(() => ({ error: 'Unknown error' }));
          alert('Error: ' + error.error);
        }
      });
    }

    // Initial Load
    loadQuestions();