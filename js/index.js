document.addEventListener("DOMContentLoaded", () => {
  const articlesContainer = document.getElementById("articles");
  
  // جلب اللغة الحالية (الافتراضية العربية)
  const currentLang = localStorage.getItem("lang") === "en" ? "en" : "ar";

  function renderArticles(categoryFilter = "all") {
    if (!articlesContainer) return;
    articlesContainer.innerHTML = ""; // تصفية الحاوية أولاً

    // تصفية المقالات بناءً على التصنيف المختار
    const filtered = blogArticles.filter(art => categoryFilter === "all" || art.category === categoryFilter);

    if (filtered.length === 0) {
      articlesContainer.innerHTML = `<p style="text-align:center; grid-column: 1/-1; color: var(--muted); padding: 40px 0;">No articles found | لا توجد مقالات</p>`;
      return;
    }

    // بناء الكروت ديناميكياً
    filtered.forEach(article => {
      const card = document.createElement("div");
      card.className = "article-card"; 
      card.style.cssText = "background: var(--card); border-radius: 12px; padding: 15px; border: 1px solid rgba(255,255,255,0.05); cursor: pointer; display: flex; flex-direction: column; gap: 12px;";
      
      card.innerHTML = `
        <img src="${article.image}" alt="Article Image" style="width:100%; height:180px; object-fit:cover; border-radius:8px;">
        <div style="display: flex; flex-direction: column; flex: 1;">
          <span style="background: var(--accent-pink); color:#fff; padding:2px 8px; border-radius:4px; font-size:12px; align-self: flex-start;">${article.category}</span>
          <h3 style="margin: 10px 0 5px 0; font-size:1.2rem; color:#fff;">${article.title[currentLang]}</h3>
          <p style="color: var(--muted); font-size:14px; margin-bottom:15px; flex: 1;">${article.excerpt[currentLang]}</p>
          <small style="color: var(--muted); margin-top: auto;">${article.date}</small>
        </div>
      `; // تم التأكد هنا من إغلاق كافة وسوم الـ div بشكل صارم لمنع تدمير الفوتر

      // عند الضغط على الكارت يتم التوجيه لصفحة المقال الفردي
      card.onclick = () => {
        window.location.href = `article.html?id=${article.id}`;
      };

      articlesContainer.appendChild(card);
    });

    // 🚀 [حل مشكلة الإعلانات]: إجبار أدسنس على إعادة فحص الصفحة وحقن الإعلانات الجانبية والتلقائية
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.log("AdSense refresh triggered");
    }
  }

  // تشغيل العرض الأولي للمقالات
  renderArticles();

  // ربط أزرار القائمة العلوية بالتصنيفات وفلترتها برمجياً مع الحفاظ على الهيكل
  const menuLinks = document.querySelectorAll(".menu-link");
  menuLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      // إذا كان الرابط يؤدي إلى صفحة أخرى (مثل index.html الحقيقية) دعه يمر، وإلا فقم بالفلترة ديناميكيًا
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
