/* =========================================================
   services.js
   SERVICES LIST PAGE — Mobile Carousel (DOTS)
   Replica do mecanismo da HOME:
     - Rail com scroll-snap center
     - Dots que sincronizam com o card central
   Requer:
     #servicesRail (na .servicesGrid)
     #servicesDots
     cards: .serviceCard
   Funciona só em <= 620px (igual seu CSS)
========================================================= */
(function () {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const rail = $("#servicesRail");
  const dotsWrap = $("#servicesDots");
  if (!rail || !dotsWrap) return;

  const mq = window.matchMedia("(max-width: 620px)");

  const getCards = () => $$(".serviceCard", rail);

  const buildDots = () => {
    const cards = getCards();

    // sem cards -> limpa
    if (!cards.length) {
      dotsWrap.innerHTML = "";
      return;
    }

    // desktop -> remove dots
    if (!mq.matches) {
      dotsWrap.innerHTML = "";
      return;
    }

    dotsWrap.innerHTML = cards
      .map(
        (_, i) =>
          `<button type="button" class="dot ${i === 0 ? "is-active" : ""}" data-i="${i}" aria-label="Go to service ${i + 1}"></button>`
      )
      .join("");
  };

  const getDots = () => $$(".dot", dotsWrap);

  // scroll alinhando ao CENTER (porque seu CSS usa scroll-snap-align: center)
  const scrollToIndexCentered = (i) => {
    const cards = getCards();
    const card = cards[i];
    if (!card) return;

    const railW = rail.clientWidth;
    const cardCenter = card.offsetLeft + card.offsetWidth / 2;
    const targetLeft = Math.max(0, cardCenter - railW / 2);

    rail.scrollTo({ left: targetLeft, behavior: "smooth" });
  };

  const syncActiveDot = () => {
    const dots = getDots();
    if (!dots.length) return 0;

    const cards = getCards();
    if (!cards.length) return 0;

    const railW = rail.clientWidth;
    const center = rail.scrollLeft + railW / 2;

    let bestI = 0;
    let bestD = Infinity;

    cards.forEach((c, i) => {
      const cCenter = c.offsetLeft + c.offsetWidth / 2;
      const d = Math.abs(cCenter - center);
      if (d < bestD) {
        bestD = d;
        bestI = i;
      }
    });

    dots.forEach((d, i) => d.classList.toggle("is-active", i === bestI));
    return bestI;
  };

  const onDotsClick = (e) => {
    const dot = e.target.closest(".dot");
    if (!dot) return;
    scrollToIndexCentered(Number(dot.dataset.i));
  };

  let rafScrolling = false;
  const onRailScroll = () => {
    if (!mq.matches) return;
    if (rafScrolling) return;
    rafScrolling = true;
    window.requestAnimationFrame(() => {
      syncActiveDot();
      rafScrolling = false;
    });
  };

  const reInit = () => {
    buildDots();
    syncActiveDot();
  };

  // init
  reInit();

  // listeners
  dotsWrap.addEventListener("click", onDotsClick);
  rail.addEventListener("scroll", onRailScroll, { passive: true });

  // breakpoint change
  if (mq.addEventListener) {
    mq.addEventListener("change", reInit);
  } else {
    mq.addListener(reInit);
  }

  // resize no mobile recalcula
  window.addEventListener("resize", () => {
    if (!mq.matches) return;
    syncActiveDot();
  });
})();
/* =========================================================
   PROCESS SECTION — Interactive Steps + Detail Panel + BG Fade
   + MOBILE SLIDER (CENTER CARD + 2 DOT ROWS + SWIPE ANYWHERE)
   (AJUSTADO: imagem agora vem de href="" nos .processCard)
========================================================= */
(() => {
  /* -------------------------
     1) DOM / References
  ------------------------- */
  const section = document.querySelector('#process.process');
  if (!section) return;

  const track = section.querySelector('.processGrid');
  const cards = Array.from(section.querySelectorAll('.processCard'));
  const inner = section.querySelector('#processDetail');
  if (!track || !inner || cards.length === 0) return;

  const tplByStep = {
    protect: section.querySelector('#tpl-protect'),
    prep: section.querySelector('#tpl-prep'),
    paint: section.querySelector('#tpl-paint'),
    clean: section.querySelector('#tpl-clean'),
  };

  /* -------------------------
     2) State
  ------------------------- */
  let activeStep = null;
  let isAnimating = false;
  let pendingStep = null;

  // BG crossfade state
  let bgOnB = section.classList.contains('is-bg-b');

  // Mobile slider state
  let activeIndex = 0;
  let startX = 0;
  let startTranslate = 0;
  let currentTranslate = 0;

  // Swipe/click guard (evita click fantasma após swipe)
  let suppressClicksUntil = 0;

  /* -------------------------
     2.1) Media helpers
  ------------------------- */
  function isMobile() {
    return window.matchMedia('(max-width: 560px)').matches;
  }
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  // Melhora gesto touch horizontal/vertical no mobile
  section.style.touchAction = 'pan-y';

  /* -------------------------
     3) Helpers (Cards)
  ------------------------- */
  function setActiveCard(step) {
    cards.forEach((c) => {
      const isActive = c.dataset.step === step;
      c.classList.toggle('is-active', isActive);
      c.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
  }

  function indexFromStep(step) {
    const i = cards.findIndex(c => c.dataset.step === step);
    return i >= 0 ? i : 0;
  }

  // ✅ AJUSTE: pega imagem do href (com fallback para data-bg, se existir)
  function getCardBg(card) {
    if (!card) return '';
    return (
      card.getAttribute('href') ||
      card.getAttribute('data-bg') ||
      card.dataset?.bg ||
      ''
    );
  }

  /* -------------------------
     4) Helpers (Detail Render)
  ------------------------- */
  function renderStep(step) {
    const tpl = tplByStep[step];
    if (!tpl) return;
    inner.replaceChildren(tpl.content.cloneNode(true));
  }

  /* -------------------------
     5) Helpers (BG Crossfade)
  ------------------------- */
  function setBgCrossfade(url) {
    if (!url) return;

    if (bgOnB) {
      section.style.setProperty('--process-bg', `url('${url}')`);
      section.classList.remove('is-bg-b');
      bgOnB = false;
    } else {
      section.style.setProperty('--process-bg-2', `url('${url}')`);
      section.classList.add('is-bg-b');
      bgOnB = true;
    }
  }

  /* -------------------------
     6) Main Transition (Animate)
  ------------------------- */
  function animateTo(step, bgUrl) {
    if (!step || step === activeStep) return;

    if (isAnimating) {
      pendingStep = { step, bgUrl };
      return;
    }

    isAnimating = true;
    pendingStep = null;

    setActiveCard(step);
    if (bgUrl) setBgCrossfade(bgUrl);

    inner.classList.add('is-exiting');

    window.setTimeout(() => {
      renderStep(step);

      inner.classList.remove('is-exiting');
      inner.classList.add('is-entering');

      void inner.offsetWidth;

      inner.classList.remove('is-entering');

      activeStep = step;
      isAnimating = false;

      if (pendingStep) {
        const next = pendingStep;
        pendingStep = null;
        animateTo(next.step, next.bgUrl);
      }
    }, 180);
  }

  // ✅ AJUSTE: usa href
  function activateFromCard(card) {
    const step = card?.dataset?.step;
    const bg = getCardBg(card);
    animateTo(step, bg);
  }

  /* -------------------------
     7) Desktop / Card Listeners
  ------------------------- */
  cards.forEach((card) => {
    if (canHover) {
      card.addEventListener('pointerenter', () => activateFromCard(card));
    }

    card.addEventListener('click', (e) => {
      // Evita click fantasma disparado após swipe no mobile
      if (Date.now() < suppressClicksUntil) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }

      activateFromCard(card);
      if (isMobile()) {
        const idx = cards.indexOf(card);
        goToIndex(idx, true);
      }
    });

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        activateFromCard(card);
        if (isMobile()) {
          const idx = cards.indexOf(card);
          goToIndex(idx, true);
        }
      }
    });
  });

  /* -------------------------
     8) Mobile UI (Dots x2 + Hint)
  ------------------------- */
  let dotsWrapTop = null;
  let dotsWrapBottom = null;
  let dotsTop = [];
  let dotsBottom = [];
  let hintEl = null;

  function buildDots(container, onClick) {
    container.innerHTML = '';
    return cards.map((_, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'processDot';
      b.setAttribute('aria-label', `Go to step ${i + 1}`);
      b.addEventListener('click', () => onClick(i));
      container.appendChild(b);
      return b;
    });
  }

  function ensureMobileUI() {
    const shell = section.querySelector('.processShell');
    const detail = section.querySelector('.processDetail');
    if (!shell || !detail) return;

    if (!dotsWrapTop) {
      dotsWrapTop = document.createElement('div');
      dotsWrapTop.className = 'processDots';
      track.insertAdjacentElement('afterend', dotsWrapTop);

      dotsTop = buildDots(dotsWrapTop, (i) => {
        goToIndex(i, true);
        activateFromCard(cards[i]);
      });
    }

    if (!dotsWrapBottom) {
      dotsWrapBottom = document.createElement('div');
      dotsWrapBottom.className = 'processDots';
      shell.appendChild(dotsWrapBottom);

      dotsBottom = buildDots(dotsWrapBottom, (i) => {
        goToIndex(i, true);
        activateFromCard(cards[i]);
      });
    }

    if (!hintEl) {
      hintEl = document.createElement('p');
      hintEl.className = 'processSwipeHint';
      hintEl.textContent = 'Swipe left / right to see the next step';
      shell.appendChild(hintEl);
    }
  }

  function updateDots() {
    if (dotsTop.length) dotsTop.forEach((d, i) => d.classList.toggle('is-active', i === activeIndex));
    if (dotsBottom.length) dotsBottom.forEach((d, i) => d.classList.toggle('is-active', i === activeIndex));
  }

  function syncActiveFromScroll() {
    if (!isMobile()) return;

    const railW = track.clientWidth;
    const center = track.scrollLeft + (railW / 2);

    let bestI = 0;
    let bestD = Infinity;

    cards.forEach((c, i) => {
      const cCenter = c.offsetLeft + (c.offsetWidth / 2);
      const d = Math.abs(cCenter - center);
      if (d < bestD) {
        bestD = d;
        bestI = i;
      }
    });

    if (bestI !== activeIndex) {
      activeIndex = bestI;
      activateFromCard(cards[bestI]); // sincroniza painel + bg + card ativo
    }

    updateDots();
  }

  /* -------------------------
     9) Mobile Slider Math
  ------------------------- */
  function cardStepPx() {
    const card = cards[0];
    if (!card) return 0;

    const cardW = card.getBoundingClientRect().width;
    const style = window.getComputedStyle(track);
    const gap = parseFloat(style.columnGap || style.gap || '0') || 0;

    return cardW + gap;
  }

  function setTranslate(px, withTransition) {
    currentTranslate = px;
  }

  function goToIndex(idx, withTransition) {
    const clamped = Math.max(0, Math.min(cards.length - 1, idx));
    activeIndex = clamped;

    const card = cards[activeIndex];
    if (!card) return;

    const railW = track.clientWidth;
    const cardCenter = card.offsetLeft + (card.offsetWidth / 2);
    const maxScroll = Math.max(0, track.scrollWidth - railW);
    const targetLeft = Math.max(0, Math.min(cardCenter - (railW / 2), maxScroll));

    track.scrollTo({
      left: targetLeft,
      behavior: withTransition ? 'smooth' : 'auto'
    });

    currentTranslate = -targetLeft;
    updateDots();
  }

  /* -------------------------
     10) Swipe Anywhere (mobile)
  ------------------------- */
  let tracking = false;
  let dragged = false;
  let startY = 0;
  let gestureStartIndex = 0;

  function resetSwipeState() {
    tracking = false;
    dragged = false;
  }

  function isInteractiveTarget(el) {
    if (!el) return false;
    return !!el.closest('button, a, input, textarea, select, label');
  }

  function onPointerDown(e) {
    if (!isMobile()) return;
    if (isInteractiveTarget(e.target)) return;

    tracking = true;
    dragged = false;

    startX = e.clientX;
    startY = e.clientY;
    startTranslate = currentTranslate;
    gestureStartIndex = activeIndex;
  }

  function onPointerMove(e) {
    if (!isMobile() || !tracking) return;

    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    const DEADZONE = 10;
    const VERTICAL_DOMINANCE = 1.35;

    if (!dragged) {
      if (Math.abs(dx) < DEADZONE) return;

      if (Math.abs(dy) > Math.abs(dx) * VERTICAL_DOMINANCE) {
        resetSwipeState();
        return;
      }

      dragged = true;
    }
  }

  function onPointerUp(e) {
    if (!isMobile()) {
      resetSwipeState();
      return;
    }

    if (!tracking) return;

    const wasDragging = dragged;
    const dx = e.clientX - startX;

    resetSwipeState();

    if (!wasDragging) return;

    suppressClicksUntil = Date.now() + 400;

    const threshold = 45;
    let targetIndex = gestureStartIndex;

    if (dx >= threshold) {
      targetIndex = Math.max(gestureStartIndex - 1, 0);
    } else if (dx <= -threshold) {
      targetIndex = Math.min(gestureStartIndex + 1, cards.length - 1);
    } else {
      targetIndex = gestureStartIndex;
    }

    goToIndex(targetIndex, true);
    activateFromCard(cards[targetIndex]);
  }

  section.addEventListener('pointerdown', onPointerDown, { passive: true });
  section.addEventListener('pointermove', onPointerMove, { passive: true });
  window.addEventListener('pointerup', onPointerUp, { passive: true });
  window.addEventListener('pointercancel', onPointerUp, { passive: true });

  let processScrollRaf = false;
  track.addEventListener('scroll', () => {
    if (!isMobile()) return;
    if (processScrollRaf) return;

    processScrollRaf = true;
    requestAnimationFrame(() => {
      syncActiveFromScroll();
      processScrollRaf = false;
    });
  }, { passive: true });

  /* -------------------------
     11) Init
  ------------------------- */
  const initial =
    cards.find((c) => c.classList.contains('is-active')) ||
    cards.find((c) => c.dataset.step === 'prep') ||
    cards[0];

  if (initial) {
    activeStep = initial.dataset.step;
    setActiveCard(activeStep);

    // ✅ AJUSTE: imagem inicial também vem do href
    const initBg = getCardBg(initial);
    if (initBg) {
      section.style.setProperty('--process-bg', `url('${initBg}')`);
      section.style.setProperty('--process-bg-2', `url('${initBg}')`);
      section.classList.remove('is-bg-b');
      bgOnB = false;
    }

    renderStep(activeStep);

    activeIndex = indexFromStep(activeStep);
    currentTranslate = 0;

    if (isMobile()) {
      ensureMobileUI();
      goToIndex(activeIndex, false);
    }
  }

  window.addEventListener('resize', () => {
    if (isMobile()) {
      ensureMobileUI();
      goToIndex(activeIndex, false);
    }
  });
})();
/* =========================================================
   PAINT GUIDE — Desktop hover + Mobile carousel (scroll-snap + dots)
   - Desktop: mantém grid/hover
   - Mobile: mesmo modelo do Services (card centralizado + dots)
   - Sheen: carousel mobile com dots
========================================================= */
(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const mqPaintMobile = window.matchMedia("(max-width: 820px)");

  /* ---------------------------------------------------------
     1) PAINT SURFACE (Recommended Paint by Surface)
  --------------------------------------------------------- */
  const surfaceRail = document.getElementById("paintSurfaceRail");
  const surfaceDotsWrap = document.getElementById("paintSurfaceDots");

  const titleEl = document.getElementById("surfaceReasonTitle");
  const recoEl = document.getElementById("surfaceReasonReco");
  const textEl = document.getElementById("surfaceReasonText");
  const reasonBox = document.getElementById("surfaceReason");

  if (surfaceRail && surfaceDotsWrap && titleEl && recoEl && textEl && reasonBox) {
    const cards = $$(".surfaceCard", surfaceRail);
    let activeIndex = 0;

    const mod = (n, m) => ((n % m) + m) % m;

    const setReason = (index) => {
      const c = cards[index];
      if (!c) return;

      titleEl.textContent = c.dataset.title || "";
      recoEl.textContent = c.dataset.reco || "";
      textEl.textContent = c.dataset.why || "";

      reasonBox.classList.remove("is-highlight");
      void reasonBox.offsetWidth;
      reasonBox.classList.add("is-highlight");
    };

    const setDesktopActiveClasses = (index) => {
      cards.forEach((c, i) => {
        c.classList.toggle("is-active", i === index);
        c.setAttribute("aria-selected", i === index ? "true" : "false");
      });
    };

    const buildSurfaceDots = () => {
      if (!cards.length || !mqPaintMobile.matches) {
        surfaceDotsWrap.innerHTML = "";
        return;
      }

      surfaceDotsWrap.innerHTML = cards
        .map(
          (_, i) =>
            `<button type="button" class="dot ${i === activeIndex ? "is-active" : ""}" data-i="${i}" aria-label="Go to surface ${i + 1}"></button>`
        )
        .join("");
    };

    const getSurfaceDots = () => $$(".dot", surfaceDotsWrap);

    const scrollSurfaceToIndexCentered = (i, behavior = "smooth") => {
      const card = cards[i];
      if (!card) return;

      const railW = surfaceRail.clientWidth;
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const targetLeft = Math.max(0, cardCenter - railW / 2);

      surfaceRail.scrollTo({ left: targetLeft, behavior });
    };

    const syncSurfaceFromScroll = () => {
      if (!mqPaintMobile.matches) return;

      const railW = surfaceRail.clientWidth;
      const center = surfaceRail.scrollLeft + railW / 2;

      let bestI = 0;
      let bestD = Infinity;

      cards.forEach((c, i) => {
        const cCenter = c.offsetLeft + c.offsetWidth / 2;
        const d = Math.abs(cCenter - center);
        if (d < bestD) {
          bestD = d;
          bestI = i;
        }
      });

      activeIndex = bestI;

      // mobile: só um card ativo visualmente
      cards.forEach((c, i) => c.classList.toggle("is-active", i === activeIndex));

      // dots
      getSurfaceDots().forEach((d, i) => d.classList.toggle("is-active", i === activeIndex));

      // painel de texto
      setReason(activeIndex);
    };

    const setSurfaceActive = (index, opts = {}) => {
      activeIndex = mod(index, cards.length);

      setReason(activeIndex);

      if (mqPaintMobile.matches) {
        cards.forEach((c, i) => c.classList.toggle("is-active", i === activeIndex));
        getSurfaceDots().forEach((d, i) => d.classList.toggle("is-active", i === activeIndex));

        if (!opts.skipScroll) {
          scrollSurfaceToIndexCentered(activeIndex, opts.behavior || "smooth");
        }
      } else {
        setDesktopActiveClasses(activeIndex);
      }
    };

    /* Desktop hover (mantido) */
    cards.forEach((card, i) => {
      card.addEventListener("mouseenter", () => {
        if (!mqPaintMobile.matches) {
          setSurfaceActive(i, { skipScroll: true });
        }
      });

      card.addEventListener("click", () => {
        // desktop: clique também atualiza
        if (!mqPaintMobile.matches) {
          setSurfaceActive(i, { skipScroll: true });
        }
      });

      card.addEventListener("keydown", (e) => {
        if (e.key !== "Enter" && e.key !== " ") return;
        e.preventDefault();
        setSurfaceActive(i, { skipScroll: mqPaintMobile.matches ? false : true });
      });
    });

    /* Dots click (mobile) */
    surfaceDotsWrap.addEventListener("click", (e) => {
      const dot = e.target.closest(".dot");
      if (!dot) return;
      setSurfaceActive(Number(dot.dataset.i));
    });

    /* Scroll sync (mobile) */
    let rafSurface = false;
    surfaceRail.addEventListener("scroll", () => {
      if (!mqPaintMobile.matches) return;
      if (rafSurface) return;
      rafSurface = true;
      requestAnimationFrame(() => {
        syncSurfaceFromScroll();
        rafSurface = false;
      });
    }, { passive: true });

    /* Reinit */
    const reinitSurface = () => {
      buildSurfaceDots();

      if (mqPaintMobile.matches) {
        // garante centralização no mobile
        setSurfaceActive(activeIndex, { behavior: "auto" });
      } else {
        setDesktopActiveClasses(activeIndex);
        setReason(activeIndex);
      }
    };

    // init
    setSurfaceActive(0, { skipScroll: true });
    reinitSurface();

    if (mqPaintMobile.addEventListener) {
      mqPaintMobile.addEventListener("change", reinitSurface);
    } else {
      mqPaintMobile.addListener(reinitSurface);
    }

    window.addEventListener("resize", () => {
      if (!mqPaintMobile.matches) return;
      syncSurfaceFromScroll();
    });
  }

  /* ---------------------------------------------------------
     2) SHEEN / FINISH LEVELS (mobile carousel + dots)
  --------------------------------------------------------- */
  const sheenRail = document.getElementById("sheenRail");
  const sheenDotsWrap = document.getElementById("sheenDots");

  if (sheenRail && sheenDotsWrap) {
    const items = $$(".sheenItem", sheenRail);

    const buildSheenDots = () => {
      if (!items.length || !mqPaintMobile.matches) {
        sheenDotsWrap.innerHTML = "";
        return;
      }

      sheenDotsWrap.innerHTML = items
        .map(
          (_, i) =>
            `<button type="button" class="dot ${i === 0 ? "is-active" : ""}" data-i="${i}" aria-label="Go to finish level ${i + 1}"></button>`
        )
        .join("");
    };

    const getSheenDots = () => $$(".dot", sheenDotsWrap);

    const scrollSheenToIndexCentered = (i) => {
      const item = items[i];
      if (!item) return;

      const railW = sheenRail.clientWidth;
      const itemCenter = item.offsetLeft + item.offsetWidth / 2;
      const targetLeft = Math.max(0, itemCenter - railW / 2);

      sheenRail.scrollTo({ left: targetLeft, behavior: "smooth" });
    };

    const syncSheenDot = () => {
      const dots = getSheenDots();
      if (!dots.length || !mqPaintMobile.matches) return;

      const railW = sheenRail.clientWidth;
      const center = sheenRail.scrollLeft + railW / 2;

      let bestI = 0;
      let bestD = Infinity;

      items.forEach((item, i) => {
        const c = item.offsetLeft + item.offsetWidth / 2;
        const d = Math.abs(c - center);
        if (d < bestD) {
          bestD = d;
          bestI = i;
        }
      });

      dots.forEach((d, i) => d.classList.toggle("is-active", i === bestI));
    };

    sheenDotsWrap.addEventListener("click", (e) => {
      const dot = e.target.closest(".dot");
      if (!dot) return;
      scrollSheenToIndexCentered(Number(dot.dataset.i));
    });

    let rafSheen = false;
    sheenRail.addEventListener("scroll", () => {
      if (!mqPaintMobile.matches) return;
      if (rafSheen) return;
      rafSheen = true;
      requestAnimationFrame(() => {
        syncSheenDot();
        rafSheen = false;
      });
    }, { passive: true });

    const reinitSheen = () => {
      buildSheenDots();
      if (mqPaintMobile.matches) syncSheenDot();
    };

    // init
    reinitSheen();

    if (mqPaintMobile.addEventListener) {
      mqPaintMobile.addEventListener("change", reinitSheen);
    } else {
      mqPaintMobile.addListener(reinitSheen);
    }

    window.addEventListener("resize", () => {
      if (!mqPaintMobile.matches) return;
      syncSheenDot();
    });
  }
})();
/* =========================================================
   PARTNERS — Mobile Carousel (DOTS) + active card
   Requer:
   - #partnersRail
   - #partnersDots
   - cards: .partnerCard
========================================================= */
(() => {
  const partnersRail = document.getElementById("partnersRail");
  const partnersDotsWrap = document.getElementById("partnersDots");
  if (!partnersRail || !partnersDotsWrap) return;

  const mqPartners = window.matchMedia("(max-width: 820px)");
  const cards = Array.from(partnersRail.querySelectorAll(".partnerCard"));
  if (!cards.length) return;

  const buildDots = () => {
    if (!mqPartners.matches) {
      partnersDotsWrap.innerHTML = "";
      // desktop: remove active mobile state
      cards.forEach(c => c.classList.remove("is-active"));
      return;
    }

    partnersDotsWrap.innerHTML = cards
      .map(
        (_, i) =>
          `<button type="button" class="dot ${i === 0 ? "is-active" : ""}" data-i="${i}" aria-label="Go to partner ${i + 1}"></button>`
      )
      .join("");

    // primeiro ativo no mobile
    cards.forEach((c, i) => c.classList.toggle("is-active", i === 0));
  };

  const getDots = () => Array.from(partnersDotsWrap.querySelectorAll(".dot"));

  const scrollToIndexCentered = (i) => {
    const card = cards[i];
    if (!card) return;

    const railW = partnersRail.clientWidth;
    const cardCenter = card.offsetLeft + card.offsetWidth / 2;
    const targetLeft = Math.max(0, cardCenter - railW / 2);

    partnersRail.scrollTo({ left: targetLeft, behavior: "smooth" });
  };

  const syncActive = () => {
    if (!mqPartners.matches) return;

    const dots = getDots();
    if (!dots.length) return;

    const railW = partnersRail.clientWidth;
    const center = partnersRail.scrollLeft + railW / 2;

    let bestI = 0;
    let bestD = Infinity;

    cards.forEach((c, i) => {
      const cCenter = c.offsetLeft + c.offsetWidth / 2;
      const d = Math.abs(cCenter - center);
      if (d < bestD) {
        bestD = d;
        bestI = i;
      }
    });

    dots.forEach((d, i) => d.classList.toggle("is-active", i === bestI));
    cards.forEach((c, i) => c.classList.toggle("is-active", i === bestI));
  };

  partnersDotsWrap.addEventListener("click", (e) => {
    const dot = e.target.closest(".dot");
    if (!dot) return;
    scrollToIndexCentered(Number(dot.dataset.i));
  });

  let rafScrolling = false;
  partnersRail.addEventListener("scroll", () => {
    if (!mqPartners.matches) return;
    if (rafScrolling) return;
    rafScrolling = true;
    requestAnimationFrame(() => {
      syncActive();
      rafScrolling = false;
    });
  }, { passive: true });

  const reInit = () => {
    buildDots();
    if (mqPartners.matches) syncActive();
  };

  // init
  reInit();

  if (mqPartners.addEventListener) {
    mqPartners.addEventListener("change", reInit);
  } else {
    mqPartners.addListener(reInit);
  }

  window.addEventListener("resize", () => {
    if (!mqPartners.matches) return;
    syncActive();
  });
})();