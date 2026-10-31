/* =========================================================
   gallery.js
   - Reusable Gallery page JS (photo-only)
   - Keeps the same core mechanics you already use:
     1) body.is-loaded
     2) Sticky navbar (#navbar -> .isScrolled)
     3) Mobile menu (#navToggle + #mobileMenu)
     4) Hero video rotation (#heroVideoA/B/C -> .is-active)
     5) Global reveal (.reveal -> .active + .isIn)
     6) Footer year + Newsletter simulated submit
     7) Work Types:
        - Desktop: infinite carousel auto loop
        - Mobile: dots + centered swipe carousel (#workTypesRail + #workTypesDots)
     8) Photo Gallery carousel dots (mobile) (#photoGalleryTrack + #photoGalleryDots)
     9) Lightbox: click photo -> open large + next/prev + swipe + keyboard + close
========================================================= */

(() => {
  const body = document.body;
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  /* =========================================================
     GLOBAL
     - Trigger de carregamento da página
     - Ano automático do footer
  ========================================================= */
  window.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => body.classList.add("is-loaded"), 60);

    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  });

  /* =========================================================
     HEADER
     1) Sticky Navbar (#navbar -> .isScrolled)
  ========================================================= */
  const navbar = $("#navbar");
  const stickyThreshold = 50;

  const updateSticky = () => {
    if (!navbar) return;
    navbar.classList.toggle("isScrolled", window.scrollY > stickyThreshold);
  };

  updateSticky();
  window.addEventListener("scroll", updateSticky, { passive: true });

  /* =========================================================
     HEADER
     2) Mobile Menu (#navToggle + #mobileMenu)
  ========================================================= */
  const navToggle = $("#navToggle");
  const mobileMenu = $("#mobileMenu");

  const closeMobile = () => {
    if (!navToggle || !mobileMenu) return;
    navToggle.classList.remove("isOpen");
    mobileMenu.classList.remove("isOpen");
    navToggle.setAttribute("aria-expanded", "false");
    mobileMenu.setAttribute("aria-hidden", "true");
    body.style.overflow = "";
  };

  const openMobile = () => {
    if (!navToggle || !mobileMenu) return;
    navToggle.classList.add("isOpen");
    mobileMenu.classList.add("isOpen");
    navToggle.setAttribute("aria-expanded", "true");
    mobileMenu.setAttribute("aria-hidden", "false");
    body.style.overflow = "hidden";
  };

  if (navToggle && mobileMenu) {
    navToggle.addEventListener("click", () => {
      const isOpen = navToggle.classList.contains("isOpen");
      isOpen ? closeMobile() : openMobile();
    });

    $$("[data-close]", mobileMenu).forEach((el) =>
      el.addEventListener("click", closeMobile)
    );

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMobile();
    });
  }

  /* =========================================================
     HERO
     1) Rotação de vídeos do Hero
     IDs esperados:
       - #heroVideoA
       - #heroVideoB
       - #heroVideoC
     Classe usada:
       - .is-active
  ========================================================= */
  const vA = $("#heroVideoA");
  const vB = $("#heroVideoB");
  const vC = $("#heroVideoC");
  const videos = [vA, vB, vC].filter(Boolean);

  const prefersReduced =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const saveData = navigator.connection && navigator.connection.saveData;

  const setActiveVideo = (idx) => {
    videos.forEach((v, i) => {
      v.classList.toggle("is-active", i === idx);
      try {
        if (i === idx) v.play?.();
      } catch (_) {}
    });
  };

  if (prefersReduced || saveData) {
    videos.forEach((v) => {
      try {
        v.pause?.();
        v.removeAttribute("autoplay");
      } catch (_) {}
      v.style.display = "none";
    });
  } else {
    if (videos.length === 1) {
      videos[0].classList.add("is-active");
    } else if (videos.length >= 2) {
      let current = 0;
      setActiveVideo(current);

      const ROTATE_EVERY_MS = 10000;

      setInterval(() => {
        current = (current + 1) % videos.length;
        setActiveVideo(current);
      }, ROTATE_EVERY_MS);
    }
  }

  /* =========================================================
     GLOBAL (Reveal)
     - Ativa animações de entrada em qualquer .reveal
     - Também adiciona .isIn para compatibilidade com footer CSS
  ========================================================= */
  const genericReveals = $$(".reveal");

  if (genericReveals.length) {
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("active");
              entry.target.classList.add("isIn");
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12 }
      );

      genericReveals.forEach((el) => io.observe(el));
    } else {
      genericReveals.forEach((el) => {
        el.classList.add("active");
        el.classList.add("isIn");
      });
    }
  }

  /* =========================================================
     FOOTER
     Newsletter form (simulado)
     Requer:
       <form id="newsletterForm">...</form>
       <p id="newsletterMsg" class="hidden">...</p>
  ========================================================= */
  const newsletterForm = document.getElementById("newsletterForm");
  const newsletterMsg = document.getElementById("newsletterMsg");

  if (newsletterForm && newsletterMsg) {
    newsletterForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const input = newsletterForm.querySelector('input[type="email"]');
      const btn = newsletterForm.querySelector("button");
      const email = input ? input.value.trim() : "";

      if (!email) return;

      if (btn) btn.disabled = true;

      await new Promise((r) => setTimeout(r, 600));

      newsletterMsg.classList.remove("hidden");
      newsletterForm.reset();

      setTimeout(() => newsletterMsg.classList.add("hidden"), 4500);

      if (btn) btn.disabled = false;

      console.log("Newsletter signup:", email);
    });
  }

  /* =========================================================
     Reusable MOBILE CAROUSEL DOTS (centered track)
     - Builds dots only under breakpoint
     - Tracks active card by viewport center
     - Scrolls to center on dot click
     - Can ignore cloned cards for infinite desktop tracks
  ========================================================= */
  function initCenteredCarouselDots({
    trackId,
    dotsId,
    cardSel,
    mqQuery = "(max-width: 900px)",
    dotClass = "dot",
    activeCls = "is-active",
    ariaLabelPrefix = "Go to item",
    ignoreSelector = "[data-clone='true']",
  }) {
    const track = document.getElementById(trackId);
    const dotsWrap = document.getElementById(dotsId);
    if (!track || !dotsWrap) return;

    const mq = window.matchMedia(mqQuery);
    let dots = [];
    let rafId = null;

    function getCards() {
      return Array.from(track.querySelectorAll(cardSel)).filter(
        (card) => !ignoreSelector || !card.matches(ignoreSelector)
      );
    }

    function scrollCardToCenter(card) {
      if (!card) return;
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const targetLeft = cardCenter - track.clientWidth / 2;
      track.scrollTo({ left: targetLeft, behavior: "smooth" });
    }

    function updateActiveDot() {
      if (!mq.matches || !dots.length) return;

      const cards = getCards();
      if (!cards.length) return;

      const viewportCenter = track.scrollLeft + track.clientWidth / 2;

      let activeIndex = 0;
      let minDist = Infinity;

      cards.forEach((card, i) => {
        const cardCenter = card.offsetLeft + card.offsetWidth / 2;
        const dist = Math.abs(cardCenter - viewportCenter);

        if (dist < minDist) {
          minDist = dist;
          activeIndex = i;
        }
      });

      dots.forEach((d, i) => d.classList.toggle(activeCls, i === activeIndex));
    }

    function buildDots() {
      dotsWrap.innerHTML = "";
      dots = [];

      const cards = getCards();
      if (!cards.length) return;

      cards.forEach((card, index) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = dotClass;
        btn.setAttribute("aria-label", `${ariaLabelPrefix} ${index + 1}`);

        btn.addEventListener("click", () => {
          scrollCardToCenter(card);
        });

        dotsWrap.appendChild(btn);
        dots.push(btn);
      });

      updateActiveDot();
    }

    function onTrackScroll() {
      if (!mq.matches) return;
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        updateActiveDot();
        rafId = null;
      });
    }

    function initOrReset() {
      if (mq.matches) {
        buildDots();
        requestAnimationFrame(() => {
          updateActiveDot();
        });
      } else {
        dotsWrap.innerHTML = "";
        dots = [];
      }
    }

    track.addEventListener("scroll", onTrackScroll, { passive: true });
    window.addEventListener("resize", initOrReset);
    window.addEventListener("DOMContentLoaded", initOrReset);

    if (mq.addEventListener) {
      mq.addEventListener("change", initOrReset);
    } else if (mq.addListener) {
      mq.addListener(initOrReset);
    }

    initOrReset();
  }

  /* =========================================================
     WORK TYPES
     - Desktop: infinite auto-loop
     - Mobile: keeps centered swipe + dots
  ========================================================= */
  function initInfiniteWorkTypesCarousel() {
    const rail = document.getElementById("workTypesRail");
    if (!rail) return;

    const mqDesktop = window.matchMedia("(min-width: 821px)");
    const reduceMotion =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let originalCards = [];
    let cloneNodes = [];
    let rafId = null;
    let paused = false;
    let currentX = 0;
    let oneSetWidth = 0;
    let lastTs = 0;

    const SPEED_PX_PER_SEC = 38;

    function getOriginalCards() {
      return Array.from(rail.querySelectorAll(".workTypeCard")).filter(
        (card) => card.dataset.clone !== "true"
      );
    }

    function cleanupClones() {
      cloneNodes.forEach((node) => node.remove());
      cloneNodes = [];
      rail.style.transform = "";
      currentX = 0;
      oneSetWidth = 0;
      lastTs = 0;
    }

    function measureOneSetWidth() {
      const cards = getOriginalCards();
      if (!cards.length) return 0;

      const firstLeft = cards[0].offsetLeft;
      const last = cards[cards.length - 1];
      const lastRight = last.offsetLeft + last.offsetWidth;

      return Math.max(0, lastRight - firstLeft);
    }

    function buildDesktopLoop() {
      cleanupClones();

      originalCards = getOriginalCards();
      if (!originalCards.length) return;

      const frag = document.createDocumentFragment();

      originalCards.forEach((card) => {
        const clone = card.cloneNode(true);
        clone.dataset.clone = "true";
        clone.setAttribute("aria-hidden", "true");
        clone.tabIndex = -1;

        clone.querySelectorAll("[id]").forEach((el) => el.removeAttribute("id"));
        clone.querySelectorAll("a, button, input, select, textarea").forEach((el) => {
          el.tabIndex = -1;
        });

        frag.appendChild(clone);
        cloneNodes.push(clone);
      });

      rail.appendChild(frag);
      oneSetWidth = measureOneSetWidth();
      rail.style.transform = "translate3d(0px,0,0)";
      currentX = 0;
      lastTs = 0;
    }

    function stopLoop() {
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      rail.style.transform = "";
    }

    function tick(ts) {
      if (!mqDesktop.matches || reduceMotion) {
        stopLoop();
        return;
      }

      if (!oneSetWidth) {
        oneSetWidth = measureOneSetWidth();
        if (!oneSetWidth) {
          rafId = requestAnimationFrame(tick);
          return;
        }
      }

      if (!lastTs) lastTs = ts;
      const dt = (ts - lastTs) / 1000;
      lastTs = ts;

      if (!paused) {
        currentX -= SPEED_PX_PER_SEC * dt;

        if (Math.abs(currentX) >= oneSetWidth) {
          currentX += oneSetWidth;
        }

        rail.style.transform = `translate3d(${currentX}px,0,0)`;
      }

      rafId = requestAnimationFrame(tick);
    }

    function startLoop() {
      if (!mqDesktop.matches || reduceMotion) {
        stopLoop();
        cleanupClones();
        return;
      }

      buildDesktopLoop();

      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(tick);
    }

    function handleModeChange() {
      paused = false;

      if (mqDesktop.matches && !reduceMotion) {
        startLoop();
      } else {
        stopLoop();
        cleanupClones();
      }
    }

    rail.addEventListener("mouseenter", () => {
      if (!mqDesktop.matches) return;
      paused = true;
    });

    rail.addEventListener("mouseleave", () => {
      if (!mqDesktop.matches) return;
      lastTs = 0;
      paused = false;
    });

    rail.addEventListener("focusin", () => {
      if (!mqDesktop.matches) return;
      paused = true;
    });

    rail.addEventListener("focusout", () => {
      if (!mqDesktop.matches) return;
      lastTs = 0;
      paused = false;
    });

    window.addEventListener("resize", handleModeChange);

    if (mqDesktop.addEventListener) {
      mqDesktop.addEventListener("change", handleModeChange);
    } else if (mqDesktop.addListener) {
      mqDesktop.addListener(handleModeChange);
    }

    window.addEventListener("DOMContentLoaded", handleModeChange);
    handleModeChange();
  }

  initInfiniteWorkTypesCarousel();

  /* WORK TYPES dots */
  (function initWorkTypesDots() {
    const rail = document.getElementById("workTypesRail");
    const dotsWrap = document.getElementById("workTypesDots");
    if (!rail || !dotsWrap) return;

    initCenteredCarouselDots({
      trackId: "workTypesRail",
      dotsId: "workTypesDots",
      cardSel: ".workTypeCard",
      mqQuery: "(max-width: 820px)",
      dotClass: "dot",
      activeCls: "is-active",
      ariaLabelPrefix: "Go to work type",
      ignoreSelector: "[data-clone='true']",
    });
  })();

  /* PHOTO GALLERY dots */
  (function initPhotoGalleryDots() {
    const track = document.getElementById("photoGalleryTrack");
    const dotsWrap = document.getElementById("photoGalleryDots");
    if (!track || !dotsWrap) return;

    initCenteredCarouselDots({
      trackId: "photoGalleryTrack",
      dotsId: "photoGalleryDots",
      cardSel: ".photoCard",
      mqQuery: "(max-width: 900px)",
      dotClass: "galleryDot",
      activeCls: "is-active",
      ariaLabelPrefix: "Go to photo",
      ignoreSelector: null,
    });
  })();

  /* =========================================================
     LIGHTBOX — Click photo to open
     Fix: close should work for ALL [data-lb-close] (overlay + X)
  ========================================================= */
  function initLightbox() {
    const lightbox = document.getElementById("lightbox");
    const imgEl = document.getElementById("lightboxImg");
    const capEl = document.getElementById("lightboxCaption");
    const countEl = document.getElementById("lightboxCount");

    if (!lightbox || !imgEl || !capEl || !countEl) return;

    const btnPrev = lightbox.querySelector("[data-lb-prev]");
    const btnNext = lightbox.querySelector("[data-lb-next]");
    const closeEls = Array.from(lightbox.querySelectorAll("[data-lb-close]"));
    const dialog = lightbox.querySelector(".lightbox__dialog");

    const track = document.getElementById("photoGalleryTrack");
    if (!track) return;

    const items = Array.from(track.querySelectorAll(".photoCard"))
      .map((card) => {
        const image = card.querySelector("img");
        const caption = card.querySelector("figcaption");
        return {
          card,
          src: image ? image.getAttribute("src") : "",
          alt: image ? image.getAttribute("alt") : "",
          caption: caption ? caption.textContent.trim() : "",
        };
      })
      .filter((x) => x.src);

    if (!items.length) return;

    let isOpen = false;
    let activeIndex = 0;
    let lastFocused = null;

    function lockBody(lock) {
      body.style.overflow = lock ? "hidden" : "";
    }

    function render(index) {
      activeIndex = Math.max(0, Math.min(index, items.length - 1));
      const it = items[activeIndex];

      imgEl.src = it.src;
      imgEl.alt = it.alt || "Gallery photo";
      capEl.textContent = it.caption || "";
      countEl.textContent = `${activeIndex + 1} / ${items.length}`;

      if (btnPrev) btnPrev.disabled = activeIndex === 0;
      if (btnNext) btnNext.disabled = activeIndex === items.length - 1;
    }

    function open(index) {
      if (isOpen) return;
      isOpen = true;

      lastFocused = document.activeElement;
      lightbox.classList.add("is-open");
      lightbox.setAttribute("aria-hidden", "false");
      lockBody(true);

      render(index);

      const closeBtn = lightbox.querySelector(".lightbox__close");
      closeBtn?.focus?.();
    }

    function close() {
      if (!isOpen) return;
      isOpen = false;

      lightbox.classList.remove("is-open");
      lightbox.setAttribute("aria-hidden", "true");
      lockBody(false);

      imgEl.src = "";

      if (lastFocused && typeof lastFocused.focus === "function") {
        lastFocused.focus();
      }
    }

    function next() {
      if (activeIndex >= items.length - 1) return;
      render(activeIndex + 1);
    }

    function prev() {
      if (activeIndex <= 0) return;
      render(activeIndex - 1);
    }

    Array.from(track.querySelectorAll(".photoCard")).forEach((card, idx) => {
      card.addEventListener("click", (e) => {
        const target = e.target;
        if (target && target.closest && target.closest("a, button")) return;
        open(idx);
      });
    });

    if (btnNext) btnNext.addEventListener("click", next);
    if (btnPrev) btnPrev.addEventListener("click", prev);

    closeEls.forEach((el) => el.addEventListener("click", close));

    window.addEventListener("keydown", (e) => {
      if (!isOpen) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    });

    let startX = 0;
    let startY = 0;
    let tracking = false;

    const DEADZONE = 12;
    const SWIPE_THRESHOLD = 50;
    const VERTICAL_DOMINANCE = 1.25;

    function onPointerDown(e) {
      if (!isOpen) return;
      tracking = true;
      startX = e.clientX;
      startY = e.clientY;
    }

    function onPointerUp(e) {
      if (!isOpen || !tracking) return;
      tracking = false;

      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      if (Math.abs(dx) < DEADZONE) return;
      if (Math.abs(dy) > Math.abs(dx) * VERTICAL_DOMINANCE) return;

      if (dx <= -SWIPE_THRESHOLD) next();
      else if (dx >= SWIPE_THRESHOLD) prev();
    }

    if (dialog) {
      dialog.style.touchAction = "pan-y";
      dialog.addEventListener("pointerdown", onPointerDown, { passive: true });
      dialog.addEventListener("pointerup", onPointerUp, { passive: true });
      dialog.addEventListener(
        "pointercancel",
        () => {
          tracking = false;
        },
        { passive: true }
      );
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initLightbox);
  } else {
    initLightbox();
  }
})();