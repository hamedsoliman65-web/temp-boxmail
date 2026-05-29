document.addEventListener("DOMContentLoaded", () => {
  const articlesContainer = document.getElementById("articles");
  
  // جلب اللغة الحالية المحددة في الموقع (الافتراضية العربية)
  const currentLang = localStorage.getItem("lang") === "en" ? "en" : "ar";

  // حل مشكلة مصفوفة المقالات والتأكد من تهيئتها بأي مسمى قادم من الداتا
  const blogArticles = window.ARTICLES || window.blogArticles || [];

  function renderArticles(categoryFilter = "all") {
    if (!articlesContainer) return;
    articlesContainer.innerHTML = ""; // تنظيف الحاوية لمنع التداخل

    // تصفية المقالات برمجياً وحمايتها من الأخطاء
    const filtered = blogArticles.filter(art => {
      if (categoryFilter === "all") return true;
      
      // التحقق إذا كان التصنيف كائن يحتوي على لغات مترجمة
      if (art.cat && typeof art.cat === 'object') {
        return art.cat.en.toLowerCase() === categoryFilter.toLowerCase();
      }
      
      const currentCategory = art.category || art.cat;
      return currentCategory && currentCategory.toLowerCase() === categoryFilter.toLowerCase();
    });

    if (filtered.length === 0) {
      articlesContainer.innerHTML = `<p style="text-align:center; grid-column: 1/-1; color: var(--muted); padding: 40px 0;">No articles found | لا توجد مقالات</p>`;
      return;
    }

    // بناء كروت المقالات برمجياً بشكل صارم وآمن
    filtered.forEach(article => {
      const card = document.createElement("div");
      card.className = "card article-card"; 

      // استخراج العنوان بشكل آمن جداً لمنع الـ undefined
      const title = article.title ? (article.title[currentLang] || article.title.en || "") : "";
      
      // استخراج حقل الوصف أو الـ Excerpt المتوافق مع بيانات السيرفر والداتا لديك
      let description = "";
      if (article.seo && article.seo[currentLang] && article.seo[currentLang].desc) {
        description = article.seo[currentLang].desc;
      } else if (article.excerpt) {
        description = typeof article.excerpt === 'object' ? (article.excerpt[currentLang] || article.excerpt.en) : article.excerpt;
      }

      // جلب اسم القسم
      const categoryName = article.cat ? (article.cat[currentLang] || article.cat.en) : (article.category || "");
      
      // جلب رابط الصورة (الداتا تستخدم مفتاح img)
      const imageUrl = article.img || article.image || "https://images.unsplash.com/photo-1550751827-4bd374c3f58b";
      
      // جلب التاريخ
      const metaDate = article.meta ? (article.meta[currentLang] || article.date || "") : (article.date || "");

      // حقن البيانات داخل الكارت
      card.innerHTML = `
        <img src="${imageUrl}" alt="${title}" loading="lazy">
        <div class="card-body">
          <span class="tag">${categoryName}</span>
          <h3>${title}</h3>
          <p>${description}</p>
          <small class="meta">${metaDate}</small>
        </div>
      `;

      // إصلاح مسار المقال الفردي ليتجه مباشرة لصفحة المقال داخل مجلد الـ blog
      card.onclick = () => {
        window.location.href = `article.html?id=${article.id}`;
      };

      articlesContainer.appendChild(card);
    });

    // تحديث إعلانات أدسنس المضمنة ديناميكياً تلقائياً بعد الفلترة
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      // تفادي إخراج خطأ إذا لم تكن الأكواد الخارجية محملة بالكامل بعد
    }
  }

  // الاستدعاء الأولي لعرض كافة المقالات فور فتح الصفحة
  renderArticles();

  // فلترة المقالات التفاعلية من خلال أزرار القائمة العلوية Navigation
  const menuLinks = document.querySelectorAll(".menu-link");
  menuLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (href && href !== "#" && !href.startsWith("index.html?")) {
        return; 
      }
      
      e.preventDefault();
      menuLinks.forEach(l => l.classList.remove("active"));
      link.classList.add("active");
      
      const category = link.getAttribute("data-category");
      renderArticles(category);
      
      // صعود ناعم لأعلى الصفحة لرؤية المحتوى الجديد المفلتر
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
});
