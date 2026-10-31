<?php
declare(strict_types=1);
require_once __DIR__.'/backend-blog/bootstrap.php';
$articles=posts();
?><!doctype html><html lang="en-US"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Painting Tips &amp; Project Insights | Lupa Painting</title>
<meta name="description" content="Painting inspiration, surface preparation tips and advice for MetroWest Massachusetts homeowners from Lupa Painting.">
<link rel="canonical" href="https://lupaservices.com/blog.php">
<link rel="stylesheet" href="/assets/css_main/global.css"><link rel="stylesheet" href="/assets/css_main/footer.css">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
<style>
body.lupaBlog{margin:0;background:#080a0e;color:white;font-family:Inter,Arial,sans-serif}
.lupaBlog *{box-sizing:border-box}
.lupaBlog .nav{position:absolute;left:0;right:0;top:0;z-index:40;background:rgba(7,9,13,.76);color:white}
.lupaBlog .nav__desktop{display:flex;align-items:center;gap:19px}
.lupaBlog .nav__link{font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#e5e5e5;text-decoration:none;font-weight:700}
.lupaBlog .nav__link:hover{color:#f7cb1c}
.lupaBlog .nav__mobile{display:none}
.lupaBlog .nav__toggle{display:none}
.lupaBlog .brand__lupa{display:inline-block;background:#fff;color:#111;font-style:italic;font-weight:900;padding:5px 12px;margin-right:7px}
.lupaBlog .brand__painting{font-style:italic;font-weight:900;color:#f4cf20}
.lupaBlog .btn--cta{background:#f3c928!important;color:black!important;border:0;padding:14px 18px;text-decoration:none;font-weight:800}
.lupaBlogHero{position:relative;min-height:590px;display:flex;align-items:center;justify-content:center;text-align:center;overflow:hidden;background:#0a0a0a}
.lupaBlogVideo{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0;transition:opacity 1.4s}
.lupaBlogVideo.active{opacity:1}
.lupaBlogOverlay{position:absolute;inset:0;background:linear-gradient(0deg,rgba(0,0,0,.88),rgba(0,0,0,.48))}
.lupaBlogHeroInner{position:relative;z-index:1;max-width:950px;margin:auto;padding:130px 24px 65px}
.lupaBlogEyebrow{color:#ffd22d;letter-spacing:.22em;font-weight:800;text-transform:uppercase;font-size:13px}
.lupaBlogHero h1{font-weight:950;text-transform:uppercase;font-style:italic;line-height:1.08;letter-spacing:-.035em;font-size:clamp(39px,6vw,82px);margin:20px 0}
.lupaBlogHero p{font-size:17px;color:#eee;max-width:700px;margin:0 auto 28px}
.lupaBlogButton{display:inline-flex;background:#ffd127;color:#0d0d0d;text-decoration:none;font-size:13px;font-weight:900;text-transform:uppercase;padding:16px 26px;margin:6px}
.lupaBlogButton.alt{background:white}
.lupaBlogMain{background:#090909;padding:62px 0 90px}
.lupaBlogWrap{width:min(1160px,92%);margin:0 auto}
.lupaBlogHeader h2{text-transform:uppercase;font-style:italic;font-weight:900;font-size:clamp(30px,4vw,51px);margin:6px 0 12px}
.lupaBlogHeader p{color:#c4c4c4;margin:0 0 35px}
.lupaBlogGrid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:26px}
.lupaBlogCard{background:#151515;border:1px solid #383838;overflow:hidden;border-radius:10px}
.lupaBlogCard img{width:100%;height:200px;object-fit:cover}
.lupaBlogCardBody{padding:24px}.lupaBlogCard h3{margin:8px 0;font-size:22px}.lupaBlogCard a{color:white;text-decoration:none}.lupaBlogCard a:hover{color:#ffd12a}.lupaBlogCard p{color:#c6c6c6}.lupaBlogCard small{color:#ffd12a}
.lupaBlogEmpty{border:1px solid #444;border-radius:12px;padding:44px;background:#141414;max-width:750px}.lupaBlogEmpty p{color:#bbb}
.lupaBlogFooter{background:#121212;color:#aaa;padding:30px;text-align:center;border-top:1px solid #333}.lupaBlogFooter a{color:#ffd12a}
@media(max-width:1050px){.lupaBlog .nav__desktop{gap:10px}.lupaBlog .nav__link{letter-spacing:0;font-size:11px}}
@media(max-width:800px){.lupaBlog .nav__desktop{display:none}.lupaBlog .nav__toggle{display:block;background:none;border:0;padding:10px}.lupaBlog .nav__burger,.lupaBlog .nav__burger:before,.lupaBlog .nav__burger:after{display:block;width:24px;height:2px;background:white;position:relative}.lupaBlog .nav__burger:before,.lupaBlog .nav__burger:after{content:"";position:absolute;left:0}.lupaBlog .nav__burger:before{top:-7px}.lupaBlog .nav__burger:after{top:7px}.lupaBlog .nav__mobile.is-open{display:flex;flex-direction:column;padding:15px 5%;background:#141414;gap:12px}.lupaBlog .nav__mobileLink{color:#fff;text-decoration:none;padding:7px}.lupaBlogGrid{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:560px){.lupaBlogHero{min-height:550px}.lupaBlogGrid{grid-template-columns:1fr}.lupaBlogHeroInner{padding-top:105px}}
@media(prefers-reduced-motion:reduce){.lupaBlogVideo{display:none}.lupaBlogVideo:first-child{display:block;opacity:.45}}
</style>
<script type="application/ld+json"><?=json_encode(['@context'=>'https://schema.org','@type'=>'Blog','name'=>'Lupa Painting Blog','url'=>'https://lupaservices.com/blog.php','publisher'=>['@type'=>'Organization','name'=>'Lupa Painting','url'=>'https://lupaservices.com/']],JSON_UNESCAPED_SLASHES)?></script></head>
<body class="lupaBlog"><nav id="navbar" class="nav">
    <div class="container nav__inner">
      <a href="/" class="brand" aria-label="Lupa Painting Services - Home">
        <span class="brand__lupa">LUPA</span>
        <span class="brand__painting">PAINTING</span>
      </a>

      <div class="nav__desktop" aria-label="Primary Navigation">
        <a class="nav__link" href="about.html">About</a>
        <a class="nav__link" href="reviews.html">Reviews</a>
        <a class="nav__link" href="services.html">Services</a>
        <a class="nav__link" href="/service-areas.html">Service Areas</a>
        <a class="nav__link" href="blog.php">Our Blog</a>
        <a class="nav__link" href="inspiration.html">Inspiration</a>
        <a class="nav__link" href="contact.html">Contact</a>

        <a class="btn btn--cta" href="tel:+18572465998">(857) 246-5998</a>
      </div>

      <button id="navToggle" class="nav__toggle" aria-label="Open menu" aria-expanded="false">
        <span class="nav__burger"></span>
      </button>
    </div>

    <!-- Mobile Menu (Gemini padrão) -->
    <div id="mobileMenu" class="nav__mobile" aria-hidden="true">
      <a class="nav__mobileLink" href="about.html" data-close>About</a>
      <a class="nav__mobileLink" href="reviews.html" data-close>Reviews</a>
      <a class="nav__mobileLink" href="services.html" data-close>Services</a>
      <a class="nav__mobileLink" href="/service-areas.html" data-close>Service Areas</a>
      <a class="nav__mobileLink" href="blog.php" data-close>Our Blog</a>
      <a class="nav__mobileLink" href="inspiration.html" data-close>Inspiration</a>
      <a class="nav__mobileLink" href="contact.html" data-close>Contact</a>

      <a class="btn btn--cta btn--lg" href="tel:+18572465998" data-close>CALL NOW</a>
      <a class="btn btn--ghost btn--lg" href="sms:+18572465998" data-close>TEXT US</a>
    </div>
  </nav>
<header class="lupaBlogHero" id="home"><video class="lupaBlogVideo active" muted autoplay loop playsinline preload="metadata" aria-hidden="true"><source src="/assets/videos/LUCAS - LUPA SERVICES - CABINET PAINTING.mp4" type="video/mp4"></video><video class="lupaBlogVideo " muted autoplay loop playsinline preload="metadata" aria-hidden="true"><source src="/assets/videos/LUCAS - LUPA SERVICES - DECK AND STAINING.mp4" type="video/mp4"></video><video class="lupaBlogVideo " muted autoplay loop playsinline preload="metadata" aria-hidden="true"><source src="/assets/videos/LUCAS - LUPA SERVICES - EXTERIOR PAINTING.mp4" type="video/mp4"></video><div class="lupaBlogOverlay"></div><div class="lupaBlogHeroInner"><div class="lupaBlogEyebrow">LUPA PAINTING / OUR BLOG</div><h1>PAINTING <span style="color:#ffd12a">TIPS</span> &amp; PROJECT INSIGHTS</h1><p>Advice, inspiration and project updates from a painting team serving MetroWest Massachusetts.</p><a class="lupaBlogButton" href="/index.html#quote">Request a Free Quote</a><a class="lupaBlogButton alt" href="/services.html">Our Services</a></div></header>
<main class="lupaBlogMain"><div class="lupaBlogWrap"><div class="lupaBlogHeader"><div class="lupaBlogEyebrow">Insights &amp; Inspiration</div><h2>THE LATEST FROM LUPA</h2><p>Learn about painting, preparation, materials and the details that make the difference.</p></div>
<?php if ($articles): ?><div class="lupaBlogGrid"><?php foreach($articles as $article): ?><article class="lupaBlogCard"><?php if(!empty($article['image'])): ?><img src="<?=h($article['image'])?>" alt="<?=h($article['title'])?>" loading="lazy"><?php endif; ?><div class="lupaBlogCardBody"><small><?=h(substr((string)($article['date']??''),0,10))?></small><h3><a href="/backend-blog/post.php?slug=<?=rawurlencode($article['slug'])?>"><?=h($article['title'])?></a></h3><p><?=h($article['summary']??'')?></p><a href="/backend-blog/post.php?slug=<?=rawurlencode($article['slug'])?>">READ ARTICLE →</a></div></article><?php endforeach; ?></div>
<?php else: ?><div class="lupaBlogEmpty"><h3>New articles are coming soon.</h3><p>We are preparing painting advice, practical guides and project inspiration. Explore our services in the meantime.</p><a class="lupaBlogButton" href="/contact.html">Get a Free Estimate</a></div><?php endif; ?></div></main>
<footer class="lupaBlogFooter">Lupa Painting · MetroWest Massachusetts · <a href="/service-areas.html">Service Areas</a> · <a href="/privacy.html">Privacy</a> · <a href="/terms.html">Terms</a></footer>
<script>(function(){const t=document.getElementById('navToggle'),m=document.getElementById('mobileMenu');if(t&&m){t.addEventListener('click',()=>{const o=m.classList.toggle('is-open');t.setAttribute('aria-expanded',String(o));m.setAttribute('aria-hidden',String(!o))});m.querySelectorAll('[data-close]').forEach(a=>a.addEventListener('click',()=>{m.classList.remove('is-open');t.setAttribute('aria-expanded','false');m.setAttribute('aria-hidden','true')}))}const videos=[...document.querySelectorAll('.lupaBlogVideo')];if(videos.length>1&&!matchMedia('(prefers-reduced-motion: reduce)').matches){let n=0;setInterval(()=>{videos[n].classList.remove('active');n=(n+1)%videos.length;videos[n].classList.add('active')},9000)}})();</script></body></html>