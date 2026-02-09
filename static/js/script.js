/**
 * CloudIntel Neural Engine - Team Ignites 
 * Version 3.0: Semantic Highlighting, History Tracking & Relevance Gauging
 */

document.addEventListener('DOMContentLoaded', () => {
    const submitBtn = document.getElementById('submit-btn');
    const inputField = document.getElementById('query-input');
    const feed = document.getElementById('results-area');
    const latencyVal = document.getElementById('lat-val');
    const relevanceVal = document.getElementById('rel-val');
    const historyList = document.getElementById('query-history'); // Ensure this ID exists in index.html

    // Store session history locally
    let sessionHistory = [];

    /**
     * Research Note Downloader & Copy Citation
     */
    window.downloadResearchNote = (query, answer, page) => {
        const timestamp = new Date().toLocaleString();
        const content = `--------------------------------------------------\nCLOUDINTEL RESEARCH EVIDENCE - TEAM IGNITES\n--------------------------------------------------\nGenerated On: ${timestamp}\nQuery: ${query.toUpperCase()}\nSource: Cloud_Computing.pdf (Page ${page})\n\nANSWER:\n${answer}\n\n--------------------------------------------------\nStrict Knowledge Constraint: Textbook Derivation Only\n--------------------------------------------------`;
        const blob = new Blob([content], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `CloudIntel_Ref_Page_${page}.txt`;
        link.click();
    };

    window.copyCitation = (text, page) => {
        const citation = `"${text}" (Source: Cloud_Computing.pdf, Page ${page})`;
        navigator.clipboard.writeText(citation).then(() => {
            alert("✅ Citation copied to clipboard!");
        });
    };

    /**
     * UX Feature: Semantic Highlighting
     * Bolds words in the answer that were present in the query.
     */
    function semanticHighlight(text, query) {
        const terms = query.toLowerCase().split(/\s+/).filter(t => t.length > 3);
        let highlighted = text;
        terms.forEach(term => {
            const regex = new RegExp(`(${term})`, 'gi');
            highlighted = highlighted.replace(regex, '<b class="text-info">$1</b>');
        });
        return highlighted;
    }

    /**
     * UX Feature: Relevance Gauge Logic
     * Updates the UI bar based on the score.
     */
    function updateRelevanceGauge(scoreStr) {
        const score = parseFloat(scoreStr);
        const gaugeFill = document.getElementById('rel-fill'); // Needs a div with this ID in CSS
        if (gaugeFill) {
            gaugeFill.style.width = score + '%';
            gaugeFill.style.backgroundColor = score > 90 ? '#00d2ff' : (score > 80 ? '#ffcc00' : '#ff4444');
        }
    }

    function updateHistoryUI(query, page) {
        if (!historyList) return;
        const historyItem = document.createElement('div');
        historyItem.className = 'history-entry small mb-2 p-2 rounded bg-dark border-start border-info';
        historyItem.innerHTML = `<span class="text-info">Q:</span> ${query} <br><small class="text-muted">Ref: Page ${page}</small>`;
        historyList.prepend(historyItem);
        if (historyList.children.length > 5) historyList.lastChild.remove();
    }

    function typeEffect(element, text, query) {
        let i = 0;
        element.innerHTML = "";
        element.classList.add('typing');
        
        // We highlight after typing is finished for a clean UX
        const timer = setInterval(() => {
            if (i < text.length) {
                element.append(text.charAt(i));
                i++;
            } else {
                clearInterval(timer);
                element.classList.remove('typing');
                element.innerHTML = semanticHighlight(text, query);
            }
        }, 10);
    }

    async function handleSearch() {
        const query = inputField.value.trim();
        if (!query) return;

        const cardId = 'R' + Date.now();
        const loaderHTML = `
            <div class="ai-response animate__animated animate__fadeIn" id="${cardId}">
                <div class="d-flex align-items-center">
                    <div class="spinner-grow spinner-grow-sm text-info me-3"></div>
                    <small class="text-muted">Executing Multi-Source Semantic Search...</small>
                </div>
            </div>`;
        
        feed.insertAdjacentHTML('beforeend', loaderHTML);
        inputField.value = '';
        const chatFeed = document.getElementById('chat-feed');
        chatFeed.scrollTop = chatFeed.scrollHeight;

        const start = performance.now();

        try {
            const response = await fetch('/ask', {
                method: 'POST',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                body: 'question=' + encodeURIComponent(query)
            });
            const data = await response.json();
            const end = performance.now();

            latencyVal.innerText = data.latency || `${Math.round(end - start)} ms`;
            relevanceVal.innerText = data.score || "95.00%";
            updateRelevanceGauge(data.score);
            updateHistoryUI(query, data.page);

            const resultElement = document.getElementById(cardId);
            resultElement.innerHTML = `
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <span class="text-info small fw-bold"><i class="fas fa-user-circle me-2"></i>${query.toUpperCase()}</span>
                    <div class="d-flex gap-2">
                        <button class="btn btn-sm btn-outline-info py-0" title="Copy Citation"
                                onclick="copyCitation('${data.answer.replace(/'/g, "\\'")}', ${data.page})">
                            <i class="fas fa-copy"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-secondary py-0" title="Download Note"
                                onclick="downloadResearchNote('${query.replace(/'/g, "\\'")}', '${data.answer.replace(/'/g, "\\'")}', ${data.page})">
                            <i class="fas fa-download"></i>
                        </button>
                        <span class="badge bg-info text-dark rounded-pill">SOURCE: PAGE ${data.page}</span>
                    </div>
                </div>
                <p class="mb-0 lead answer-text" style="font-size:1.05rem; line-height:1.7;"></p>
            `;
            
            typeEffect(resultElement.querySelector('.answer-text'), data.answer, query);
            
            const scrollInterval = setInterval(() => {
                chatFeed.scrollTop = chatFeed.scrollHeight;
            }, 100);
            setTimeout(() => clearInterval(scrollInterval), data.answer.length * 15);

        } catch (error) {
            document.getElementById(cardId).innerHTML = `
                <div class="p-2 border border-danger rounded text-danger">
                    <i class="fas fa-exclamation-triangle me-2"></i> Search Halted: ${error.message}
                </div>`;
        }
    }

    submitBtn.addEventListener('click', handleSearch);
    inputField.addEventListener('keypress', (e) => { 
        if (e.key === 'Enter') { e.preventDefault(); handleSearch(); }
    });
});