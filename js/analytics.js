window.dataLayer = window.dataLayer || [];

function gtag() {
  dataLayer.push(arguments);
}

gtag('js', new Date());

gtag('config', 'AW-10997329046');

gtag('consent', 'default', {
  ad_storage: 'denied',
  analytics_storage: 'denied'
});

window.setConsent = function(status) {

  if (status === 'granted') {

    gtag('consent', 'update', {
      ad_storage: 'granted',
      analytics_storage: 'granted'
    });

    loadAnalytics();

  } else {

    gtag('consent', 'update', {
      ad_storage: 'denied',
      analytics_storage: 'denied'
    });

  }

};

function loadAnalytics() {

  if (window.analyticsLoaded) return;

  window.analyticsLoaded = true;

  const s = document.createElement('script');

  s.src = 'https://www.googletagmanager.com/gtag/js?id=G-NR4CFG9TFJ';

  s.async = true;

  s.referrerPolicy = 'strict-origin-when-cross-origin';

  document.head.appendChild(s);

  s.onload = function () {

    gtag('js', new Date());

    gtag('config', 'G-NR4CFG9TFJ');

  };

}
