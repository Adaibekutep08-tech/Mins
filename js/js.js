document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();

    const navItems = document.querySelectorAll('[data-page]');
    const pageViews = document.querySelectorAll('.page-view');

    function switchPage(pageId) {
        pageViews.forEach(page => page.style.display = 'none');
        const targetPage = document.getElementById('page-' + pageId);
        if (targetPage) targetPage.style.display = 'block';

        navItems.forEach(nav => nav.classList.remove('active'));
        const activeNav = document.querySelector(`[data-page="${pageId}"]`);
        if (activeNav) activeNav.classList.add('active');

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            switchPage(item.getAttribute('data-page'));
            const navLinks = document.getElementById('navLinks');
            if (navLinks) navLinks.classList.remove('active');
        });
    });

    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => navLinks.classList.toggle('active'));
    }

    // База данных по записям в блокноте
    const allManhwas = {
        greek: {
            name: "Мифы Древней Греции",
            chapters: {
                1: { title: "Геракл и Прометей", pages: ["https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=1000&auto=format&fit=crop"] },
                2: { title: "Икар и Дедал", pages: ["https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1000&auto=format&fit=crop"] }
            }
        },
        slav: {
            name: "Славянская мифология",
            chapters: {
                1: { title: "Миф о солнце и Леший", pages: ["https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1000&auto=format&fit=crop"] },
                2: { title: "Хранитель очага — Домовой", pages: ["https://images.unsplash.com/photo-1511497584788-876761c11969?q=80&w=1000&auto=format&fit=crop"] }
            }
        },
        turk: {
            name: "Тюркская мифология",
            chapters: {
                1: { title: "Тенгри, Яйцю и Умай", pages: ["https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1000&auto=format&fit=crop"] },
                2: { title: "От Ана, Ер су и Ерлик", pages: ["https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1000&auto=format&fit=crop"] }
            }
        },
        bible: {
            name: "Библейская мифология",
            chapters: {
                1: { title: "Вавилонская башня", pages: ["https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1000&auto=format&fit=crop"] },
                2: { title: "Мудрость царя Соломона", pages: ["https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=1000&auto=format&fit=crop"] }
            }
        }
    };

    let selectedManhwaKey = 'greek';
    let currentChapterNum = 1;
    let currentPageIdx = 0;

    const activePageImg = document.getElementById('activePageImg');
    const chapterTitle = document.getElementById('chapterTitle');
    const pageCounter = document.getElementById('pageCounter');
    const prevPageBtn = document.getElementById('prevPageBtn');
    const nextPageBtn = document.getElementById('nextPageBtn');
    const chapterSelector = document.getElementById('chapterSelector');
    const backToCatalogBtn = document.getElementById('backToCatalogBtn');

    function openManhwa(manhwaKey) {
        selectedManhwaKey = manhwaKey;
        currentChapterNum = 1;
        currentPageIdx = 0;

        renderChapterSelector();
        updateViewer();
        switchPage('reader');
    }

    function renderChapterSelector() {
        const manhwa = allManhwas[selectedManhwaKey];
        chapterSelector.innerHTML = '';

        Object.keys(manhwa.chapters).forEach(chNum => {
            const btn = document.createElement('button');
            btn.className = `chapter-btn ${parseInt(chNum) === currentChapterNum ? 'active' : ''}`;
            btn.textContent = `Глава ${chNum}`;
            btn.addEventListener('click', () => {
                currentChapterNum = parseInt(chNum);
                currentPageIdx = 0;
                renderChapterSelector();
                updateViewer();
            });
            chapterSelector.appendChild(btn);
        });
    }

    function updateViewer() {
        const chapter = allManhwas[selectedManhwaKey].chapters[currentChapterNum];
        chapterTitle.textContent = `${allManhwas[selectedManhwaKey].name} — ${chapter.title}`;
        activePageImg.src = chapter.pages[currentPageIdx];
        pageCounter.textContent = `Страница ${currentPageIdx + 1} из ${chapter.pages.length}`;
    }

    document.querySelectorAll('.manhwa-card').forEach(card => {
        card.addEventListener('click', () => {
            openManhwa(card.getAttribute('data-manhwa'));
        });
    });

    if (backToCatalogBtn) {
        backToCatalogBtn.addEventListener('click', () => switchPage('catalog'));
    }

    prevPageBtn.addEventListener('click', () => {
        if (currentPageIdx > 0) {
            currentPageIdx--;
            updateViewer();
        }
    });

    nextPageBtn.addEventListener('click', () => {
        const chapter = allManhwas[selectedManhwaKey].chapters[currentChapterNum];
        if (currentPageIdx < chapter.pages.length - 1) {
            currentPageIdx++;
            updateViewer();
        }
    });

    // Викторина по обновленным данным
    const quizQuestions = [
        {
            question: "Кто из героев относится к мифам Древней Греции?",
            options: ["Соломон", "Прометей", "Домовой", "Ерлик"],
            correct: 1
        },
        {
            question: "Какой персонаж упоминается в славянской мифологии?",
            options: ["Икар", "Тенгри", "Леший", "Вавилонская башня"],
            correct: 2
        },
        {
            question: "Кто является подземным владыкой в тюркской мифологии?",
            options: ["Ерлик", "Соломон", "Дедал", "Макошь"],
            correct: 0
        },
        {
            question: "Какой библейский образ упоминается в записях?",
            options: ["Яйцю", "Вавилонская башня", "От Ана", "Геракл"],
            correct: 1
        }
    ];

    let currentQIdx = 0;
    let quizScore = 0;

    const questionText = document.getElementById('questionText');
    const optionsGrid = document.getElementById('optionsGrid');
    const quizContainer = document.getElementById('quizContainer');
    const quizResult = document.getElementById('quizResult');
    const scoreText = document.getElementById('scoreText');
    const restartQuizBtn = document.getElementById('restartQuizBtn');

    function loadQuestion() {
        const q = quizQuestions[currentQIdx];
        questionText.textContent = `${currentQIdx + 1}. ${q.question}`;
        optionsGrid.innerHTML = '';

        q.options.forEach((opt, idx) => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.textContent = opt;
            btn.addEventListener('click', () => {
                if (idx === q.correct) quizScore++;
                currentQIdx++;
                if (currentQIdx < quizQuestions.length) {
                    loadQuestion();
                } else {
                    quizContainer.style.display = 'none';
                    quizResult.style.display = 'block';
                    scoreText.textContent = `Ваш результат: ${quizScore} из ${quizQuestions.length}`;
                }
            });
            optionsGrid.appendChild(btn);
        });
    }

    if (restartQuizBtn) {
        restartQuizBtn.addEventListener('click', () => {
            quizScore = 0;
            currentQIdx = 0;
            quizResult.style.display = 'none';
            quizContainer.style.display = 'block';
            loadQuestion();
        });
    }

    loadQuestion();
});