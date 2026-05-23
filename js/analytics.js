<script async
src="https://www.googletagmanager.com/gtag/js?id=AW-10997329046">
</script>

<script>

window.dataLayer = window.dataLayer || [];

function gtag() {
  dataLayer.push(arguments);
}

gtag('js', new Date());

/* Consent الافتراضي */
gtag('consent', 'default', {
  ad_storage: 'denied',
  analytics_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied'
});

/* Google Ads */
gtag('config', 'AW-10997329046');

window.setConsent = function(status) {

  if (status === 'granted') {

    gtag('consent', 'update', {
      ad_storage: 'granted',
      analytics_storage: 'granted',
      ad_user_data: 'granted',
      ad_personalization: 'granted'
    });

    loadAnalytics();

  } else {

    gtag('consent', 'update', {
      ad_storage: 'denied',
      analytics_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied'
    });

  }

};

function loadAnalytics() {

  if (window.analyticsLoaded) return;

  window.analyticsLoaded = true;

  gtag('config', 'G-NR4CFG9TFJ');

}

</script>
