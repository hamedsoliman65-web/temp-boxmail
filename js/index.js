document.addEventListener("DOMContentLoaded", () => {
  const articlesContainer = document.getElementById("articles");
  
  // جلب اللغة الحالية المحددة (الافتراضية العربية)
  const currentLang = localStorage.getItem("lang") === "en" ? "en" : "ar";

  // التأكد من تهيئتها بأي مسمى قادم من الداتا
  const blogArticles = window.ARTICLES || window.blogArticles || [];

  function renderArticles(categoryFilter = "all") {
    if (!articlesContainer) return;
    articlesContainer.innerHTML = ""; 

    // تصفية المقالات برمجياً وحمايتها من الأخطاء
    const filtered = blogArticles.filter(art => {
      if (categoryFilter === "all") return true;
      if (art.cat && typeof art.cat === 'object') {
        return art.cat.en.toLowerCase() === categoryFilter.toLowerCase();
      }
      const currentCategory = art.category || art.cat;
      return currentCategory && currentCategory.toLowerCase() === categoryFilter.toLowerCase();
    });

    if (filtered.length === 0) {
      articlesContainer.innerHTML = `<p style="text-align:center; grid-column: 1/-1; color: var(--muted); padding: 40px 0;">لا توجد مقالات في هذا القسم حالياً</p>`;
      return;
    }

    // بناء كروت المقالات برمجياً بشكل صارم وآمن
    filtered.forEach(article => {
      const card = document.createElement("div");
      card.className = "card article-card"; 

      const title = article.title ? (article.title[currentLang] || article.title.en || "") : "";
      
      let description = "";
      if (article.seo && article.seo[currentLang] && article.seo[currentLang].desc) {
        description = article.seo[currentLang].desc;
      } else if (article.excerpt) {
        description = typeof article.excerpt === 'object' ? (article.excerpt[currentLang] || article.excerpt.en) : article.excerpt;
      }

      const categoryName = article.cat ? (article.cat[currentLang] || article.cat.en) : (article.category || "");
      const imageUrl = article.img || article.image || "https://images.unsplash.com/photo-1550751827-4bd374c3f58b";
      const metaDate = article.meta ? (article.meta[currentLang] || article.date || "") : (article.date || "");

      card.innerHTML = `
        <img src="${imageUrl}" alt="${title}" loading="lazy">
        <div class="card-body">
          <span class="tag">${categoryName}</span>
          <h3>${title}</h3>
          <p>${description}</p>
          <small class="meta">${metaDate}</small>
        </div>
      `;

      // التوجيه النسبي الصحيح لفتح المقال داخل مجلد الـ blog نفسه
      card.onclick = () => {
window.location.href = `article.html?id=${article.id}`;
      };

      articlesContainer.appendChild(card);
    });

    // تحديث إعلانات أدسنس بعد الفلترة
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {}
  }

  renderArticles();

  // فلترة المقالات التفاعلية من خلال أزرار القائمة العلوية
  const menuLinks = document.querySelectorAll(".menu-link");
  menuLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      menuLinks.forEach(l => l.classList.remove("active"));
      link.classList.add("active");
      const category = link.getAttribute("data-category");
      renderArticles(category);
    });
  });
});
