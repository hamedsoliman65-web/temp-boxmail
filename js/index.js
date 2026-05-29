document.addEventListener("DOMContentLoaded", () => {
  const articlesContainer = document.getElementById("articles");
  
  // جلب اللغة الحالية (الافتراضية العربية)
  const currentLang = localStorage.getItem("lang") === "en" ? "en" : "ar";

  // حل مشكلة تسمية المصفوفة: التأكد من جلب المصفوفة الصحيحة من الـ window
  const blogArticles = window.ARTICLES || window.blogArticles || [];

  function renderArticles(categoryFilter = "all") {
    if (!articlesContainer) return;
    articlesContainer.innerHTML = ""; // تصفية الحاوية أولاً

    // تصفية المقالات بناءً على التصنيف المختار (يدعم نظام الـ Object في حقل cat أو السلسلة النصية العادية)
    const filtered = blogArticles.filter(art => {
      if (categoryFilter === "all") return true;
      
      // إذا كان التصنيف كائن يحتوي على لغات (cat.en)
      if (art.cat && typeof art.cat === 'object') {
        return art.cat.en.toLowerCase() === categoryFilter.toLowerCase();
      }
      // إذا كان التصنيف نصاً عادياً (category)
      const currentCategory = art.category || art.cat;
      return currentCategory && currentCategory.toLowerCase() === categoryFilter.toLowerCase();
    });

    if (filtered.length === 0) {
      articlesContainer.innerHTML = `<p style="text-align:center; grid-column: 1/-1; color: var(--muted); padding: 40px 0;">No articles found | لا توجد مقالات</p>`;
      return;
    }

    // بناء الكروت ديناميكياً بناءً على مفاتيح ملف data.js الفعلي
    filtered.forEach(article => {
      const card = document.createElement("div");
      card.className = "article-card card"; // إضافة الكلاسات المتوافقة مع الـ CSS

      // استخراج النصوص المترجمة بأمان لعدم ضرب الكود في حال غياب أحد الحقول
      const title = article.title ? (article.title[currentLang] || article.title.en || "") : "";
      
      // جلب الوصف من حقل الـ seo.desc أو حقل excerpt المتوفر
      let description = "";
      if (article.seo && article.seo[currentLang] && article.seo[currentLang].desc) {
        description = article.seo[currentLang].desc;
      } else if (article.excerpt) {
        description = article.excerpt[currentLang] || article.excerpt;
      }

      // جلب اسم التصنيف الظاهري حسب لغة المتصفح الحالية
      const categoryName = article.cat ? (article.cat[currentLang] || article.cat.en) : (article.category || "");
      
      // جلب رابط الصورة الصحيح (الداتا تستخدم img)
      const imageUrl = article.img || article.image || "https://images.unsplash.com/photo-1550751827-4bd374c3f58b";
      
      // جلب الميتا أو التاريخ الحالي
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

      // عند الضغط على الكارت يتم التوجيه لصفحة المقال الفردي داخل مجلد الـ blog
      card.onclick = () => {
        window.location.href = `article.html?id=${article.id}`;
      };

      articlesContainer.appendChild(card);
    });

    // 🚀 [حل مشكلة الإعلانات]: إعادة تشغيل وحدات أدسنس المضمنة ديناميكياً
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.log("AdSense refresh triggered");
    }
  }

  // تشغيل العرض الأولي للمقالات فوراً
  renderArticles();

  // ربط أزرار القائمة العلوية بالتصنيفات وفلترتها برمجياً
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
      
      // إعادة التمرير لأعلى الصفحة بسلاسة ليظهر المحتوى الجديد بشكل مريح
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
});
