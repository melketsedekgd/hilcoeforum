

// Supabase Setup – put this at the very top
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

export const supabase = createClient(
    'https://xlrnaxmjykcldherfywy.supabase.co', 
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhscm5heG1qeWtjbGRoZXJmeXd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3NTAzNTcsImV4cCI6MjA4NTMyNjM1N30.00eWFylerK7u76JiRc6wecMf_CpeAV2m2YqSDPR_170'
);

// App State
const state = {
    posts: [],
    categoryCounts: { all: 0 },
    selectedCategory: "all",
    selectedPost: null,
    isDarkMode: false,
    isMobileMenuOpen: false,
    currentSort: 'recent',
    searchQuery: '',
    currentUser: null           
};

//  4. Categories (static metadata)
const categories = [
    { id: "all",        name: "All Topics",   icon: "users"   },
    { id: "academics",  name: "Academics",    icon: "book"    },
    { id: "programming",name: "Programming",  icon: "code"    },
    { id: "projects",   name: "Projects",     icon: "lightbulb"},
    { id: "career",     name: "Career",       icon: "briefcase"},
    { id: "general",    name: "General",      icon: "coffee"   },
    { id: "about",      name: "About Hive",   icon: "info"    }
];

// ICON
const icons = {
    users: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>',
    book: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>',
    code: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>',
    lightbulb: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>',
    briefcase: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>',
    coffee: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line><line x1="14" y1="1" x2="14" y2="4"></line></svg>',
    eye: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>',
    thumbsUp: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>',
    messageCircle: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>',
    share: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>',
    info: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"> <circle cx="12" cy="12" r="10"></circle> <line x1="12" y1="16" x2="12" y2="12"></line> <line x1="12" y1="8"  x2="12.01" y2="8"></line> </svg>`,
    github: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"> <path d="M9 19c-5 1.5-5-2.5-7-3"/> <path d="M15 19c5 1.5 5-2.5 7-3"/> <path d="M12 2c5.5 0 10 3.5 10 9 0 4.5-3 8-7 9 v-3c0-1-.5-2-1.5-2 3.5-.5 7-2 7-6 0-1.5-.5-3-1.5-4"/> </svg>`,
    telegram: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"> <path d="M22 2L11 13"/> <path d="M22 2L15 22l-4-9-9-4z"/></svg>`
};

// DOM Elements
const darkModeBtn = document.getElementById('darkModeBtn');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileOverlay = document.getElementById('mobileOverlay');
const sidebar = document.getElementById('sidebar');
const categoriesNav = document.getElementById('categoriesNav');
const postsList = document.getElementById('postsList');
const categoryTitle = document.getElementById('categoryTitle');
const postCount = document.getElementById('postCount');
const newPostBtn = document.getElementById('newPostBtn');
const newPostModal = document.getElementById('newPostModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const cancelPostBtn = document.getElementById('cancelPostBtn');
const newPostForm = document.getElementById('newPostForm');
const postListView = document.getElementById('postListView');
const postDetailView = document.getElementById('postDetailView');



// Event Listeners
function attachEventListeners() {
    darkModeBtn.addEventListener('click', toggleDarkMode);
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    mobileOverlay.addEventListener('click', closeMobileMenu);
    newPostBtn.addEventListener('click', openNewPostModal);
    closeModalBtn.addEventListener('click', closeNewPostModal);
    cancelPostBtn.addEventListener('click', closeNewPostModal);
    newPostModal.addEventListener('click', (e) => {
        if (e.target === newPostModal) closeNewPostModal();
    });
    newPostForm.addEventListener('submit', handleNewPost);

}

// Dark Mode
function toggleDarkMode() {
    state.isDarkMode = !state.isDarkMode;
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', state.isDarkMode);
}

// Mobile Menu
function toggleMobileMenu() {
    state.isMobileMenuOpen = !state.isMobileMenuOpen;
    sidebar.classList.toggle('active');
    mobileOverlay.classList.toggle('active');
}

function closeMobileMenu() {
    state.isMobileMenuOpen = false;
    sidebar.classList.remove('active');
    mobileOverlay.classList.remove('active');
}

// Quick category counts from loaded data
function updateCategoryCounts() {
    const counts = { all: state.posts.length };
    state.posts.forEach(p => {
        counts[p.category] = (counts[p.category] || 0) + 1;
    });
    state.categoryCounts = counts;
}

// Render Categories on sidebar :)
function renderCategories() {
    categoriesNav.innerHTML = categories.map(cat => {
        const count = cat.id === 'about' ? null : (state.categoryCounts[cat.id] ?? 0);
        return `
            <button class="category-btn ${state.selectedCategory === cat.id ? 'active' : ''}" 
                    onclick="selectCategory('${cat.id}')">
                <div class="category-left">
                    <div class="category-icon">${icons[cat.icon]}</div>
                    <span>${cat.name}</span>
                </div>
                ${count !== null ? `<span class="category-count">${count}</span>` : ''}
            </button>
            `;
    }).join('');
}

// Select Category
function selectCategory(categoryId) {
    // Leaving About → restore normal forum view
    if (state.selectedCategory === 'about' && categoryId !== 'about') {
        postListView.style.display = 'block';
        postDetailView.style.display = 'none';
    }

    if (categoryId === 'about') {
        showAboutUs();
        closeMobileMenu();
        return;
    }

    state.selectedCategory = categoryId;
    closeMobileMenu();
    renderCategories();
    renderPosts();
}

function showAboutUs() {
    categoryTitle.textContent = "About Us";
    state.selectedCategory = 'about';
    renderCategories();

    postListView.style.display = 'none';
    postDetailView.style.display = 'none';

    const aboutView = document.getElementById('aboutView');
    aboutView.style.display = 'block';

    aboutView.innerHTML = `
<div class="post-detail">

    <div class="detail-card">
        <h1 class="detail-title">About Us</h1>

        <p class="detail-content">
            Hive Forum is a student-driven discussion platform built to help learners,
            developers, and creators ask better questions, share real knowledge, and
            grow together as a community.
        </p>

        <p class="detail-content">
            Inspired by platforms like Stack Overflow and Reddit, Hive focuses on
            clarity, collaboration, and learning by doing — not just consuming.
        </p>
    </div>

    <div class="detail-card">
        <h2 class="detail-title">Our Mission</h2>
        <p class="detail-content">
            To empower students and developers to learn faster by asking freely,
            answering honestly, and building knowledge together in a respectful space.
        </p>
    </div>

    <div class="detail-card">
        <h2 class="detail-title">What Makes Hive Different</h2>
        <ul class="detail-content">
            <li>✔ Student-focused discussions</li>
            <li>✔ Real projects, real problems</li>
            <li>✔ Clean UI, no distractions</li>
            <li>✔ Built by students, for students</li>
        </ul>
    </div>

    <div class="detail-card">
        <h2 class="detail-title">Contributors</h2>

        <div class="contributors">

            <div class="contributor">
                <strong>Samuel Mifta</strong>
                <div class="contributor-links">
                    <a href="https://github.com/Sami7ma" target="_blank" title="GitHub">
                        ${icons.github}
                    </a>
                    <a href="https://t.me/sami7ma" target="_blank" title="Telegram">
                        ${icons.telegram}
                    </a>
                </div>
            </div>

            <div class="contributor">
                <strong>Melketsedik Getener</strong>
                <div class="contributor-links">
                    <a href="https://github.com/melketsedekgd" target="_blank">
                        ${icons.github}
                    </a>
                    <a href="https://t.me/melkegd" target="_blank">
                        ${icons.telegram}
                    </a>
                </div>
            </div>

            <div class="contributor">
                <strong>Ruth Daniel</strong>
                <div class="contributor-links">
                    <a href="https://github.com/Ruthdme" target="_blank">
                        ${icons.github}
                    </a>
                    <a href="https://t.me/ruthTeffera" target="_blank">
                        ${icons.telegram}
                    </a>
                </div>
            </div>

        </div>
    </div>

</div>
`;
    window.scrollTo(0, 0);
}

// Render Posts
function renderPosts() {

    const aboutView = document.getElementById('aboutView');
    if (state.selectedCategory !== 'about') {
        aboutView.style.display = 'none';
    }
    let filtered = state.posts;

    if (state.searchQuery?.trim()) {
        const q = state.searchQuery.toLowerCase().trim();
        filtered = filtered.filter(p =>
            p.title.toLowerCase().includes(q) ||
            p.content.toLowerCase().includes(q) ||
            p.author.name.toLowerCase().includes(q) ||
            p.tags.some(t => t.toLowerCase().includes(q))
        );
    }

    if (state.selectedCategory !== 'all') {
        filtered = filtered.filter(p => p.category === state.selectedCategory);
    }

    categoryTitle.textContent = state.selectedCategory === 'all'
        ? 'All Discussions'
        : `${categories.find(c => c.id === state.selectedCategory)?.name || 'Category'} Discussions`;

    postCount.textContent = `${filtered.length} posts`;

    if (filtered.length === 0) {
        postsList.innerHTML = `<p class="no-results">No matching discussions found</p>`;
        return;
    }

    postsList.innerHTML = filtered.map(post => `
        <div class="post-card" onclick="showPostDetail('${post.id}')">
            <div class="post-header">
                <div class="avatar">${post.author.initials}</div>
                <div class="post-body">
                    <h3 class="post-title">${post.title}</h3>
                    <p class="post-content">${post.content.substring(0, 140)}${post.content.length > 140 ? '...' : ''}</p>
                    <div class="post-tags">${post.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>
                    <div class="post-meta">
                        
                        <div class="post-stats">
                            
                            <div class="stat">${icons.thumbsUp}<span>${post.likes}</span></div>
                            <div class="stat">${icons.messageCircle}<span>${post.replies}</span></div>
                        </div>

                        <div class="post-author-info">
                            <span>${post.author.name}</span> • <span>${post.timestamp}</span>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Render Post Detail
async function showPostDetail(postId) {
    // 1. Fetch the single question + author
    const { data: question, error: qError } = await supabase
        .from('questions')
        .select(`
            id,
            title,
            content,
            category,
            votes,
            created_at,
            author:users (username)
        `)
        .eq('id', postId)
        .single();

    if (qError || !question) {
        console.error('Error loading question:', qError);
        alert('Could not load this question');
        return;
    }

    // 2. Fetch all answers for this question + their authors
    const { data: answers, error: aError } = await supabase
        .from('answers')
        .select(`
            id,
            text,
            votes,
            created_at,
            author:users (username)
        `)
        .eq('question_id', postId)
        .order('created_at', { ascending: true });

    if (aError) {
        console.error('Error loading answers:', aError);
        // continue anyway — show question even without answers
    }

    // 3. Build the state.selectedPost object
    state.selectedPost = {
        id: question.id,
        title: question.title,
        content: question.content || "(No content provided)",
        author: {
            name: question.author?.username || "Anonymous",
            initials: (question.author?.username || "A")[0].toUpperCase()
        },
        category: question.category,
        timestamp: formatTimestamp(question.created_at),
        likes: question.votes || 0,
        replies: answers?.length || 0
    };

    // 4. Hide list, show detail view
    postListView.style.display = 'none';
    postDetailView.style.display = 'block';

    // 5. Build the HTML
    postDetailView.innerHTML = `
        <div class="post-detail">
            <button class="back-btn" onclick="backToForum()">
                ← Back to Forum
            </button>

            <div class="detail-card">
                <div class="detail-header">
                    <div class="avatar">${state.selectedPost.author.initials}</div>
                    <div class="author-info">
                        <span class="author-name">${state.selectedPost.author.name}</span>
                        <span class="post-time"> • ${state.selectedPost.timestamp}</span>
                        <span class="category-badge">${state.selectedPost.category}</span>
                    </div>
                </div>

                <h1 class="detail-title">${state.selectedPost.title}</h1>
                <p class="detail-content">${state.selectedPost.content}</p>

                <div class="detail-actions">
                    <button class="action-btn vote-btn" id="d1" data-id="${state.selectedPost.id}" data-type="question">
                        ${icons.thumbsUp}
                        <span class="vote-count">${state.selectedPost.likes}</span>
                    </button>
                    <button class="action-btn" id="d2">
                        ${icons.messageCircle}
                        <span>${state.selectedPost.replies}</span>
                    </button>
                </div>
            </div>

            <div class="detail-card replies-section">
                <h3>${state.selectedPost.replies} ${state.selectedPost.replies === 1 ? 'Reply' : 'Replies'}</h3>
                <div class="replies-list">
                    ${answers?.map(ans => `
                        <div class="reply">
                            <div class="avatar">${(ans.author?.username || "?")[0].toUpperCase()}</div>
                            <div class="reply-body">
                                <div class="reply-header">
                                    <span class="reply-author">${ans.author?.username || "Anonymous"}</span>
                                    <span>•</span>
                                    <span class="reply-time">${formatTimestamp(ans.created_at)}</span>
                                </div>
                                <p class="reply-content">${ans.text}</p>

                                <button class="action-btn vote-btn small" 
                                        onclick="toggleLike('${ans.id}', 'answer')">
                                    ${icons.thumbsUp}
                                    <span>${ans.votes || 0}</span>
                                </button>

                            </div>
                        </div>
                    `).join('') || '<p>No replies yet.</p>'}
                </div>
            </div>

            <!-- Reply form – add auth check later -->
            <div class="detail-card reply-form-section">
                <h3>Add a Reply</h3>
                <form class="reply-form" onsubmit="handleReply(event, '${postId}')">
                    <textarea class="form-textarea" placeholder="Share your thoughts..." required></textarea>
                    <button type="submit" class="btn btn-primary">Post Reply</button>
                </form>
            </div>
        </div>
    `;
    // Add this right after postDetailView.innerHTML = `...`
postDetailView.querySelectorAll('.vote-btn').forEach(button => {
    button.addEventListener('click', async () => {
        const id = button.dataset.id;
        const type = button.dataset.type;
        // call your function (no window. needed)
        await toggleLike(id, type);
    });
});

    window.scrollTo(0, 0);
}

// Back to Forum
function backToForum() {
    state.selectedPost = null;
    postListView.style.display = 'block';
    postDetailView.style.display = 'none';
    window.scrollTo(0, 0);
}

// Handle Reply – working version with Supabase
async function handleReply(e, questionId) {
    e.preventDefault();

    const textarea = e.target.querySelector('textarea');
    const text = textarea.value.trim();
    if (!text) return;

    // Get current logged-in user
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        alert("You need to be signed in to post a reply");
        openAuthModal();           // your existing login modal function
        return;
    }

    // Insert the new answer
    const { data, error } = await supabase
        .from('answers')
        .insert({
            question_id: questionId,
            author_id: user.id,     // ← real user ID from auth
            text: text
        })
        .select()                   // return the inserted row
        .single();

    if (error) {
        console.error("Failed to post reply:", error);
        alert("Could not post reply: " + (error.message || "unknown error"));
        return;
    }

    // Success
    textarea.value = '';           // clear the input
    showPostDetail(questionId);    // reload the post to show new reply
}


// MODAL FUNCTIONS
// new post and auth modals
function openNewPostModal() {
    newPostModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeNewPostModal() {
    newPostModal.classList.remove('active');
    document.body.style.overflow = '';
    newPostForm.reset();
}

function openAuthModal(isSignup = false) {
    const modal = document.getElementById('authModal');
    const title = document.getElementById('authTitle');
    const subtitle = document.getElementById('authSubtitle');
    const usernameField = document.getElementById('usernameField');
    const submitBtn = document.getElementById('authSubmitBtn');
    const switchText = document.getElementById('switchText');
    const switchBtn = document.getElementById('switchModeBtn');
    const message = document.getElementById('authMessage');

    // Reset form & message
    document.getElementById('authForm').reset();
    message.textContent = '';
    message.className = 'auth-message';

    if (isSignup) {
        title.textContent = 'Create Account';
        subtitle.textContent = 'Join to post, reply, and vote';
        usernameField.style.display = 'block';
        submitBtn.textContent = 'Sign Up';
        switchText.innerHTML = 'Already have an account? <button type="button" id="switchModeBtn">Sign In</button>';
    } else {
        title.textContent = 'Sign In';
        subtitle.textContent = 'to post questions, reply, or vote';
        usernameField.style.display = 'none';
        submitBtn.textContent = 'Sign In';
        switchText.innerHTML = 'Don\'t have an account? <button type="button" id="switchModeBtn">Sign Up</button>';
    }

    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    // Re-attach switch button listener
    document.getElementById('switchModeBtn')?.addEventListener('click', () => {
        openAuthModal(!isSignup);
    });
}

function closeAuthModal() {
    document.getElementById('authModal').style.display = 'none';
    document.body.style.overflow = '';
}

// Handle form submission (sign in or sign up)
document.getElementById('authForm')?.addEventListener('submit', async e => {
    e.preventDefault();

    const email = document.getElementById('authEmail').value.trim();
    const password = document.getElementById('authPassword').value;
    const username = document.getElementById('authUsername').value.trim();
    const isSignup = document.getElementById('authSubmitBtn').textContent.includes('Up');

    const messageEl = document.getElementById('authMessage');

    if (isSignup && !username) {
        messageEl.textContent = 'Please choose a username';
        messageEl.className = 'auth-message error';
        return;
    }

    messageEl.textContent = 'Processing...';
    messageEl.className = 'auth-message';

    let result;

    if (isSignup) {
        result = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { username }
            }
        });
    } else {
        result = await supabase.auth.signInWithPassword({ email, password });
    }

    const { data, error } = result;

    if (error) {
        messageEl.textContent = error.message;
        messageEl.className = 'auth-message error';
        return;
    }

    messageEl.textContent = isSignup ? 'Check your email to confirm!' : 'Logged in successfully!';
    messageEl.className = 'auth-message success';

    if (!isSignup) {
        state.currentUser = {
            id: data.user.id,
            email: data.user.email,
            username: data.user.user_metadata?.username || 'User'
        };
        setTimeout(closeAuthModal, 1500);
    }
});

// Handle New Post
async function handleNewPost(e) {
    e.preventDefault();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        openAuthModal();  // ← show login modal
        return;
    }


    const title = document.getElementById('postTitle').value;
    const category = document.getElementById('postCategory').value;
    const content = document.getElementById('postContent')?.value || '';

    const { data, error } = await supabase
    .from('questions')
    .insert({
        title,
        category,
        content,
        author_id: user.id
    })
    .select()
    .single();

    if (error) {
    alert('Failed to post: ' + error.message);
    } else {
    
    
    loadQuestions();
    closeNewPostModal()
    alert('BRUHHH! Question posted ');
    }
}

function formatTimestamp(isoString) {
    if (!isoString) return "recent";

    const date = new Date(isoString);
    if (isNaN(date.getTime())) return "invalid date";

    const now = new Date();
    const diffMs = now - date;
    const diffMin = Math.floor(diffMs / 60000);

    if (diffMin < 1)    return "just now";
    if (diffMin < 60)   return `${diffMin} min ago`;
    if (diffMin < 1440) return `${Math.floor(diffMin / 60)} h ago`;

    // older than 1 day → show date
    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined
    });
}

// SORT BUTTONS
function setupSortButtons() {
    const recentBtn = document.getElementById('sortRecentBtn');
    const hotBtn    = document.getElementById('sortHotBtn');

    if (!recentBtn || !hotBtn) return;

    recentBtn.addEventListener('click', () => setSort('recent'));
    hotBtn.addEventListener('click', () => setSort('likes'));     // or 'hot'
}

async function setSort(newSort) {
    if (state.currentSort === newSort) return; // no change

    state.currentSort = newSort;

    // Update active button style
    document.querySelectorAll('.sort-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.sort === newSort);
    });

    // Reload data with new sort
    await loadQuestions();
    renderPosts();
}


async function loadQuestions() {
    let query = supabase
        .from('questions')
        .select(`
            id,
            title,
            content,
            category,
            votes,
            created_at,
            author:users (username)
        `);

    // Sort
    if (state.currentSort === 'likes') {
        query = query.order('votes', { ascending: false });
    } else {
        query = query.order('created_at', { ascending: false });
    }

    // Search
    if (state.searchQuery?.trim()) {
        const term = `%${state.searchQuery.trim()}%`;
        query = query.or(`title.ilike.${term},content.ilike.${term}`);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Supabase error:', error.message, error.details, error.hint);
        alert('Failed to load questions: ' + error.message);
        return;
    }

    state.posts = data.map(q => ({
        id: q.id,
        title: q.title,
        content: q.content || "",
        category: q.category.toLowerCase(),
        timestamp: formatTimestamp(q.created_at),
        likes: q.votes || 0,
        replies: 0,                 // ← TODO: count answers (see below)
        author: {
            name: q.author?.username || 'Anonymous',
            initials: (q.author?.username || 'A')[0].toUpperCase()
        },
        tags: [q.category.toLowerCase()]
    }));

    updateCategoryCounts();
    renderCategories();
    renderPosts();
}

// CHANGE THE USER ICON
function updateAuthButton() {
    const button = document.getElementById('authButton');
    if (!button) return;

    supabase.auth.getUser().then(({ data: { user } }) => {
        if (user) {
            // Signed in → show avatar with first letter
            const username = user.user_metadata?.username || user.email?.split('@')[0] || 'User';
            const initial = username.charAt(0).toUpperCase();


            button.innerHTML = `
                <div class="avatar">${initial}</div>
            `;

            // Change what happens when clicked (example: open profile or menu)
            button.onclick = () => {
                
                alert(`Signed in as ${username}`);
            };

            button.setAttribute('aria-label', `Signed in as ${username}`);
        } else {
            // Not signed in → restore original sign-in icon
            button.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                </svg>
            `;

            button.onclick = openAuthModal;
            button.setAttribute('aria-label', 'Sign in');
        }
    });
}


// Make functions globally available
window.selectCategory = selectCategory;
window.showPostDetail = showPostDetail;
window.backToForum = backToForum;
window.handleReply = handleReply;
window.openAuthModal = openAuthModal;
window.closeAuthModal = closeAuthModal;

// Initialize App
async function init() {
    // Dark mode
    if (localStorage.getItem('darkMode') === 'true') {
        state.isDarkMode = true;
        document.body.classList.add('dark-mode');
    }

    // Load data
    await loadQuestions();
    attachEventListeners();

    // Event listeners
    darkModeBtn?.addEventListener('click', toggleDarkMode);
    attachEventListeners();
    setupSortButtons()

    // Search
    document.getElementById('searchInput')?.addEventListener('input', e => {
        state.searchQuery = e.target.value;
        renderPosts();
    });

    // Show correct button on load
    updateAuthButton();
    // Listen for login/logout changes
    supabase.auth.onAuthStateChange(() => {
        updateAuthButton();
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
// Expose toggleLike globally so inline onclick="..." can find it
window.toggleLike = async function(itemId, itemType) {
    console.log(`toggleLike clicked: ${itemType} ${itemId}`);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        alert("Please sign in to vote");
        openAuthModal();
        return;
    }

    const { error } = await supabase.rpc('increment_votes', {
        p_id: itemId,
        p_amount: 1,
        p_type: itemType
    });

    if (error) {
        console.error("Vote failed:", error);
        // alert("Vote failed – likely a temporary Supabase issue. Try again in a minute.");
        return;   // ← stops fake success
    }

    // Only runs if real success
    console.log("Vote worked – refreshing");
    if (itemType === 'question') {
        showPostDetail(itemId);
    } else if (state.selectedPost?.id) {
        showPostDetail(state.selectedPost.id);
    }
};