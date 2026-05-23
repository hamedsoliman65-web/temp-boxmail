<script async
src="https://www.googletagmanager.com/gtag/js?id=AW-10997329046">
</script>

<script>

window.dataLayer = window.dataLayer || [];

function gtag() {
  dataLayer.push(arguments);
}

gtag('js', new Date());

/* الوضع الافتراضي قبل موافقة المستخدم */
gtag('consent', 'default', {
  ad_storage: 'denied',
  analytics_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  wait_for_update: 500
});

/* Google Ads */
gtag('config', 'AW-10997329046');

/* Google Analytics */
gtag('config', 'G-NR4CFG9TFJ', {
  anonymize_ip: true
});

/* منع التحميل المتكرر */
window.analyticsLoaded = false;

/* تغيير حالة الموافقة */
window.setConsent = function(status) {

  if (status === 'granted') {

    gtag('consent', 'update', {
      ad_storage: 'granted',
      analytics_storage: 'granted',
      ad_user_data: 'granted',
      ad_personalization: 'granted'
    });

    if (!window.analyticsLoaded) {

      window.analyticsLoaded = true;

      gtag('event', 'page_view', {
        page_path: location.pathname
      });

    }

  } else {

    gtag('consent', 'update', {
      ad_storage: 'denied',
      analytics_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied'
    });

  }

};

</script>
