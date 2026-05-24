function setConsent(status) {
    if (status === 'grant') {
        console.log('تم قبول ملفات الارتباط');
        localStorage.setItem('cookie_consent', 'granted');
    } else {
        console.log('تم رفض ملفات الارتباط');
        localStorage.setItem('cookie_consent', 'denied');
    }
    
    // كود لإخفاء شريط ملفات الارتباط من الشاشة بعد الضغط
    var consentBanner = document.querySelector('.cookie-banner') || document.getElementById('consent-banner');
    if (consentBanner) {
        consentBanner.style.display = 'none';
    }
}
