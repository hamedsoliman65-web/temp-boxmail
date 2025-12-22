document.addEventListener("DOMContentLoaded", () => {
  let lang = localStorage.getItem("lang") || "ar";
  const langBtn = document.getElementById("langBtn");

  // ================== النصوص ==================
  const TEXTS = {
    en: { logo:"📧 Temp Box Blog", home:"Home", ai:"AI", cyber:"Cybersecurity", tech:"Technology", getTempMail:"Get Temp Mail", footerTitle:"Temp Box Mail Blog", footerDesc:"Your source for the latest insights on AI, cybersecurity, and technology.", footerConnect:"Email: support@temp-boxmail.org", footerCopy:"© 2025 Temp Box Mail. All rights reserved." },
    ar: { logo:"📧 مدونة تمب بوكس", home:"الرئيسية", ai:"الذكاء الاصطناعي", cyber:"الأمن السيبراني", tech:"التقنية", getTempMail:"احصل على بريد مؤقت", footerTitle:"مدونة تمب بوكس", footerDesc:"مصدر معلوماتك لأحدث التحليلات عن الذكاء الاصطناعي والأمن السيبراني والتقنية.", footerConnect:"X · GitHub · البريد الإلكتروني", footerCopy:"© 2025 تمب بوكس. جميع الحقوق محفوظة." }
  };

  function updateTexts() {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";

    document.getElementById("logo").textContent = TEXTS[lang].logo;
    document.getElementById("footerTitle").textContent = TEXTS[lang].footerTitle;
    document.getElementById("footerDesc").textContent = TEXTS[lang].footerDesc;
    document.getElementById("footerConnect").textContent = TEXTS[lang].footerConnect;
    document.getElementById("footerCopy").textContent = TEXTS[lang].footerCopy;
    document.getElementById("ctaBtn").textContent = TEXTS[lang].getTempMail;

    document.querySelectorAll(".menu-link").forEach(a=>{
      const key = a.getAttribute("data-text");
      if(key && TEXTS[lang][key]) a.textContent = TEXTS[lang][key];
    });

    langBtn.textContent = lang==="ar"?"EN":"AR";
  }

 
  // ================== عرض المقالات ==================
  function renderArticles(category = "all") {
    const container = document.getElementById("articles");
    if (!container) {
      console.error("❌ عنصر articles غير موجود");
      return;
    }

    if (!window.ARTICLES || ARTICLES.length === 0) {
      container.innerHTML = "<p>لا توجد مقالات</p>";
      return;
    }

    container.innerHTML = "";

    const data =
      category === "all"
        ? ARTICLES
        : ARTICLES.filter(a => a.cat.en === category);

   data.forEach(a => {
  container.innerHTML += `
    <a class="card" href="/article?id=${a.id}"> 
      <img src="${a.img}" alt="${a.title[lang]}">
      <div class="card-body">
        <div class="tag">${a.cat[lang]}</div>
        <h3>${a.title[lang]}</h3>
        <div class="meta">${a.meta[lang]}</div>
      </div>
    </a>
  `;
});
  }


  // ================== القائمة ==================
  document.querySelectorAll(".menu-link").forEach(link=>{
    link.addEventListener("click", e=>{
      e.preventDefault();
      const category = link.dataset.category;
      document.querySelectorAll(".menu-link").forEach(l=>l.classList.remove("active"));
      link.classList.add("active");
      renderArticles(category);
    });
  });

  // ================== زر اللغة ==================
  langBtn?.addEventListener("click", ()=>{
    lang = lang==="ar"?"en":"ar";
    localStorage.setItem("lang", lang);
    updateTexts();
    renderArticles();
  });

  updateTexts();
  renderArticles();
});

