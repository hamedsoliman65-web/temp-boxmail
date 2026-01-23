/* ============================================================
   1. Trusted Types Configuration (First execution)
   ============================================================ */
if (window.trustedTypes && window.trustedTypes.createPolicy) {
    if (!window.trustedTypes.defaultPolicy) {
        window.trustedTypes.createPolicy('default', {
            createHTML: (string) => DOMPurify.sanitize(string, { RETURN_TRUSTED_TYPE: true }),
            createScriptURL: (src) => src,
            createScript: (s) => s 
        });
    }
}

/* ======================
   2. Configuration & State
   ====================== */
const API_BASE = 'https://api.mail.tm';
const $ = id => document.getElementById(id);

let account = null;
let token = null;
let messages = [];
let pollInterval = null;
let currentArticleIndex = 0; 

/* ==============
   3. Translations (UI Texts & FAQ)
   ============== */
const UI = {
  ar: {
    title: "Temp-BoxMail",
    subtitle: "استقبل رسائل التفعيل وOTP فورًا",
    inboxTitle: "البريد الوارد",
    inboxDesc: "يتم جلب الرسائل تلقائيًا",
    copy: "نسخ",
    refresh: "تحديث",
    newMail: "إنشاء بريد جديد",
    delete: "حذف",
    prevArticle: '‹ المقال السابق',
    nextArticle: 'المقال التالي ›',
    noMessages: "لا توجد رسائل بعد — اضغط \"إنشاء بريد جديد\" ثم استقبل الرسائل هنا.",
    msgSub: "أضغط تحديث وأختر الرسالة",
    footer: "جميع الحقوق محفوظه - © Temp-BoxMail",
    faqTitle: "الأسئلة الشائعة (FAQ)",
    faqItems: [
      { q: "ما هو البريد الإلكتروني المؤقت؟", a: "خدمة تمنحك عنوان بريد صالح لفترة مؤقتة للتسجيل دون كشف هويتك الحقيقية." },
      { q: "هل يمكنني استقبال رسائل OTP؟", a: "نعم، النظام مصمم لاستقبال أكواد التحقق وOTP من جميع المنصات فوراً." },
      { q: "هل الخدمة مجانية بالكامل؟", a: "نعم، جميع خدماتنا مجانية 100% بدون أي تكاليف مخفية." },
      { q: "كم تظل الرسائل محفوظة؟", a: "يتم حذف الرسائل دورياً لضمان الخصوصية، لذا نوصي بنسخ بياناتك فوراً." }
    ]
  },
  en: {
    title: "Temp-BoxMail",
    subtitle: "Receive OTP & verification emails instantly",
    inboxTitle: "Inbox",
    inboxDesc: "Messages are fetched automatically",
    copy: "Copy",
    refresh: "Refresh",
    newMail: "Create New Email",
    delete: "Delete",
    prevArticle: '‹ Previous Article',
    nextArticle: 'Next Article ›',
    noMessages: "No messages yet — click \"Create New Email\" to start receiving emails.",
    msgSub: "Press refresh and select the message",
    footer: "All rights reserved - © Temp-BoxMail",
    faqTitle: "Frequently Asked Questions (FAQ)",
    faqItems: [
      { q: "What is Temporary Email?", a: "A service providing a temp address to receive emails without revealing your identity." },
      { q: "Can I receive OTP messages?", a: "Yes, our system is optimized to receive verification codes and OTPs instantly." },
      { q: "Is the service free?", a: "Yes, Temp-BoxMail is 100% free with no hidden fees." },
      { q: "How long are messages kept?", a: "Messages are deleted periodically for privacy. Please copy important info immediately." }
    ]
  }
};

/* ============================================================
   4. API & Mail Functions
   ============================================================ */
function escapeHtml(s){ return s? s.replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])) : ''; }
function currentLang() { return localStorage.getItem('lang') || 'ar'; }

async function fetchMessages(){
  if(!token) return;
  try {
    const res = await fetch(API_BASE + '/messages', {headers: {Authorization: 'Bearer ' + token}});
    if(res.ok) {
        const json = await res.json();
        messages = json['hydra:member'] || [];
        renderInbox();
    }
  } catch(e) { console.error("Fetch Error", e); }
}

function renderInbox(){
  const container = $('inbox');
  if(!container) return;
  container.innerHTML = '';
  if(!messages.length){
    container.innerHTML = `<div style="color:var(--muted);padding:8px">${UI[currentLang()].noMessages}</div>`;
    return;
  }
  messages.forEach(m => {
    const el = document.createElement('div');
    el.className = 'mail-item';
    el.innerHTML = `<div style="flex:1">
      <div class="mail-sub">${escapeHtml(m.subject || '(No Subject)')}</div>
      <div class="mail-from">${escapeHtml(m.from?.address || 'Unknown')}</div>
    </div><div class="mail-time">${new Date(m.createdAt).toLocaleTimeString()}</div>`;
    el.onclick = () => showMessage(m);
    container.appendChild(el);
  });
}

async function showMessage(m){
    try {
        const res = await fetch(`${API_BASE}/messages/${m.id}`, { headers: { Authorization: 'Bearer ' + token } });
        const full = await res.json();
        $('msg-sub').textContent = full.subject || 'No Subject';
        
        let rawContent = full.html || `<pre>${escapeHtml(full.text)}</pre>`;
        // التطهير الأمني وحقن المحتوى
        $('msg-body').innerHTML = DOMPurify.sanitize(rawContent, { RETURN_TRUSTED_TYPE: true });

        // استخراج OTP
        const otpMatch = rawContent.match(/(?:OTP|رمز|كود)[\s:]*([0-9]{4,8})/i);
        if(otpMatch) {
            $('extractedOtp').textContent = otpMatch[1];
            $('extractedOtp').style.display = 'inline-block';
        } else {
            $('extractedOtp').style.display = 'none';
        }
    } catch(e){ console.error(e); }
}

/* ============================================================
   5. Article, SEO & Language Helpers
   ============================================================ */
function applyLanguage(lang) {
  document.documentElement.lang = lang;
  document.documentElement.dir = (lang === 'ar') ? 'rtl' : 'ltr';
  const t = UI[lang];

  // 1. تحديث نصوص الواجهة
  if ($('btn-text-copy')) $('btn-text-copy').textContent = t.copy;
  if ($('btn-text-refresh')) $('btn-text-refresh').textContent = t.refresh;
  if ($('btn-text-new')) $('btn-text-new').textContent = t.newMail;
  if ($('btn-text-delete')) $('btn-text-delete').textContent = t.delete;
  if ($('t-title')) $('t-title').textContent = t.title;
  if ($('t-sub')) $('t-sub').textContent = t.subtitle;
  if ($('inbox-title')) $('inbox-title').textContent = t.inboxTitle;
  if ($('footer-text')) $('footer-text').textContent = t.footer;
  if ($('langToggle')) $('langToggle').textContent = (lang === 'ar') ? 'English 🇺🇸' : 'العربية 🇸🇦';
  if ($('prevArticle')) $('prevArticle').textContent = t.prevArticle;
  if ($('nextArticle')) $('nextArticle').textContent = t.nextArticle;

  // 2. تحديث قائمة الـ FAQ
  const faqListElem = $('faq-list');
  if ($('faq-main-title')) $('faq-main-title').textContent = t.faqTitle;
  if (faqListElem && t.faqItems) {
    faqListElem.innerHTML = t.faqItems.map(item => `
      <div class="faq-item" style="border-bottom: 1px solid rgba(255,255,255,0.05); padding: 15px 0;">
        <p><strong style="color: var(--accent);">${item.q}</strong></p>
        <p style="color: #ccc;">${item.a}</p>
      </div>`).join('');
  }

  // 3. تحديث الـ SEO والـ Schema
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": t.faqItems.map(item => ({
      "@type": "Question",
      "name": item.q,
      "acceptedAnswer": { "@type": "Answer", "text": item.a }
    }))
  };

  let scriptTag = $('faq-schema') || document.createElement('script');
  scriptTag.id = 'faq-schema';
  scriptTag.type = 'application/ld+json';
  const schemaString = JSON.stringify(schemaData);
  
  if (window.trustedTypes?.defaultPolicy) {
      scriptTag.text = window.trustedTypes.defaultPolicy.createScript(schemaString);
  } else {
      scriptTag.textContent = schemaString;
  }
  if (!$('faq-schema')) document.head.appendChild(scriptTag);

  // 4. عرض المقالة الحالية
  if (window.ALL_ARTICLES && ALL_ARTICLES[currentArticleIndex]) {
    const art = ALL_ARTICLES[currentArticleIndex];
    $('article').innerHTML = DOMPurify.sanitize(art[lang], { RETURN_TRUSTED_TYPE: true });
    document.title = (art.title?.[lang] || t.title) + " | Temp-BoxMail";
  }
}

/* ============================================================
   6. Account Management
   ============================================================ */
async function createAccount(){
  try {
    const domainRes = await fetch(API_BASE + '/domains');
    const domains = await domainRes.json();
    const domain = domains['hydra:member'][0].domain;
    const address = 'tb' + Math.random().toString(36).substring(2, 8) + '@' + domain;
    const password = Math.random().toString(36).slice(-10);

    const res = await fetch(API_BASE + '/accounts', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({address, password})
    });
    
    const accJson = await res.json();
    const tokenRes = await fetch(API_BASE + '/token', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({address, password})
    });
    const tokenJson = await tokenRes.json();
    
    account = accJson;
    token = tokenJson.token;
    localStorage.setItem('tb_account', JSON.stringify({id: account.id, address, password, token}));
    onAccountReady();
  } catch(e) { console.error("Account Creation Failed", e); }
}

function onAccountReady(){
  if ($('address')) $('address').textContent = account.address;
  if (pollInterval) clearInterval(pollInterval);
  pollInterval = setInterval(fetchMessages, 7000);
  fetchMessages();
}

/* ============================================================
   7. Main Init & Listeners
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  // استعادة اللغة
  const savedLang = currentLang();
  
  // تحديد المقالة من الرابط
  const urlParams = new URLSearchParams(window.location.search);
  const artIdx = parseInt(urlParams.get('article')) - 1;
  currentArticleIndex = (artIdx >= 0 && artIdx < (window.ALL_ARTICLES?.length || 1)) ? artIdx : 0;

  applyLanguage(savedLang);

  // استعادة الحساب
  const stored = localStorage.getItem('tb_account');
  if(stored) {
    const data = JSON.parse(stored);
    account = data;
    token = data.token;
    onAccountReady();
  } else {
    createAccount();
  }

  // ربط الأزرار
  $('copyBtn').onclick = () => {
    navigator.clipboard.writeText(account.address);
    alert(currentLang() === 'ar' ? 'تم النسخ' : 'Copied');
  };
  
  $('refreshBtn').onclick = () => fetchMessages();
  
  $('newBtn').onclick = () => {
    if(confirm(currentLang() === 'ar' ? 'إنشاء بريد جديد؟' : 'Create new?')) createAccount();
  };

  $('langToggle').onclick = () => {
    const next = currentLang() === 'ar' ? 'en' : 'ar';
    localStorage.setItem('lang', next);
    applyLanguage(next);
  };
  
  // أزرار التنقل
  $('prevArticle').onclick = () => {
      if(currentArticleIndex > 0) {
          currentArticleIndex--;
          applyLanguage(currentLang());
          window.scrollTo(0,0);
      }
  };
  
  $('nextArticle').onclick = () => {
      if(currentArticleIndex < ALL_ARTICLES.length - 1) {
          currentArticleIndex++;
          applyLanguage(currentLang());
          window.scrollTo(0,0);
      }
  };
});
