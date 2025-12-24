
// mail.js - GA + AdSense + Consent Banner
// ===============================================
// 1. الدوال المساعدة الأساسية (Utility/Core Functions)
// ===============================================

// الدوال التي كانت لديك سابقًا (مع استكمال محتواها)
function currentLang() { 
    // تفترض تخزين اللغة في localStorage، والافتراضي هو العربية 'ar'
    return localStorage.getItem('lang') || 'ar'; 
}
function loadStored() { 
    // تفترض أنك تتحقق من وجود بيانات 'userData'
    return localStorage.getItem('userData') ? true : false;
}
function createAccount() { 
    console.log('تم إنشاء الحساب تلقائيًا'); 
    // ضع منطق إنشاء الحساب الفعلي هنا (مثل استدعاء API)
}

/* دالة لتحديث ترقيم المقالات: المقال X من Y */
function updateArticleCounter(){
    const total = ALL_ARTICLES.length;
    // currentArticleIndex هو رقم يبدأ من 0، لذا نضيف 1 للرقم الظاهر
    const current = currentArticleIndex + 1; 

    const lang = currentLang();
    let text = `${current} / ${total}`;

    if (lang === 'ar') {
        text = `المقال ${current} من ${total}`;
    }
    
    // تأكد من وجود دالة $ = id => document.getElementById(id); في بداية الملف
    const counterElement = $('articleCounter');
    if (counterElement) {
        counterElement.textContent = text;
    }
}
// الدوال الجديدة للغة والتبديل والتنقل (حل مشكلة عدم ظهور المقالات)

// 1. دالة تحديث نص زر اللغة
function updateLangButton(lang) {
    const btn = $('langToggle');
    if (btn) {
        btn.textContent = lang === 'ar' ? 'English 🇺🇸' : 'العربية 🇸🇦';
    }
}

// 2. دالة تحديث الرابط في المتصفح
function updateArticleURL(index) {
    history.pushState({}, "", "?article=" + (index + 1));
}

// 3. دالة تحديث العنوان والوصف (SEO)
function applySEO(articleNumber) {
    const index = articleNumber - 1;
    const article = ALL_ARTICLES[index];
    const lang = currentLang();
    
    if (article && article[lang]) {
        const title = article.title || (lang === 'ar' ? 'صندوق البريد المؤقت' : 'Temporary Mailbox');
        document.title = title;
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', article.description || title);
        }
    }
}

// 4. دالة تبديل اللغة
function toggleLanguage() {
    const current = currentLang();
    const newLang = current === 'ar' ? 'en' : 'ar';
    localStorage.setItem('lang', newLang);
    updateLangButton(newLang);
    applyLanguage(newLang); 
    applySEO(currentArticleIndex + 1);
}


// 5. دالة عرض المقالة (التصحيح النهائي لـ ID الحاوية)
function applyLanguage(lang) {
    // ⭐ هذا هو السطر المصحح الذي يستهدف ID="article" في HTML ⭐
    const articleContentContainer = $('article'); 
    
    const article = ALL_ARTICLES[currentArticleIndex]; 

    if (article && article[lang] && articleContentContainer) {
        // نستخدم DOMPurify (تأكد من تحميلها في HTML)
        const safeArticleHtml = DOMPurify.sanitize(article[lang]);
        
        // حقن المحتوى
        articleContentContainer.innerHTML = safeArticleHtml;
        
        // تطبيق الـ SEO
        if (typeof applySEO === "function") {
            applySEO(currentArticleIndex + 1);
        }

    } else if (articleContentContainer) {
        // رسالة في حالة عدم توفر المقالة
        articleContentContainer.innerHTML = `<p style="color:var(--muted)">
            ${lang === 'ar' ? 'لا يمكن عرض محتوى المقالة.' : 'Could not display article content.'}
        </p>`;
    }
}

// ===============================================
// هنا تبدأ الدوال الرئيسية الأخرى (مثل showMessage و fetchMessages)
// ===============================================

// 1️⃣ دالة currentLang لتجنب خطأ الكونسول
function currentLang() {
    return localStorage.getItem('lang') || 'ar';
}

// 2️⃣ وظائف الصفحة
function loadStored() {
    return localStorage.getItem('userData') ? true : false;
}

function createAccount() {
    console.log('تم إنشاء الحساب تلقائيًا');
}


// 3️⃣ إدارة البنر والتتبع
document.addEventListener('DOMContentLoaded', () => {
    applyLanguage(currentLang());
applySEO(currentArticleIndex + 1);
    if (!loadStored()) createAccount();

    const banner = document.getElementById('cookie-banner');
    if (!banner) return;

    const consent = localStorage.getItem('cookieConsent');

    // عرض البنر إذا لم يقرر المستخدم بعد
    if (!consent) banner.style.display = 'flex';
    else banner.style.display = 'block';

    const acceptBtn = document.getElementById('accept-btn');
    const rejectBtn = document.getElementById('reject-btn');

    if (acceptBtn) {
        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'accepted');
            banner.style.display = 'none';
             // تشغيل الصوت
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
           
            // لا نفعل أي تتبع أو إعلانات
        });
    }

    // إذا وافق المستخدم مسبقًا
    if (consent === 'accepted') enableAnalyticsAndAds();

    // -----------------------
    function enableAnalyticsAndAds() {
        // Google Analytics
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-XG-NR4CFG9TFJ'); // ضع معرف GA الخاص بك

        // Google AdSense
        // تأكد من إضافة كود AdSense هنا
        // مثال: تحميل سكربت AdSense الديناميكي
        if (!document.getElementById('adsense-script')) {
            const script = document.createElement('script');
            script.id = 'adsense-script';
            script.async = true;
            script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";
            script.setAttribute('data-ad-client', 'ca-pub-4901985375072472'); // ضع معرف AdSense الخاص بك
            document.head.appendChild(script);
        }
    }
});


/* ======================
   Configuration & State
   ====================== */
const API_BASE = 'https://api.mail.tm'; 
const $ = id => document.getElementById(id);

let account = null;
let token = null;
let messages = [];
let pollInterval = null;

/* ==============
   Translations
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
    footer:"جميع الحقوق محفوظه - © Temp-BoxMail"
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
    footer:"All rights reserved - © Temp-BoxMail"
  }
};


/* ======================
   الدوال المساعدة (SEO)
   ====================== */
function applySEO(articleNum) {
    // التأكد من أن رقم المقالة ضمن الحدود
    if (!ALL_ARTICLES || articleNum < 1 || articleNum > ALL_ARTICLES.length) {
        return;
    }

    const index = articleNum - 1;
    const article = ALL_ARTICLES[index];
    const lang = currentLang();
    
    // 1. استخراج البيانات باللغة المناسبة
    const title = article.title[lang];
    const description = article.description[lang];

    // 2. تحديث عنوان الصفحة (<title>)
    document.title = title + " | Temp-BoxMail";

    // 3. تحديث وسم الوصف (Meta Description) باستخدام الدالة المساعدة
    updateMetaTag('description', description); 

    // 4. (اختياري، لكن محبب) تحديث وسوم Open Graph للمشاركة
    updateMetaTag('og:title', title);
    updateMetaTag('og:description', description);
}
/* ============================================================
   الدالة المساعدة لتحديث وسوم الميتا (تستخدمها applySEO)
   ============================================================ */
function updateMetaTag(property, content) {
    // تحديث وسوم name (مثل description, keywords)
    let metaTag = document.querySelector(`meta[name="${property}"]`);
    
    // تحديث وسوم property (مثل og:title, og:description)
    if (!metaTag) {
        metaTag = document.querySelector(`meta[property="${property}"]`);
    }

    if (!metaTag) {
        // إذا لم يكن الوسم موجوداً، نقوم بإنشائه
        metaTag = document.createElement('meta');
        if (property.startsWith('og:')) {
            metaTag.setAttribute('property', property);
        } else {
            metaTag.name = property;
        }
        document.head.appendChild(metaTag);
    }
    
    metaTag.content = content;
}

/*/ ============================================================
   بعد ذلك يأتي كود الـ DOMContentLoaded الذي رتبناه في الرسالة السابقة
  // ============================================================ */
function updateMetaTag(property, content) {
    // البحث عن الوسم سواء كان يستخدم name أو property
    let tag = document.querySelector(`meta[name="${property}"], meta[property="${property}"]`);
    
    if (!tag) {
        tag = document.createElement('meta');
        // إذا كان الوسم يبدأ بـ og: فهو وسم Open Graph يحتاج property
        if (property.startsWith('og:')) {
            tag.setAttribute('property', property);
        } else {
            // غير ذلك فهو وسم SEO عادي يحتاج name
            tag.setAttribute('name', property);
        }
        document.head.appendChild(tag);
    }
    tag.content = content;
}function getArticleIndexFromURL() {
  const params = new URLSearchParams(window.location.search);
  const index = parseInt(params.get("article"), 10);
  if (isNaN(index) || index < 1 || index > ALL_ARTICLES.length) {
    return 0; // أول مقال افتراضي
  }
  return index - 1; // لأن المصفوفة تبدأ من 0
}

/* ================
   Language Helpers
   ================ */
// function currentLang(){ return localStorage.getItem('lang') || 'ar'; }

function applyLanguage(lang){
  // set document direction and lang
  document.documentElement.lang = lang;
  document.documentElement.dir = (lang === 'ar') ? 'rtl' : 'ltr';

  // UI texts
  const t = UI[lang];
  $('t-title').textContent = t.title;
  $('t-sub').textContent = t.subtitle;
  $('inbox-title').textContent = t.inboxTitle;
  $('inbox-desc').textContent = t.inboxDesc;
  $('copyBtn').textContent = t.copy;
  $('refreshBtn').textContent = t.refresh;
  $('newBtn').textContent = t.newMail;
  $('deleteBtn').textContent = t.delete;
  $('footer-text').textContent = t.footer;

  // Article content (HTML)
  $('article').innerHTML = ALL_ARTICLES[currentArticleIndex][lang];
 
// Article navigation buttons
  $('prevArticle').textContent = t.prevArticle;
  $('nextArticle').textContent = t.nextArticle;

  // If there are no messages, set default body text (localized)
  if(!messages.length){
    $('msg-body').innerHTML = `<p style="color:var(--muted)">${t.noMessages}</p>`;
  }

  // set lang toggle button label
  $('langToggle').textContent = (lang === 'ar') ? 'English' : 'عربي';

  localStorage.setItem('lang', lang);
}

/* ================
   Mail.TM Functions
   ================ */
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
    $('address').textContent = account.address; // address must remain untranslated
    startPolling();
    fetchMessages();
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
    // if existing account exists, clear it first in UI but keep stored if user didn't delete
    const domain = await getFirstDomain();
    const local = randLocal();
    const address = local + '@' + domain;
    const password = Math.random().toString(36).slice(-10) + 'A1!';
    // create
    const res = await fetch(API_BASE + '/accounts', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({address, password})
    });
    if(!res.ok){
      // if account exists (rare), try again
      const txt = await res.text();
      throw new Error(txt || 'Failed creating account');
    }
    account = await res.json();
    account.password = password;

    // login to get token
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
  $('address').textContent = 'انشئ بريدًا جديد';
  $('expiry').textContent = '';
  $('inbox').innerHTML = `<div style="color:var(--muted);padding:8px">${UI[currentLang()].noMessages}</div>`;
  $('msg-sub').textContent = currentLang() === 'ar' ? 'اختر الرسالة لعرض المحتوى' : 'Select a message to view';
  $('msg-from').textContent = '';
  $('msg-body').innerHTML = `<p style="color:var(--muted)">${UI[currentLang()].noMessages}</p>`;
  $('extractedOtp').style.display = 'none';
}

/* Render inbox list */
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

/* Show message content - الإصدار النهائي (أمان، OTP، صور، روابط) */
async function showMessage(m){
    // **ملاحظة هامة:** يجب التأكد من تحميل مكتبة DOMPurify في ملف HTML قبل هذا الكود.

    if(!token) return console.warn('لا يوجد توكن صالح لعرض الرسالة');
    try{
        const res = await fetch(`${API_BASE}/messages/${m.id}`, { headers: { Authorization: 'Bearer ' + token } });
        if(!res.ok) throw new Error('فشل جلب محتوى الرسالة');

        const full = await res.json();
        console.log('Message content:', full);

        // عنوان الرسالة و المرسل (نحتفظ بهذا الجزء كما هو)
        $('msg-sub').textContent = full.subject || (currentLang() === 'ar' ? '(بدون عنوان)' : '(No subject)');
        $('msg-from').textContent = (full.from?.address || '') + ' · ' + new Date(full.createdAt).toLocaleString();

        const msgBodyElement = $('msg-body');
        const extractedOtpElement = $('extractedOtp');
        
        let rawContent = '';
        let isPlainText = false;

        // 1. تحديد المحتوى الخام
        if(full.html && typeof full.html === 'string' && full.html.length){
            rawContent = full.html;
        } else if(full.text && typeof full.text === 'string' && full.text.length){
            rawContent = `<pre style="white-space:pre-wrap;color:var(--muted)">${escapeHtml(full.text)}</pre>`;
            isPlainText = true;
        } else {
            msgBodyElement.innerHTML = `<p style="color:var(--muted)">لا يوجد محتوى للرسالة</p>`;
            extractedOtpElement.style.display = 'none';
            return;
        }
        
        // 2. 🧹 التطهير الأمني باستخدام DOMPurify (تصحيح خيارات الصور)
        const safeHtml = DOMPurify.sanitize(rawContent, {
            // نُعيد 'img' لـ ALLOWED_TAGS (بدلاً من CUSTOM_ELEMENTS) لضمان القدرة على تعديل خصائصها
            ALLOWED_TAGS: ['a', 'img', 'p', 'div', 'span', 'table', 'tr', 'td', 'th', 'h1', 'h2', 'h3', 'pre', 'br', 'style'], 
            ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'style'], 
        });
        
        let finalHtml = safeHtml;
        
        // 3. 🔑 استخلاص OTP المحسّن وتغليفه
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
        
        // *********************************************************
// 4. 🔗 التعديل الأخير للمحتوى (الروابط والصور)
        // ننشئ عنصر DIV مؤقت لتحليل محتوى HTML النظيف والآمن
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = finalHtml; 

        // أ. معالجة الصور (تجاوز حظر الـ Referrer)
        // هذا يحول الروابط النصية إلى عناصر <img> قابلة للعرض
        tempDiv.querySelectorAll('img').forEach(img => {
            img.setAttribute('referrerpolicy', 'no-referrer');
        });
        
        // ب. معالجة الروابط (الأمان وتفعيل الزيارة)
        // هذا يحول الروابط النصية إلى عناصر <a> قابلة للنقر بأمان
        tempDiv.querySelectorAll('a').forEach(link => {
            link.setAttribute('target', '_blank'); // فتح في نافذة جديدة
            link.setAttribute('rel', 'noopener noreferrer nofollow'); // أمان الروابط
        });

        // 5. حقن المحتوى المعالج والآمن في DOM (الخطوة النهائية)
        msgBodyElement.innerHTML = tempDiv.innerHTML;
        // *********************************************************

    } catch(e){
        console.error('showMessage error:', e);
        // رسالة خطأ أوضح في حالة الفشل
        $('msg-body').innerHTML = `<p style="color:red">
            خطأ في عرض المحتوى. الأسباب: (1) عدم تحميل DOMPurify CDN. (2) فشل اتصال API.
        </p>`;
        $('extractedOtp').style.display = 'none';
    }
}/* Polling */
function startPolling(){
  if(pollInterval) clearInterval(pollInterval);
  pollInterval = setInterval(fetchMessages, 7000);
}
function stopPolling(){ if(pollInterval) clearInterval(pollInterval); pollInterval = null; }

/* Called when account created */
function onAccountReady(){
  $('address').textContent = account.address; // ALWAYS untranslated
  $('expiry').textContent = currentLang() === 'ar' ? 'العنوان مُدار بواسطة temp-boxmail.org' : 'Address managed by temp-boxmail.org';
  startPolling();
  fetchMessages();
}

// ===============================================
// دالة عرض المقالة الرئيسية وتطبيق اللغة (مُعدَّلة)
// ===============================================

function applyLanguage(lang) {
    // ⭐⭐ تم التعديل ليناسب الـ ID الموجود في كود HTML وهو 'article' ⭐⭐
    const articleContentContainer = $('article'); 
    
    // المقالة الحالية (article)
    const article = ALL_ARTICLES[currentArticleIndex]; 

    if (article && article[lang] && articleContentContainer) {
        // نستخدم DOMPurify لتطهير محتوى المقالة للأمان
        const safeArticleHtml = DOMPurify.sanitize(article[lang]);
        
        // حقن المحتوى في الـ DOM
        articleContentContainer.innerHTML = safeArticleHtml;
        
        // تطبيق الـ SEO
        if (typeof applySEO === "function") {
            applySEO(currentArticleIndex + 1);
        }

    } else if (articleContentContainer) {
        // رسالة في حالة عدم توفر المقالة أو اللغة
        articleContentContainer.innerHTML = `<p style="color:var(--muted)">
            ${lang === 'ar' ? 'لا يمكن عرض محتوى المقالة.' : 'Could not display article content.'}
        </p>`;
    }
    
    // ...
}

  /* ======================
   Buttons binding
   ====================== */
document.addEventListener('DOMContentLoaded', () => {

    // 1️⃣ استخراج رقم المقال من الرابط (URL) أولاً
    const urlParams = new URLSearchParams(window.location.search);
    const articleParam = urlParams.get('article');
    if (articleParam) {
        const idx = parseInt(articleParam) - 1;
        // التأكد أن الرقم صحيح وضمن حدود المصفوفة
        if (idx >= 0 && idx < ALL_ARTICLES.length) {
            currentArticleIndex = idx;
        }
    }

    // 2️⃣ تطبيق اللغة وضبط زر التبديل
    const currentL = currentLang();
    document.documentElement.setAttribute('dir', currentL === 'ar' ? 'rtl' : 'ltr');
    applyLanguage(currentL);
    // ⭐⭐ التعديل الأول: ضبط نص زر اللغة عند التحميل
    // (يجب أن تكون دالة updateLangButton مُعرَّفة)
    if (typeof updateLangButton === "function") {
        updateLangButton(currentL);
    }

    // 3️⃣ تحميل الحساب المخزن أو إنشاء حساب جديد
    const loaded = loadStored();
    if(!loaded){
        createAccount();
    }
updateArticleCounter();
    // ===============================================
    // 4️⃣ ربط مستمعات الأحداث (EventListeners)
    // ===============================================

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

    // ⭐⭐ التعديل الثاني: ربط زر تغيير اللغة بالدالة toggleLanguage
    // (يجب أن تكون دالة toggleLanguage مُعرَّفة)
    $('langToggle').addEventListener('click', () => {
        if (typeof toggleLanguage === "function") {
            toggleLanguage();
        } else {
            console.error('الدالة toggleLanguage غير معرفة!');
        }
    });

   // ... (داخل document.addEventListener('DOMContentLoaded', ...) ) ...

    // أزرار التنقل بين المقالات
    $('prevArticle').addEventListener('click', () => {
        if (currentArticleIndex > 0) {
            currentArticleIndex--;
            updateArticleURL(currentArticleIndex);
            applyLanguage(currentLang());
            applySEO(currentArticleIndex + 1);
            // 🔑 إضافة العداد المفقود
            if (typeof updateArticleCounter === 'function') updateArticleCounter(); 
        }
    });

    $('nextArticle').addEventListener('click', () => {
        if (currentArticleIndex < ALL_ARTICLES.length - 1) {
            currentArticleIndex++;
            updateArticleURL(currentArticleIndex);
            applyLanguage(currentLang());
            applySEO(currentArticleIndex + 1);
            // 🔑 إضافة العداد المفقود
            if (typeof updateArticleCounter === 'function') updateArticleCounter();
        }
    });

    // 5️⃣ دالة مساعدة لتحديث رابط المقال 
    function updateArticleURL(index) {
        history.pushState({}, "", "?article=" + (index + 1));
        // هنا لا يوجد استدعاء لـ applySEO
    }
document.addEventListener('DOMContentLoaded', function() {    // 1. تحديد المقالة من الرابط (إذا كان هناك دالة لهذا)

    // 2. إنشاء الحساب أو تحميله
    loadStoredAccount(); // على سبيل المثال
    
    // 3. تطبيق اللغة والمحتوى (هذه الدالة التي تسبب الخطأ 1254!)
    applyLanguage(detectUserLanguage()); // استدعاء دالة applyLanguage هنا
    
    // 4. تحديث العداد
    updateArticleCounter(); 
    
    // 5. تعريف مستمعي الأحداث
    document.getElementById('prev-btn').addEventListener('click', prevArticle);
    document.getElementById('next-btn').addEventListener('click', nextArticle);
    // ... إلخ.
});
// ... (بقية الكود) ...
// ← نهاية DOMContentLoaded
/* ==============
   END OF SCRIPT
   ============== */
 
