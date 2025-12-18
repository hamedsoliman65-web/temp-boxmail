function activateTab(tabBtn){
  const tabId = tabBtn.dataset.tab;
  if(!tabId) return;

  document.querySelectorAll(".tab-btn").forEach(btn => btn.classList.remove("active"));
  document.querySelectorAll(".tab-content").forEach(tab => tab.classList.remove("active"));

  tabBtn.classList.add("active");
  const target = document.getElementById(tabId);
  if(target) target.classList.add("active");
}
// يعمل على click + touch
document.addEventListener("click", function(e){
  const btn = e.target.closest(".tab-btn");
  if(!btn) return;
  activateTab(btn);
});

document.addEventListener("touchstart", function(e){
  const btn = e.target.closest(".tab-btn");
  if(!btn) return;
  activateTab(btn);
}, { passive: true });

// ================= SEO FUNCTIONS =================
function applyArticleSEO(article, lang) {
  const title = article.title[lang];
  const desc = article.content[lang].replace(/<[^>]*>/g, '').slice(0, 150); // أول 150 حرف بدون HTML
  const keywords = article.cat[lang] + ", Temp Box Blog";

  document.title = title;

  setMeta("description", desc);
  setMeta("keywords", keywords);

  setOG("og:title", title);
  setOG("og:description", desc);
  setOG("og:image", article.img);
}

function setMeta(name, content) {
  let tag = document.querySelector(`meta[name="${name}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute("name", name);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

function setOG(property, content) {
  let tag = document.querySelector(`meta[property="${property}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute("property", property);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

// ================= MAIN =================
document.addEventListener("DOMContentLoaded", () => {
  let lang = localStorage.getItem("lang") || "en";
  const langBtn = document.getElementById("langBtn");

  function updateTexts() {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang==="ar"?"rtl":"ltr";

    document.getElementById("logo").textContent = lang==="ar"?"📧 مدونة تمب بوكس":"📧 Temp Box Blog";
    document.querySelectorAll(".menu-link").forEach(a=>{
      const key = a.getAttribute("data-text");
      if(key){
        if(key==="home") a.textContent = lang==="ar"?"الرئيسية":"Home";
        if(key==="ai") a.textContent = lang==="ar"?"الذكاء الاصطناعي":"AI";
        if(key==="cyber") a.textContent = lang==="ar"?"الأمن السيبراني":"Cybersecurity";
        if(key==="tech") a.textContent = lang==="ar"?"التقنية":"Technology";
      }
    });

    langBtn.textContent = lang==="ar"?"EN":"AR";
  }

  function loadArticle(){
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    if(!id || !window.ARTICLES) return;

    const article = ARTICLES.find(a=>a.id==id);
    if(!article) return;

    const articleImg = document.getElementById("articleImg");
    if (articleImg) {
      articleImg.src = article.img;
      articleImg.alt = article.title[lang];
    }

    document.getElementById("articleTitle").textContent = article.title[lang];
    document.getElementById("articleCat").textContent = article.cat[lang];
    document.getElementById("articleMeta").textContent = article.meta[lang];
    document.getElementById("articleContent").innerHTML = article.content[lang];

    // تفعيل أول تبويب تلقائي بعد تحميل المقال
    const firstTab = document.querySelector(".tab-btn");
    if(firstTab) activateTab(firstTab);

    // تحديث الميتا تاجز
    applyArticleSEO(article, lang);
  }

  langBtn?.addEventListener("click", ()=>{
    lang = lang==="ar"?"en":"ar";
    localStorage.setItem("lang", lang);
    updateTexts();
    loadArticle();
  });

  updateTexts();
  loadArticle();
});

// ================= TABS FIX (DESKTOP + MOBILE) =================
function activateTab(tabBtn){
  const tabId = tabBtn.dataset.tab;

  document.querySelectorAll(".tab-btn").forEach(btn => btn.classList.remove("active"));
  document.querySelectorAll(".tab-content").forEach(tab => tab.classList.remove("active"));

  tabBtn.classList.add("active");
  const target = document.getElementById(tabId);
  if(target) target.classList.add("active");
}

// click + touch دعم كامل
document.addEventListener("click", function(e){
  const btn = e.target.closest(".tab-btn");
  if(!btn) return;
  activateTab(btn);
});

document.addEventListener("touchstart", function(e){
  const btn = e.target.closest(".tab-btn");
  if(!btn) return;
  activateTab(btn);
}, { passive: true });


