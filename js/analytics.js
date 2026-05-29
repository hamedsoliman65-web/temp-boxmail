// ================= GOOGLE CONSENT MODE V2 & ANALYTICS =================

// 1. تهيئة الـ dataLayer والدوال الأساسية فوراً لمنع أي تأخير
window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }

// 2. إرسال أمر منع التتبع الافتراضي (Consent) قبل تحميل أي سكريبت خارجي من جوجل
gtag('consent', 'default', {
  'ad_storage': 'denied',
  'analytics_storage': 'denied',
  'ad_user_data': 'denied',
  'ad_personalization': 'denied',
  'wait_for_update': 500
});

// إعداد توقيت البدء الأساسي للجافا سكريبت الخاصة بجوجل
gtag('js', new Date());

// 3. تعريف دالة الموافقة وجعلها متاحة فوراً في الـ window للأزرار في أسفل الموقع
window.analyticsLoaded = false;
window.setConsent = function(status) {
  if (status === 'granted') {
    gtag('consent', 'update', {
      'ad_storage': 'granted',
      'analytics_storage': 'granted',
      'ad_user_data': 'granted',
      'ad_personalization': 'granted'
    });

    // تحديث الإعدادات لتبدأ تجميع البيانات فوراً بعد موافقة المستخدم
    if (!window.analyticsLoaded) {
      window.analyticsLoaded = true;
      // إعادة تهيئة الحسابات للتأكيد على تفعيل التتبع بعد تحديث الـ Consent
      gtag('config', 'G-NR4CFG9TFJ', { 'anonymize_ip': true });
      gtag('config', 'AW-10997329046');
    }
  } else {
    gtag('consent', 'update', {
      'ad_storage': 'denied',
      'analytics_storage': 'denied',
      'ad_user_data': 'denied',
      'ad_personalization': 'denied'
    });
  }
};

// 4. إعداد التتبع الافتراضي للحسابات (يتم إرساله كـ Pings مشفرة بدون كوكيز حتى يوافق المستخدم)
gtag('config', 'G-NR4CFG9TFJ', { 'anonymize_ip': true });
gtag('config', 'AW-10997329046');

// 5. تحميل سكريبت جوجل برمجياً باستخدام معرف الإحصائيات الشامل (G-) لضمان عمل كافة الأدوات بالتوازي
(function() {
  const script = document.createElement('script');
  script.async = true;
  script.src = "https://www.googletagmanager.com/gtag/js?id=G-NR4CFG9TFJ";
  document.head.appendChild(script);
})();
