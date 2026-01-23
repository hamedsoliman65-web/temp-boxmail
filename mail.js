(function() {
    /* ============================================================
       1. إعدادات الأمان (Trusted Types) - لحل أخطاء الكونسول
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
        // الأسئلة الشائعة مدمجة هنا لضمان ظهورها
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
       3. محرك الـ SEO (تحديث العناوين والوصف تلقائياً)
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

    /* ============================================================
       4. حقن المحتوى (الأسئلة الشائعة والمقالات)
       ============================================================ */
    function refreshDynamicContent() {
        const lang = getLang();
        
        // 1. تحديث SEO
        updateSEO(lang);

        // 2. حقن الأسئلة الشائعة
        const faqContainer = document.getElementById('faq-list');
        if (faqContainer) {
            faqContainer.innerHTML = App.faq[lang].map(item => `
                <div class="faq-item" style="margin-bottom:20px; border-bottom:1px solid #eee; padding-bottom:15px;">
                    <h3 style="font-size:1.1rem; color:#333;">${item.q}</h3>
                    <p style="color:#666;">${item.a}</p>
                </div>
            `).join('');
        }

        // 3. ربط ملف المقالات (article_nav.js) بهذا الملف
        if (typeof renderCurrentArticle === 'function') {
            renderCurrentArticle(); // استدعاء دالة العرض الموجودة في ملفك
        }
    }

    /* ============================================================
       5. وظائف البريد الإلكتروني (الإنشاء، المزامنة، والعرض)
       ============================================================ */

    // أولاً: دالة إنشاء إيميل جديد للمستخدمين الجدد
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
        } catch (e) { console.error("فشل إنشاء الحساب الجديد"); }
    }

    // ثانياً: دالة جلب قائمة الرسائل
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
const currentLang = getLang(); // نغير اسم المتغير ليكون مميزاً

if (msgs.length === 0) {
    container.innerHTML = `
        <div style="text-align:center; padding:20px; color:#999;">
            ${currentLang === 'ar' ? 'لا توجد رسائل بعد' : 'No messages yet'}
        </div>`;
    return;
}
                
                container.innerHTML = '';
                msgs.forEach(m => {
                    const div = document.createElement('div');
                    div.className = 'mail-item';
                    div.style.padding = "10px";
                    div.style.borderBottom = "1px solid #eee";
                    div.style.cursor = "pointer";
                    div.innerHTML = `<strong>${m.subject}</strong><br><small>${m.from.address}</small>`;
                    div.onclick = () => loadFullMail(m.id);
                    container.appendChild(div);
                });
            }
        } catch (e) { console.error("Sync Error"); }
    }

    // ثالثاً: دالة فتح وقراءة رسالة معينة
    async function loadFullMail(id) {
        const res = await fetch(`${App.api}/messages/${id}`, {
            headers: { Authorization: `Bearer ${App.token}` }
        });
        const d = await res.json();
        document.getElementById('msg-sub').textContent = d.subject;
        const htmlBody = d.html || d.text;
        document.getElementById('msg-body').innerHTML = window.DOMPurify ? 
            DOMPurify.sanitize(htmlBody, { RETURN_TRUSTED_TYPE: true }) : htmlBody;
    }
  /* ============================================================
       6. البدء عند التحميل (Initialization)
       ============================================================ */
    document.addEventListener('DOMContentLoaded', () => {
        refreshDynamicContent();

        // استعادة جلسة البريد أو إنشاء حساب جديد
        const saved = localStorage.getItem('tb_v3_session');
        if (saved) {
            const data = JSON.parse(saved);
            App.token = data.token;
            App.address = data.address;
            if(document.getElementById('address')) document.getElementById('address').textContent = App.address;
            syncInbox();
            setInterval(syncInbox, 10000);
        } else {
            // مهم جداً: إذا لم يجد جلسة قديمة، يقوم بإنشاء حساب جديد فوراً
            createNewAccount();
        }

        // إعدادات تغيير اللغة
        const langToggle = document.getElementById('langToggle');
        if (langToggle) {
            langToggle.onclick = () => {
                const next = getLang() === 'ar' ? 'en' : 'ar';
                localStorage.setItem('lang', next);
                location.reload(); 
            };
        }

        // تشغيل محتوى الأسئلة والمقالات
        renderFAQ(); 
        if (typeof renderCurrentArticle === 'function') {
            renderCurrentArticle();
        }

    }); // إغلاق مستمع الأحداث

    // 2. تعريف دالة الأسئلة (خارج نطاق الأحداث)
    function renderFAQ() {
        const lang = getLang();
        const faqContainer = document.getElementById('faq-list');
        
        if (faqContainer && App.faq) {
            faqContainer.innerHTML = App.faq[lang].map(item => `
                <div class="faq-item" style="margin-bottom: 25px; padding: 15px; background: #1a1a1a; border-radius: 8px; border-right: 4px solid #00bc8c;">
                    <h3 style="color: #00bc8c; font-size: 1.1rem; margin-bottom: 10px;">${item.q}</h3>
                    <p style="color: #ffffff; line-height: 1.6; margin: 0;">${item.a}</p>
                </div>
            `).join('');
        }
    }

})(); // نهاية الملف
