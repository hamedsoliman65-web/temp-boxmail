(function() {
    /* ============================================================
       1. إعدادات الأمان (Trusted Types)
       ============================================================ */
    if (window.trustedTypes && window.trustedTypes.createPolicy) {
        if (!window.trustedTypes.defaultPolicy) {
            try {
                window.trustedTypes.createPolicy('default', {
                    createHTML: (s) => (window.DOMPurify ? DOMPurify.sanitize(s, { RETURN_TRUSTED_TYPE: true }) : s),
                    createScriptURL: (src) => src
                });
            } catch (e) { console.warn("TrustedTypes policy exists."); }
        }
    }

    /* ============================================================
       2. حالة التطبيق (State) والبيانات
       ============================================================ */
    const App = {
        api: 'https://api.mail.tm',
        token: null,
        address: null,
        faq: {
            ar: [
                { q: "ما هو البريد الإلكتروني المؤقت؟", a: "خدمة تمنحك عنوان بريد صالح لفترة مؤقتة للتسجيل دون كشف هويتك الحقيقية." },
                { q: "هل يمكنني استقبال رسائل OTP؟", a: "نعم، النظام مصمم لاستقبال أكواد التحقق وOTP من جميع المنصات فوراً." },
                { q: "هل الخدمة مجانية؟", a: "نعم، خدمة Temp-BoxMail مجانية تماماً وتهدف لحماية خصوصيتك." }
            ],
            en: [
                { q: "What is Temporary Email?", a: "A service providing a temporary address for secure registration without revealing your identity." },
                { q: "Can I receive OTP codes?", a: "Yes, our system is optimized to receive verification codes and OTPs instantly." },
                { q: "Is it free?", a: "Yes, Temp-BoxMail is completely free to use for privacy protection." }
            ]
        }
    };

    const getLang = () => localStorage.getItem('lang') || 'ar';

    /* ============================================================
       3. محرك الـ SEO والترجمة
       ============================================================ */
    function updateSEO(lang) {
        const titles = {
            ar: "Temp-BoxMail | بريد مؤقت مهمل سريع لاستقبال OTP",
            en: "Temp-BoxMail | Fast Disposable Temporary Email for OTP"
        };
        const descriptions = {
            ar: "أفضل خدمة بريد إلكتروني مؤقت مهمل. احصل على إيميل وهمي بضغطة واحدة واستقبل رسائل التفعيل فوراً.",
            en: "Best disposable temp mail service. Get a temporary email and receive activation codes instantly."
        };
        document.title = titles[lang];
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) metaDesc.content = descriptions[lang];
    }

    function refreshDynamicContent() {
        const lang = getLang();
        updateSEO(lang);

        const uiStrings = {
            ar: {
                'inbox-title': 'البريد الوارد',
                'btn-copy': 'نسخ',
                'btn-new': 'جديد',
                'btn-refresh': 'تحديث',
                'btn-delete': 'حذف',
                'msg-status': 'لا توجد رسائل بعد',
                'select-msg-text': 'اختر رسالة لعرضها'
            },
            en: {
                'inbox-title': 'Inbox',
                'btn-copy': 'Copy',
                'btn-new': 'New',
                'btn-refresh': 'Refresh',
                'btn-delete': 'Delete',
                'msg-status': 'No messages yet',
                'select-msg-text': 'Select a message to view'
            }
        };

        Object.keys(uiStrings[lang]).forEach(id => {
            const el = document.getElementById(id);
            if (el) el.textContent = uiStrings[lang][id];
        });

        renderFAQ();
        if (typeof renderCurrentArticle === 'function') renderCurrentArticle();
    }

    /* ============================================================
       4. وظائف البريد الإلكتروني
       ============================================================ */
    async function createNewAccount() {
        try {
            const domainsRes = await fetch(`${App.api}/domains`);
            const domains = await domainsRes.json();
            const domain = domains['hydra:member'][0].domain;
            const address = `${Math.random().toString(36).substring(7)}@${domain}`;
            const password = 'password123';

            const res = await fetch(`${App.api}/accounts`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ address, password })
            });

            if (res.ok) {
                const tokenRes = await fetch(`${App.api}/token`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ address, password })
                });
                const tokenData = await tokenRes.json();
                App.token = tokenData.token;
                App.address = address;
                localStorage.setItem('tb_v3_session', JSON.stringify({ token: App.token, address: App.address }));
                if(document.getElementById('address')) document.getElementById('address').textContent = address;
                syncInbox();
                setInterval(syncInbox, 10000);
            }
        } catch (e) { console.error("Account Creation Failed"); }
    }

    async function syncInbox() {
        if (!App.token) return;
        try {
            const res = await fetch(`${App.api}/messages`, {
                headers: { Authorization: `Bearer ${App.token}` }
            });
            if (res.ok) {
                const data = await res.json();
                const container = document.getElementById('inbox');
                if (!container) return;
                const msgs = data['hydra:member'] || [];
                const currentLang = getLang();

                if (msgs.length === 0) {
                    container.innerHTML = `<div style="text-align:center; padding:20px; color:#999;">${currentLang === 'ar' ? 'لا توجد رسائل بعد' : 'No messages yet'}</div>`;
                    return;
                }
                container.innerHTML = '';
                msgs.forEach(m => {
                    const div = document.createElement('div');
                    div.className = 'mail-item';
                    div.style = "padding:10px; border-bottom:1px solid #eee; cursor:pointer;";
                    div.innerHTML = `<strong>${m.subject}</strong><br><small>${m.from.address}</small>`;
                    div.onclick = () => loadFullMail(m.id);
                    container.appendChild(div);
                });
            }
        } catch (e) { console.error("Sync Error"); }
    }

    async function loadFullMail(id) {
        const res = await fetch(`${App.api}/messages/${id}`, {
            headers: { Authorization: `Bearer ${App.token}` }
        });
        const d = await res.json();
        const subEl = document.getElementById('msg-sub');
        if(subEl) subEl.textContent = d.subject;
        const bodyEl = document.getElementById('msg-body');
        if(bodyEl) {
            const htmlBody = d.html || d.text;
            bodyEl.innerHTML = window.DOMPurify ? DOMPurify.sanitize(htmlBody, { RETURN_TRUSTED_TYPE: true }) : htmlBody;
        }
    }

    async function deleteAccount() {
        if (!App.token) return;
        if (!confirm(getLang() === 'ar' ? "هل أنت متأكد؟" : "Are you sure?")) return;
        try {
            await fetch(`${App.api}/accounts/me`, { method: 'DELETE', headers: { Authorization: `Bearer ${App.token}` } });
        } catch (e) {}
        localStorage.removeItem('tb_v3_session');
        location.reload();
    }

    /* ============================================================
       5. البدء والتشغيل (Initialization)
       ============================================================ */
    document.addEventListener('DOMContentLoaded', () => {
        refreshDynamicContent();

        // ربط أزرار التحكم
        const btnNew = document.getElementById('btn-new');
        if (btnNew) btnNew.onclick = () => { localStorage.removeItem('tb_v3_session'); location.reload(); };

        const btnDelete = document.getElementById('btn-delete');
        if (btnDelete) btnDelete.onclick = deleteAccount;

        const btnCopy = document.getElementById('btn-copy');
        if (btnCopy) btnCopy.onclick = () => {
            const addr = document.getElementById('address').textContent;
            navigator.clipboard.writeText(addr);
            alert(getLang() === 'ar' ? 'تم النسخ!' : 'Copied!');
        };

        const btnRefresh = document.getElementById('btn-refresh');
        if (btnRefresh) btnRefresh.onclick = () => syncInbox();

        // إدارة الجلسة
        const saved = localStorage.getItem('tb_v3_session');
        if (saved) {
            const data = JSON.parse(saved);
            App.token = data.token;
            App.address = data.address;
            if(document.getElementById('address')) document.getElementById('address').textContent = App.address;
            syncInbox();
            setInterval(syncInbox, 10000);
        } else {
            createNewAccount();
        }

        // زر اللغة
        const langToggle = document.getElementById('langToggle');
        if (langToggle) {
            langToggle.onclick = () => {
                localStorage.setItem('lang', getLang() === 'ar' ? 'en' : 'ar');
                location.reload();
            };
        }
    });

    function renderFAQ() {
        const lang = getLang();
        const faqContainer = document.getElementById('faq-list');
        if (faqContainer) {
            faqContainer.innerHTML = App.faq[lang].map(item => `
                <div class="faq-item" style="margin-bottom: 25px; padding: 15px; background: #1a1a1a; border-radius: 8px; border-right: 4px solid #00bc8c;">
                    <h3 style="color: #00bc8c; font-size: 1.1rem; margin-bottom: 10px;">${item.q}</h3>
                    <p style="color: #ffffff; line-height: 1.6; margin: 0;">${item.a}</p>
                </div>
            `).join('');
        }
    }
})();
