<?php
declare(strict_types=1);
require_once __DIR__.'/backend-blog/bootstrap.php';
$articles=posts();
?><!doctype html>
<html lang="en-US"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Painting Tips &amp; Project Insights | Lupa Painting Blog</title><meta name="description" content="Explore helpful painting advice, finish selection, surface preparation and home improvement inspiration from Lupa Painting in MetroWest Massachusetts.">
<link rel="canonical" href="https://lupaservices.com/blog.php">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/css_main/global.css">
<link rel="stylesheet" href="/assets/css_main/css_services/services.css">
<link rel="stylesheet" href="/assets/css_main/css_services/hero.css">
<link rel="stylesheet" href="/assets/css_main/footer.css">
<style>
body{background:#0b0d12;color:#fff}
.lupaBlogKicker{font-size:13px;font-weight:800;color:#f6d123;letter-spacing:.2em;text-transform:uppercase;margin-bottom:18px}
.lupaBlogTitle{font-size:clamp(35px,5vw,72px);font-style:italic;font-weight:900;text-transform:uppercase;line-height:1.08;max-width:970px;margin:0 auto 20px;color:#fff}
.lupaBlogIntro{font-size:17px;color:#f4f4f4;max-width:690px;margin:0 auto 25px;line-height:1.6}
.hero__content .reveal{text-align:center}
.lupaBlogListing{background:#0b0d12;padding:75px 0 110px}
.lupaBlogListing .container{max-width:1180px}
.lupaBlogEyebrow{letter-spacing:.2em;color:#f6ca20;font-weight:800;font-size:13px}
.lupaBlogHeading{font-size:clamp(30px,4vw,52px);text-transform:uppercase;font-style:italic;margin:12px 0}
.lupaBlogSubtitle{color:#c5c9d0;max-width:720px;margin-bottom:35px}
.lupaBlogGrid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:24px}
.lupaBlogCard{border:1px solid #35383f;background:#171a20;border-radius:12px;overflow:hidden}
.lupaBlogCard img{width:100%;height:215px;object-fit:cover;display:block}
.lupaBlogCardContent{padding:22px}.lupaBlogCard small{color:#f6cd26}
.lupaBlogCard h3{font-size:22px;line-height:1.3;margin:12px 0}.lupaBlogCard a{color:#fff;text-decoration:none}
.lupaBlogCard a:hover{color:#ffd12b}.lupaBlogCard p{color:#c9c9cc}
.lupaBlogCard .lupaRead{font-weight:800;color:#f6cd26}
.lupaBlogEmpty{background:#171a20;border:1px solid #343943;border-radius:12px;padding:38px;max-width:780px}.lupaBlogEmpty p{color:#d1d1d1}
.lupaBlogFooter{background:#0a0c11;padding:28px;text-align:center;color:#aaa}.lupaBlogFooter a{color:#f4ce2a}
@media(max-width:960px){.lupaBlogGrid{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:650px){.lupaBlogGrid{grid-template-columns:1fr}.lupaBlogListing{padding:48px 0}.lupaBlogTitle{font-size:36px}.lupaBlogIntro{font-size:15px}}
</style>
<script type="application/ld+json"><?=json_encode(['@context'=>'https://schema.org','@type'=>'Blog','name'=>'Lupa Painting Blog','url'=>'https://lupaservices.com/blog.php','publisher'=>['@type'=>'Organization','name'=>'Lupa Painting','url'=>'https://lupaservices.com/']],JSON_UNESCAPED_SLASHES)?></script>
</head><body><nav id="navbar" class="nav">
    <div class="container nav__inner">
      <a href="/" class="brand" aria-label="Lupa Painting Services - Home">
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

    <!-- Mobile Menu (Gemini padrão) -->
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
<header class="hero hero--video hero--ctasOnly" id="home">
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
      <p class="lupaBlogKicker">THE LUPA JOURNAL</p><h1 class="lupaBlogTitle">PAINTING TIPS &amp; PROJECT INSIGHTS</h1><p class="lupaBlogIntro">Practical painting advice, project inspiration and surface preparation tips from Lupa Painting.</p><div class="hero__actions hero__actions--only">
        <a class="btn btn--cta btn--lg" href="/index.html#quote">REQUEST A FREE QUOTE</a>
        <a class="btn btn--ghost btn--lg" href="mailto:paintinglupa@gmail.com">EMAIL US</a>
        <a class="btn btn--white btn--lg" href="/index.html#service-areas">SEE SERVICE AREAS</a>
      </div>
    </div>
  </div>

  <!-- Scroll icon -->
  <a class="hero__scroll" href="#latestArticles" aria-label="Scroll">
    <span class="chev" aria-hidden="true"></span>
  </a>
</header>
<main id="mainContent"><section id="latestArticles" class="lupaBlogListing"><div class="container"><p class="lupaBlogEyebrow">LUPA PAINTING JOURNAL</p><h2 class="lupaBlogHeading">THE LATEST FROM LUPA</h2><p class="lupaBlogSubtitle">Painting insights, preparation guides and project inspiration for MetroWest Massachusetts.</p><?php if ($articles): ?><div class="lupaBlogGrid"><?php foreach($articles as $article): ?><article class="lupaBlogCard"><?php if(!empty($article['image'])): ?><img src="<?=h($article['image'])?>" alt="<?=h($article['title'])?>" loading="lazy"><?php endif; ?><div class="lupaBlogCardContent"><small><?=h(substr((string)($article['date']??''),0,10))?></small><h3><a href="/backend-blog/post.php?slug=<?=rawurlencode($article['slug'])?>"><?=h($article['title'])?></a></h3><p><?=h($article['summary']??'')?></p><a class="lupaRead" href="/backend-blog/post.php?slug=<?=rawurlencode($article['slug'])?>">READ ARTICLE</a></div></article><?php endforeach; ?></div><?php else: ?><div class="lupaBlogEmpty"><h3>Painting insights are on the way.</h3><p>We are preparing articles about surface preparation, finishes and home painting projects. You can explore our services or request an estimate today.</p><a class="btn btn--cta btn--lg" href="/index.html#quote">GET A FREE ESTIMATE</a></div><?php endif; ?></div></section></main>
<footer class="lupaBlogFooter">Lupa Painting · MetroWest Massachusetts · <a href="/service-areas.html">Service Areas</a> · <a href="/privacy.html">Privacy</a> · <a href="/terms.html">Terms</a></footer>
<script src="/assets/js/app.js?v=20261031-conversion" defer></script><script src="/assets/js/services.js" defer></script>
</body></html>