<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
?>

<?php
header('Content-Type: application/xml; charset=utf-8');

// رابط موقعك
$base_url = "https://www.hamedsoliman65-web.com/"; // غيّر إلى رابط موقعك الفعلي

$urls = [];

// دالة لإضافة جميع ملفات html/php من مجلد معين
function addFilesFromDir($dir, &$urls) {
    if (is_dir($dir)) {
        $files = new RecursiveIteratorIterator(
            new RecursiveDirectoryIterator($dir),
            RecursiveIteratorIterator::LEAVES_ONLY
        );
        foreach ($files as $file) {
            if ($file->isFile()) {
                $ext = strtolower(pathinfo($file, PATHINFO_EXTENSION));
                if (in_array($ext, ['html','php'])) {
                    // احصل على المسار بالنسبة للمجلد الرئيسي
                    $relativePath = str_replace('\\','/', $file->getPathname());
                    $relativePath = preg_replace('#^\.#', '', $relativePath); // إزالة نقطة البداية إذا موجودة
                    $urls[] = ltrim($relativePath, '/');
                }
            }
        }
    }
}

// إضافة الصفحة الرئيسية
$urls[] = 'index.html';

// إضافة صفحات من مجلدات محددة
addFilesFromDir('pages', $urls);
addFilesFromDir('blog', $urls);

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
