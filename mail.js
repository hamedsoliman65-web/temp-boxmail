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

const ARTICLE_1 = {
  ar: `
<h2>البريد المؤقت: دليل شامل لحماية الخصوصية وتجربة الإنترنت بأمان</h2>
<p>في عصر تتزايد فيه التهديدات الرقمية، أصبحت حماية البيانات الشخصية أولوية لا غنى عنها. البريد المؤقت هو أحد الحلول الأكثر فعالية لمواجهة الرسائل المزعجة، الحفاظ على خصوصيتك، وتجربة خدمات الإنترنت بدون المخاطرة بالبريد الإلكتروني الرئيسي.</p>

<h3>فهم البريد المؤقت</h3>
<p>البريد المؤقت هو خدمة تمنحك عنوان بريد إلكتروني مؤقتًا يمكن استخدامه لفترة محدودة. يتيح لك استقبال الرسائل، الرموز المؤقتة OTP، أو رسائل التفعيل دون الحاجة لإنشاء حساب دائم. بعد انتهاء الفترة المحددة، يتم حذف البريد تلقائيًا بالكامل، مما يحمي هويتك وخصوصيتك الرقمية.</p>

<h3>الفوائد الأساسية للبريد المؤقت</h3>
<ul>
<li>حماية الهوية الرقمية</li>
<li>تجنب الرسائل المزعجة</li>
<li>سهولة وسرعة الاستخدام</li>
<li>استقبال أكواد التفعيل</li>
<li>اختبار الخدمات دون مخاطر</li>
<li>مرونة الوصول من أي جهاز</li>
<li>الحفاظ على الخصوصية بعد انتهاء الصلاحية</li>
</ul>

<h3>الاستخدامات اليومية للبريد المؤقت</h3>
<p>البريد المؤقت مفيد لتجربة الخدمات التجريبية، الاشتراك في النشرات الإخبارية، أو حماية البريد الرئيسي من الرسائل المزعجة.</p>

<h3>الأمان عند استخدام البريد المؤقت</h3>
<ul>
<li>تجنب الخدمات المالية أو البنكية</li>
<li>لا تشارك معلومات حساسة</li>
<li>احذف الرسائل بعد الاستخدام</li>
<li>استخدم خدمات موثوقة تحذف البريد بعد انتهاء صلاحيته</li>
</ul>

<h3>البريد المؤقت والتجارة الإلكترونية</h3>
<p>يمكن استخدام البريد المؤقت عند التسوق عبر الإنترنت لتجنب الرسائل الترويجية وحماية بيانات البطاقات من الاختراق.</p>

<h3>البريد المؤقت ومواقع التواصل الاجتماعي</h3>
<p>يساعد البريد المؤقت على إنشاء حسابات مؤقتة على منصات التواصل الاجتماعي لتجربة الميزات دون المخاطرة بالبريد الشخصي.</p>

<h3>خلاصة</h3>
<p>البريد المؤقت أداة قوية لحماية الخصوصية الرقمية وتجربة الإنترنت بأمان. عند الاستخدام الصحيح، يوفر بريدًا سريعًا وآمنًا للاختبار دون المخاطرة بالبريد الرئيسي.</p>
`,

  en: `
<h2>Temporary Email: Comprehensive Guide for Privacy Protection and Safe Online Experience</h2>
<p>In a world where digital threats are constantly increasing, protecting personal data has become essential. Temporary email is one of the most effective tools to reduce spam, safeguard your privacy, and explore online services without risking your primary email address.</p>

<h3>Understanding Temporary Email</h3>
<p>Temporary email provides a disposable address for a limited period. It allows you to receive messages, OTPs, and activation emails without creating a permanent account. After expiration, the email is deleted automatically, protecting your identity.</p>

<h3>Key Benefits of Temporary Email</h3>
<ul>
<li>Protects digital identity</li>
<li>Reduces spam</li>
<li>Simple and fast to use</li>
<li>Receives activation codes quickly</li>
<li>Safe service testing</li>
<li>Flexible access from any device</li>
<li>Privacy assurance after expiration</li>
</ul>

<h3>Daily Use Cases</h3>
<p>Temporary email is useful for trying trial services, subscribing to newsletters, or protecting the main inbox from spam.</p>

<h3>Ensuring Security</h3>
<ul>
<li>Avoid banking or financial services</li>
<li>Do not share sensitive info</li>
<li>Delete messages after use</li>
<li>Use trusted services that delete emails after expiration</li>
</ul>

<h3>Temporary Email and E-commerce</h3>
<p>Use temporary email for online shopping to avoid promotional messages and protect card information on untrusted sites.</p>

<h3>Temporary Email and Social Media</h3>
<p>Temporary email allows creating temporary accounts on social platforms to explore features without risking your main email.</p>

<h3>Conclusion</h3>
<p>Temporary email is a powerful tool for digital privacy. Used correctly, it provides secure and fast email access for testing without risking the main email address.</p>
`
};


const ARTICLE_2 = {
  ar: `
<h2>أفضل الممارسات عند استخدام البريد المؤقت</h2>
<p>حتى مع قوة البريد المؤقت، هناك ممارسات يجب اتباعها لضمان الاستخدام الآمن والمحترف. هذه النصائح تساعد على حماية بياناتك الرقمية وتجربة الإنترنت بثقة.</p>

<h3>اختيار خدمة موثوقة</h3>
<p>اختر خدمات البريد المؤقت التي تحذف البريد تلقائيًا بعد انتهاء الصلاحية ولا تخزن معلوماتك الشخصية.</p>

<h3>تجنب الاستخدامات الحساسة</h3>
<p>لا تستخدم البريد المؤقت للخدمات المالية أو البنكية أو مشاركة معلومات حساسة، الهدف منه هو التجربة والحماية.</p>

<h3>التحكم في الوصول</h3>
<p>استخدم البريد المؤقت للأغراض القصيرة أو الاختبارات، واحتفظ بالبريد الرئيسي للحسابات الرسمية.</p>

<h3>البقاء على اطلاع</h3>
<p>تابع التحديثات الأمنية للخدمات التي تستخدمها وتحقق دائمًا من سياسات الخصوصية.</p>

<h3>البريد المؤقت والتسجيل السريع</h3>
<p>يساعد البريد المؤقت على التسجيل بسرعة في المواقع والخدمات دون الحاجة للبريد الشخصي، مما يحسن تجربة المستخدم ويحافظ على الخصوصية.</p>

<h3>خلاصة</h3>
<p>اتباع أفضل الممارسات يجعل استخدام البريد المؤقت آمنًا وفعالًا، ويوفر حماية إضافية للهوية الرقمية أثناء تجربة الإنترنت.</p>
`,

  en: `
<h2>Best Practices for Using Temporary Email</h2>
<p>Even with the power of temporary email, following best practices ensures safe and professional usage. These tips help protect your data and navigate the web securely.</p>

<h3>Choose a Reliable Service</h3>
<p>Select temporary email services that automatically delete emails after expiration and do not store personal information.</p>

<h3>Avoid Sensitive Uses</h3>
<p>Do not use temporary emails for banking, finance, or sharing sensitive data. Its purpose is safe testing.</p>

<h3>Control Access</h3>
<p>Use temporary email for short-term purposes or testing, keeping your main email for official accounts.</p>

<h3>Stay Updated</h3>
<p>Follow security updates for services you use and always check privacy policies.</p>

<h3>Temporary Email and Fast Registration</h3>
<p>Temporary email allows quick registration on websites and services without providing your personal email, enhancing user experience while protecting privacy.</p>

<h3>Conclusion</h3>
<p>Following best practices ensures temporary email is used safely and effectively, providing additional protection for your digital identity while exploring the web.</p>
`
};


const ARTICLE_3 = {
  ar: `
<h2>البريد المؤقت وحماية الهوية الرقمية</h2>
<p>الهجمات الإلكترونية والرسائل المزعجة أصبحت جزءًا من حياتنا اليومية. البريد المؤقت يساعد على حماية هويتك الرقمية وتقليل المخاطر عند التسجيل في المواقع والتطبيقات.</p>

<h3>فوائد حماية الهوية الرقمية</h3>
<ul>
<li>تجنب البريد المزعج والروابط المشبوهة</li>
<li>تقليل فرص سرقة البيانات الشخصية</li>
<li>تأمين الحسابات المؤقتة دون استخدام البريد الرئيسي</li>
<li>تجربة الخدمات الجديدة بأمان</li>
</ul>

<h3>البريد المؤقت للتسجيل السريع</h3>
<p>يمكن استخدام البريد المؤقت للتسجيل بسرعة في المواقع والخدمات دون الحاجة لتقديم البريد الشخصي، مما يحسن تجربة المستخدم ويحافظ على الخصوصية.</p>

<h3>الاستخدامات العملية</h3>
<p>يمكن للبريد المؤقت أن يكون مفيدًا عند الاشتراك في النشرات الإخبارية، المسابقات، أو المواقع التي تتطلب بريدًا للتفعيل.</p>

<h3>خلاصة</h3>
<p>البريد المؤقت هو أداة فعالة لحماية الهوية الرقمية وتجربة الإنترنت بأمان، ويجب استخدامه بحكمة مع الاعتماد على خدمات موثوقة لضمان حماية بياناتك الشخصية.</p>
`,

  en: `
<h2>Temporary Email and Digital Identity Protection</h2>
<p>Cyber attacks and spam are part of daily life. Temporary email helps protect your digital identity and reduces risks when registering on websites and apps.</p>

<h3>Benefits for Digital Identity Protection</h3>
<ul>
<li>Avoid spam and suspicious links</li>
<li>Reduce chances of personal data theft</li>
<li>Secure temporary accounts without using main email</li>
<li>Safely try new services</li>
</ul>

<h3>Temporary Email for Fast Registration</h3>
<p>Temporary email allows quick registration on websites and services without giving personal email, improving user experience while maintaining privacy.</p>

<h3>Practical Uses</h3>
<p>Temporary email is useful for subscribing to newsletters, participating in competitions, or activating accounts on sites that require email.</p>

<h3>Conclusion</h3>
<p>Temporary email is an effective tool for digital identity protection and safe web exploration. Use it wisely and rely on trusted services to protect your personal data.</p>
`
};
const ARTICLE_4 = {
  ar: `
<h2>البريد المؤقت واختبار الخدمات الرقمية بأمان</h2>
<p>قبل استخدام أي خدمة أو موقع جديد، من الأفضل تجربة الحسابات بشكل مؤقت لتجنب المخاطر. البريد المؤقت يسمح للمستخدمين بالاختبار دون استخدام البريد الشخصي.</p>

<h3>فوائد استخدام البريد المؤقت للاختبار</h3>
<ul>
<li>تجربة التطبيقات والمواقع دون مشاركة البريد الشخصي</li>
<li>التحقق من مصداقية الخدمات قبل التسجيل الدائم</li>
<li>تجنب البريد المزعج والإعلانات غير المرغوب فيها</li>
<li>سهولة حذف الحسابات المؤقتة بعد الاستخدام</li>
</ul>

<h3>البريد المؤقت والتعليم الرقمي</h3>
<p>يمكن للطلاب تجربة خدمات التعليم عبر الإنترنت أو تنزيل الملفات دون الحاجة لتسجيل بريدهم الشخصي، مما يساهم في حماية بياناتهم الشخصية.</p>

<h3>الأمان عند تجربة الخدمات</h3>
<ul>
<li>لا تشارك معلومات حساسة أثناء التجربة</li>
<li>تأكد من أن الموقع آمن وموثوق قبل إدخال أي بيانات</li>
<li>احذف البريد المؤقت بعد الانتهاء من التجربة</li>
</ul>

<h3>خلاصة</h3>
<p>البريد المؤقت أداة فعالة لتجربة الخدمات الرقمية بأمان، حماية الخصوصية، وتجنب المخاطر المرتبطة بالبريد الرئيسي.</p>
`,

  en: `
<h2>Temporary Email and Safe Digital Service Testing</h2>
<p>Before using any new service or website, it's better to test accounts temporarily to avoid risks. Temporary email allows users to test without using their personal email.</p>

<h3>Benefits of Using Temporary Email for Testing</h3>
<ul>
<li>Try apps and websites without sharing personal email</li>
<li>Verify service credibility before permanent registration</li>
<li>Reduce spam and unwanted advertisements</li>
<li>Easy deletion of temporary accounts after use</li>
</ul>

<h3>Temporary Email in Digital Education</h3>
<p>Students can try online education services or download resources without registering their personal email, helping protect their personal data.</p>

<h3>Safety Tips During Testing</h3>
<ul>
<li>Do not share sensitive information during testing</li>
<li>Ensure the website is secure and trusted before entering data</li>
<li>Delete temporary email after finishing the test</li>
</ul>

<h3>Conclusion</h3>
<p>Temporary email is an effective tool for safely testing digital services, protecting privacy, and avoiding risks associated with using the main email address.</p>
`
};


const ARTICLE_5 = {
  ar: `
<h2>البريد المؤقت والتعامل مع الرسائل المزعجة</h2>
<p>البريد المزعج أصبح جزءًا من الإنترنت الحديث، ويستهدف البريد الشخصي لمستخدمي الخدمات المختلفة. البريد المؤقت يوفر وسيلة لتجنب هذه المشكلة بشكل فعال.</p>

<h3>كيف يقلل البريد المؤقت من الرسائل المزعجة</h3>
<ul>
<li>استخدام البريد المؤقت عند التسجيل في المواقع المشكوك فيها</li>
<li>عدم تقديم البريد الشخصي للمواقع غير الموثوقة</li>
<li>تصفية الرسائل غير المرغوبة دون التأثير على البريد الرئيسي</li>
</ul>

<h3>البريد المؤقت وحماية الهوية</h3>
<p>عند استخدام البريد المؤقت، تقل احتمالية تتبع بريدك الشخصي أو اختراق حساباتك، مما يعزز الأمان الرقمي.</p>

<h3>أفضل ممارسات التعامل مع البريد المزعج</h3>
<ul>
<li>استخدم البريد المؤقت للتجارب أو التسجيلات القصيرة</li>
<li>احذف الرسائل غير المرغوبة فورًا</li>
<li>تجنب استخدام البريد المؤقت للخدمات المهمة أو المالية</li>
</ul>

<h3>خلاصة</h3>
<p>البريد المؤقت وسيلة ممتازة للسيطرة على الرسائل المزعجة وحماية البريد الرئيسي، مع الحفاظ على تجربة استخدام سلسة وآمنة على الإنترنت.</p>
`,

  en: `
<h2>Temporary Email and Managing Spam Messages</h2>
<p>Spam has become a major part of the modern internet, targeting personal emails of users across various services. Temporary email provides an effective way to avoid this problem.</p>

<h3>How Temporary Email Reduces Spam</h3>
<ul>
<li>Use temporary email when registering on questionable sites</li>
<li>Do not provide personal email to untrusted websites</li>
<li>Filter unwanted messages without affecting main email</li>
</ul>

<h3>Temporary Email and Identity Protection</h3>
<p>Using temporary email reduces the chances of tracking your real email or account hacking, enhancing digital security.</p>

<h3>Best Practices for Handling Spam</h3>
<ul>
<li>Use temporary email for short-term trials or registrations</li>
<li>Delete unwanted messages immediately</li>
<li>Avoid using temporary email for critical or financial services</li>
</ul>

<h3>Conclusion</h3>
<p>Temporary email is an excellent way to control spam and protect the main inbox, while maintaining a smooth and safe online experience.</p>
`
};


const ARTICLE_6 = {
  ar: `
<h2>البريد المؤقت والتسويق الرقمي</h2>
<p>يستخدم بعض المسوقين البريد الإلكتروني للترويج للمنتجات والخدمات بشكل مكثف، مما قد يضر بتجربة المستخدم. البريد المؤقت يساعد على إدارة هذه الرسائل بسهولة.</p>

<h3>فوائد البريد المؤقت في التسويق الرقمي</h3>
<ul>
<li>تجنب الرسائل الدعائية غير المرغوب فيها</li>
<li>الحفاظ على نظافة البريد الرئيسي</li>
<li>اختبار حملات البريد الإلكتروني بشكل آمن</li>
<li>تجربة العروض والخدمات بدون مشاركة البريد الشخصي</li>
</ul>

<h3>البريد المؤقت وتحليل الحملات الإعلانية</h3>
<p>يمكن للشركات استخدام البريد المؤقت لاختبار فعالية الحملات الإعلانية دون التأثير على البريد الشخصي للعملاء.</p>

<h3>خلاصة</h3>
<p>البريد المؤقت أداة فعالة للتحكم في البريد الإلكتروني، حماية الخصوصية، وتحسين تجربة المستخدم أثناء التعامل مع التسويق الرقمي.</p>
`,

  en: `
<h2>Temporary Email and Digital Marketing</h2>
<p>Some marketers use email extensively to promote products and services, which may disrupt the user experience. Temporary email helps manage these messages efficiently.</p>

<h3>Benefits of Temporary Email in Digital Marketing</h3>
<ul>
<li>Avoid unwanted promotional emails</li>
<li>Keep main inbox clean</li>
<li>Test email campaigns safely</li>
<li>Try offers and services without sharing personal email</li>
</ul>

<h3>Temporary Email and Ad Campaign Analysis</h3>
<p>Companies can use temporary email to test campaign effectiveness without impacting customers’ personal inboxes.</p>

<h3>Conclusion</h3>
<p>Temporary email is an effective tool for managing email, protecting privacy, and improving user experience while handling digital marketing.</p>
`
};
const ARTICLE_7 = {
  ar: `
<h2>البريد المؤقت والأمان على الشبكات الاجتماعية</h2>
<p>مع تزايد استخدام الشبكات الاجتماعية، يصبح من الضروري حماية البريد الشخصي من التسريب أو الاختراق. البريد المؤقت يوفر طريقة آمنة لتسجيل الحسابات أو تجربة الميزات الجديدة دون المخاطرة بالبريد الرئيسي.</p>

<h3>فوائد البريد المؤقت على الشبكات الاجتماعية</h3>
<ul>
<li>إنشاء حسابات مؤقتة لتجربة الميزات</li>
<li>حماية البريد الرئيسي من الرسائل الدعائية</li>
<li>تجنب التسويق الموجه أو الرسائل المزعجة</li>
<li>الحفاظ على الخصوصية عند التفاعل مع المحتوى العام</li>
</ul>

<h3>أفضل ممارسات الاستخدام</h3>
<ul>
<li>استخدام البريد المؤقت فقط للحسابات الثانوية أو التجريبية</li>
<li>عدم استخدامه لاستعادة كلمات المرور للحسابات الهامة</li>
<li>حذف البريد المؤقت فور الانتهاء لتقليل المخاطر</li>
</ul>

<h3>خلاصة</h3>
<p>البريد المؤقت على الشبكات الاجتماعية يضمن تجربة آمنة دون المساس بالخصوصية، ويسمح للمستخدمين بالاستمتاع بالخدمات الرقمية دون قلق من التسريب أو الاختراق.</p>
`,

  en: `
<h2>Temporary Email and Social Media Security</h2>
<p>With the increasing use of social media, protecting personal email from leaks or hacks is crucial. Temporary email offers a safe way to register accounts or test new features without risking the main email.</p>

<h3>Benefits of Temporary Email on Social Media</h3>
<ul>
<li>Create temporary accounts to explore features</li>
<li>Protect main email from promotional messages</li>
<li>Avoid targeted marketing or spam messages</li>
<li>Maintain privacy when interacting with public content</li>
</ul>

<h3>Best Practices</h3>
<ul>
<li>Use temporary email only for secondary or test accounts</li>
<li>Do not use it for password recovery of important accounts</li>
<li>Delete temporary email immediately after use to minimize risk</li>
</ul>

<h3>Conclusion</h3>
<p>Temporary email on social media ensures a secure experience without compromising privacy, allowing users to enjoy digital services safely.</p>
`
};


const ARTICLE_8 = {
  ar: `
<h2>البريد المؤقت والتسجيل في المنتديات والمواقع العامة</h2>
<p>عند المشاركة في المنتديات أو المواقع التي تتطلب بريدًا إلكترونيًا، قد تتعرض للرسائل المزعجة أو تسريب البريد. البريد المؤقت يقدم حلًا فعالًا لهذه المشكلة.</p>

<h3>فوائد البريد المؤقت في المنتديات</h3>
<ul>
<li>تسجيل الحسابات بسرعة وسهولة دون استخدام البريد الشخصي</li>
<li>الحماية من الرسائل الدعائية والإعلانات غير المرغوب فيها</li>
<li>التحكم في الحسابات المؤقتة وإزالتها بعد الاستخدام</li>
<li>تجنب تسريب البريد الرئيسي عند مشاركة المحتوى العام</li>
</ul>

<h3>أفضل ممارسات الاستخدام</h3>
<ul>
<li>استخدام البريد المؤقت عند التسجيل في المواقع العامة</li>
<li>عدم مشاركة معلومات حساسة عبر البريد المؤقت</li>
<li>حذف البريد المؤقت بعد الانتهاء من التفاعل</li>
</ul>

<h3>خلاصة</h3>
<p>البريد المؤقت أداة مثالية للحفاظ على الخصوصية عند التفاعل مع المنتديات والمواقع العامة، مع ضمان تجربة آمنة وسلسة.</p>
`,

  en: `
<h2>Temporary Email for Forums and Public Websites</h2>
<p>When participating in forums or websites requiring an email, you may be exposed to spam or email leaks. Temporary email provides an effective solution to this problem.</p>

<h3>Benefits of Temporary Email in Forums</h3>
<ul>
<li>Quick and easy account registration without using personal email</li>
<li>Protection from promotional emails and unwanted advertisements</li>
<li>Manage temporary accounts and remove them after use</li>
<li>Avoid exposing main email when sharing content publicly</li>
</ul>

<h3>Best Practices</h3>
<ul>
<li>Use temporary email when registering on public sites</li>
<li>Do not share sensitive information via temporary email</li>
<li>Delete temporary email after finishing interactions</li>
</ul>

<h3>Conclusion</h3>
<p>Temporary email is ideal for maintaining privacy when engaging with forums and public websites, ensuring a safe and smooth experience.</p>
`
};


const ARTICLE_9 = {
  ar: `
<h2>البريد المؤقت وحماية الهوية الرقمية</h2>
<p>في عالم رقمي مليء بالتهديدات، حماية البريد الإلكتروني الشخصي أمر ضروري. البريد المؤقت يساهم في حماية الهوية الرقمية وتقليل التعرض للمخاطر.</p>

<h3>أهمية البريد المؤقت</h3>
<ul>
<li>منع كشف البريد الشخصي في المواقع غير الموثوقة</li>
<li>تقليل فرص اختراق الحسابات أو سرقة البيانات</li>
<li>تجربة الخدمات بشكل آمن دون المخاطرة بالمعلومات الحقيقية</li>
<li>التحكم الكامل في البريد الإلكتروني المؤقت وحذفه عند الانتهاء</li>
</ul>

<h3>نصائح للحفاظ على الهوية الرقمية</h3>
<ul>
<li>استخدم البريد المؤقت عند التسجيل في المواقع الجديدة</li>
<li>تجنب استخدام البريد الشخصي إلا للخدمات المهمة</li>
<li>حذف البريد المؤقت بعد الانتهاء من استخدامه</li>
</ul>

<h3>خلاصة</h3>
<p>البريد المؤقت أداة قوية لحماية الهوية الرقمية، تقليل المخاطر، والحفاظ على الخصوصية أثناء تجربة الإنترنت وخدماته المختلفة.</p>
`,

  en: `
<h2>Temporary Email and Digital Identity Protection</h2>
<p>In a digital world full of threats, protecting personal email is essential. Temporary email helps safeguard digital identity and minimize exposure to risks.</p>

<h3>Importance of Temporary Email</h3>
<ul>
<li>Prevent exposing personal email on untrusted sites</li>
<li>Reduce chances of account hacking or data theft</li>
<li>Test services safely without risking real information</li>
<li>Full control over temporary email, deleting it after use</li>
</ul>

<h3>Tips for Maintaining Digital Identity</h3>
<ul>
<li>Use temporary email when registering on new websites</li>
<li>Avoid using personal email except for critical services</li>
<li>Delete temporary email after finishing usage</li>
</ul>

<h3>Conclusion</h3>
<p>Temporary email is a powerful tool to protect digital identity, minimize risks, and maintain privacy while exploring the internet and its services.</p>
`
};

// إضافة المقالات الثلاثة الأخيرة للمصفوفة
ALL_ARTICLES.push(ARTICLE_1, ARTICLE_2, ARTICLE_3, ARTICLE_4, ARTICLE_5, ARTICLE_6, ARTICLE_7, ARTICLE_8, ARTICLE_9);
let currentArticleIndex = 0;

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
document.addEventListener('DOMContentLoaded', () => {

  // تطبيق اللغة الحالية
  applyLanguage(currentLang());

  // تحميل الحساب المخزن أو إنشاء حساب جديد
  const loaded = loadStored();
  if(!loaded){
    createAccount();
  }

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
  $('langToggle').addEventListener('click', () => {
    const next = currentLang() === 'ar' ? 'en' : 'ar';
    applyLanguage(next);
  });

  // أزرار التنقل بين المقالات
  $('prevArticle').addEventListener('click', () => {
    if(currentArticleIndex > 0) currentArticleIndex--;
    applyLanguage(currentLang());
  });

  $('nextArticle').addEventListener('click', () => {
    if(currentArticleIndex < ALL_ARTICLES.length - 1) currentArticleIndex++;
    applyLanguage(currentLang());
  });

}); // ← نهاية DOMContentLoaded

/* ==============
   END OF SCRIPT
   ============== */

