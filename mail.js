// =======================
// mail.js - GA + AdSense + Consent Banner + Temp Mail
// =======================

// -----------------------
// 1️⃣ Helpers
// -----------------------
const $ = id => document.getElementById(id);

function currentLang() {
    return localStorage.getItem('lang') || 'ar';
}

function escapeHtml(s) {
    return s ? s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])) : '';
}

function randLocal() {
    return 'tb' + Math.floor(Math.random() * 900000 + 100000);
}

// -----------------------
// 2️⃣ Articles & UI
// -----------------------
const ALL_ARTICLES = [];
let currentArticleIndex = 0;

// تعريف جميع المقالات هنا (ARTICLE_1 ... ARTICLE_9) كما في كودك السابق
// ثم إضافة المقالات إلى المصفوفة
ALL_ARTICLES.push(ARTICLE_1, ARTICLE_2, ARTICLE_3, ARTICLE_4, ARTICLE_5, ARTICLE_6, ARTICLE_7, ARTICLE_8, ARTICLE_9);

const UI = {
  ar:{ title:"Temp-BoxMail", subtitle:"استقبل رسائل التفعيل وOTP فورًا", inboxTitle:"البريد الوارد", inboxDesc:"يتم جلب الرسائل تلقائيًا", copy:"نسخ", refresh:"تحديث", newMail:"إنشاء بريد جديد", delete:"حذف", noMessages:"لا توجد رسائل بعد — اضغط \"إنشاء بريد جديد\" ثم استقبل الرسائل هنا.", footer:"جميع الحقوق محفوظه - © Temp-BoxMail" },
  en:{ title:"Temp-BoxMail", subtitle:"Receive OTP & verification emails instantly", inboxTitle:"Inbox", inboxDesc:"Messages are fetched automatically", copy:"Copy", refresh:"Refresh", newMail:"Create New Email", delete:"Delete", noMessages:"No messages yet — click \"Create New Email\" to start receiving emails.", footer:"All rights reserved - © Temp-BoxMail" }
};

// -----------------------
// 3️⃣ Language & UI
// -----------------------
function applyLanguage(lang){
    document.documentElement.lang = lang;
    document.documentElement.dir = (lang === 'ar') ? 'rtl' : 'ltr';

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

    // عرض المقال
    $('article').innerHTML = ALL_ARTICLES[currentArticleIndex][lang];

    // حالة البريد الوارد إذا فارغ
    if(!messages.length){
        $('msg-body').innerHTML = `<p style="color:var(--muted)">${t.noMessages}</p>`;
        $('inbox').innerHTML = `<div style="color:var(--muted);padding:8px">${t.noMessages}</div>`;
    }

    $('langToggle').textContent = (lang === 'ar') ? 'English' : 'عربي';
    localStorage.setItem('lang', lang);
}

// -----------------------
// 4️⃣ Consent Banner & Analytics
// -----------------------
function enableAnalyticsAndAds(){
    // Google Analytics
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-XG-NR4CFG9TFJ'); // معرف GA الخاص بك

    // Google AdSense
    if (!document.getElementById('adsense-script')) {
        const script = document.createElement('script');
        script.id = 'adsense-script';
        script.async = true;
        script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";
        script.setAttribute('data-ad-client', 'ca-pub-4901985375072472'); // معرف AdSense الخاص بك
        document.head.appendChild(script);
    }
}

function setupConsentBanner(){
    const banner = $('cookie-banner');
    if (!banner) return;

    const consent = localStorage.getItem('cookieConsent');

    banner.style.display = !consent ? 'flex' : 'block';

    const acceptBtn = $('accept-btn');
    const rejectBtn = $('reject-btn');

    if (acceptBtn) acceptBtn.addEventListener('click', () => {
        localStorage.setItem('cookieConsent','accepted');
        banner.style.display='none';
        const notifySound = $('notifySound');
        if(notifySound) notifySound.play().catch(e=>console.log("الصوت لم يُشغل:", e));
        enableAnalyticsAndAds();
    });

    if (rejectBtn) rejectBtn.addEventListener('click', () => {
        localStorage.setItem('cookieConsent','rejected');
        banner.style.display='none';
    });

    if(consent === 'accepted') enableAnalyticsAndAds();
}

// -----------------------
// 5️⃣ Temp-Mail Functions
// -----------------------
const API_BASE = 'https://api.mail.tm';
let account = null;
let token = null;
let messages = [];
let pollInterval = null;

function hasStoredAccount(){ return !!localStorage.getItem('tb_account'); }

function loadStoredAccount(){
    const st = localStorage.getItem('tb_account');
    if(!st) return false;
    try{
        const obj = JSON.parse(st);
        account = {id:obj.id,address:obj.address,password:obj.password};
        token = obj.token;
        $('address').textContent = account.address;
        startPolling();
        fetchMessages();
        return true;
    }catch(e){ return false; }
}

function saveAccount(){
    if(!account) return;
    localStorage.setItem('tb_account', JSON.stringify({id:account.id,address:account.address,password:account.password,token}));
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
        const res = await fetch(API_BASE + '/accounts', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({address,password})});
        if(!res.ok){ const txt = await res.text(); throw new Error(txt || 'Failed creating account'); }
        account = await res.json();
        account.password = password;

        const tokenRes = await fetch(API_BASE + '/token', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({address,password})});
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
    try{ await fetch(API_BASE + '/accounts/' + account.id, {method:'DELETE', headers:{Authorization:'Bearer ' + token}}); }catch(e){ console.warn(e); }
    account=null; token=null; messages=[];
    localStorage.removeItem('tb_account');
    renderEmptyState();
}

async function fetchMessages(){
    if(!token) return;
    try{
        const res = await fetch(API_BASE + '/messages', {headers:{Authorization:'Bearer ' + token}});
        if(!res.ok) return;
        const json = await res.json();
        messages = json['hydra:member'] || [];
        renderInbox();
    }catch(e){ console.error('fetchMessages error', e); }
}

function renderEmptyState(){
    $('address').textContent = 'انشئ بريدًا جديد';
    $('expiry').textContent = '';
    $('inbox').innerHTML = `<div style="color:var(--muted);padding:8px">${UI[currentLang()].noMessages}</div>`;
    $('msg-sub').textContent = currentLang() === 'ar' ? 'اختر الرسالة لعرض المحتوى' : 'Select a message to view';
    $('msg-from').textContent = '';
    $('msg-body').innerHTML = `<p style="color:var(--muted)">${UI[currentLang()].noMessages}</p>`;
    $('extractedOtp').style.display='none';
}

function renderInbox(){
    const container = $('inbox');
    container.innerHTML = '';
    if(!messages.length){ renderEmptyState(); return; }
    messages.forEach(m => {
        const el = document.createElement('div');
        el.className='mail-item';
        el.innerHTML = `<div style="flex:1">
            <div class="mail-sub">${escapeHtml(m.subject || '(بدون عنوان)')}</div>
            <div class="mail-from">${escapeHtml(m.from?.address || 'مُرسِل مجهول')}</div>
        </div><div class="mail-time">${new Date(m.createdAt).toLocaleString()}</div>`;
        el.onclick = ()=> showMessage(m);
        container.appendChild(el);
    });
}

async function showMessage(m){
    if(!token) return console.warn('لا يوجد توكن صالح لعرض الرسالة');
    try{
        const res = await fetch(`${API_BASE}/messages/${m.id}`, {headers:{Authorization:'Bearer '+token}});
        if(!res.ok) throw new Error('فشل جلب محتوى الرسالة');
        const full = await res.json();

        $('msg-sub').textContent = full.subject || (currentLang() === 'ar' ? '(بدون عنوان)' : '(No subject)');
        $('msg-from').textContent = (full.from?.address || '') + ' · ' + new Date(full.createdAt).toLocaleString();

        let content = '';
        if(full.html?.length){ const safe=full.html.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi,''); $('msg-body').innerHTML=safe; }
        else if(full.text?.length) $('msg-body').innerHTML=`<pre style="white-space:pre-wrap;color:var(--muted)">${escapeHtml(full.text)}</pre>`;
        else $('msg-body').innerHTML=`<p style="color:var(--muted)">لا يوجد محتوى للرسالة</p>`;

        const combined = (full.text||'') + ' ' + (full.html||'');
        const found = combined.match(/\b\d{4,8}\b/);
        if(found){ $('extractedOtp').style.display='inline-block'; $('extractedOtp').textContent=found[0]; }
        else $('extractedOtp').style.display='none';

    }catch(e){ console.error('showMessage error:', e); $('msg-body').innerHTML=`<p style="color:var(--muted)">فشل عرض محتوى الرسالة</p>`; }
}

// Polling
function startPolling(){ if(pollInterval) clearInterval(pollInterval); pollInterval=setInterval(fetchMessages,7000); }
function stopPolling(){ if(pollInterval) clearInterval(pollInterval); pollInterval=null; }

function onAccountReady(){
    $('address').textContent=account.address;
    $('expiry').textContent=currentLang()==='ar'?'العنوان مُدار بواسطة temp-boxmail.online':'Address managed by temp-boxmail.online';
    startPolling();
    fetchMessages();
    alert((currentLang()==='ar'?'تم إنشاء البريد: ':'Created email: ')+account.address);
}

// -----------------------
// 6️⃣ DOMContentLoaded
// -----------------------
document.addEventListener('DOMContentLoaded', ()=>{

    applyLanguage(currentLang());
    setupConsentBanner();

    const loaded = loadStoredAccount();
    if(!loaded) createAccount();

    // أزرار البريد
    $('copyBtn').addEventListener('click', ()=>{ if(!account?.address) return alert(currentLang()==='ar'?'لا يوجد عنوان لنسخه':'No address to copy'); navigator.clipboard.writeText(account.address).then(()=>alert(currentLang()==='ar'?'تم النسخ':'Copied')); });
    $('newBtn').addEventListener('click', ()=>{ if(confirm(currentLang()==='ar'?'إنشاء بريد جديد سيحذف الحالي. موافق؟':'Creating a new email will replace the current one. Continue?')) createAccount(); });
    $('refreshBtn').addEventListener('click', ()=>{ fetchMessages().then(()=>alert(currentLang()==='ar'?'تم التحديث':'Refreshed')); });
    $('deleteBtn').addEventListener('click', ()=>{ if(confirm(currentLang()==='ar'?'حذف الحساب نهائيًا؟':'Delete account permanently?')) deleteAccount(); });

    // زر تغيير اللغة
    $('langToggle').addEventListener('click', ()=>{ const next = currentLang()==='ar'?'en':'ar'; applyLanguage(next); });

    // أزرار التنقل بين المقالات
    $('prevArticle').addEventListener('click', ()=>{ if(currentArticleIndex>0) currentArticleIndex--; applyLanguage(currentLang()); });
    $('nextArticle').addEventListener('click', ()=>{ if(currentArticleIndex<ALL_ARTICLES.length-1) currentArticleIndex++; applyLanguage(currentLang()); });

});
