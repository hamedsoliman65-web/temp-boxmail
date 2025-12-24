function updateArticleCounter() {
    if (typeof ALL_ARTICLES === 'undefined' || typeof currentArticleIndex === 'undefined') {
        return;
    }
    const currentSpan = document.getElementById('current-article-num');
    const totalSpan = document.getElementById('total-articles-num');
    const totalArticles = ALL_ARTICLES.length;
    const currentNum = currentArticleIndex + 1; 

    if (currentSpan) {
        currentSpan.textContent = currentNum;
    }
    if (totalSpan) {
        totalSpan.textContent = totalArticles;
    }
}

function prevArticle() {
    if (typeof renderCurrentArticle === 'function' && currentArticleIndex > 0) {
        currentArticleIndex--;
        renderCurrentArticle();
    }
}

function nextArticle() {
    if (typeof renderCurrentArticle === 'function' && currentArticleIndex < ALL_ARTICLES.length - 1) {
        currentArticleIndex++;
        renderCurrentArticle();
    }
}
