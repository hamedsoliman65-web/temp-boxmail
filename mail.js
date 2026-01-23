/* ============================================================
   1. Trusted Types Configuration (لحل مشاكل الأمان في الكونسول)
   ============================================================ */
if (window.trustedTypes && window.trustedTypes.createPolicy) {
    if (!window.trustedTypes.defaultPolicy) {
        try {
            window.trustedTypes.createPolicy('default', {
                createHTML: (string) => (window.DOMPurify ? DOMPurify.sanitize(string, { RETURN_TRUSTED_TYPE: true }) : string),
                createScriptURL: (src) => src,
                createScript: (s) => s 
            });
        } catch (e) { console.warn("TrustedTypes policy initialization skipped."); }
    }
}

/* ============================================================
   2. Application State (استخدام كائن موحد لتجنب تكرار التعريفات)
   ============================================================ */
const BoxApp = {
    api: 'https://api.mail.tm',
    account: null,
    token: null,
    messages: [],
    poll: null,
    currentArtIdx: 0 // تم تغيير الاسم لتجنب التعارض مع ملفات أخرى
};

const $el = id => document.getElementById(id);

/* ============================================================
   3. Translations & UI Content
   ============================================================ */
const UI_RESOURCES = {
    ar: {
        faqTitle: "الأسئلة الشائعة (FAQ)",
        noMsgs: "لا توجد رسائل بعد.",
        copy: "نسخ", refresh: "تحديث", new: "جديد", delete: "حذف",
        faqItems: [
            { q: "ما هو البريد الإلكتروني المؤقت؟", a: "خدمة تمنحك عنوان بريد صالح لفترة مؤقتة للتسجيل دون كشف هويتك الحقيقية." },
            { q: "هل يمكنني استقبال رسائل OTP؟", a: "نعم، النظام مصمم لاستقبال أكواد التحقق وOTP من جميع المنصات فوراً." }
        ]
    },
    en: {
        faqTitle: "Frequently Asked Questions (FAQ)",
        noMsgs: "No messages yet.",
        copy: "Copy", refresh: "Refresh", new: "New", delete: "Delete",
        faqItems: [
            { q: "What is Temporary Email?", a: "A service providing a temp address to receive emails without revealing your identity." },
            { q: "Can I receive OTP messages?", a: "Yes, our system is optimized for verification codes." }
        ]
    }
};

/* ============================================================
   4. Core Functions
   ============================================================ */
function getLang() { return localStorage.getItem('lang') || 'ar'; }

function applyGlobalLanguage(lang) {
    const t = UI_RESOURCES[lang];
    if ($el('faq-main-title')) $el('faq-main-title').textContent = t.faqTitle;
    
    // حقن الأسئلة الشائعة
    const faqList = $el('faq-list');
    if (faqList) {
        faqList.innerHTML = t.faqItems.map(item => `
            <div class="faq-item">
                <p><strong>${item.q}</strong></p>
                <p>${item.a}</p>
            </div>`).join('');
    }

    // عرض المقالات من ALL_ARTICLES (الموجود في article_nav.js)
    if (window.ALL_ARTICLES && window.ALL_ARTICLES[BoxApp.currentArtIdx]) {
        const art = window.ALL_ARTICLES[BoxApp.currentArtIdx];
        const content = art[lang] || art['ar'];
        if ($el('article')) {
            $el('article').innerHTML = window.DOMPurify ? DOMPurify.sanitize(content, { RETURN_TRUSTED_TYPE: true }) : content;
        }
        if ($el('articleCounter')) $el('articleCounter').textContent = `${BoxApp.currentArtIdx + 1} / ${window.ALL_ARTICLES.length}`;
    }
}

async function fetchInbox() {
    if (!BoxApp.token) return;
    try {
        const res = await fetch(`${BoxApp.api}/messages`, {
            headers: { Authorization: `Bearer ${BoxApp.token}` }
        });
        if (res.ok) {
            const data = await res.json();
            BoxApp.messages = data['hydra:member'] || [];
            renderInboxUI();
        }
    } catch (e) { console.error("Inbox Error:", e); }
}

function renderInboxUI() {
    const container = $el('inbox');
    if (!container) return;
    container.innerHTML = '';
    if (BoxApp.messages.length === 0) {
        container.innerHTML = `<div style="padding:15px; color:#888;">${UI_RESOURCES[getLang()].noMsgs}</div>`;
        return;
    }
    BoxApp.messages.forEach(m => {
        const div = document.createElement('div');
        div.className = 'mail-item';
        div.innerHTML = `<strong>${m.subject}</strong><br><small>${m.from.address}</small>`;
        div.onclick = () => loadMailContent(m.id);
        container.appendChild(div);
    });
}

async function loadMailContent(id) {
    const res = await fetch(`${BoxApp.api}/messages/${id}`, {
        headers: { Authorization: `Bearer ${BoxApp.token}` }
    });
    const data = await res.json();
    $el('msg-sub').textContent = data.subject;
    const raw = data.html || data.text;
    $el('msg-body').innerHTML = window.DOMPurify ? DOMPurify.sanitize(raw, { RETURN_TRUSTED_TYPE: true }) : raw;
}

/* ============================================================
   5. Initialization & Events
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
    applyGlobalLanguage(getLang());

    const saved = localStorage.getItem('tb_v3_session');
    if (saved) {
        const session = JSON.parse(saved);
        BoxApp.account = { address: session.address };
        BoxApp.token = session.token;
        if ($el('address')) $el('address').textContent = BoxApp.account.address;
        fetchInbox();
        BoxApp.poll = setInterval(fetchInbox, 10000);
    }

    // أزرار التحكم
    if ($el('langToggle')) $el('langToggle').onclick = () => {
        const next = getLang() === 'ar' ? 'en' : 'ar';
        localStorage.setItem('lang', next);
        location.reload(); // إعادة التحميل لضمان تنظيف كافة الحالات
    };

    if ($el('nextArticle')) $el('nextArticle').onclick = () => {
        if (window.ALL_ARTICLES && BoxApp.currentArtIdx < window.ALL_ARTICLES.length - 1) {
            BoxApp.currentArtIdx++;
            applyGlobalLanguage(getLang());
        }
    };

    if ($el('prevArticle')) $el('prevArticle').onclick = () => {
        if (BoxApp.currentArtIdx > 0) {
            BoxApp.currentArtIdx--;
            applyGlobalLanguage(getLang());
        }
    };
});
