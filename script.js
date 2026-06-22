const games = [
    {
        id: 2,
        title: '化学方程式配平',
        description: '挑战配平各种化学反应方程式，掌握化学计量学',
        category: 'reaction',
        difficulty: 'medium',
        rating: 5.0,
        icon: '⚗️',
        gradient: 'linear-gradient(135deg, #e74c3c, #f39c12)',
        date: '2026-02-20',
        path: 'pages/equation-balancer/intro.html'
    },
    {
        id: 3,
        title: '分子搭建大师',
        description: '使用原子球搭建各种有机和无机分子结构',
        category: 'molecule',
        difficulty: 'medium',
        rating: 5.0,
        icon: '⚛️',
        gradient: 'linear-gradient(135deg, #9b59b6, #3498db)',
        date: '2026-03-10',
        path: 'pages/molecule-builder/intro.html'
    },
    {
        id: 5,
        title: '共存接接乐',
        description: '接住坠落的离子，连续5个不冲突即可得分，但要注意离子间的共存关系！',
        category: 'reaction',
        difficulty: 'medium',
        rating: 5.0,
        icon: '⚡',
        gradient: 'linear-gradient(135deg, #667eea, #764ba2)',
        date: '2026-06-07',
        path: 'pages/ion-catcher/intro.html'
    }
];

let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
let currentCategory = 'all';
let currentDifficulty = 'all';
let currentSort = 'popular';
let currentView = 'grid';
let searchQuery = '';

function init() {
    renderGames();
    setupEventListeners();
}

function setupEventListeners() {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            currentCategory = link.dataset.category;
            renderGames();
        });
    });

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentDifficulty = btn.dataset.difficulty;
            renderGames();
        });
    });

    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentView = btn.dataset.view;
            const grid = document.getElementById('gamesGrid');
            if (currentView === 'list') {
                grid.classList.add('list-view');
            } else {
                grid.classList.remove('list-view');
            }
        });
    });

    document.getElementById('sortSelect').addEventListener('change', (e) => {
        currentSort = e.target.value;
        renderGames();
    });

    document.getElementById('searchInput').addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase();
        renderGames();
    });

    document.getElementById('clearFilter').addEventListener('click', () => {
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        document.querySelector('.nav-link[data-category="all"]').classList.add('active');
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        document.querySelector('.filter-btn[data-difficulty="all"]').classList.add('active');
        document.getElementById('sortSelect').value = 'popular';
        document.getElementById('searchInput').value = '';
        currentCategory = 'all';
        currentDifficulty = 'all';
        currentSort = 'popular';
        searchQuery = '';
        renderGames();
    });
}

function filterGames() {
    let filtered = games;

    if (currentCategory !== 'all') {
        filtered = filtered.filter(game => game.category === currentCategory);
    }

    if (currentDifficulty !== 'all') {
        filtered = filtered.filter(game => game.difficulty === currentDifficulty);
    }

    if (searchQuery) {
        filtered = filtered.filter(game => 
            game.title.toLowerCase().includes(searchQuery) ||
            game.description.toLowerCase().includes(searchQuery)
        );
    }

    return filtered;
}

function sortGames(games) {
    const sorted = [...games];
    
    switch (currentSort) {
        case 'popular':
            sorted.sort((a, b) => b.rating - a.rating);
            break;
        case 'newest':
            sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
            break;
        case 'oldest':
            sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
            break;
        case 'difficulty':
            const difficultyOrder = { easy: 0, medium: 1, hard: 2 };
            sorted.sort((a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]);
            break;
        default:
            break;
    }

    return sorted;
}

function renderGames() {
    const filtered = filterGames();
    const sorted = sortGames(filtered);
    const grid = document.getElementById('gamesGrid');

    if (sorted.length === 0) {
        grid.innerHTML = `
            <div class="no-results">
                <div class="no-results-icon">🔍</div>
                <h3>没有找到匹配的游戏</h3>
                <p>尝试调整筛选条件或搜索关键词</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = sorted.map(game => {
        const isFavorite = favorites.includes(game.id);
        const difficultyColor = {
            easy: '#2ecc71',
            medium: '#f39c12',
            hard: '#e74c3c'
        };

        return `
            <article class="game-card" data-path="${game.path || ''}">
                <div class="card-inner">
                    <div class="card-image" style="background: ${game.gradient}">
                        <span class="game-icon">${game.icon}</span>
                        <button class="favorite-btn ${isFavorite ? 'favorited' : ''}" onclick="toggleFavorite(${game.id}, this)">
                            ${isFavorite ? '❤️' : '🤍'}
                        </button>
                    </div>
                    <div class="card-content">
                        <div class="game-header">
                            <h3 class="game-title">${game.title}</h3>
                            <span class="difficulty-badge" style="background: ${difficultyColor[game.difficulty]}">
                                ${game.difficulty === 'easy' ? '简单' : game.difficulty === 'medium' ? '中等' : '困难'}
                            </span>
                        </div>
                        <p class="game-description">${game.description}</p>
                        <div class="game-footer">
                            <div class="rating">
                                <span class="star">★</span>
                                <span class="rating-value">${game.rating}</span>
                            </div>
                            <span class="date">${formatDate(game.date)}</span>
                        </div>
                    </div>
                </div>
            </article>
        `;
    }).join('');

    document.querySelectorAll('.game-card').forEach(card => {
        card.addEventListener('click', () => {
            const path = card.dataset.path;
            if (path) {
                window.open(path, '_blank');
            } else {
                alert('该游戏正在开发中，敬请期待！');
            }
        });
    });
}

function toggleFavorite(gameId, button) {
    if (favorites.includes(gameId)) {
        favorites = favorites.filter(id => id !== gameId);
        button.textContent = '🤍';
        button.classList.remove('favorited');
    } else {
        favorites.push(gameId);
        button.textContent = '❤️';
        button.classList.add('favorited');
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

document.addEventListener('DOMContentLoaded', init);