(function() {
    /* ============================================================
       1. الإعدادات والتحكم بالأمان (Trusted Types)
       ============================================================ */
    if (window.trustedTypes && window.trustedTypes.createPolicy) {
        if (!window.trustedTypes.defaultPolicy) {
            try {
                window.trustedTypes.createPolicy('default', {
                    createHTML: (s) => (window.DOMPurify ? DOMPurify.sanitize(s, { RETURN_TRUSTED_TYPE: true }) : s),
                    createScriptURL: (src) => src
                });
            } catch (e) {}
        }
    }

    const App = {
        api: 'https://api.mail.tm',
        token: null,
        address: null,
        currentArtIdx: 0,
        // بيانات SEO والأسئلة الشائعة
        resources: {
            ar: {
                title: "Temp-BoxMail | بريد مؤقت مهمل سريع",
                description: "استقبل رسائل التفعيل وأكواد OTP فوراً مع أفضل خدمة بريد إلكتروني مؤقت لحماية خصوصيتك.",
                faqTitle: "الأسئلة الشائعة (FAQ)",
                noMsgs: "لا توجد رسائل بعد.. في انتظار وصول رسائلك.",
                faqItems: [
                    { q: "ما هو البريد الإلكتروني المؤقت؟", a: "خدمة تمنحك عنوان بريد صالح لفترة مؤقتة للتسجيل دون كشف هويتك الحقيقية." },
                    { q: "هل يمكنني استقبال رسائل OTP؟", a: "نعم، النظام مصمم لاستقبال أكواد التحقق وOTP من جميع المنصات فوراً." }
                ]
            },
            en: {
                title: "Temp-BoxMail | Fast Disposable Temporary Email",
                description: "Receive activation emails and OTP codes instantly. The best temporary email service to protect your privacy.",
                faqTitle: "Frequently Asked Questions (FAQ)",
                noMsgs: "No messages yet.. Waiting for your emails.",
                faqItems: [
                    { q: "What is Temporary Email?", a: "A service providing a temporary address for secure registration without revealing your identity." },
                    { q: "Can I receive OTP?", a: "Yes, our system is optimized to receive verification codes and OTPs instantly." }
                ]
            }
        }
    };

    const getLang = () => localStorage.getItem('lang') || 'ar';

    /* ============================================================
       2. نظام تحسين محركات البحث (SEO Engine)
       ============================================================ */
    function updateSEO(lang) {
        const data = App.resources[lang];
        document.title = data.title;
        
        // تحديث Meta Description
        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
            metaDesc = document.createElement('meta');
            metaDesc.name = "description";
            document.head.appendChild(metaDesc);
        }
        metaDesc.content = data.description;

        // تحديث Open Graph (للفيس بوك وتويتر)
        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) ogTitle.content = data.title;
    }

    /* ============================================================
       3. إدارة المحتوى (المقالات والأسئلة)
       ============================================================ */
    function refreshContent() {
        const lang = getLang();
        const res = App.resources[lang];

        // تحديث SEO
        updateSEO(lang);

        // حقن الأسئلة الشائعة
        const faqList = document.getElementById('faq-list');
        if (faqList) {
            faqList.innerHTML = res.faqItems.map(item => `
                <div class="faq-item" style="margin-bottom:20px; border-bottom:1px solid #f0f0f0; padding-bottom:15px;">
                    <h3 style="font-size:1.1rem; color:#333; margin-bottom:8px;">${item.q}</h3>
                    <p style="color:#666; line-height:1.6;">${item.a}</p>
                </div>
            `).join('');
        }

        // حقن المقالات من ملف article_nav.js
        if (window.ALL_ARTICLES && window.ALL_ARTICLES[App.currentArtIdx]) {
            const art = window.ALL_ARTICLES[App.currentArtIdx];
            const content = art[lang] || art['ar'];
            const articleEl = document.getElementById('article');
            if (articleEl) {
                articleEl.innerHTML = window.DOMPurify ? 
                    DOMPurify.sanitize(content, { RETURN_TRUSTED_TYPE: true }) : content;
            }
            
            const counter = document.getElementById('articleCounter');
            if (counter) counter.textContent = `${App.currentArtIdx + 1} / ${window.ALL_ARTICLES.length}`;
        }
    }

    /* ============================================================
       4. نظام البريد الإلكتروني (Mail API)
       ============================================================ */
    async function checkMessages() {
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
                if (msgs.length === 0) {
                    container.innerHTML = `<div style="text-align:center; padding:20px; color:#999;">${App.resources[getLang()].noMsgs}</div>`;
                    return;
                }
                
                container.innerHTML = '';
                msgs.forEach(m => {
                    const div = document.createElement('div');
                    div.className = 'mail-item';
                    div.style.padding = "12px";
                    div.style.borderBottom = "1px solid #eee";
                    div.style.cursor = "pointer";
                    div.innerHTML = `<strong>${m.subject}</strong><br><small>${m.from.address}</small>`;
                    div.onclick = () => loadMailDetail(m.id);
                    container.appendChild(div);
                });
            }
        } catch (e) { console.error("Mail fetch error"); }
    }

    async function loadMailDetail(id) {
        const res = await fetch(`${App.api}/messages/${id}`, {
            headers: { Authorization: `Bearer ${App.token}` }
        });
        const d = await res.json();
        document.getElementById('msg-sub').textContent = d.subject;
        const html = d.html || d.text;
        document.getElementById('msg-body').innerHTML = window.DOMPurify ? 
            DOMPurify.sanitize(html, { RETURN_TRUSTED_TYPE: true }) : html;
    }

    /* ============================================================
       5. التشغيل والتحكم (Initialization)
       ============================================================ */
    document.addEventListener('DOMContentLoaded', () => {
        // جمع المقالات في مصفوفة إذا لم تكن موجودة
        if (!window.ALL_ARTICLES && window.ARTICLE_1) {
            window.ALL_ARTICLES = [ARTICLE_1, ARTICLE_2, ARTICLE_3, ARTICLE_4, ARTICLE_5, ARTICLE_6];
        }

        refreshContent();

        // استعادة الحساب
        const session = localStorage.getItem('tb_v3_session');
        if (session) {
            const data = JSON.parse(session);
            App.token = data.token;
            App.address = data.address;
            document.getElementById('address').textContent = App.address;
            checkMessages();
            setInterval(checkMessages, 10000);
        }

        // أزرار التنقل
        document.getElementById('nextArticle').onclick = () => {
            if (window.ALL_ARTICLES && App.currentArtIdx < window.ALL_ARTICLES.length - 1) {
                App.currentArtIdx++;
                refreshContent();
            }
        };

        document.getElementById('prevArticle').onclick = () => {
            if (App.currentArtIdx > 0) {
                App.currentArtIdx--;
                refreshContent();
            }
        };

        document.getElementById('langToggle').onclick = () => {
            const next = getLang() === 'ar' ? 'en' : 'ar';
            localStorage.setItem('lang', next);
            location.reload();
        };
    });
})();
