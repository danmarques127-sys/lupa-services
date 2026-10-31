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
<link rel="stylesheet" href="/assets/css_main/css_services/hero.css?v=20261031-hero-fix">
<link rel="stylesheet" href="/assets/css_main/footer.css">
<style>.lupaBlogListing{padding:65px 0;background:#0b0d12;color:white}.lupaBlogGrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:24px}.lupaBlogCard{background:#161a22;border:1px solid #393e45;border-radius:12px;overflow:hidden}.lupaBlogCardContent{padding:22px}.lupaBlogCard img{width:100%;height:220px;object-fit:cover}.lupaBlogCard a{color:#f3c926}.lupaBlogListing .container{max-width:1150px}.lupaBlogFooter{padding:30px;text-align:center;background:#090c12;color:white}.lupaBlogFooter a{color:#f3c926}</style>
<script type="application/ld+json"><?=json_encode(['@context'=>'https://schema.org','@type'=>'Blog','name'=>'Lupa Painting Blog','url'=>'https://lupaservices.com/blog.php','publisher'=>['@type'=>'Organization','name'=>'Lupa Painting','url'=>'https://lupaservices.com/']],JSON_UNESCAPED_SLASHES)?></script>
</head><body><nav id="navbar" class="nav">
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

        <p class="serviceHeroSubline"><span class="is-white">PAINTING TIPS. PROJECT STORIES. PRACTICAL ADVICE.</span></p>
      </div>

      <div class="hero__actions hero__actions--only serviceHeroActions"><a class="btn btn--cta btn--lg" href="/index.html#quote">REQUEST A FREE QUOTE</a><a class="btn btn--ghost btn--lg" href="#latestArticles">READ ARTICLES</a><a class="btn btn--white btn--lg" href="/services.html">OUR SERVICES</a></div>
    </div>
  </div>

  <a class="hero__scroll" href="#latestArticles" aria-label="Scroll">
    <span class="chev" aria-hidden="true"></span>
  </a>
</header>
<main id="mainContent"><section id="latestArticles" class="lupaBlogListing"><div class="container"><p class="lupaBlogEyebrow">LUPA PAINTING JOURNAL</p><h2 class="lupaBlogHeading">THE LATEST FROM LUPA</h2><p class="lupaBlogSubtitle">Painting insights, preparation guides and project inspiration for MetroWest Massachusetts.</p><?php if ($articles): ?><div class="lupaBlogGrid"><?php foreach($articles as $article): ?><article class="lupaBlogCard"><?php if(!empty($article['image'])): ?><img src="<?=h($article['image'])?>" alt="<?=h($article['title'])?>" loading="lazy"><?php endif; ?><div class="lupaBlogCardContent"><small><?=h(substr((string)($article['date']??''),0,10))?></small><h3><a href="/backend-blog/post.php?slug=<?=rawurlencode($article['slug'])?>"><?=h($article['title'])?></a></h3><p><?=h($article['summary']??'')?></p><a class="lupaRead" href="/backend-blog/post.php?slug=<?=rawurlencode($article['slug'])?>">READ ARTICLE</a></div></article><?php endforeach; ?></div><?php else: ?><div class="lupaBlogEmpty"><h3>Painting insights are on the way.</h3><p>We are preparing articles about surface preparation, finishes and home painting projects. You can explore our services or request an estimate today.</p><a class="btn btn--cta btn--lg" href="/index.html#quote">GET A FREE ESTIMATE</a></div><?php endif; ?></div></section></main>
<footer class="lupaBlogFooter">Lupa Painting · MetroWest Massachusetts · <a href="/service-areas.html">Service Areas</a> · <a href="/privacy.html">Privacy</a> · <a href="/terms.html">Terms</a></footer>
<script src="/assets/js/app.js?v=20261031-conversion" defer></script><script src="/assets/js/services.js" defer></script>
</body></html>