
/**
 * دالة مساعدة لتحديث أرقام المقالة الحالية والكلية في أزرار التنقل.
 * تعتمد على المتغيرات العالمية ALL_ARTICLES و currentArticleIndex المعرفة في mail.js.
 */
function updateArticleCounter() {
    // تحقق من وجود المتغيرات الأساسية
    if (typeof ALL_ARTICLES === 'undefined' || typeof currentArticleIndex === 'undefined') {
        return;
    }

    const currentSpan = document.getElementById('current-article-num');
    const totalSpan = document.getElementById('total-articles-num');
    const totalArticles = ALL_ARTICLES.length;
    
    // currentArticleIndex هو صفر-أساس، نعرض واحد-أساس.
    const currentNum = currentArticleIndex + 1; 

    if (currentSpan) {
        currentSpan.textContent = currentNum;
    }
    if (totalSpan) {
        totalSpan.textContent = totalArticles;
    }
}

/**
 * دالة لتغيير المقالة المعروضة إلى السابقة.
 */
function prevArticle() {
    // نعتمد على دالة renderCurrentArticle التي يجب أن تكون مُعرّفة في mail.js
    if (typeof renderCurrentArticle === 'function' && currentArticleIndex > 0) {
        currentArticleIndex--;
        renderCurrentArticle(); // استدعاء دالة عرض المقالة الرئيسية
    }
}

/**
 * دالة لتغيير المقالة المعروضة إلى التالية.
 */
function nextArticle() {
    // نعتمد على دالة renderCurrentArticle التي يجب أن تكون مُعرّفة في mail.js
    if (typeof renderCurrentArticle === 'function' && currentArticleIndex < ALL_ARTICLES.length - 1) {
        currentArticleIndex++;
        renderCurrentArticle(); // استدعاء دالة عرض المقالة الرئيسية
    }
}
