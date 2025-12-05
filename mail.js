// =======================
// mail.js - GA + AdSense + Consent Banner
// =======================

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
const API_BASE = 'https://api.mail.tm'; // mail.tm public API
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
    noMessages:"No messages yet — click \"Create New Email\" to start receiving emails.",
    footer:"All rights reserved - © Temp-BoxMail"
  }
};

const ARTICLE = {
  ar: `
  <h2>البريد المؤقت: دليل شامل لحماية الخصوصية وتجربة الإنترنت بأمان</h2>
  <p>في عصر تتزايد فيه التهديدات الرقمية، أصبحت حماية البيانات الشخصية أولوية لا غنى عنها. البريد المؤقت هو أحد الحلول الأكثر فعالية لمواجهة الرسائل المزعجة، الحفاظ على خصوصيتك، وتجربة خدمات الإنترنت بدون المخاطرة بالبريد الإلكتروني الرئيسي.</p>

  <h3>فهم البريد المؤقت</h3>
  <p>البريد المؤقت هو خدمة تمنحك عنوان بريد إلكتروني مؤقتًا يمكن استخدامه لفترة محدودة. يتيح لك استقبال الرسائل، الرموز المؤقتة OTP، أو رسائل التفعيل دون الحاجة لإنشاء حساب دائم. بعد انتهاء الفترة المحددة، يتم حذف البريد تلقائيًا بالكامل، مما يحمي هويتك وخصوصيتك الرقمية.</p>

  <h3>الفوائد الأساسية للبريد المؤقت</h3>
  <ul>
    <li><strong>حماية الهوية الرقمية:</strong> يمنع كشف بريدك الشخصي ويقلل من خطر الاختراقات.</li>
    <li><strong>تجنب الرسائل المزعجة:</strong> يحافظ على نظافة صندوقك من البريد الدعائي.</li>
    <li><strong>سهولة وسرعة الاستخدام:</strong> لا حاجة لتسجيل الدخول أو كلمات المرور، يمكنك استخدامه فورًا.</li>
    <li><strong>استقبال أكواد التفعيل:</strong> مفيد لتفعيل الحسابات المؤقتة بسرعة.</li>
    <li><strong>اختبار الخدمات دون مخاطر:</strong> يسمح لك بتجربة المواقع والتطبيقات بشكل آمن.</li>
    <li><strong>مرونة الوصول:</strong> يمكن الوصول للبريد من أي جهاز دون إعدادات معقدة.</li>
    <li><strong>الحفاظ على الخصوصية:</strong> البريد المؤقت لا يحتفظ بمعلوماتك الشخصية بعد انتهاء صلاحيته.</li>
  </ul>

  <h3>الاستخدامات اليومية للبريد المؤقت</h3>
  <p>البريد المؤقت يمكن أن يكون أداة قيمة في العديد من الحالات:</p>
  <ul>
    <li>التسجيل في الخدمات التجريبية أو التجريبية لمرة واحدة.</li>
    <li>استلام الرسائل الإخبارية دون إغراق البريد الرئيسي.</li>
    <li>الحفاظ على الخصوصية عند نشر البريد في المنتديات أو التعليقات العامة.</li>
    <li>اختبار مواقع وتطبيقات تتطلب بريدًا للتفعيل.</li>
    <li>إجراء استطلاعات أو مسابقات عبر الإنترنت دون استخدام بريدك الأساسي.</li>
  </ul>

  <h3>الأمان عند استخدام البريد المؤقت</h3>
  <ul>
    <li>تجنب استخدامه للخدمات المالية أو البنكية.</li>
    <li>لا تشارك معلومات حساسة عبر البريد المؤقت.</li>
    <li>احذف الرسائل بعد استخدامها لتقليل المخاطر.</li>
    <li>تأكد من استخدام خدمات موثوقة تحذف البريد بعد انتهاء صلاحيته.</li>
  </ul>

  <h3>أفضل الممارسات</h3>
  <ul>
    <li>استخدم البريد المؤقت فقط للأغراض المؤقتة أو التجريبية.</li>
    <li>لا تعتمد عليه للحسابات التي تحتاج للوصول الطويل المدى.</li>
    <li>احتفظ ببريدك الرئيسي للخدمات الرسمية والهامة.</li>
    <li>احرص على مراجعة سياسة الخصوصية لكل خدمة تستخدمها.</li>
  </ul>

  <h3>البريد المؤقت والتجارة الإلكترونية</h3>
  <p>يمكن أن يكون البريد المؤقت مفيدًا عند التسوق عبر الإنترنت لتجنب الرسائل الترويجية والخصومات المزعجة، بالإضافة إلى حماية بيانات بطاقتك من الاختراق في المواقع غير الموثوقة.</p>

  <h3>البريد المؤقت والتسجيل في مواقع التواصل الاجتماعي</h3>
  <p>يسمح البريد المؤقت بالتسجيل في منصات التواصل الاجتماعي لتجربة الميزات أو إنشاء حسابات مؤقتة. مع ذلك، لا يُنصح باستخدامه للحسابات الشخصية المهمة أو الحسابات التي تحتاج استرجاع كلمة المرور لاحقًا.</p>

  <h3>خلاصة</h3>
  <p>البريد المؤقت أداة قوية لحماية الخصوصية الرقمية، تقليل الرسائل المزعجة، وتجربة الإنترنت بأمان. عند الاستخدام الصحيح، يوفر بريدًا سريعًا وآمنًا للاختبار والتجربة دون المخاطرة بالبريد الرئيسي. يجب استخدامه بحكمة والاعتماد على خدمات موثوقة للحفاظ على أمان بياناتك.</p>

  <p>استخدام البريد المؤقت يعزز التحكم في بياناتك الشخصية، يمنحك حرية التجربة، ويقلل من المخاطر المرتبطة بالرسائل المزعجة والاختراقات الإلكترونية، مما يجعله أداة مثالية للخصوصية الرقمية الحديثة.</p>
  `,

  en: `
  <h2>Temporary Email: Comprehensive Guide for Privacy Protection and Safe Online Experience</h2>
  <p>In a world where digital threats are constantly increasing, protecting personal data has become essential. Temporary email is one of the most effective tools to reduce spam, safeguard your privacy, and explore online services without risking your primary email address.</p>

  <h3>Understanding Temporary Email</h3>
  <p>Temporary email provides a disposable address for a limited period. It allows you to receive messages, OTPs, and activation emails without creating a permanent account. After the expiration period, the email is automatically deleted, protecting your identity and personal information.</p>

  <h3>Key Benefits of Temporary Email</h3>
  <ul>
    <li><strong>Protects digital identity:</strong> Prevents exposure of your real email and reduces hacking risks.</li>
    <li><strong>Reduces spam:</strong> Keeps your main inbox clean from advertising emails.</li>
    <li><strong>Simple and fast:</strong> No login or password required—use it instantly.</li>
    <li><strong>Receives activation codes quickly:</strong> Useful for temporary account verifications.</li>
    <li><strong>Safe service testing:</strong> Allows testing websites and apps securely.</li>
    <li><strong>Flexible access:</strong> Accessible from any device without complex setups.</li>
    <li><strong>Privacy assurance:</strong> Temporary email does not store personal information after expiration.</li>
  </ul>

  <h3>Daily Use Cases</h3>
  <ul>
    <li>Signing up for trial or beta services.</li>
    <li>Receiving newsletters without cluttering the main inbox.</li>
    <li>Maintaining privacy when posting email on forums or public comments.</li>
    <li>Testing websites and apps that require activation emails.</li>
    <li>Participating in online surveys or competitions without exposing personal email.</li>
  </ul>

  <h3>Ensuring Security When Using Temporary Email</h3>
  <ul>
    <li>Avoid using it for banking or financial services.</li>
    <li>Do not share sensitive personal information via temporary emails.</li>
    <li>Delete messages after use to minimize risks.</li>
    <li>Use trusted services that automatically delete emails after expiration.</li>
  </ul>

  <h3>Best Practices</h3>
  <ul>
    <li>Use temporary email only for temporary or trial purposes.</li>
    <li>Do not rely on it for accounts requiring long-term access.</li>
    <li>Keep your primary email for official and important accounts.</li>
    <li>Review privacy policies of services you use.</li>
  </ul>

  <h3>Temporary Email and E-commerce</h3>
  <p>Temporary email is helpful for online shopping to avoid promotional emails and unwanted discount messages, while also protecting your card data on untrusted sites.</p>

  <h3>Temporary Email and Social Media</h3>
  <p>Temporary email allows signing up for social platforms to explore features or create temporary accounts. However, it is not recommended for personal or important accounts requiring password recovery.</p>

  <h3>Conclusion</h3>
  <p>Temporary email is a powerful tool for digital privacy, reducing spam, and safely experiencing the web. Used correctly, it provides fast, secure access to email for testing and trial purposes without risking your primary email. Use it wisely and choose trusted services to keep your data safe.</p>

  <p>It enhances control over personal data, provides freedom for experimentation, and minimizes risks from spam and online threats, making it an ideal solution for modern digital privacy.</p>
  `
};


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
  $('article').innerHTML = ARTICLE[lang];

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

/* Show message content */
async function showMessage(m){
  if(!token) return console.warn('لا يوجد توكن صالح لعرض الرسالة');
  try{
    const res = await fetch(`${API_BASE}/messages/${m.id}`, { headers: { Authorization: 'Bearer ' + token } });
    if(!res.ok) throw new Error('فشل جلب محتوى الرسالة');

    const full = await res.json();
    console.log('Message content:', full); // تحقق من المحتوى في console

    // عنوان الرسالة و المرسل
    $('msg-sub').textContent = full.subject || (currentLang() === 'ar' ? '(بدون عنوان)' : '(No subject)');
    $('msg-from').textContent = (full.from?.address || '') + ' · ' + new Date(full.createdAt).toLocaleString();

    // محتوى الرسالة: HTML أولًا، ثم نص، ثم fallback
    let content = '';
    if(full.html && typeof full.html === 'string' && full.html.length){
  // sanitize minimal: we won't allow script tags
  const safe = full.html.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '');
  $('msg-body').innerHTML = safe;
} else if(full.text && typeof full.text === 'string' && full.text.length){
  $('msg-body').innerHTML = `<pre style="white-space:pre-wrap;color:var(--muted)">${escapeHtml(full.text)}</pre>`;
} else {
  $('msg-body').innerHTML = `<p style="color:var(--muted)">لا يوجد محتوى للرسالة</p>`;
}
    // استخراج OTP (4-8 أرقام)
    const combined = (full.text || '') + ' ' + (full.html || '');
    const found = combined.match(/\b\d{4,8}\b/);
    if(found){
      $('extractedOtp').style.display = 'inline-block';
      $('extractedOtp').textContent = found[0];
    } else {
      $('extractedOtp').style.display = 'none';
    }

  } catch(e){
    console.error('showMessage error:', e);
    $('msg-body').innerHTML = `<p style="color:var(--muted)">فشل عرض محتوى الرسالة</p>`;
  }
}


/* Polling */
function startPolling(){
  if(pollInterval) clearInterval(pollInterval);
  pollInterval = setInterval(fetchMessages, 7000);
}
function stopPolling(){ if(pollInterval) clearInterval(pollInterval); pollInterval = null; }

/* Called when account created */
function onAccountReady(){
  $('address').textContent = account.address; // ALWAYS untranslated
  $('expiry').textContent = currentLang() === 'ar' ? 'العنوان مُدار بواسطة temp-boxmail.online' : 'Address managed by temp-boxmail.online';
  startPolling();
  fetchMessages();
  alert((currentLang() === 'ar' ? 'تم إنشاء البريد: ' : 'Created email: ') + account.address);
}

/* ================
   Buttons binding
   ================ */
$('copyBtn').addEventListener('click', () => {
  if(!account?.address) return alert(currentLang() === 'ar' ? 'لا يوجد عنوان لنسخه' : 'No address to copy');
  navigator.clipboard.writeText(account.address).then(()=> alert(currentLang() === 'ar' ? 'تم النسخ' : 'Copied'));
});

$('newBtn').addEventListener('click', () => {
  if(confirm(currentLang() === 'ar' ? 'إنشاء بريد جديد سيحذف الحالي. موافق؟' : 'Creating a new email will replace the current one. Continue?')){
    // optionally delete old (not forced), just create new and replace stored
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

/* Language toggle button */
$('langToggle').addEventListener('click', () => {
  const next = currentLang() === 'ar' ? 'en' : 'ar';
  applyLanguage(next);
});

/* initialize: apply lang, load stored or create new */
document.addEventListener('DOMContentLoaded', () => {
  applyLanguage(currentLang());
  const loaded = loadStored();
  if(!loaded){
    // create account automatically on first load
    createAccount();
  }
}); // ← إغلاق القوس والدالة


/* ==============
   END OF SCRIPT
   ============== */

