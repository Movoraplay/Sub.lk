/**
 * SubLK - SRT Subtitle Library Engine
 * Standalone Client-Side Application
 */

// ================= GLOBAL STATE =================
const STORAGE_KEY = 'SUBLK_SUBTITLES_DATA_V1';
let subtitleData = [];
let filteredData = [];
let currentPage = 1;
const itemsPerPage = 10;
let currentPreviewSRT = null;

// Default Dummy Data (Loaded on first visit)
const initialDummyData = [
    {
        id: "1",
        title: "Inception",
        year: 2010,
        category: "Movie",
        language: "English",
        downloads: 14200,
        uploadDate: "2026-01-15",
        fileSize: "45 KB",
        poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=300&q=80",
        description: "Official WEBRip 1080p English release subtitle track.",
        content: "1\n00:00:10,000 --> 00:00:13,000\nWhat is the most resilient parasite?\n\n2\n00:00:14,100 --> 00:00:16,500\nAn Idea. Resilient, highly contagious."
    },
    {
        id: "2",
        title: "Inception",
        year: 2010,
        category: "Movie",
        language: "Sinhala",
        downloads: 8930,
        uploadDate: "2026-02-01",
        fileSize: "52 KB",
        poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=300&q=80",
        description: "Sinhala subtitle translated by SubLK community.",
        content: "1\n00:00:10,000 --> 00:00:13,000\nවඩාත්ම ප්‍රබල පරපෝෂිතයා කුමක්ද?\n\n2\n00:00:14,100 --> 00:00:16,500\nඅදහසක්. එය අතිශයින්ම බලවත්."
    },
    {
        id: "3",
        title: "Stranger Things S04E01",
        year: 2022,
        category: "Series",
        language: "English",
        downloads: 25400,
        uploadDate: "2026-03-10",
        fileSize: "61 KB",
        poster: "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?w=300&q=80",
        description: "HDTV / WEB-DL sync SRT release.",
        content: "1\n00:00:02,000 --> 00:00:05,000\nHawkins, Indiana. 1986.\n\n2\n00:00:06,200 --> 00:00:09,000\n[Atmospheric Synth Music Playing]"
    },
    {
        id: "4",
        title: "Attack on Titan Final Season",
        year: 2023,
        category: "Anime",
        language: "Japanese",
        downloads: 18200,
        uploadDate: "2026-03-12",
        fileSize: "38 KB",
        poster: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=300&q=80",
        description: "Original Japanese audio sync script.",
        content: "1\n00:00:01,500 --> 00:00:04,200\nその日、人類は思い出した…\n\n2\n00:00:05,000 --> 00:00:08,100\nヤツらに支配されていた恐怖を。"
    },
    {
        id: "5",
        title: "Our Planet II",
        year: 2023,
        category: "Documentary",
        language: "French",
        downloads: 3100,
        uploadDate: "2026-04-02",
        fileSize: "40 KB",
        poster: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300&q=80",
        description: "French documentary commentary subtitle.",
        content: "1\n00:00:12,000 --> 00:00:15,000\nSur notre planète, le mouvement est la clé de la vie."
    },
    {
        id: "6",
        title: "Interstellar",
        year: 2014,
        category: "Movie",
        language: "Spanish",
        downloads: 12900,
        uploadDate: "2026-04-10",
        fileSize: "58 KB",
        poster: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=300&q=80",
        description: "Full Spanish Latino sync release.",
        content: "1\n00:00:40,000 --> 00:00:43,000\nEl fin de la Tierra no será el fin de nosotros."
    },
    {
        id: "7",
        title: "The Dark Knight",
        year: 2008,
        category: "Movie",
        language: "English",
        downloads: 41000,
        uploadDate: "2026-04-18",
        fileSize: "62 KB",
        poster: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=300&q=80",
        description: "BluRay 1080p full commentary track.",
        content: "1\n00:01:15,000 --> 00:01:18,200\nWhatever doesn't kill you simply makes you... stranger."
    },
    {
        id: "8",
        title: "Spirited Away",
        year: 2001,
        category: "Anime",
        language: "German",
        downloads: 6400,
        uploadDate: "2026-05-01",
        fileSize: "42 KB",
        poster: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=300&q=80",
        description: "German local release sync SRT.",
        content: "1\n00:00:30,000 --> 00:00:33,000\nChihiro, wir sind gleich da!"
    }
];

// ================= INITIALIZATION & SETUP =================
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    loadLocalStorageData();
    setupEventListeners();
    handleUrlRouting();
});

// Initialize Theme Mode
function initTheme() {
    const savedTheme = localStorage.getItem('SUBLK_THEME') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

function updateThemeIcon(theme) {
    const themeBtn = document.getElementById('theme-toggle');
    themeBtn.innerHTML = theme === 'dark' 
        ? '<i class="fa-solid fa-sun"></i>' 
        : '<i class="fa-solid fa-moon"></i>';
}

// Load or Seed Subtitle Data
function loadLocalStorageData() {
    const rawData = localStorage.getItem(STORAGE_KEY);
    if (!rawData) {
        subtitleData = [...initialDummyData];
        saveToLocalStorage();
    } else {
        subtitleData = JSON.parse(rawData);
    }
    filteredData = [...subtitleData];
}

function saveToLocalStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(subtitleData));
}

// ================= EVENT LISTENERS =================
function setupEventListeners() {
    // Theme Toggle
    document.getElementById('theme-toggle').addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('SUBLK_THEME', next);
        updateThemeIcon(next);
    });

    // Navigation & Views
    document.getElementById('nav-brand').addEventListener('click', (e) => {
        e.preventDefault();
        switchView('explore');
    });

    document.getElementById('open-upload-btn').addEventListener('click', () => {
        switchView('upload');
    });

    document.getElementById('cancel-upload-btn').addEventListener('click', () => {
        switchView('explore');
    });

    document.getElementById('back-to-explore-btn').addEventListener('click', () => {
        switchView('explore');
    });

    // Search Inputs
    const handleSearch = (e) => {
        const query = e.target.value.trim().toLowerCase();
        applyFilters(query);
    };

    document.getElementById('nav-search-input').addEventListener('input', handleSearch);
    document.getElementById('hero-search-input').addEventListener('input', handleSearch);
    document.getElementById('hero-search-btn').addEventListener('click', () => {
        const query = document.getElementById('hero-search-input').value.trim().toLowerCase();
        applyFilters(query);
    });

    // Category & Language Filters
    document.getElementById('category-filter').addEventListener('change', () => applyFilters());
    document.getElementById('language-filter').addEventListener('change', () => applyFilters());

    // File Upload Handler
    const dropZone = document.getElementById('file-drop-zone');
    const fileInput = document.getElementById('upload-file');

    dropZone.addEventListener('click', () => fileInput.click());

    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
    });

    dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        if (e.dataTransfer.files.length) {
            validateAndAssignFile(e.dataTransfer.files[0]);
        }
    });

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length) {
            validateAndAssignFile(e.target.files[0]);
        }
    });

    // Upload Form Submit
    document.getElementById('upload-form').addEventListener('submit', handleFormSubmit);

    // Modal Control
    document.getElementById('close-modal-btn').addEventListener('click', closeModal);
    document.getElementById('copy-preview-btn').addEventListener('click', copyPreviewText);
    document.getElementById('download-from-modal-btn').addEventListener('click', () => {
        if (currentPreviewSRT) {
            triggerSRTDownload(currentPreviewSRT);
        }
    });
}

// ================= VIEW & ROUTING ENGINE =================
function switchView(viewName, paramId = null) {
    document.querySelectorAll('.page-view').forEach(el => el.classList.add('hidden'));
    
    const heroSection = document.getElementById('hero-section');

    if (viewName === 'explore') {
        document.getElementById('view-explore').classList.remove('hidden');
        heroSection.classList.remove('hidden');
        window.history.pushState({}, '', window.location.pathname);
        renderExploreView();
    } else if (viewName === 'upload') {
        document.getElementById('view-upload').classList.remove('hidden');
        heroSection.classList.add('hidden');
        window.history.pushState({}, '', '?page=upload');
    } else if (viewName === 'details') {
        document.getElementById('view-details').classList.remove('hidden');
        heroSection.classList.add('hidden');
        window.history.pushState({}, '', `?id=${paramId}`);
        renderDetailView(paramId);
    }
}

function handleUrlRouting() {
    const urlParams = new URLSearchParams(window.location.search);
    const page = urlParams.get('page');
    const id = urlParams.get('id');

    if (page === 'upload') {
        switchView('upload');
    } else if (id) {
        switchView('details', id);
    } else {
        switchView('explore');
    }
}

// ================= DATA FILTERING & RENDER =================
function applyFilters(searchQuery = null) {
    const searchVal = searchQuery !== null 
        ? searchQuery 
        : document.getElementById('nav-search-input').value.toLowerCase() || document.getElementById('hero-search-input').value.toLowerCase();
    
    const catVal = document.getElementById('category-filter').value;
    const langVal = document.getElementById('language-filter').value;

    filteredData = subtitleData.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchVal);
        const matchesCategory = (catVal === 'ALL' || item.category === catVal);
        const matchesLanguage = (langVal === 'ALL' || item.language === langVal);
        return matchesSearch && matchesCategory && matchesLanguage;
    });

    currentPage = 1;
    renderExploreView();
}

function renderExploreView() {
    const skeleton = document.getElementById('skeleton-container');
    const tableBody = document.getElementById('subtitle-table-body');
    const mobileGrid = document.getElementById('subtitle-mobile-grid');
    const emptyState = document.getElementById('empty-state');

    // Simulate skeleton loading state
    skeleton.classList.remove('hidden');
    tableBody.innerHTML = '';
    mobileGrid.innerHTML = '';

    setTimeout(() => {
        skeleton.classList.add('hidden');

        document.getElementById('showing-count').innerText = Math.min(filteredData.length, itemsPerPage);
        document.getElementById('total-count').innerText = filteredData.length;

        if (filteredData.length === 0) {
            emptyState.classList.remove('hidden');
            renderPagination(0);
            return;
        }

        emptyState.classList.add('hidden');

        // Pagination slicing
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const pageItems = filteredData.slice(start, end);

        // Render Desktop Table & Mobile Cards
        pageItems.forEach(item => {
            // Table Row
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>
                    <img src="${item.poster}" alt="${item.title}" class="poster-thumb" onclick="switchView('details', '${item.id}')">
                </td>
                <td>
                    <div class="movie-info-text">
                        <strong><a href="#" onclick="switchView('details', '${item.id}'); return false;">${item.title} (${item.year})</a></strong>
                        <span>${item.description || 'SRT Subtitle file'}</span>
                    </div>
                </td>
                <td><span class="badge">${item.category}</span></td>
                <td><span class="flag-icon">🌐</span> ${item.language}</td>
                <td>${item.fileSize}</td>
                <td><i class="fa-solid fa-download"></i> ${item.downloads.toLocaleString()}</td>
                <td>${item.uploadDate}</td>
                <td>
                    <div class="action-btn-group">
                        <button class="btn btn-primary" onclick="triggerSRTDownloadById('${item.id}')">
                            <i class="fa-solid fa-download"></i> SRT
                        </button>
                        <button class="btn btn-secondary" onclick="openPreviewModal('${item.id}')">
                            <i class="fa-solid fa-eye"></i>
                        </button>
                    </div>
                </td>
            `;
            tableBody.appendChild(tr);

            // Mobile Card
            const card = document.createElement('div');
            card.className = 'mobile-card';
            card.innerHTML = `
                <img src="${item.poster}" alt="${item.title}" class="poster-thumb">
                <div class="mobile-card-details">
                    <div>
                        <strong>${item.title} (${item.year})</strong>
                        <p style="font-size:0.8rem; color:var(--text-muted);">${item.language} • ${item.category}</p>
                    </div>
                    <div class="action-btn-group" style="margin-top:0.5rem;">
                        <button class="btn btn-primary" style="flex:1;" onclick="triggerSRTDownloadById('${item.id}')">Download</button>
                        <button class="btn btn-secondary" onclick="openPreviewModal('${item.id}')"><i class="fa-solid fa-eye"></i></button>
                    </div>
                </div>
            `;
            mobileGrid.appendChild(card);
        });

        renderPagination(filteredData.length);
    }, 200);
}

// Pagination Component Logic
function renderPagination(totalItems) {
    const pageNumbersContainer = document.getElementById('page-numbers');
    const prevBtn = document.getElementById('prev-page-btn');
    const nextBtn = document.getElementById('next-page-btn');

    pageNumbersContainer.innerHTML = '';
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    if (totalPages <= 1) {
        document.getElementById('pagination-bar').classList.add('hidden');
        return;
    }

    document.getElementById('pagination-bar').classList.remove('hidden');

    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;

    prevBtn.onclick = () => { if (currentPage > 1) { currentPage--; renderExploreView(); } };
    nextBtn.onclick = () => { if (currentPage < totalPages) { currentPage++; renderExploreView(); } };

    for (let i = 1; i <= totalPages; i++) {
        const numBtn = document.createElement('div');
        numBtn.className = `page-num ${i === currentPage ? 'active' : ''}`;
        numBtn.innerText = i;
        numBtn.onclick = () => { currentPage = i; renderExploreView(); };
        pageNumbersContainer.appendChild(numBtn);
    }
}

// ================= DETAILS PAGE VIEW =================
function renderDetailView(id) {
    const container = document.getElementById('details-hero-container');
    const mainItem = subtitleData.find(x => x.id === id);

    if (!mainItem) {
        container.innerHTML = `<h3>Subtitle record not found.</h3>`;
        return;
    }

    // Find all languages available for this same movie
    const relatedSubtitles = subtitleData.filter(x => x.title.toLowerCase() === mainItem.title.toLowerCase());

    container.innerHTML = `
        <img src="${mainItem.poster}" alt="${mainItem.title}" class="details-poster">
        <div class="details-info">
            <h1>${mainItem.title} (${mainItem.year})</h1>
            <div class="details-meta">
                <span class="badge">${mainItem.category}</span>
                <span><i class="fa-solid fa-calendar"></i> ${mainItem.uploadDate}</span>
                <span><i class="fa-solid fa-file"></i> ${mainItem.fileSize}</span>
            </div>
            <p class="details-description">${mainItem.description || 'No additional description provided.'}</p>
            
            <h3>Available Language Subtitles:</h3>
            <div style="margin-top: 1rem; display:flex; flex-direction:column; gap:0.75rem;">
                ${relatedSubtitles.map(sub => `
                    <div style="background:var(--bg-tertiary); padding:0.75rem 1rem; border-radius:var(--radius-md); display:flex; justify-content:space-between; align-items:center;">
                        <div>
                            <strong>🌐 ${sub.language} Subtitle</strong>
                            <span style="font-size:0.8rem; color:var(--text-muted); display:block;">Downloads: ${sub.downloads.toLocaleString()}</span>
                        </div>
                        <div class="action-btn-group">
                            <button class="btn btn-secondary" onclick="openPreviewModal('${sub.id}')"><i class="fa-solid fa-eye"></i> Preview</button>
                            <button class="btn btn-primary" onclick="triggerSRTDownloadById('${sub.id}')"><i class="fa-solid fa-download"></i> Download SRT</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// ================= FILE UPLOAD ENGINE =================
let loadedFileContent = null;
let loadedFileSize = "0 KB";

function validateAndAssignFile(file) {
    if (!file.name.toLowerCase().endsWith('.srt')) {
        alert('Invalid file format! Only .srt files are accepted.');
        return;
    }

    loadedFileSize = (file.size / 1024).toFixed(1) + ' KB';
    const reader = new FileReader();

    reader.onload = (e) => {
        loadedFileContent = e.target.result;
        document.getElementById('file-zone-text').innerHTML = `
            <strong style="color:var(--accent-color);"><i class="fa-solid fa-circle-check"></i> ${file.name}</strong> loaded (${loadedFileSize})
        `;
    };

    reader.readAsText(file);
}

function handleFormSubmit(e) {
    e.preventDefault();

    if (!loadedFileContent) {
        alert('Please attach a valid .srt file first.');
        return;
    }

    const title = document.getElementById('upload-title').value.trim();
    const year = parseInt(document.getElementById('upload-year').value);
    const category = document.getElementById('upload-category').value;
    const language = document.getElementById('upload-language').value;
    const poster = document.getElementById('upload-poster').value.trim() || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=300&q=80';
    const description = document.getElementById('upload-description').value.trim();

    const newSubtitle = {
        id: Date.now().toString(),
        title,
        year,
        category,
        language,
        downloads: 0,
        uploadDate: new Date().toISOString().split('T')[0],
        fileSize: loadedFileSize,
        poster,
        description,
        content: loadedFileContent
    };

    subtitleData.unshift(newSubtitle);
    saveToLocalStorage();

    // Reset Form
    document.getElementById('upload-form').reset();
    loadedFileContent = null;
    document.getElementById('file-zone-text').innerHTML = `Drag and drop your <strong>.srt</strong> file here or click to browse`;

    alert('Subtitle uploaded successfully!');
    applyFilters();
    switchView('explore');
}

// ================= DOWNLOAD & PREVIEW ENGINE =================
function triggerSRTDownloadById(id) {
    const item = subtitleData.find(x => x.id === id);
    if (item) {
        item.downloads++;
        saveToLocalStorage();
        triggerSRTDownload(item);
        if (document.getElementById('view-explore').classList.contains('active')) {
            renderExploreView();
        }
    }
}

function triggerSRTDownload(item) {
    const blob = new Blob([item.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${item.title}.${item.year}.${item.language}.SubLK.srt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function openPreviewModal(id) {
    const item = subtitleData.find(x => x.id === id);
    if (!item) return;

    currentPreviewSRT = item;
    const modal = document.getElementById('preview-modal');
    const previewBox = document.getElementById('srt-preview-box');

    // Extract first 20 lines
    const lines = item.content.split('\n').slice(0, 20).join('\n');
    previewBox.innerText = lines + '\n\n... [Preview truncated]';

    modal.classList.remove('hidden');
}

function closeModal() {
    document.getElementById('preview-modal').classList.add('hidden');
    currentPreviewSRT = null;
}

function copyPreviewText() {
    if (!currentPreviewSRT) return;
    navigator.clipboard.writeText(currentPreviewSRT.content).then(() => {
        const copyBtn = document.getElementById('copy-preview-btn');
        copyBtn.innerHTML = `<i class="fa-solid fa-check"></i> Copied!`;
        setTimeout(() => {
            copyBtn.innerHTML = `<i class="fa-solid fa-copy"></i> Copy Text`;
        }, 2000);
    });
}