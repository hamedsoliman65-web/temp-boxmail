/* ============================================================
   1. Trusted Types (لحل أخطاء الكونسول الحمراء)
   ============================================================ */
if (window.trustedTypes && window.trustedTypes.createPolicy) {
    if (!window.trustedTypes.defaultPolicy) {
        try {
            window.trustedTypes.createPolicy('default', {
                createHTML: (s) => (window.DOMPurify ? DOMPurify.sanitize(s, { RETURN_TRUSTED_TYPE: true }) : s),
                createScriptURL: (src) => src
            });
        } catch (e) { console.warn("Policy exists"); }
    }
}

/* ============================================================
   2. الإعدادات العامة (Configuration)
   ============================================================ */
const AppConfig = {
    api: 'https://api.mail.tm',
    token: null,
    address: null,
    artIdx: 0 // تم تغيير الاسم لمنع التعارض مع article_nav.js
};

const UI_DATA = {
    ar: {
        faqTitle: "الأسئلة الشائعة (FAQ)",
        noMsgs: "لا توجد رسائل بعد.",
        faqItems: [
            { q: "ما هو البريد الإلكتروني المؤقت؟", a: "خدمة تمنحك عنوان بريد صالح لفترة مؤقتة للتسجيل دون كشف هويتك الحقيقية." },
            { q: "هل يمكنني استقبال رسائل OTP؟", a: "نعم، النظام مصمم لاستقبال أكواد التحقق وOTP فوراً." }
        ]
    },
    en: {
        faqTitle: "Frequently Asked Questions (FAQ)",
        noMsgs: "No messages yet.",
        faqItems: [
            { q: "What is Temporary Email?", a: "A service providing a temp address to receive emails privately." },
            { q: "Can I receive OTP?", a: "Yes, our system is optimized for verification codes." }
        ]
    }
};

/* ============================================================
   3. وظائف المقالات والأسئلة الشائعة (FAQ & Articles)
   ============================================================ */
function updateDisplayContent() {
    const lang = localStorage.getItem('lang') || 'ar';
    const t = UI_DATA[lang];

    // عرض الأسئلة الشائعة
    const faqBox = document.getElementById('faq-list');
    if (faqBox) {
        faqBox.innerHTML = t.faqItems.map(i => `
            <div class="faq-item" style="margin-bottom:15px;">
                <p><strong>${i.q}</strong></p>
                <p>${i.a}</p>
            </div>`).join('');
    }

    // عرض المقالات (تأكد من وجود ALL_ARTICLES في ملف article_nav.js)
    if (window.ALL_ARTICLES && window.ALL_ARTICLES[AppConfig.artIdx]) {
        const art = window.ALL_ARTICLES[AppConfig.artIdx];
        const artEl = document.getElementById('article');
        if (artEl) {
            const content = art[lang] || art['ar'];
            artEl.innerHTML = window.DOMPurify ? DOMPurify.sanitize(content, { RETURN_TRUSTED_TYPE: true }) : content;
        }
        const counter = document.getElementById('articleCounter');
        if (counter) counter.textContent = `${AppConfig.artIdx + 1} / ${window.ALL_ARTICLES.length}`;
    }
}

/* ============================================================
   4. وظائف البريد الإلكتروني
   ============================================================ */
async function syncInbox() {
    if (!AppConfig.token) return;
    try {
        const res = await fetch(`${AppConfig.api}/messages`, {
            headers: { Authorization: `Bearer ${AppConfig.token}` }
        });
        if (res.ok) {
            const data = await res.json();
            const container = document.getElementById('inbox');
            if (!container) return;
            const msgs = data['hydra:member'] || [];
            container.innerHTML = msgs.length ? '' : `<div style="padding:10px;color:#888;">${UI_DATA[localStorage.getItem('lang') || 'ar'].noMsgs}</div>`;
            msgs.forEach(m => {
                const d = document.createElement('div');
                d.className = 'mail-item';
                d.innerHTML = `<b>${m.subject}</b><br><small>${m.from.address}</small>`;
                d.onclick = () => { /* كود فتح الرسالة */ };
                container.appendChild(d);
            });
        }
    } catch (e) { console.error("Sync Error", e); }
}

/* ============================================================
   5. التشغيل عند التحميل
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
    updateDisplayContent();
    
    // استعادة الجلسة
    const saved = localStorage.getItem('tb_v3_session');
    if (saved) {
        const session = JSON.parse(saved);
        AppConfig.token = session.token;
        if (document.getElementById('address')) document.getElementById('address').textContent = session.address;
        syncInbox();
        setInterval(syncInbox, 10000);
    }

    // أزرار المقالات
    if (document.getElementById('nextArticle')) {
        document.getElementById('nextArticle').onclick = () => {
            if (window.ALL_ARTICLES && AppConfig.artIdx < window.ALL_ARTICLES.length - 1) {
                AppConfig.artIdx++;
                updateDisplayContent();
            }
        };
    }
});
