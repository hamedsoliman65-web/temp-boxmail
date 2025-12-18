<?php
header('Content-Type: application/xml; charset=utf-8');

// رابط موقعك
$base_url = "https://www.hamedsoliman65-web.com/"; // غيّر إلى رابط موقعك الفعلي

$urls = [];

// صفحة البداية
$urls[] = 'index.html';

// جميع صفحات HTML في مجلد pages
if (is_dir('pages')) {
    foreach (glob("pages/*.html") as $file) {
        $urls[] = "pages/" . basename($file);
    }
}

// جميع صفحات HTML في مجلد blog
if (is_dir('blog')) {
    foreach (glob("blog/*.html") as $file) {
        $urls[] = "blog/" . basename($file);
    }
}

// إنشاء ملف Sitemap بصيغة XML
echo '<?xml version="1.0" encoding="UTF-8"?>';
echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

foreach($urls as $url){
    echo "<url>";
    echo "<loc>" . $base_url . $url . "</loc>";
    echo "<lastmod>" . date('Y-m-d') . "</lastmod>";
    echo "<changefreq>weekly</changefreq>";
    echo "<priority>0.8</priority>";
    echo "</url>";
}

echo '</urlset>';
?>
