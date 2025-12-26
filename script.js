/* =========================================================
   Lupa Services — Core UI
   - Mobile drawer (aside) + overlay + focus trap
   - Desktop "Services" submenu (click-friendly)
   - Hero slideshow (autoplay, dots, prev/next, ARIA)
   - Mobile carousel para .svc-section (Cleaning + Painting)
   - Smooth anchor scroll + footer year
   ========================================================= */

(function () {
  "use strict";

  /* -------------------------
     Shortcuts / selectors
  ------------------------- */
  const $  = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const isDesktop = () => window.matchMedia("(min-width: 992px)").matches;
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* -------------------------
     Elements (header/drawer)
  ------------------------- */
  const body           = document.body;
  const mobileToggle   = $("#mobile-toggle");
  const mobileNav      = $("#mobile-nav");
  const overlay        = $("#overlay");
  const mobileClose    = $("#mobile-close");
  const mobileLinks    = $$(".mobile-nav a");
  const focusablesSel  = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1")]';

  // Desktop submenu (Services)
  const servicesItem   = $("#services-item");
  const servicesToggle = $("#services-toggle");

  /* -------------------------
     Helpers
  ------------------------- */
  function lockScroll(lock) {
    body.style.overflow = lock ? "hidden" : "";
  }

  function setOverlay(active) {
    if (!overlay) return;
    if (active) {
      overlay.hidden = false;
      overlay.classList.add("is-active");
    } else {
      overlay.classList.remove("is-active");
      setTimeout(() => { overlay && (overlay.hidden = true); }, 150);
    }
  }

  function firstFocusable(root) {
    return $(focusablesSel, root) || null;
  }

  function trapFocus(e) {
    if (!mobileNav || !mobileNav.classList.contains("is-open")) return;
    if (e.key !== "Tab") return;

    const foci = $$(focusablesSel, mobileNav);
    if (!foci.length) return;

    const first = foci[0];
    const last  = foci[foci.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  /* -------------------------
     Drawer controls (mobile)
  ------------------------- */
  function openMobileNav() {
    if (!mobileNav) return;
    mobileNav.classList.add("is-open");
    mobileNav.setAttribute("aria-hidden", "false");
    mobileToggle && mobileToggle.setAttribute("aria-expanded", "true");
    setOverlay(true);
    lockScroll(true);

    const first = firstFocusable(mobileNav);
    first && first.focus();
  }

  function closeMobileNav() {
    if (!mobileNav) return;
    mobileNav.classList.remove("is-open");
    mobileNav.setAttribute("aria-hidden", "true");
    mobileToggle && mobileToggle.setAttribute("aria-expanded", "false");
    setOverlay(false);
    lockScroll(false);
    mobileToggle && mobileToggle.focus();
  }

  function toggleMobileNav() {
    const isOpen = mobileNav && mobileNav.classList.contains("is-open");
    isOpen ? closeMobileNav() : openMobileNav();
  }

  // Eventos do drawer
  mobileToggle && mobileToggle.addEventListener("click", (e) => {
    e.preventDefault();
    toggleMobileNav();
  });

  mobileClose && mobileClose.addEventListener("click", (e) => {
    e.preventDefault();
    closeMobileNav();
  });

  overlay && overlay.addEventListener("click", (e) => {
    e.preventDefault();
    closeMobileNav();
  });

  // Fecha quando um link do menu mobile é clicado
  mobileLinks.forEach((a) => a.addEventListener("click", () => closeMobileNav()));

  // ESC + focus trap
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && mobileNav && mobileNav.classList.contains("is-open")) {
      e.preventDefault();
      closeMobileNav();
    }
    trapFocus(e);
  });

  // Fecha no resize para desktop
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (isDesktop()) {
        closeMobileNav();
        setOverlay(false);
        lockScroll(false);
      }
    }, 120);
  });

  /* -------------------------
     Desktop Services submenu
  ------------------------- */
  function closeServicesMenu() {
    if (!servicesItem) return;
    servicesItem.classList.remove("is-open");
    servicesToggle && servicesToggle.setAttribute("aria-expanded", "false");
  }

  function openServicesMenu() {
    if (!servicesItem) return;
    servicesItem.classList.add("is-open");
    servicesToggle && servicesToggle.setAttribute("aria-expanded", "true");
  }

  function toggleServicesMenu() {
    if (!servicesItem) return;
    const isOpen = servicesItem.classList.contains("is-open");
    isOpen ? closeServicesMenu() : openServicesMenu();
  }

  if (servicesToggle && servicesItem) {
    servicesToggle.addEventListener("click", (e) => {
      e.preventDefault();
      if (isDesktop()) toggleServicesMenu();
    });

    // Click fora fecha (desktop)
    document.addEventListener("click", (e) => {
      if (!isDesktop()) return;
      if (!servicesItem.contains(e.target)) {
        closeServicesMenu();
      }
    });

    // Reset quando sair do desktop
    window.addEventListener("resize", () => {
      if (!isDesktop()) closeServicesMenu();
    });

    // ESC fecha quando foco está dentro
    servicesItem.addEventListener("keydown", (e) => {
      if (!isDesktop()) return;
      if (e.key === "Escape") {
        e.preventDefault();
        closeServicesMenu();
        servicesToggle && servicesToggle.focus();
      }
    });
  }

  /* -------------------------
     HERO slideshow controller
     - roda apenas se existir #hero
  ------------------------- */
  (function heroSlideshow() {
    const hero = $("#hero");
    if (!hero) return;

    const slides   = $$(".hero-slide", hero);
    const dotsWrap = $(".hero-dots", hero);
    const prevBtn  = $(".hero-rail-btn.prev", hero);
    const nextBtn  = $(".hero-rail-btn.next", hero);

    if (!slides.length || !dotsWrap) return;

    const INTERVAL = 7000;
    let index = 0;
    let timer = null;
    let paused = false;

    // Dots
    slides.forEach((_, i) => {
      const b = document.createElement("button");
      b.className = "hero-dot";
      b.type = "button";
      b.setAttribute("role", "tab");
      b.setAttribute("aria-label", `Show slide ${i + 1}`);
      b.addEventListener("click", () => go(i));
      dotsWrap.appendChild(b);
    });

    // Preload backgrounds
    slides.forEach((s) => {
      const url = getComputedStyle(s)
        .getPropertyValue("--bg")
        .trim()
        .replace(/^url\((.*)\)$/, "$1")
        .replace(/^["']|["']$/g, "");
      if (url) {
        const img = new Image();
        img.src = url;
      }
    });

    function update() {
      slides.forEach((s, i) => s.classList.toggle("is-active", i === index));
      [...dotsWrap.children].forEach((d, i) =>
        d.setAttribute("aria-selected", i === index ? "true" : "false")
      );
    }

    function go(i) {
      index = (i + slides.length) % slides.length;
      update();
      restart();
    }

    function next() { go(index + 1); }
    function prev() { go(index - 1); }

    function start() {
      if (timer || prefersReduced) return;
      timer = setInterval(() => {
        if (!paused) next();
      }, INTERVAL);
    }

    function stop() {
      clearInterval(timer);
      timer = null;
    }

    function restart() {
      stop();
      start();
    }

    nextBtn && nextBtn.addEventListener("click", next);
    prevBtn && prevBtn.addEventListener("click", prev);

    ["mouseenter", "focusin"].forEach((ev) =>
      hero.addEventListener(ev, () => { paused = true; })
    );
    ["mouseleave", "focusout"].forEach((ev) =>
      hero.addEventListener(ev, () => { paused = false; })
    );

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        stop();
      } else {
        restart();
      }
    });

    update();
    start();
  })();

  /* -------------------------------------------------------
     Services carousel (MOBILE)
     - <section class="svc-section"> com .svc-grid e .svc-card
  ------------------------------------------------------- */
  (function servicesCarouselAll() {
    const sections = $$(".svc-section");
    if (!sections.length) return;

    const mql = window.matchMedia("(max-width: 560px)");

    function buildSection(section) {
      if (section.dataset.carouselInited === "1") return;

      const grid = section.querySelector(".svc-grid");
      if (!grid) return;

      const cards = $$(".svc-card", grid);
      if (cards.length <= 1) return;

      section.dataset.carouselInited = "1";

      const nav = document.createElement("div");
      nav.className = "svc-nav";
      nav.style.display = "flex";
      nav.style.justifyContent = "center";
      nav.style.alignItems = "center";
      nav.style.marginTop = "12px";
      nav.style.gap = "12px";

      const prev = document.createElement("button");
      prev.className = "svc-prev";
      prev.type = "button";
      prev.setAttribute("aria-label", "Previous service");
      prev.textContent = "‹";

      const dots = document.createElement("div");
      dots.className = "svc-dots";
      dots.style.display = "flex";
      dots.style.alignItems = "center";
      dots.style.justifyContent = "center";

      const next = document.createElement("button");
      next.className = "svc-next";
      next.type = "button";
      next.setAttribute("aria-label", "Next service");
      next.textContent = "›";

      nav.append(prev, dots, next);
      grid.after(nav);

      const originalDisplay = grid.style.display;
      const originalOverflow = grid.style.overflowX;
      const originalGap = grid.style.gap;

      grid.style.display = "flex";
      grid.style.overflowX = "hidden";
      grid.style.scrollBehavior = "smooth";
      grid.style.gap = "12px";

      let idx = 0;

      function sizeCards() {
        const secWidth = section.getBoundingClientRect().width;
        const width = secWidth;
        cards.forEach((c) => {
          c.style.minWidth = width + "px";
        });
      }
      sizeCards();

      function paintDots() {
        dots.innerHTML = "";
        cards.forEach((_, i) => {
          const b = document.createElement("button");
          b.type = "button";
          b.className = "svc-dot";
          b.setAttribute("aria-label", `Show service ${i + 1}`);
          Object.assign(b.style, {
            width: "8px",
            height: "8px",
            borderRadius: "999px",
            border: "0",
            margin: "0 4px",
            background: i === idx ? "#174B82" : "rgba(23,75,130,.35)",
          });
          b.addEventListener("click", () => go(i));
          dots.appendChild(b);
        });
      }

      function go(i) {
        idx = (i + cards.length) % cards.length;
        const target = cards[idx];
        const x = target.offsetLeft;
        grid.scrollTo({
          left: x,
          behavior: prefersReduced ? "auto" : "smooth",
        });
        paintDots();
      }

      prev.addEventListener("click", () => go(idx - 1));
      next.addEventListener("click", () => go(idx + 1));

      let startX = 0;
      grid.addEventListener(
        "touchstart",
        (e) => {
          if (!e.touches[0]) return;
          startX = e.touches[0].clientX;
        },
        { passive: true }
      );

      grid.addEventListener(
        "touchend",
        (e) => {
          if (!e.changedTouches[0]) return;
          const dx = e.changedTouches[0].clientX - startX;
          if (Math.abs(dx) > 40) {
            dx < 0 ? go(idx + 1) : go(idx - 1);
          }
        },
        { passive: true }
      );

      const resizeHandler = () => sizeCards();
      window.addEventListener("resize", resizeHandler);

      section._svcCleanup = () => {
        window.removeEventListener("resize", resizeHandler);
        nav.remove();
        cards.forEach((c) => { c.style.minWidth = ""; });
        grid.style.display = originalDisplay;
        grid.style.overflowX = originalOverflow;
        grid.style.gap = originalGap;
        delete section.dataset.carouselInited;
        delete section._svcCleanup;
      };

      paintDots();
      go(0);
    }

    function destroySection(section) {
      if (
        section.dataset.carouselInited === "1" &&
        typeof section._svcCleanup === "function"
      ) {
        section._svcCleanup();
      }
    }

    function updateAll() {
      sections.forEach((section) => {
        if (mql.matches) buildSection(section);
        else destroySection(section);
      });
    }

    updateAll();
    mql.addEventListener("change", updateAll);
  })();

  /* -------------------------
     Smooth anchor scroll (#hash)
  ------------------------- */
  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;

    const href = a.getAttribute("href");
    if (!href || href === "#") return;

    const target = document.querySelector(href);
    if (!target) return;

    e.preventDefault();

    if (mobileNav && mobileNav.classList.contains("is-open")) {
      closeMobileNav();
    }

    target.scrollIntoView({
      behavior: prefersReduced ? "auto" : "smooth",
      block: "start",
    });

    target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
    setTimeout(() => target.removeAttribute("tabindex"), 800);
  });

  /* -------------------------
     Footer year
  ------------------------- */
  (function () {
    const y = document.getElementById("year");
    if (y) y.textContent = new Date().getFullYear();
  })();
})();

/* -------------------------------------------------------
   Reviews carousel (MOBILE)
   - <section class="reviews-section"> com .reviews-track
   - Desktop: grid normal
   - Mobile (≤640px): carrossel com autoplay 7s
------------------------------------------------------- */
(function reviewsCarousel() {
  const section = document.querySelector(".reviews-section");
  if (!section) return;

  const track = section.querySelector(".reviews-track");
  if (!track) return;

  const cards = Array.from(track.querySelectorAll(".review-card"));
  if (cards.length <= 1) return;

  const dotsWrap = section.querySelector(".reviews-dots");
  const prevBtn = section.querySelector(".reviews-prev");
  const nextBtn = section.querySelector(".reviews-next");
  const mql = window.matchMedia("(max-width: 640px)");
  const prefersReducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const INTERVAL = 7000;

  let idx = 0;
  let timer = null;

  function buildDots() {
    if (!dotsWrap) return;
    dotsWrap.innerHTML = "";
    cards.forEach((_, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "reviews-dot";
      b.setAttribute("aria-label", `Show review ${i + 1}`);
      b.addEventListener("click", () => go(i, true));
      dotsWrap.appendChild(b);
    });
  }

  function paintDots() {
    if (!dotsWrap) return;
    const dots = Array.from(dotsWrap.querySelectorAll(".reviews-dot"));
    dots.forEach((d, i) => {
      d.classList.toggle("is-active", i === idx);
    });
  }

  function go(i, userTriggered) {
    idx = (i + cards.length) % cards.length;

    // Scrolla exatamente até o início do card visível
    const target = cards[idx];
    const x = target.offsetLeft;

    track.scrollTo({
      left: x,
      behavior:
        prefersReducedQuery.matches || !mql.matches ? "auto" : "smooth",
    });

    paintDots();
    if (userTriggered) restart();
  }

  function start() {
    if (timer || prefersReducedQuery.matches || !mql.matches) return;
    timer = setInterval(() => {
      go(idx + 1, false);
    }, INTERVAL);
  }

  function stop() {
    if (!timer) return;
    clearInterval(timer);
    timer = null;
  }

  function restart() {
    stop();
    start();
  }

  // Swipe no touch
  let startX = 0;

  track.addEventListener(
    "touchstart",
    (e) => {
      if (!mql.matches || !e.touches[0]) return;
      startX = e.touches[0].clientX;
    },
    { passive: true }
  );

  track.addEventListener(
    "touchend",
    (e) => {
      if (!mql.matches || !e.changedTouches[0]) return;
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 40) {
        dx < 0 ? go(idx + 1, true) : go(idx - 1, true);
      }
    },
    { passive: true }
  );

  // Ativar/desativar carrossel conforme breakpoint
  function enable() {
    if (section.dataset.reviewsCarousel === "1") return;
    section.dataset.reviewsCarousel = "1";

    // Cada card ocupa 100% da largura visível do TRACK (container)
    const resizeHandler = () => {
      const width = track.getBoundingClientRect().width;
      cards.forEach((c) => {
        c.style.minWidth = width + "px";
      });
    };
    resizeHandler();
    window.addEventListener("resize", resizeHandler);
    section._reviewsResize = resizeHandler;

    buildDots();
    go(0, false);
    start();
  }

  function disable() {
    if (section.dataset.reviewsCarousel !== "1") return;
    delete section.dataset.reviewsCarousel;

    stop();
    if (section._reviewsResize) {
      window.removeEventListener("resize", section._reviewsResize);
      delete section._reviewsResize;
    }

    cards.forEach((c) => {
      c.style.minWidth = "";
    });
    if (dotsWrap) dotsWrap.innerHTML = "";
    track.scrollTo({ left: 0, behavior: "auto" });
  }

  function updateMode() {
    if (mql.matches) {
      enable();
    } else {
      disable();
    }
  }

  updateMode();
  mql.addEventListener("change", updateMode);

  // Navegação por setas
  if (prevBtn) {
    prevBtn.addEventListener("click", () => go(idx - 1, true));
  }
  if (nextBtn) {
    nextBtn.addEventListener("click", () => go(idx + 1, true));
  }

  // Pausar quando a aba não estiver visível
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stop();
    } else if (mql.matches) {
      restart();
    }
  });
})();

/* -------------------------------------------------------
   FAQ accordion (Cleaning + Painting)
------------------------------------------------------- */
(function faqAccordion() {
  const section = document.getElementById("faqs");
  if (!section) return;

  const items = Array.from(section.querySelectorAll(".faq-item"));
  if (!items.length) return;

  items.forEach((item, index) => {
    const btn = item.querySelector(".faq-button");
    const panel = item.querySelector(".faq-panel");
    if (!btn || !panel) return;

    const panelId = panel.id || `faq-panel-${index + 1}`;
    panel.id = panelId;
    btn.setAttribute("aria-controls", panelId);

    // começa fechado
    btn.setAttribute("aria-expanded", "false");
    panel.hidden = true;

    btn.addEventListener("click", () => {
      const isOpen = btn.getAttribute("aria-expanded") === "true";

      // abre só o clicado e fecha os demais
      items.forEach((it) => {
        const b = it.querySelector(".faq-button");
        const p = it.querySelector(".faq-panel");
        if (!b || !p) return;

        const shouldOpen = it === item && !isOpen;
        b.setAttribute("aria-expanded", shouldOpen ? "true" : "false");
        p.hidden = !shouldOpen;
      });
    });
  });
})();

/* -------------------------------------------------------
   Interior page – carrossel + lightbox (tl-work)
------------------------------------------------------- */
// lupa-painting-interior.js
document.addEventListener('DOMContentLoaded', function () {
  /* =========================================================
     CARROSSEL "Recent interior painting projects" + LIGHTBOX
     ========================================================= */
  const workTrack = document.querySelector('[data-work-track]');

  if (workTrack) {
    const slides = Array.from(workTrack.querySelectorAll('.tl-work-slide'));
    const btnPrev = document.querySelector('[data-work-prev]');
    const btnNext = document.querySelector('[data-work-next]');

    // slide ativo inicial
    let currentIndex = slides.findIndex(s => s.classList.contains('is-active'));
    if (currentIndex === -1) currentIndex = 0;

    function showWorkSlide(idx) {
      if (!slides.length) return;

      if (idx < 0) idx = slides.length - 1;
      if (idx >= slides.length) idx = 0;

      slides.forEach((slide, i) => {
        const isThis = i === idx;
        slide.classList.toggle('is-active', isThis);

        // só o visível recebe clique
        slide.style.pointerEvents = isThis ? 'auto' : 'none';
      });

      currentIndex = idx;
    }

    // aplica na carga
    showWorkSlide(currentIndex);

    // botões
    if (btnPrev) {
      btnPrev.addEventListener('click', () => {
        showWorkSlide(currentIndex - 1);
      });
    }

    if (btnNext) {
      btnNext.addEventListener('click', () => {
        showWorkSlide(currentIndex + 1);
      });
    }

    /* ---------- LIGHTBOX ---------- */
    let lightboxEl = null;
    let lightboxImg = null;

    function openLightbox(src, altText) {
      if (!lightboxEl) {
        lightboxEl = document.createElement('div');
        lightboxEl.className = 'tl-lightbox';

        lightboxImg = document.createElement('img');

        // fecha clicando fora
        lightboxEl.addEventListener('click', e => {
          if (e.target === lightboxEl) {
            lightboxEl.remove();
          }
        });

        lightboxEl.appendChild(lightboxImg);
      }

      lightboxImg.src = src;
      lightboxImg.alt = altText || '';
      document.body.appendChild(lightboxEl);
    }

    // adiciona clique na imagem de cada slide
    slides.forEach(slide => {
      const img = slide.querySelector('img');
      if (!img) return;

      img.style.cursor = 'zoom-in';

      img.addEventListener('click', () => {
        const src = img.getAttribute('src');
        const alt = img.getAttribute('alt') || '';
        openLightbox(src, alt);
      });
    });

    /* ---------- AUTO-SLIDE OPCIONAL ---------- */
    const AUTO_DELAY = 7000; // 7s – pode ajustar ou remover
    let autoTimer = null;

    function startAuto() {
      stopAuto();
      autoTimer = setInterval(() => {
        showWorkSlide(currentIndex + 1);
      }, AUTO_DELAY);
    }

    function stopAuto() {
      if (autoTimer) {
        clearInterval(autoTimer);
        autoTimer = null;
      }
    }

    // inicia o auto
    startAuto();

    // pausa ao passar o mouse, retoma ao sair (desktop)
    workTrack.addEventListener('mouseenter', stopAuto);
    workTrack.addEventListener('mouseleave', startAuto);
  }
});

/* =========================================================
   BLOG HUB (Cleaning + Painting)
   - Override global de imagens dos cards do hub
   - Funciona com:
     - CLEANING_BLOG_LAYOUT
     - PAINTING_BLOG_LAYOUT
   ========================================================= */

(function () {
  function patchBlogHubs() {
    // Se não existir loadPostData, não é página de hub de blog
    if (typeof window.loadPostData !== "function") return;

    // Gera forcedImg para cada slot de CLEANING
    if (Array.isArray(window.CLEANING_BLOG_LAYOUT)) {
      window.CLEANING_BLOG_LAYOUT.forEach((slot, index) => {
        if (!slot.forcedImg) {
          slot.forcedImg = `images/blogcleaningimg${index + 1}.jpg`;
        }
      });
    }

    // Gera forcedImg para cada slot de PAINTING (se tiver)
    if (Array.isArray(window.PAINTING_BLOG_LAYOUT)) {
      window.PAINTING_BLOG_LAYOUT.forEach((slot, index) => {
        if (!slot.forcedImg) {
          slot.forcedImg = `images/blogpaintingimg${index + 1}.jpg`;
        }
      });
    }

    const originalLoad = window.loadPostData;

    // Sobrescreve loadPostData para aplicar as imagens fixas
    window.loadPostData = async function (file) {
      const data = await originalLoad(file);
      let forcedImg = null;

      // Tenta achar nos slots de CLEANING
      if (Array.isArray(window.CLEANING_BLOG_LAYOUT)) {
        const slot = window.CLEANING_BLOG_LAYOUT.find(
          (s) => s.file === file && s.forcedImg
        );
        if (slot) forcedImg = slot.forcedImg;
      }

      // Se não achou, tenta nos slots de PAINTING
      if (!forcedImg && Array.isArray(window.PAINTING_BLOG_LAYOUT)) {
        const slot = window.PAINTING_BLOG_LAYOUT.find(
          (s) => s.file === file && s.forcedImg
        );
        if (slot) forcedImg = slot.forcedImg;
      }

      // Se tiver imagem forçada, aplica
      if (forcedImg) {
        data.imgSrc = forcedImg;
        if (!data.imgAlt) {
          data.imgAlt = data.title || "Blog article";
        }
      }

      return data;
    };
  }

  // Garante que rode depois de TODOS os scripts da página (incluindo os inline dos hubs)
  if (document.readyState === "complete") {
    patchBlogHubs();
  } else {
    window.addEventListener("load", patchBlogHubs);
  }
})();
document.addEventListener('DOMContentLoaded', function () {

  function initServicesCarousel(sectionId) {
    const section = document.getElementById(sectionId);
    if (!section) return;

    const track   = section.querySelector('.svc-track');
    const slides  = section.querySelectorAll('.svc-slide');
    const prevBtn = section.querySelector('.svc-nav--prev');
    const nextBtn = section.querySelector('.svc-nav--next');

    // Se faltar alguma parte, não faz nada (sem erro no console)
    if (!track || !prevBtn || !nextBtn || slides.length === 0) return;

    // Largura do card + espaçamento interno = quanto ele deve mover por clique
    function getStep() {
      const first = slides[0].getBoundingClientRect();
      return first.width + 16; // ajusta se quiser rolar mais/menos
    }

    function scrollByDir(direction) {
      track.scrollBy({
        left: direction * getStep(),
        behavior: 'smooth'
      });
    }

    prevBtn.addEventListener('click', () => scrollByDir(-1));
    nextBtn.addEventListener('click', () => scrollByDir(1));
  }

  // 👉 Aplica no Painting
  initServicesCarousel('painting');

  // 👉 E também no Cleaning (confere se o id da seção é este)
  initServicesCarousel('cleaning-services');
});
function playCleaningVideo() {
  const wrapper = document.getElementById("cleaning-video-wrapper");
  wrapper.innerHTML = `
    <iframe
      src="https://www.youtube.com/embed/DBCGoFwTy4E?autoplay=1"
      frameborder="0"
      allow="autoplay; encrypted-media"
      allowfullscreen
      title="Lupa Cleaning Services">
    </iframe>
  `;
}
