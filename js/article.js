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

// تحديث صورة البنر والعنوان والمحتوى
  const articleImg = document.getElementById("articleImg");
  if (articleImg) articleImg.src = article.img;
  if (articleImg) articleImg.alt = article.title[lang];


    document.getElementById("articleImg").src = article.img;
    document.getElementById("articleImg").alt = article.title[lang];
    document.getElementById("articleTitle").textContent = article.title[lang];
    document.getElementById("articleCat").textContent = article.cat[lang];
    document.getElementById("articleMeta").textContent = article.meta[lang];
    document.getElementById("articleContent").innerHTML = article.content[lang];

  // ← هذا السطر مهم لتطبيق الميتا تاجز على المقال
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
