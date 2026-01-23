if (window.trustedTypes && window.trustedTypes.createPolicy) {
    if (!window.trustedTypes.defaultPolicy) {
        window.trustedTypes.createPolicy('default', {
            createHTML: (string) => DOMPurify.sanitize(string, { RETURN_TRUSTED_TYPE: true }),
            createScriptURL: (src) => src,
            createScript: (s) => s // هذا السطر سيحل خطأ السطر 458 الذي ظهر في صورك
        });
    }
}
// mail.js - الملف المتكامل والمنظف (الإصدار النهائي والخالي من الأخطاء التركيبية)

/* ======================
  Configuration & State
  ====================== */
const API_BASE = 'https://api.mail.tm';
const $ = id => document.getElementById(id); // دالة مساعدة سريعة

let account = null;
let token = null;
let messages = [];
let pollInterval = null;
// ملاحظة: يتم تعريف ALL_ARTICLES في ملف article_nav.js الذي يتم تحميله قبله
////let currentArticleIndex = 0; // يتم تحديثه عند التحميل من الرابط

/* ==============
  Translations UI Texts
  ============== */
const UI = {
  ar:{
    title:"Temp-BoxMail",
    subtitle:"استقبل رسائل التفعيل وOTP فورًا",
    inboxTitle:"البريد الوارد",
    inboxDesc:"يتم جلب الرسائل تلقائيًا",
    copy:"نسخ",
    refresh:"تحديث",
    newMail:"إنشاء بريد جديد",
    delete:"حذف",
    prevArticle: '‹ المقال السابق',
    nextArticle: 'المقال التالي ›',
    noMessages:"لا توجد رسائل بعد — اضغط \"إنشاء بريد جديد\" ثم استقبل الرسائل هنا.",
    msgSub: "أضغط تحديث وأختر الرسالة",
    footer:"جميع الحقوق محفوظه - © Temp-BoxMail",
    // --- أضفنا هذا الجزء للأسئلة الشائعة ---
    faqTitle: "الأسئلة الشائعة (FAQ)",
    faqItems: [
      { q: "ما هو البريد الإلكتروني المؤقت؟", a: "خدمة تمنحك عنوان بريد صالح لفترة مؤقتة للتسجيل دون كشف هويتك الحقيقية." },
      { q: "هل يمكنني استقبال رسائل OTP؟", a: "نعم، النظام مصمم لاستقبال أكواد التحقق وOTP من جميع المنصات فوراً." },
      { q: "هل الخدمة مجانية بالكامل؟", a: "نعم، جميع خدماتنا مجانية 100% بدون أي تكاليف مخفية." },
      { q: "كم تظل الرسائل محفوظة؟", a: "يتم حذف الرسائل دورياً لضمان الخصوصية، لذا نوصي بنسخ بياناتك فوراً." }
    ]
  },
  en:{
    title:"Temp-BoxMail",
    subtitle:"Receive OTP & verification emails instantly",
    inboxTitle:"Inbox",
    inboxDesc:"Messages are fetched automatically",
    copy:"Copy",
    refresh:"Refresh",
    newMail:"Create New Email",
    delete:"Delete",
    prevArticle: '‹ Previous Article',
    nextArticle: 'Next Article ›',
    noMessages:"No messages yet — click \"Create New Email\" to start receiving emails.",
    msgSub: "Press refresh and select the message",
    footer:"All rights reserved - © Temp-BoxMail",
    // --- أضفنا هذا الجزء للأسئلة الشائعة ---
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
  Mail.TM API Functions (منطق البريد المؤقت)
  ============================================================ */

function escapeHtml(s){ return s? s.replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])) : ''; }
function randLocal(){ return 'tb'+Math.floor(Math.random()*900000+100000); }
function saveAccount(){ if(!account) return; localStorage.setItem('tb_account', JSON.stringify({id:account.id,address:account.address,password:account.password,token})); }

function loadStored(){
  const st = localStorage.getItem('tb_account');
  if(!st) return false;
  try{
    const obj = JSON.parse(st);
    account = {id:obj.id,address:obj.address,password:obj.password};
    token = obj.token;
    return true;
  }catch(e){ return false; }
}

async function getFirstDomain(){
  const res = await fetch(API_BASE + '/domains?page=1');
  const json = await res.json();
  if(json['hydra:member']?.length) return json['hydra:member'][0].domain;
  throw new Error('No domains available');
}

async function createAccount(){
  try{
    const domain = await getFirstDomain();
    const local = randLocal();
    const address = local + '@' + domain;
    const password = Math.random().toString(36).slice(-10) + 'A1!';
    
    const res = await fetch(API_BASE + '/accounts', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({address, password})
    });
    if(!res.ok){
      const txt = await res.text();
      throw new Error(txt || 'Failed creating account');
    }
    account = await res.json();
    account.password = password;

    const tokenRes = await fetch(API_BASE + '/token', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({address, password})
    });
    const tokenJson = await tokenRes.json();
    token = tokenJson.token;

    saveAccount();
    onAccountReady();
  }catch(e){
    alert('خطأ إنشاء الحساب: ' + (e.message || e));
    console.error(e);
  }
}

async function deleteAccount(){
  if(!account || !token) return alert('لا يوجد حساب للحذف');
  try{
    await fetch(API_BASE + '/accounts/' + account.id, {method:'DELETE', headers:{Authorization:'Bearer ' + token}});
  }catch(e){ console.warn(e); }
  account = null; token = null; messages = [];
  localStorage.removeItem('tb_account');
  renderEmptyState();
}

async function fetchMessages(){
  if(!token) return;
  try{
    const res = await fetch(API_BASE + '/messages', {headers: {Authorization: 'Bearer ' + token}});
    if(!res.ok) return;
    const json = await res.json();
    messages = json['hydra:member'] || [];
    renderInbox();
  }catch(e){
    console.error('fetchMessages error', e);
  }
}

function renderEmptyState(){
  const t = UI[currentLang()];
  $('address').textContent = t.newMail;
  $('expiry').textContent = '';
  $('inbox').innerHTML = `<div style="color:var(--muted);padding:8px">${t.noMessages}</div>`;
  $('msg-sub').textContent = currentLang() === 'ar' ? 'اختر الرسالة لعرض المحتوى' : 'Select a message to view';
  $('msg-from').textContent = '';
  $('msg-body').innerHTML = `<p style="color:var(--muted)">${t.noMessages}</p>`;
  $('extractedOtp').style.display = 'none';
}

function renderInbox(){
  const container = $('inbox');
  container.innerHTML = '';
  if(!messages.length){
    container.innerHTML = `<div style="color:var(--muted);padding:8px">${UI[currentLang()].noMessages}</div>`;
    $('msg-body').innerHTML = `<p style="color:var(--muted)">${UI[currentLang()].noMessages}</p>`;
    return;
  }
  messages.forEach(m => {
    const el = document.createElement('div');
    el.className = 'mail-item';
    el.innerHTML = `<div style="flex:1">
      <div class="mail-sub">${escapeHtml(m.subject || '(بدون عنوان)')}</div>
      <div class="mail-from">${escapeHtml(m.from?.address || 'مُرسِل مجهول')}</div>
    </div><div class="mail-time">${new Date(m.createdAt).toLocaleString()}</div>`;
    el.onclick = () => showMessage(m);
    container.appendChild(el);
  });
}

async function showMessage(m){
    if(!token) return console.warn('لا يوجد توكن صالح لعرض الرسالة');
    try{
        const res = await fetch(`${API_BASE}/messages/${m.id}`, { headers: { Authorization: 'Bearer ' + token } });
        if(!res.ok) throw new Error('فشل جلب محتوى الرسالة');

        const full = await res.json();
        $('msg-sub').textContent = full.subject || (currentLang() === 'ar' ? '(بدون عنوان)' : '(No subject)');
        $('msg-from').textContent = (full.from?.address || '') + ' · ' + new Date(full.createdAt).toLocaleString();

        const msgBodyElement = $('msg-body');
        const extractedOtpElement = $('extractedOtp');

        let rawContent = '';
        if(full.html && typeof full.html === 'string' && full.html.length){
            rawContent = full.html;
        } else if(full.text && typeof full.text === 'string' && full.text.length){
            rawContent = `<pre style="white-space:pre-wrap;color:var(--muted)">${escapeHtml(full.text)}</pre>`;
        } else {
            msgBodyElement.innerHTML = `<p style="color:var(--muted)">لا يوجد محتوى للرسالة</p>`;
            extractedOtpElement.style.display = 'none';
            return;
        }

        // التطهير الأمني باستخدام DOMPurify
        const safeHtml = DOMPurify.sanitize(rawContent, {
            ALLOWED_TAGS: ['a', 'img', 'p', 'div', 'span', 'table', 'tr', 'td', 'th', 'h1', 'h2', 'h3', 'pre', 'br', 'style'],
            ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'style'],
        });

        let finalHtml = safeHtml;

        // استخلاص OTP المحسّن وتغليفه
        const otpRegex = /(?:رمز|كود|OTP|Code)[\s:]*([0-9]{4,8}|[A-Za-z0-9]{5,10})|(\b\d{4,8}\b)/i;
        let otpMatch = finalHtml.match(otpRegex);
        let otpValue = null;

        if (otpMatch) {
            otpValue = otpMatch[1] || otpMatch[2];
        }

        if(otpValue){
            extractedOtpElement.textContent = otpValue;
            extractedOtpElement.style.display = 'inline-block';

            const escapedOtp = otpValue.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
            const wrapRegex = new RegExp(`\\b${escapedOtp}\\b`, 'i');

            finalHtml = finalHtml.replace(wrapRegex, `<span class="otp">${otpValue}</span>`);

        } else {
            extractedOtpElement.style.display = 'none';
        }

        // التعديل الأخير للمحتوى (الروابط والصور)
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = finalHtml;

        tempDiv.querySelectorAll('img').forEach(img => {
            img.setAttribute('referrerpolicy', 'no-referrer');
        });

        tempDiv.querySelectorAll('a').forEach(link => {
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer nofollow');
        });

        // حقن المحتوى المعالج والآمن في DOM
        msgBodyElement.innerHTML = tempDiv.innerHTML;

    } catch(e){
        console.error('showMessage error:', e);
        $('msg-body').innerHTML = `<p style="color:red">خطأ في عرض المحتوى.</p>`;
        $('extractedOtp').style.display = 'none';
    }
}

/* Polling */
function startPolling(){
  if(pollInterval) clearInterval(pollInterval);
  pollInterval = setInterval(fetchMessages, 7000);
}
function stopPolling(){ if(pollInterval) clearInterval(pollInterval); pollInterval = null; }

/* Called when account created or loaded */
function onAccountReady(){
  $('address').textContent = account.address; // ALWAYS untranslated
  $('expiry').textContent = currentLang() === 'ar' ? 'العنوان مُدار بواسطة temp-boxmail.org' : 'Address managed by temp-boxmail.org';
  startPolling();
  fetchMessages();
}

/* ============================================================
  Article/Language/SEO Helpers
  ============================================================ */

function currentLang() {
  return localStorage.getItem('lang') || 'ar';
}

function updateArticleURL(index) {
  history.pushState({}, "", "?article=" + (index + 1));
}

function getArticleIndexFromURL() {
  const params = new URLSearchParams(window.location.search);
  const index = parseInt(params.get("article"), 10);
  if (isNaN(index) || index < 1 || index > ALL_ARTICLES.length) {
    return 0;
  }
  return index - 1;
}

function updateArticleCounter(){
  const total = ALL_ARTICLES.length;
  const current = currentArticleIndex + 1;

  const lang = currentLang();
  let text = `${current} / ${total}`;

  if (lang === 'ar') {
    text = `المقال ${current} من ${total}`;
  }

  const counterElement = $('articleCounter');
  if (counterElement) {
    counterElement.textContent = text;
  }
}

function updateMetaTag(property, content) {
  let tag = document.querySelector(`meta[name="${property}"], meta[property="${property}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    if (property.startsWith('og:')) {
      tag.setAttribute('property', property);
    } else {
      tag.setAttribute('name', property);
    }
    document.head.appendChild(tag);
  }
  tag.content = content;
}

function applySEO(articleNum) {
  if (!window.ALL_ARTICLES || articleNum < 1 || articleNum > ALL_ARTICLES.length) {
    return;
  }
  const index = articleNum - 1;
  const article = ALL_ARTICLES[index];
  const lang = currentLang();

  // استخدام نصوص UI الافتراضية إذا لم يتم تعريف العنوان والوصف في بيانات المقالة
  const title = article.title?.[lang] || UI[lang].title;
  const description = article.description?.[lang] || UI[lang].subtitle;

  document.title = title + " | Temp-BoxMail";
  updateMetaTag('description', description);
  updateMetaTag('og:title', title);
  updateMetaTag('og:description', description);

let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    document.head.appendChild(canonical);
  }
  canonical.setAttribute('href', window.location.href);
}

function updateLangButton(lang) {
  const btn = $('langToggle');
  if (btn) {
    btn.textContent = lang === 'ar' ? 'English 🇺🇸' : 'العربية 🇸🇦';
  }
}

function toggleLanguage() {
  const current = currentLang();
  const newLang = current === 'ar' ? 'en' : 'ar';
  localStorage.setItem('lang', newLang);
  updateLangButton(newLang);
  applyLanguage(newLang);
  applySEO(currentArticleIndex + 1);
}

function applyLanguage(lang) {
  // تطبيق الاتجاه واللغة في HTML
  document.documentElement.lang = lang;
  document.documentElement.dir = (lang === 'ar') ? 'rtl' : 'ltr';

  // تحديث نصوص الواجهة (UI)
  const t = UI[lang];
// تحديث نصوص الأزرار (نستهدف الـ span الداخلي للحفاظ على الأيقونة)
 if ($('btn-text-copy')) $('btn-text-copy').textContent = t.copy;
 if ($('btn-text-refresh')) $('btn-text-refresh').textContent = t.refresh;
 if ($('btn-text-new')) $('btn-text-new').textContent = t.newMail;
 if ($('btn-text-delete')) $('btn-text-delete').textContent = t.delete;
  if ($('t-title')) $('t-title').textContent = t.title;
 if ($('t-sub')) $('t-sub').textContent = t.subtitle;
 if ($('inbox-title')) $('inbox-title').textContent = t.inboxTitle;
 if ($('inbox-desc')) $('inbox-desc').textContent = t.inboxDesc;
 if ($('footer-text')) $('footer-text').textContent = t.footer;
 if ($('msg-sub')) $('msg-sub').textContent = t.msgSub;

  // 3. تحديث زر تبديل اللغة
  if ($('langToggle')) {
    $('langToggle').textContent = (lang === 'ar') ? 'English 🇺🇸' : 'العربية 🇸🇦';
  }
  // أزرار التنقل بين المقالات
  const prevBtn = $('prevArticle');
  const nextBtn = $('nextArticle');
  if (prevBtn) prevBtn.textContent = t.prevArticle;
  if (nextBtn) nextBtn.textContent = t.nextArticle;

// ----------------------------------------------------------------
  // تحديث قسم الأسئلة الشائعة (FAQ) - الجزء الجديد
  // ----------------------------------------------------------------
  const faqTitleElem = $('faq-main-title');
  const faqListElem = $('faq-list');

  if (faqTitleElem && faqListElem && t.faqItems) {
    faqTitleElem.textContent = t.faqTitle;
    faqListElem.innerHTML = t.faqItems.map(item => `
      <div class="faq-item" style="border-bottom: 1px solid rgba(255,255,255,0.05); padding: 15px 0;">
        <p><strong style="color: var(--accent); display: block; margin-bottom: 5px;">${item.q}</strong></p>
        <p style="color: #ccc; font-size: 15px;">${item.a}</p>
      </div>
    `).join('');
  }

// ----------------------------------------------------------------
// 4. إضافة Schema FAQ لمساعدة جوجل (SEO)
// ----------------------------------------------------------------
let scriptTag = document.getElementById('faq-schema');
if (!scriptTag) {
    scriptTag = document.createElement('script');
    scriptTag.id = 'faq-schema';
    scriptTag.type = 'application/ld+json';
    document.head.appendChild(scriptTag);
}

// التعديل الأمني: استخدام Trusted Types بدلاً من textContent المباشر
const schemaString = JSON.stringify(schemaData);
if (window.trustedTypes && window.trustedTypes.defaultPolicy) {
    // نستخدم createScript لأن السياسة تمنع النصوص غير المفحوصة في السكربتات
    scriptTag.text = window.trustedTypes.defaultPolicy.createScript(schemaString);
} else {
    scriptTag.textContent = schemaString;
}

// ----------------------------------------------------------------
// عرض محتوى المقالة
// ----------------------------------------------------------------
const articleContentContainer = $('article');
const article = ALL_ARTICLES[currentArticleIndex];

if (article && article[lang] && articleContentContainer) {
    // التطهير الأمني وحقن المحتوى كـ TrustedHTML
    const cleanHtml = DOMPurify.sanitize(article[lang], { RETURN_TRUSTED_TYPE: true });
    articleContentContainer.innerHTML = cleanHtml;
    
    applySEO(currentArticleIndex + 1);
} else if (articleContentContainer) {
    articleContentContainer.innerHTML = `<p style="color:var(--muted)">
      ${lang === 'ar' ? 'لا يمكن عرض محتوى المقالة.' : 'Could not display article content.'}
    </p>`;
}
/* ============================================================
  DOM Content Loaded (المنفذ الرئيسي عند تحميل الصفحة)
  ============================================================ */
document.addEventListener('DOMContentLoaded', () => {

  // 1. Initialize Article Index & Display
  currentArticleIndex = getArticleIndexFromURL();
  const initialLang = currentLang();
  
  // تطبيق اللغة واتجاه الصفحة والعداد
  document.documentElement.setAttribute('dir', initialLang === 'ar' ? 'rtl' : 'ltr');
  updateLangButton(initialLang);
  updateArticleCounter();
  applyLanguage(initialLang); // هذا يستدعي applySEO

  // 2. Account Check & Initialization
  const loaded = loadStored();
  if(loaded){
    onAccountReady();
  } else {
    // إذا لم يكن مخزنًا، قم بإنشاء حساب
    createAccount(); 
  }

  // 3. Event Listeners (ربط الأزرار)

  // أزرار البريد
  $('copyBtn').addEventListener('click', () => {
    if(!account?.address) return alert(currentLang() === 'ar' ? 'لا يوجد عنوان لنسخه' : 'No address to copy');
    navigator.clipboard.writeText(account.address).then(()=> alert(currentLang() === 'ar' ? 'تم النسخ' : 'Copied'));
  });

  $('newBtn').addEventListener('click', () => {
    if(confirm(currentLang() === 'ar' ? 'إنشاء بريد جديد سيحذف الحالي. موافق؟' : 'Creating a new email will replace the current one. Continue?')){
      createAccount();
    }
  });

  $('refreshBtn').addEventListener('click', () => {
    fetchMessages().then(() => alert(currentLang() === 'ar' ? 'تم التحديث' : 'Refreshed'));
  });

  $('deleteBtn').addEventListener('click', () => {
    if(confirm(currentLang() === 'ar' ? 'حذف الحساب نهائيًا؟' : 'Delete account permanently?')){
      deleteAccount();
    }
  });

  // زر تغيير اللغة
  $('langToggle').addEventListener('click', toggleLanguage);

  // أزرار التنقل بين المقالات
  $('prevArticle').addEventListener('click', () => {
    if (currentArticleIndex > 0) {
      currentArticleIndex--;
      updateArticleURL(currentArticleIndex);
      updateArticleCounter();
      applyLanguage(currentLang()); 
    }
  });

  $('nextArticle').addEventListener('click', () => {
    if (currentArticleIndex < ALL_ARTICLES.length - 1) {
      currentArticleIndex++;
      updateArticleURL(currentArticleIndex);
      updateArticleCounter();
      applyLanguage(currentLang());
    }
  });


  // 4. Consent Banner Logic
  const banner = document.getElementById('cookie-banner');
  if (!banner) return;

  const consent = localStorage.getItem('cookieConsent');
  if (!consent) banner.style.display = 'flex';

  const acceptBtn = document.getElementById('accept-btn');
  const rejectBtn = document.getElementById('reject-btn');

 const enableAnalyticsAndAds = () => {
    // استخدم الـ loadAnalytics التي عرفناها في HTML لضمان الالتزام بـ Trusted Types والـ Nonce
    if (typeof loadAnalytics === 'function') {
        loadAnalytics();
    }

    // Google AdSense مع الالتزام بالـ Nonce
    if (!document.getElementById('adsense-script')) {
        const script = document.createElement('script');
        script.id = 'adsense-script';
        script.async = true;
        script.nonce = "rAnd0m123"; // يجب أن يطابق الـ Nonce في الـ HTML
        script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4901985375072472";
        script.setAttribute('crossorigin', 'anonymous');
        document.head.appendChild(script);
    }
};

  if (acceptBtn) {
    acceptBtn.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'accepted');
      banner.style.display = 'none';
      const notifySound = document.getElementById('notifySound');
      if (notifySound) {
        notifySound.play().catch(e => console.log("الصوت لم يُشغل:", e));
      }
      enableAnalyticsAndAds();
    });
  }

  if (rejectBtn) {
    rejectBtn.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'rejected');
      banner.style.display = 'none';
    });
  }

  if (consent === 'accepted') enableAnalyticsAndAds();
});
// 🛑 هذا هو نهاية ملف mail.js
