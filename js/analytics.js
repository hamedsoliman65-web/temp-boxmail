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

    if (!window.analyticsLoaded) {
      window.analyticsLoaded = true;
      // إرسال حدث مشاهدة الصفحة يدوياً بعد تفعيل الموافقة
      gtag('event', 'page_view', {
        page_path: location.pathname
      });
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

// 4. إعداد التتبع الخاص بالحسابات
gtag('js', new Date());
gtag('config', 'AW-10997329046');
gtag('config', 'G-NR4CFG9TFJ', { 'anonymize_ip': true });

// 5. تحميل سكريبت جوجل برمجياً لضمان أنه لن يشتغل إلا بعد ترتيب الأوامر السابقة بالكامل
(function() {
  const script = document.createElement('script');
  script.async = true;
  script.src = "https://www.googletagmanager.com/gtag/js?id=AW-10997329046";
  document.head.appendChild(script);
})();
