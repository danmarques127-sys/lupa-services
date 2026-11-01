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
<html lang="en-US">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="index,follow">
<meta name="description" content="<?= h((string)($post['summary'] ?? '')) ?>">
<title><?= h($post['title']) ?> | Lupa Painting</title>
<link rel="canonical" href="https://lupaservices.com/backend-blog/post.php?slug=<?= rawurlencode((string)$post['slug']) ?>">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/css_main/global.css">
<link rel="stylesheet" href="/assets/css_main/css_services/services.css">
<link rel="stylesheet" href="/assets/css_main/css_services/hero.css?v=20261031-hero-fix">
<link rel="stylesheet" href="/assets/css_main/footer.css?v=20261101">
<link rel="stylesheet" href="/assets/css_main/lupa-inner-pages.css?v=20261101">
<link rel="stylesheet" href="/assets/css_main/lupa-article.css?v=20261101a">
<link rel="icon" type="image/png" sizes="32x32" href="/assets/favicons/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/assets/favicons/favicon-16x16.png">
<link rel="icon" type="image/svg+xml" href="/assets/favicons/icon.svg">
<link rel="apple-touch-icon" sizes="180x180" href="/assets/favicons/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<meta name="theme-color" content="#111111">
</head>
<body class="lupaArticlePage">
<nav id="navbar" class="nav">
    <div class="container nav__inner">
      <a href="/" class="brand" aria-label="Lupa Painting - Home">
        <span class="brand__lupa">LUPA</span>
        <span class="brand__painting">PAINTING</span>
      </a>

      <div class="nav__desktop" aria-label="Primary Navigation">
        <a class="nav__link" href="/about.html">About</a>
        <a class="nav__link" href="/reviews.html">Reviews</a>
        <a class="nav__link" href="/services.html">Services</a>
        <a class="nav__link" href="/service-areas.html">Service Areas</a>
        <a class="nav__link" href="/blog.php">Our Blog</a>
        <a class="nav__link" href="/inspiration.html">Inspiration</a>
        <a class="nav__link" href="/contact.html">Contact</a>

        <a class="btn btn--cta" href="tel:+18572465998">(857) 246-5998</a>
      </div>

      <button id="navToggle" class="nav__toggle" aria-label="Open menu" aria-expanded="false">
        <span class="nav__burger"></span>
      </button>
    </div>

    <!-- Mobile Menu -->
    <div id="mobileMenu" class="nav__mobile" aria-hidden="true">
      <a class="nav__mobileLink" href="/about.html" data-close>About</a>
      <a class="nav__mobileLink" href="/reviews.html" data-close>Reviews</a>
      <a class="nav__mobileLink" href="/services.html" data-close>Services</a>
      <a class="nav__mobileLink" href="/service-areas.html" data-close>Service Areas</a>
      <a class="nav__mobileLink" href="/blog.php" data-close>Our Blog</a>
      <a class="nav__mobileLink" href="/inspiration.html" data-close>Inspiration</a>
      <a class="nav__mobileLink" href="/contact.html" data-close>Contact</a>

      <a class="btn btn--cta btn--lg" href="tel:+18572465998" data-close>CALL NOW</a>
      <a class="btn btn--ghost btn--lg" href="sms:+18572465998" data-close>TEXT US</a>
    </div>
  </nav>
<header class="hero hero--video hero--ctasOnly" id="pageHero">
  <!-- Video Background -->
  <div class="hero__bg hero__bgVideo" aria-hidden="true">
    <video class="hero-video is-active" id="heroVideoA" autoplay muted loop playsinline preload="metadata">
      <source src="/assets/videos/LUCAS - LUPA SERVICES - CABINET PAINTING.mp4" type="video/mp4" />
    </video>

    <video class="hero-video" id="heroVideoB" autoplay muted loop playsinline preload="metadata">
      <source src="/assets/videos/LUCAS - LUPA SERVICES - DECK AND STAINING.mp4" type="video/mp4" />
    </video>

    <video class="hero-video" id="heroVideoC" autoplay muted loop playsinline preload="metadata">
      <source src="/assets/videos/LUCAS - LUPA SERVICES - EXTERIOR PAINTING.mp4" type="video/mp4" />
    </video>
  </div>

  <!-- Overlay -->
  <div class="hero__overlay" aria-hidden="true"></div>

  <div class="container hero__content">
    <div class="reveal">
      <div class="serviceHeroTitle">
        <h1 class="serviceHeroHeading">
          <span class="hero__line hero__line--top">
            <span class="is-white serviceHeroWord">OUR</span>
            <span class="is-yellow serviceHeroAccent">BLOG</span>
          </span>
        </h1>

        <p class="serviceHeroSubline"><span class="is-white">Explore expert painting insights. Discover practical preparation and design ideas. Plan your next project with confidence.</span></p>
      </div>

      <div class="hero__actions hero__actions--only serviceHeroActions"><a class="btn btn--cta btn--lg" href="/contact.html">REQUEST A FREE QUOTE</a><a class="btn btn--ghost btn--lg" href="#articleContent">READ ARTICLE</a><a class="btn btn--white btn--lg" href="/services.html">OUR SERVICES</a></div>
    </div>
  </div>

  <a class="hero__scroll" href="#articleContent" aria-label="Scroll">
    <span class="chev" aria-hidden="true"></span>
  </a>
</header>
<main id="articleContent" class="lupaArticleMain">
  <div class="lupaArticleContainer">
    <nav class="lupaArticleBreadcrumb" aria-label="Breadcrumb"><a href="/">HOME</a><span>/</span><a href="/blog.php">BLOG</a><span>/</span><span>ARTICLE</span></nav>
    <div class="lupaArticleLayout">
      <article class="lupaArticle">
        <div class="lupaArticleTopline">LUPA PAINTING <span>/</span> PAINTING INSIGHTS</div>
        <h2 class="lupaArticleTitle"><?= h($post['title']) ?></h2>
        <?php if (!empty($post['date'])): ?><p class="lupaArticleDate"><?= h(date('F j, Y', strtotime((string)$post['date']))) ?></p><?php endif; ?>
        <?php if (!empty($post['summary'])): ?><p class="lupaArticleLead"><?= h($post['summary']) ?></p><?php endif; ?>
        <?php if (!empty($post['image'])): ?><figure class="lupaArticleFigure"><img class="lupaArticleCover" src="<?= h($post['image']) ?>" alt="<?= h($post['title']) ?>" loading="eager" decoding="async"></figure><?php endif; ?>
        <?php if (!empty($post['video'])): ?><video class="lupaArticleVideo" controls preload="metadata" src="<?= h($post['video']) ?>"></video><?php endif; ?>
        <?php if (!empty($post['youtube'])): ?><p class="lupaArticleExternal"><a href="<?= h($post['youtube']) ?>" rel="noopener noreferrer" target="_blank">WATCH VIDEO ↗</a></p><?php endif; ?>
        <div class="lupaArticleProse"><?= articleHtml($body) ?></div>
        <aside class="lupaArticleCallout"><p class="lupaArticleCalloutLabel">YOUR NEXT PROJECT</p><h3>READY TO REFRESH YOUR SPACE?</h3><p>From interior walls and trim to exterior painting, Lupa Painting helps homeowners plan beautiful, lasting finishes.</p><a href="/contact.html" class="lupaArticleButton">REQUEST A FREE QUOTE</a></aside>
        <a class="lupaArticleBack" href="/blog.php">← BACK TO ALL ARTICLES</a>
      </article>
      <aside class="lupaArticleSidebar" aria-label="Related information">
        <div class="lupaArticleSidebarInner"><p class="lupaArticleSideEyebrow">LUPA PAINTING</p><h3>BRING YOUR IDEAS TO LIFE.</h3><p>Professional painting for homes and businesses across MetroWest Massachusetts.</p><a href="/services.html">EXPLORE OUR SERVICES ↗</a><a href="/contact.html">GET A FREE ESTIMATE ↗</a></div>
      </aside>
    </div>
  </div>
</main>
<footer class="lupaFooterDivider footer">
    <div class="container">
      <div class="footerGrid reveal">
        <div class="footerBrand">
          <a href="/" class="brand brand--big" aria-label="Lupa Painting">
            <span class="brand__lupa">LUPA</span>
            <span class="brand__painting">PAINTING</span>
          </a>

          <p class="muted">
            Premium interior and exterior painting services for homeowners and businesses that value craftsmanship, clean finishes, and dependable results.
          </p>

          <div class="socials" aria-label="Social links">
            <a href="https://www.facebook.com/profile.php?id=61586579284078" aria-label="Facebook">f</a>
            <a href="https://www.instagram.com/lupaservices/" aria-label="Instagram">ig</a>
            <a href="https://x.com/lupapainting" aria-label="Twitter">x</a>
          </div>
        </div>

        <div class="footerCol">
          <h4 class="footerTitle">CONTACT US</h4>
          <ul class="footerList">
            <li>8 Joanne Drive,<br>Ashland, MA 01721</li>
            <li>+1 (857) 246-5998</li>
            <li>officelupaservices@gmail.com</li>
          </ul>
        </div>

        <div class="footerCol">
          <h4 class="footerTitle">NEWSLETTER</h4>
          <p class="muted small">Subscribe for painting tips, color ideas, and seasonal offers.</p>
          <form class="newsletter" id="newsletterForm">
            <input type="email" placeholder="YOUR EMAIL" required />
            <button type="submit">JOIN</button>
          </form>
          <p id="newsletterMsg" class="muted small hidden">Thanks! You're subscribed.</p>
        </div>
      </div>

      <div class="footerBottom">
        <p>© <span id="year"></span> LUPA PAINTING. ALL RIGHTS RESERVED.</p>
        <div class="footerLinks">
          <a href="privacy.html">Privacy Policy</a>
          <a href="terms.html">Terms of Service</a>
        </div>
      </div>
    </div>
  </footer>
<script src="/assets/js/app.js?v=20261031-conversion" defer></script><script src="/assets/js/services.js" defer></script>
<script src="/assets/js/lupa-local-faq.js?v=20261101" defer></script></body></html>
