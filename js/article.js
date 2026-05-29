// ================= SEO FUNCTIONS =================
function applyArticleSEO(article, lang) {
  // تفضيل بيانات الـ SEO المخصصة القادمة من الملف أولاً، وإلا يتم التوليد تلقائياً
  const title = article.seo && article.seo[lang] && article.seo[lang].title ? article.seo[lang].title : article.title[lang];
  const desc = article.seo && article.seo[lang] && article.seo[lang].desc ? article.seo[lang].desc : article.content[lang].replace(/<[^>]*>/g, '').slice(0, 150);
  const keywords = article.seo && article.seo[lang] && article.seo[lang].keywords ? article.seo[lang].keywords : (article.cat[lang] + ", Temp Box Blog");

  document.title = title;

  setMeta("description", desc);
  setMeta("keywords", keywords);

  setOG("og:title", title);
  setOG("og:description", desc);
  setOG("og:image", article.img || article.image);
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
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";

    const logoEl = document.getElementById("logo");
    if (logoEl) {
      logoEl.textContent = lang === "ar" ? "📧 مدونة تمب بوكس" : "📧 Temp Box Blog";
    }

    document.querySelectorAll(".menu-link").forEach(a => {
      const key = a.getAttribute("data-text");
      if (key) {
        if (key === "home") a.textContent = lang === "ar" ? "الرئيسية" : "Home";
        if (key === "ai") a.textContent = lang === "ar" ? "الذكاء الاصطناعي" : "AI";
        if (key === "cyber") a.textContent = lang === "ar" ? "الأمن السيبراني" : "Cybersecurity";
        if (key === "tech") a.textContent = lang === "ar" ? "التقنية" : "Technology";
      }
    });

    if (langBtn) {
      langBtn.textContent = lang === "ar" ? "EN" : "AR";
    }
  }

  function loadArticle() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    
    // التحقق من وجود مصفوفة المقالات
    const articlesArray = window.ARTICLES || window.blogArticles;
    if (!id || !articlesArray || articlesArray.length === 0) return;

    const article = articlesArray.find(a => a.id == id);
    
    // معالجة حالة عدم العثور على المقال لمنع ظهور صفحة بيضاء فارغة
    if (!article) {
      const contentEl = document.getElementById("articleContent");
      if (contentEl) {
        contentEl.innerHTML = lang === "ar" 
          ? "<p style='text-align:center; font-size:18px;'>المقال غير موجود أو تم حذفه.</p>" 
          : "<p style='text-align:center; font-size:18px;'>Article not found or has been removed.</p>";
      }
      return;
    }

    // تحديث صورة البنر بأمان وتفادي مشكلة المسمى (img أو image)
    const articleImg = document.getElementById("articleImg");
    if (articleImg) {
      articleImg.src = article.img || article.image;
      articleImg.alt = article.title[lang] || "Article Image";
    }

    // تحديث باقي حقول العرض بالتأكد من وجود العناصر في الصفحة أولاً
    const titleEl = document.getElementById("articleTitle");
    if (titleEl) titleEl.textContent = article.title[lang];

    const catEl = document.getElementById("articleCat");
    if (catEl) catEl.textContent = article.cat[lang];

    const metaEl = document.getElementById("articleMeta");
    if (metaEl) metaEl.textContent = article.meta[lang];

    const contentEl = document.getElementById("articleContent");
    if (contentEl) contentEl.innerHTML = article.content[lang];

    // تطبيق الميتا تاجز والميزات المتقدمة للأرشفة تلقائياً
    applyArticleSEO(article, lang);
  }

  langBtn?.addEventListener("click", () => {
    lang = lang === "ar" ? "en" : "ar";
    localStorage.setItem("lang", lang);
    updateTexts();
    loadArticle();
  });

  updateTexts();
  loadArticle();
});
