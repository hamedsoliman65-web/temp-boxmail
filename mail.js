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
    api: 'https://nameless-butterfly-fb91.hamed-soliman65.workers.dev',
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
                'select-msg-text': 'اختر رسالة لعرضها',
                'site-desc': 'استقبل رسائل التفعيل و OTP فوراً' // إضافة الجملة المفقودة
            },
            en: {
                'inbox-title': 'Inbox',
                'btn-copy': 'Copy',
                'btn-new': 'New',
                'btn-refresh': 'Refresh',
                'btn-delete': 'Delete',
                'msg-status': 'No messages yet',
                'select-msg-text': 'Select a message to view',
                'site-desc': 'Receive activation and OTP messages instantly' // إضافة الترجمة الإنجليزية
            }
        };

        Object.keys(uiStrings[lang]).forEach(id => {
            const el = document.getElementById(id);
            if (el) el.textContent = uiStrings[lang][id];
        });

        renderFAQ();
        if (typeof updateArticleUI === 'function') updateArticleUI();
    }

    /* ============================================================
       4. وظائف البريد الإلكتروني
       ============================================================ */

    async function createNewAccount() {
        const lang = getLang();

        const showError = (message) => {
            console.error("[Temp-BoxMail] Account Creation Failed:", message);

            const addressEl = document.getElementById("address");
            if (addressEl) {
                addressEl.textContent = lang === "ar"
                    ? "تعذر إنشاء البريد. راجع Console."
                    : "Could not create email. Check Console.";
            }
        };

        try {
            console.log("[Temp-BoxMail] API:", App.api);

            // جلب النطاقات المتاحة
            const domainsRes = await fetch(`${App.api}/domains`);

            if (!domainsRes.ok) {
                throw new Error(`Domains API: HTTP ${domainsRes.status}`);
            }

            const domainsData = await domainsRes.json();
            const domains = domainsData["hydra:member"];

            if (!Array.isArray(domains) || domains.length === 0) {
                throw new Error("No email domains available");
            }

            const selectedDomain = domains.find(d =>
                d.isActive === true ||
                d.isActive === 1 ||
                d.isActive === "1"
            ) || domains[0];

            if (!selectedDomain.domain) {
                throw new Error("Invalid domain response");
            }

            const randomPart = crypto.randomUUID()
                .replace(/-/g, "")
                .slice(0, 12);

            const address = `${randomPart}@${selectedDomain.domain}`;
            const password = `${crypto.randomUUID()}Aa1!`;

            // إنشاء الحساب
            const createRes = await fetch(`${App.api}/accounts`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({ address, password })
            });

            if (!createRes.ok) {
                const detail = await createRes.text();
                throw new Error(
                    `Account API: HTTP ${createRes.status} - ${detail}`
                );
            }

            // الحصول على رمز الدخول
            const tokenRes = await fetch(`${App.api}/token`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({ address, password })
            });

            if (!tokenRes.ok) {
                const detail = await tokenRes.text();
                throw new Error(
                    `Token API: HTTP ${tokenRes.status} - ${detail}`
                );
            }

            const tokenData = await tokenRes.json();

            if (!tokenData.token) {
                throw new Error("API did not return an access token");
            }

            // حفظ الجلسة
            App.token = tokenData.token;
            App.address = address;

            localStorage.setItem("tb_v3_session", JSON.stringify({
                token: App.token,
                address: App.address
            }));

            const addressEl = document.getElementById("address");
            if (addressEl) {
                addressEl.textContent = address;
            }

            // بدء مزامنة البريد
            await syncInbox();

            if (window.inboxInterval) {
                clearInterval(window.inboxInterval);
            }

            window.inboxInterval = setInterval(syncInbox, 10000);

            console.log("[Temp-BoxMail] Account created successfully");

        } catch (error) {
            showError(error?.message || String(error));
        }
    }


    async function syncInbox() {
        if (!App.token) return;

        try {
            const res = await fetch(`${App.api}/messages`, {
                headers: {
                    "Authorization": `Bearer ${App.token}`,
                    "Accept": "application/json"
                }
            });

            if (!res.ok) {
                throw new Error(`Messages API: HTTP ${res.status}`);
            }

            const data = await res.json();
            const container = document.getElementById("inbox");

            if (!container) return;

            const msgs = data["hydra:member"] || [];
            const lang = getLang();

            const inboxTitle = document.getElementById("inbox-title");

            if (inboxTitle) {
                inboxTitle.textContent = lang === "ar"
                    ? `البريد الوارد (${msgs.length})`
                    : `Inbox (${msgs.length})`;
            }

            if (msgs.length === 0) {
                container.textContent = "";
                const empty = document.createElement("div");
                empty.style.cssText =
                    "text-align:center;padding:20px;color:#999;";
                empty.textContent = lang === "ar"
                    ? "لا توجد رسائل بعد"
                    : "No messages yet";
                container.appendChild(empty);
                return;
            }

            container.textContent = "";

            msgs.forEach(m => {
                const div = document.createElement("div");
                div.className = "mail-item";
                div.style.cssText =
                    "padding:10px;border-bottom:1px solid rgba(255,255,255,0.1);cursor:pointer;";

                const subject = document.createElement("strong");
                subject.textContent = m.subject || (
                    lang === "ar" ? "(بلا عنوان)" : "(No subject)"
                );

                const sender = document.createElement("small");
                sender.textContent = m.from?.address || "";

                div.appendChild(subject);
                div.appendChild(document.createElement("br"));
                div.appendChild(sender);

                div.addEventListener("click", () => loadFullMail(m.id));

                container.appendChild(div);
            });

        } catch (error) {
            console.error("[Temp-BoxMail] Inbox Sync Failed:", error);
        }
    }


    async function loadFullMail(id) {
        try {
            const res = await fetch(
                `${App.api}/messages/${encodeURIComponent(id)}`,
                {
                    headers: {
                        "Authorization": `Bearer ${App.token}`,
                        "Accept": "application/json"
                    }
                }
            );

            if (!res.ok) {
                throw new Error(`Read message: HTTP ${res.status}`);
            }

            const d = await res.json();

            const subEl = document.getElementById("msg-sub");
            if (subEl) {
                subEl.textContent = d.subject || "";
            }

            const bodyEl = document.getElementById("msg-body");

            if (bodyEl) {
                const htmlBody = d.html || d.text || "";

                if (window.DOMPurify) {
                    bodyEl.innerHTML = DOMPurify.sanitize(htmlBody);
                } else {
                    // عرض آمن كنص إذا لم تتوفر مكتبة DOMPurify
                    bodyEl.textContent = d.text || htmlBody;
                }
            }

        } catch (error) {
            console.error("[Temp-BoxMail] Read Message Failed:", error);
        }
    }


    async function deleteAccount() {
        if (!App.token) return;

        const lang = getLang();

        if (!confirm(
            lang === "ar" ? "هل أنت متأكد؟" : "Are you sure?"
        )) {
            return;
        }

        try {
            const res = await fetch(`${App.api}/accounts/me`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${App.token}`
                }
            });

            if (!res.ok) {
                throw new Error(`Delete account: HTTP ${res.status}`);
            }

        } catch (error) {
            console.error("[Temp-BoxMail] Delete Failed:", error);
        }

        if (window.inboxInterval) {
            clearInterval(window.inboxInterval);
            window.inboxInterval = null;
        }

        App.token = null;
        App.address = null;

        localStorage.removeItem("tb_v3_session");
        location.reload();
    }


    function renderFAQ() {
        const lang = getLang();
        const faqContainer = document.getElementById("faq-list");

        if (!faqContainer || !App.faq[lang]) return;

        faqContainer.textContent = "";

        App.faq[lang].forEach(item => {
            const wrapper = document.createElement("div");
            wrapper.className = "faq-item";
            wrapper.style.cssText =
                "margin-bottom:20px;padding:15px;background:rgba(255,255,255,0.05);border-radius:8px;";

            const heading = document.createElement("h3");
            heading.style.cssText = "color:#00d4ff;font-size:1rem;";
            heading.textContent = item.q;

            const paragraph = document.createElement("p");
            paragraph.style.cssText = "color:#ccc;font-size:0.9rem;";
            paragraph.textContent = item.a;

            wrapper.appendChild(heading);
            wrapper.appendChild(paragraph);
            faqContainer.appendChild(wrapper);
        });
    }

    /* ============================================================
       5. البدء والتشغيل (Initialization) 
       ============================================================ */
    document.addEventListener('DOMContentLoaded', () => {
        refreshDynamicContent();

        const btnNew = document.getElementById('btn-new');
        if (btnNew) {
            btnNew.onclick = (e) => {
                e.preventDefault();
                if (confirm(getLang() === 'ar' ? "هل تريد إنشاء بريد جديد؟" : "Create a new email?")) {
                    localStorage.removeItem('tb_v3_session');
                    const addrEl = document.getElementById('address');
                    const inboxEl = document.getElementById('inbox');
                    if(addrEl) addrEl.textContent = "...";
                    if(inboxEl) inboxEl.innerHTML = "";
                    createNewAccount();
                }
            };
        }

        const btnDelete = document.getElementById('btn-delete');
        if (btnDelete) btnDelete.onclick = deleteAccount;

        const btnCopy = document.getElementById('btn-copy');
        if (btnCopy) {
            btnCopy.onclick = () => {
                const addr = document.getElementById('address').textContent;
                navigator.clipboard.writeText(addr);
                alert(getLang() === 'ar' ? 'تم نسخ العنوان!' : 'Address Copied!');
            };
        }

        const btnRefresh = document.getElementById('btn-refresh');
        if (btnRefresh) btnRefresh.onclick = () => syncInbox();

        const saved = localStorage.getItem('tb_v3_session');
        if (saved) {
            const data = JSON.parse(saved);
            App.token = data.token;
            App.address = data.address;
            if(document.getElementById('address')) document.getElementById('address').textContent = App.address;
            syncInbox();
            window.inboxInterval = setInterval(syncInbox, 10000);
        } else {
            createNewAccount();
        }

        const langToggle = document.getElementById('langToggle') || document.getElementById('lang-btn');
        if (langToggle) {
            langToggle.onclick = (e) => {
                e.preventDefault();
                const newLang = getLang() === 'ar' ? 'en' : 'ar';
                localStorage.setItem('lang', newLang);
                
                document.documentElement.lang = newLang;
                document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';

                refreshDynamicContent(); 
                langToggle.textContent = (newLang === 'ar') ? "English" : "العربية";
            };
        }
    });
})();
