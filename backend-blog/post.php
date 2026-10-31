<?php
declare(strict_types=1);
require __DIR__ . '/bootstrap.php';

function articleInline(string $input): string {
    $safe = h($input);
    $safe = preg_replace('/\\*\\*(.+?)\\*\\*/u', '<strong>$1</strong>', $safe);
    $safe = preg_replace('/(?<!\\*)\\*([^*\\n]+)\\*(?!\\*)/u', '<em>$1</em>', $safe);
    $safe = preg_replace('/(?<!\\w)_([^_\\n]+)_(?!\\w)/u', '<em>$1</em>', $safe);
    return $safe;
}
function articleHtml(string $input): string {
    $lines = preg_split('/\\r\\n|\\r|\\n/', trim($input)) ?: [];
    $out = '';
    $paragraph = [];
    $inList = false;
    $flushParagraph = function () use (&$paragraph, &$out): void {
        if ($paragraph) {
            $out .= '<p>' . articleInline(implode(' ', $paragraph)) . '</p>';
            $paragraph = [];
        }
    };
    $closeList = function () use (&$inList, &$out): void {
        if ($inList) { $out .= '</ul>'; $inList = false; }
    };
    foreach ($lines as $line) {
        $line = trim($line);
        if ($line === '') {
            $flushParagraph();
            $closeList();
            continue;
        }
        if (preg_match('/^(#{1,4})\\s+(.+)$/u', $line, $m)) {
            $flushParagraph(); $closeList();
            $level = min(strlen($m[1]) + 1, 5);
            $out .= '<h' . $level . '>' . articleInline($m[2]) . '</h' . $level . '>';
            continue;
        }
        if (preg_match('/^[-*]\\s+(.+)$/u', $line, $m)) {
            $flushParagraph();
            if (!$inList) { $out .= '<ul>'; $inList = true; }
            $out .= '<li>' . articleInline($m[1]) . '</li>';
            continue;
        }
        $closeList();
        $paragraph[] = $line;
    }
    $flushParagraph(); $closeList();
    return $out;
}

$post = null;
$published = posts(false);
$slug = (string) ($_GET['slug'] ?? '');
if ($slug === '' && !empty($published)) {
    // A direct /post.php visit opens the latest published article.
    $post = $published[0];
} else {
    foreach ($published as $candidate) {
        if (hash_equals((string) ($candidate['slug'] ?? ''), $slug)) {
            $post = $candidate;
            break;
        }
    }
}
if (!$post) {
    http_response_code(404);
    exit('Article not found. <a href="/blog.php">Back to blog</a>');
}
$body = (string)($post['body'] ?? '');
$body = preg_replace('/^#\\s+' . preg_quote(trim((string)$post['title']), '/') . '\\s*\\R?/ui', '', $body) ?? $body;
?>
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="index,follow">
<meta name="description" content="<?= h((string)($post['summary'] ?? '')) ?>">
<title><?= h($post['title']) ?> | Lupa Painting</title>
<link rel="stylesheet" href="/assets/css/blog-php.css">
</head>
<body class="blog-article-page">
<header><a href="/blog.php">&larr; All articles</a><a href="/request-quote.html">Request a Quote</a></header>
<main class="article-shell">
<article class="article-container">
<div class="article-kicker">VIANA COMMERCIAL SERVICES &nbsp; / &nbsp; CLEANING INSIGHTS</div>
<h1><?= h($post['title']) ?></h1>
<?php if (!empty($post['summary'])): ?><p class="article-lede"><?= h($post['summary']) ?></p><?php endif; ?>
<?php if (!empty($post['image'])): ?><img class="article-cover" src="<?= h($post['image']) ?>" alt="<?= h($post['title']) ?>" loading="eager"><?php endif; ?>
<?php if (!empty($post['video'])): ?><video class="article-cover" controls src="<?= h($post['video']) ?>"></video><?php endif; ?>
<?php if (!empty($post['youtube'])): ?><p><a href="<?= h($post['youtube']) ?>" rel="noopener noreferrer" target="_blank">Watch the video</a></p><?php endif; ?>
<div class="article-prose"><?= articleHtml($body) ?></div>
<div class="article-footer"><strong>Need a cleaner workplace?</strong><p>Contact Lupa Painting for a free commercial cleaning quote.</p><a class="article-cta" href="/request-quote.html">Request a Free Quote &rarr;</a></div>
</article>
</main>
</body>
</html>
