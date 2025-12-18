<?php
header('Content-Type: application/xml; charset=utf-8');

$base_url = "https://www.yoursite.com/"; // ضع رابط موقعك هنا
$urls = [];

// صفحات الجذر
$urls[] = 'index.html';

// جميع صفحات HTML في مجلد pages
foreach (glob("pages/*.html") as $file) {
    $urls[] = "pages/" . basename($file);
}

// جميع صفحات HTML في مجلد blog
foreach (glob("blog/*.html") as $file) {
    $urls[] = "blog/" . basename($file);
}

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
