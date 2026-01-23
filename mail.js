/* ============================================================
   1. Trusted Types Configuration
   ============================================================ */
if (window.trustedTypes && window.trustedTypes.createPolicy) {
    if (!window.trustedTypes.defaultPolicy) {
        try {
            window.trustedTypes.createPolicy('default', {
                createHTML: (string) => typeof DOMPurify !== 'undefined' ? DOMPurify.sanitize(string, { RETURN_TRUSTED_TYPE: true }) : string,
                createScriptURL: (src) => src,
                createScript: (s) => s 
            });
        } catch (e) { console.warn("TrustedTypes policy already exists"); }
    }
}

/* ======================
   2. Configuration & State
   ====================== */
const API_BASE = 'https://api.mail.tm';
const $ = id => document.getElementById(id);

let mail_account = null;
let mail_token = null;
let mail_messages = [];
let mail_pollInterval = null;
// تم تغيير الاسم لمنع خطأ "already declared"
let mail_currentArticleIdx = 0; 

/* ==============
   3. Translations
   ============== */
const UI_DOCS = {
  ar: {
    title: "Temp-BoxMail",
    subtitle: "استقبل رسائل التفعيل وOTP فورًا",
    inboxTitle: "البريد الوارد",
    noMessages: "لا توجد رسائل بعد — اضغط \"إنشاء بريد جديد\" ثم استقبل الرسائل هنا.",
    copy: "نسخ", refresh: "تحديث", newMail: "جديد", delete: "حذف",
    footer: "جميع الحقوق محفوظة - © Temp-BoxMail",
    faqTitle: "الأسئلة الشائعة (FAQ)",
    faqItems: [
      { q: "ما هو البريد الإلكتروني المؤقت؟", a: "خدمة تمنحك عنوان بريد صالح لفترة مؤقتة للتسجيل دون كشف هويتك الحقيقية." },
      { q: "هل يمكنني استقبال رسائل OTP؟", a: "نعم، النظام مصمم لاستقبال أكواد التحقق وOTP فوراً." }
    ]
  },
  en: {
    title: "Temp-BoxMail",
    subtitle: "Receive OTP & verification emails instantly",
    inboxTitle: "Inbox",
    noMessages: "No messages yet — click \"Create New Email\".",
    copy: "Copy", refresh: "Refresh", newMail: "New", delete: "Delete",
    footer: "All rights reserved - © Temp-BoxMail",
    faqTitle: "Frequently Asked Questions (FAQ)",
    faqItems: [
      { q: "What is Temporary Email?", a: "A service providing a temp address for privacy." },
      { q: "Can I receive OTP?", a: "Yes, our system is optimized for OTP codes." }
    ]
  }
};

/* ============================================================
   4. Core Functions
   ============================================================ */
function safeHtml(s){ return s? s.replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])) : ''; }
function getActiveLang() { return localStorage.getItem('lang') || 'ar'; }

async function fetchMailMessages(){
  if(!mail_token) return;
  try {
    const res = await fetch(API_BASE + '/messages', {headers: {Authorization: 'Bearer ' + mail_token}});
    if(res.ok) {
        const json = await res.json();
        mail_messages = json['hydra:member'] || [];
        renderMailInbox();
    }
  } catch(e) { console.error("Fetch Error", e); }
}

function renderMailInbox(){
  const container = $('inbox');
  if(!container) return;
  container.innerHTML = '';
  if(!mail_messages.length){
    container.innerHTML = `<div style="color:#888;padding:10px">${UI_DOCS[getActiveLang()].noMessages}</div>`;
    return;
  }
  mail_messages.forEach(m => {
    const el = document.createElement('div');
    el.className = 'mail-item';
    el.style.cursor = 'pointer';
    el.innerHTML = `<div><div class="mail-sub">${safeHtml(m.subject)}</div><div class="mail-from">${safeHtml(m.from?.address)}</div></div>`;
    el.onclick = () => showMailDetail(m);
    container.appendChild(el);
  });
}

async function showMailDetail(m){
    try {
        const res = await fetch(`${API_BASE}/messages/${m.id}`, { headers: { Authorization: 'Bearer ' + mail_token } });
        const full = await res.json();
        $('msg-sub').textContent = full.subject || 'No Subject';
        let rawContent = full.html || `<pre>${safeHtml(full.text)}</pre>`;
        
        if (window.DOMPurify) {
            $('msg-body').innerHTML = window.DOMPurify.sanitize(rawContent, { RETURN_TRUSTED_TYPE: true });
        } else {
            $('msg-body').innerHTML = rawContent;
        }
    } catch(e){ console.error(e); }
}

function updateUILanguage(lang) {
  document.documentElement.lang = lang;
  document.documentElement.dir = (lang === 'ar') ? 'rtl' : 'ltr';
  const t = UI_DOCS[lang];

  if ($('btn-text-copy')) $('btn-text-copy').textContent = t.copy;
  if ($('btn-text-refresh')) $('btn-text-refresh').textContent = t.refresh;
  if ($('btn-text-new')) $('btn-text-new').textContent = t.newMail;
  if ($('btn-text-delete')) $('btn-text-delete').textContent = t.delete;
  if ($('t-title')) $('t-title').textContent = t.title;
  if ($('t-sub')) $('t-sub').textContent = t.subtitle;
  if ($('inbox-title')) $('inbox-title').textContent = t.inboxTitle;
  if ($('footer-text')) $('footer-text').textContent = t.footer;
  if ($('langToggle')) $('langToggle').textContent = (lang === 'ar') ? 'English' : 'العربية';

  // تحديث المقالات من ملف article_nav.js
  if (window.ALL_ARTICLES && ALL_ARTICLES[mail_currentArticleIdx]) {
    const art = ALL_ARTICLES[mail_currentArticleIdx];
    if ($('article')) {
        $('article').innerHTML = window.DOMPurify ? DOMPurify.sanitize(art[lang], { RETURN_TRUSTED_TYPE: true }) : art[lang];
    }
    if ($('articleCounter')) $('articleCounter').textContent = `${mail_currentArticleIdx + 1} / ${ALL_ARTICLES.length}`;
  }
}

async function createNewMailAccount(){
  try {
    const dRes = await fetch(API_BASE + '/domains');
    const dJson = await dRes.json();
    const domain = dJson['hydra:member'][0].domain;
    const address = 'box' + Math.random().toString(36).substring(2, 7) + '@' + domain;
    const password = 'Pass' + Math.random().toString(36).slice(-8);

    const res = await fetch(API_BASE + '/accounts', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({address, password})
    });
    
    const tokenRes = await fetch(API_BASE + '/token', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({address, password})
    });
    const tJson = await tokenRes.json();
    
    mail_account = { address };
    mail_token = tJson.token;
    localStorage.setItem('tb_acc_v2', JSON.stringify({address, token: mail_token}));
    refreshAccountDisplay();
  } catch(e) { console.error("Account Creation Error", e); }
}

function refreshAccountDisplay(){
  if ($('address')) $('address').textContent = mail_account.address;
  if (mail_pollInterval) clearInterval(mail_pollInterval);
  mail_pollInterval = setInterval(fetchMailMessages, 8000);
  fetchMailMessages();
}

/* ============================================================
   5. Initialization
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  const savedLang = getActiveLang();
  updateUILanguage(savedLang);

  const stored = localStorage.getItem('tb_acc_v2');
  if(stored) {
    const data = JSON.parse(stored);
    mail_account = { address: data.address };
    mail_token = data.token;
    refreshAccountDisplay();
  } else {
    createNewMailAccount();
  }

  // Events
  $('copyBtn').onclick = () => {
    navigator.clipboard.writeText(mail_account.address);
    alert(getActiveLang() === 'ar' ? 'تم النسخ!' : 'Copied!');
  };
  
  $('refreshBtn').onclick = () => fetchMailMessages();
  $('newBtn').onclick = () => createNewMailAccount();
  $('langToggle').onclick = () => {
    const next = getActiveLang() === 'ar' ? 'en' : 'ar';
    localStorage.setItem('lang', next);
    updateUILanguage(next);
  };
  
  $('nextArticle').onclick = () => {
      if(window.ALL_ARTICLES && mail_currentArticleIdx < ALL_ARTICLES.length - 1) {
          mail_currentArticleIdx++;
          updateUILanguage(getActiveLang());
      }
  };
  
  $('prevArticle').onclick = () => {
      if(mail_currentArticleIdx > 0) {
          mail_currentArticleIdx--;
          updateUILanguage(getActiveLang());
      }
  };
});
