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
    // Dispara animações globais (seu CSS usa body.is-loaded)
    setTimeout(() => body.classList.add("is-loaded"), 60);

    // Footer year automático
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

    // Fecha ao clicar em links/botões com data-close dentro do menu mobile
    $$("[data-close]", mobileMenu).forEach((el) =>
      el.addEventListener("click", closeMobile)
    );

    // Fecha com ESC
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
    // Se usuário preferir menos movimento / economia de dados
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

      // Tempo de troca dos vídeos
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
              entry.target.classList.add("isIn"); // compat footer CSS
              io.unobserve(entry.target); // anima 1x
            }
          });
        },
        { threshold: 0.12 }
      );

      genericReveals.forEach((el) => io.observe(el));
    } else {
      // Fallback browsers antigos
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

      // Simulação de envio (trocar por fetch() quando conectar backend)
      await new Promise((r) => setTimeout(r, 600));

      newsletterMsg.classList.remove("hidden");
      newsletterForm.reset();

      setTimeout(() => newsletterMsg.classList.add("hidden"), 4500);

      if (btn) btn.disabled = false;

      console.log("Newsletter signup:", email);
    });
  }

  /* =========================================================
     SERVICE INTRO — Mobile Carousel (DOTS)
     Requer:
       #serviceIntroRail e #serviceIntroDots
       cards: .serviceCard
     Funciona só no mobile (<= 820px)
  ========================================================= */
  const serviceIntroRail = $("#serviceIntroRail");
  const serviceIntroDotsWrap = $("#serviceIntroDots");

  if (serviceIntroRail && serviceIntroDotsWrap) {
    const mqServiceIntro = window.matchMedia("(max-width: 820px)");
    const serviceCards = $$(".serviceCard", serviceIntroRail);

    const buildServiceDots = () => {
      if (!serviceCards.length) {
        serviceIntroDotsWrap.innerHTML = "";
        return;
      }

      if (!mqServiceIntro.matches) {
        serviceIntroDotsWrap.innerHTML = "";
        return;
      }

      serviceIntroDotsWrap.innerHTML = serviceCards
        .map(
          (_, i) =>
            `<button type="button" class="dot ${i === 0 ? "is-active" : ""}" data-i="${i}" aria-label="Go to service card ${i + 1}"></button>`
        )
        .join("");
    };

    const getServiceDots = () => $$(".dot", serviceIntroDotsWrap);

    const scrollServiceToIndexCentered = (i) => {
      const card = serviceCards[i];
      if (!card) return;

      const railW = serviceIntroRail.clientWidth;
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const maxScroll = Math.max(0, serviceIntroRail.scrollWidth - railW);
      const targetLeft = Math.max(0, Math.min(cardCenter - railW / 2, maxScroll));

      serviceIntroRail.scrollTo({ left: targetLeft, behavior: "smooth" });
    };

    const syncServiceActiveDot = () => {
      const dots = getServiceDots();
      if (!dots.length) return 0;

      const railW = serviceIntroRail.clientWidth;
      const center = serviceIntroRail.scrollLeft + railW / 2;

      let bestI = 0;
      let bestD = Infinity;

      serviceCards.forEach((c, i) => {
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

    const onServiceDotsClick = (e) => {
      const target = e.target;
      if (!(target instanceof Element)) return;

      const dot = target.closest(".dot");
      if (!dot) return;

      scrollServiceToIndexCentered(Number(dot.dataset.i));
    };

    let rafServiceScrolling = false;
    const onServiceRailScroll = () => {
      if (!mqServiceIntro.matches) return;
      if (rafServiceScrolling) return;
      rafServiceScrolling = true;

      window.requestAnimationFrame(() => {
        syncServiceActiveDot();
        rafServiceScrolling = false;
      });
    };

    const reInitServiceIntro = () => {
      buildServiceDots();
      syncServiceActiveDot();
    };

    // init
    reInitServiceIntro();

    // listeners
    serviceIntroDotsWrap.addEventListener("click", onServiceDotsClick);
    serviceIntroRail.addEventListener("scroll", onServiceRailScroll, { passive: true });

    if (mqServiceIntro.addEventListener) {
      mqServiceIntro.addEventListener("change", reInitServiceIntro);
    } else {
      mqServiceIntro.addListener(reInitServiceIntro);
    }

    window.addEventListener("resize", () => {
      if (!mqServiceIntro.matches) return;
      syncServiceActiveDot();
    });
  }

  /* =========================================================
     SERVICE PROCESS — Interactive left steps + right details
     (robust init + hover fallback + mobile dots + mobile swipe via pointer)
  ========================================================= */
  function initServiceProcess() {
    const section = document.querySelector("#serviceProcess");
    if (!section) return;

    const stepsRail = section.querySelector("#serviceSteps");
    const steps = Array.from(section.querySelectorAll(".processStep"));
    const detailInner = section.querySelector("#serviceProcessDetail");
    const dotsWrap = section.querySelector("#serviceStepsDots");

    if (!stepsRail || !steps.length || !detailInner) {
      console.warn("Service process: missing required elements", {
        stepsRail,
        stepsCount: steps.length,
        detailInner
      });
      return;
    }

    // Evita inicializar duas vezes na mesma section
    if (section.dataset.serviceProcessReady === "1") return;
    section.dataset.serviceProcessReady = "1";

    const mqMobile = window.matchMedia("(max-width: 820px)");
    const canHoverQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    const canHover = !!canHoverQuery.matches;

    // mesmo padrão estável: deixa a section rolar vertical e o rail cuidar do horizontal
    section.style.touchAction = "pan-y";
    stepsRail.style.touchAction = "pan-x";

    // Busca templates dentro da section; fallback no document
    const getTpl = (id) => section.querySelector(id) || document.querySelector(id);

    const tplByStep = {
      inspect: getTpl("#tpl-step-inspect"),
      protect: getTpl("#tpl-step-protect"),
      repair: getTpl("#tpl-step-repair"),
      measure: getTpl("#tpl-step-measure"),
      install: getTpl("#tpl-step-install"),
      finishprep: getTpl("#tpl-step-finishprep"),
      final: getTpl("#tpl-step-final")
    };

    let activeStep = null; // selecionado por click/mobile
    let hoverStep = null; // preview temporário no desktop
    let isAnimating = false;
    let pending = null;

    // swipe/click guard (evita click fantasma após swipe)
    let suppressClicksUntil = 0;

    /* -------------------------
       Helpers
    ------------------------- */
    function setSelectedVisual(stepKey) {
      steps.forEach((el) => {
        const isSelected = el.dataset.step === stepKey;
        el.classList.toggle("is-active", isSelected);
        el.setAttribute("aria-selected", isSelected ? "true" : "false");
      });
    }

    function renderTemplate(stepKey) {
      const tpl = tplByStep[stepKey];

      if (!tpl || tpl.tagName !== "TEMPLATE") {
        detailInner.innerHTML = `
          <div class="processDetailCard">
            <p class="processDetailCard__kicker">Template error</p>
            <h3 class="processDetailCard__title">Missing template for: ${stepKey}</h3>
            <p class="processDetailCard__lead muted">
              Check if the template ID exists and is a &lt;template&gt; element.
            </p>
          </div>
        `;
        return;
      }

      detailInner.innerHTML = "";
      detailInner.appendChild(tpl.content.cloneNode(true));
    }

    function getDots() {
      return dotsWrap ? Array.from(dotsWrap.querySelectorAll(".dot")) : [];
    }

    function updateActiveDot() {
      const dots = getDots();
      if (!dots.length) return;

      const activeIndex = Math.max(
        0,
        steps.findIndex((s) => s.dataset.step === activeStep)
      );

      dots.forEach((d, i) => d.classList.toggle("is-active", i === activeIndex));
    }

    function animatePanelTo(stepKey, options = {}) {
      const { commitActive = false } = options;
      if (!stepKey) return;

      const currentlyShown = hoverStep || activeStep;
      if (stepKey === currentlyShown && !commitActive) return;

      if (isAnimating) {
        pending = { stepKey, commitActive };
        return;
      }

      isAnimating = true;
      pending = null;

      if (commitActive) {
        activeStep = stepKey;
        hoverStep = null;
        setSelectedVisual(activeStep);
        updateActiveDot();
      }

      detailInner.classList.add("is-exiting");

      window.setTimeout(() => {
        renderTemplate(stepKey);

        detailInner.classList.remove("is-exiting");
        detailInner.classList.add("is-entering");

        void detailInner.offsetWidth; // força reflow
        detailInner.classList.remove("is-entering");

        if (!commitActive && !mqMobile.matches) {
          hoverStep = stepKey;
        }

        isAnimating = false;

        if (pending) {
          const next = pending;
          pending = null;
          animatePanelTo(next.stepKey, { commitActive: next.commitActive });
        }
      }, 140);
    }

    function scrollStepToCenter(index, smooth = true) {
      const stepEl = steps[index];
      if (!stepEl) return;

      const railW = stepsRail.clientWidth;
      const stepCenter = stepEl.offsetLeft + stepEl.offsetWidth / 2;
      const maxScroll = Math.max(0, stepsRail.scrollWidth - railW);
      const target = Math.max(0, Math.min(stepCenter - railW / 2, maxScroll));

      stepsRail.scrollTo({
        left: target,
        behavior: smooth ? "smooth" : "auto"
      });
    }

    function activateStep(stepEl, commit = false) {
      if (!stepEl) return;
      const stepKey = stepEl.dataset.step;
      animatePanelTo(stepKey, { commitActive: commit });

      if (mqMobile.matches) {
        const idx = steps.indexOf(stepEl);
        scrollStepToCenter(idx, true);
      }
    }

    // ✅ igual ao sistema que funcionou: scroll só sincroniza estado/painel (sem recentralizar)
    function setActiveFromScroll(stepEl) {
      if (!stepEl) return;

      const stepKey = stepEl.dataset.step;
      if (!stepKey) return;

      if (stepKey === activeStep) {
        updateActiveDot();
        return;
      }

      activeStep = stepKey;
      hoverStep = null;

      setSelectedVisual(activeStep);
      updateActiveDot();

      // Atualiza painel sem chamar scrollStepToCenter
      animatePanelTo(stepKey, { commitActive: false });
    }

    /* -------------------------
       Mobile swipe anywhere (pointer events)
       (funciona em celular real + DevTools)
    ------------------------- */
    function isInteractiveTarget(el) {
      if (!el) return false;
      return !!el.closest("button, a, input, textarea, select, label");
    }

    let swipeTracking = false;
    let swipeDragged = false;
    let swipeStartX = 0;
    let swipeStartY = 0;
    let gestureStartStep = null;

    function resetSwipeState() {
      swipeTracking = false;
      swipeDragged = false;
      swipeStartX = 0;
      swipeStartY = 0;
      gestureStartStep = null;
    }

    function onSwipePointerDown(e) {
      if (!mqMobile.matches) return;
      if (isInteractiveTarget(e.target)) return;

      swipeTracking = true;
      swipeDragged = false;
      swipeStartX = e.clientX;
      swipeStartY = e.clientY;
      gestureStartStep = activeStep;
    }

    function onSwipePointerMove(e) {
      if (!mqMobile.matches) return;
      if (!swipeTracking) return;

      const dx = e.clientX - swipeStartX;
      const dy = e.clientY - swipeStartY;

      const DEADZONE = 10;
      const VERTICAL_DOMINANCE = 1.35;

      if (!swipeDragged) {
        if (Math.abs(dx) < DEADZONE) return;

        // gesto vertical: cancela swipe e deixa a página rolar
        if (Math.abs(dy) > Math.abs(dx) * VERTICAL_DOMINANCE) {
          resetSwipeState();
          return;
        }

        swipeDragged = true;
      }
    }

    function onSwipePointerUp(e) {
      if (!mqMobile.matches) {
        resetSwipeState();
        return;
      }

      if (!swipeTracking) return;

      const wasDragging = swipeDragged;
      const dx = e.clientX - swipeStartX;
      const startStep = gestureStartStep;

      resetSwipeState();

      // tap normal (sem swipe)
      if (!wasDragging) return;

      // Bloqueia click fantasma logo após swipe
      suppressClicksUntil = Date.now() + 400;

      const startIndex = Math.max(
        0,
        steps.findIndex((s) => s.dataset.step === startStep)
      );

      const threshold = 45;
      let targetIndex = startIndex;

      // Mesmo comportamento do bloco que funcionou:
      // arrastar para a direita = VOLTA
      // arrastar para a esquerda = AVANÇA
      if (dx >= threshold) {
        targetIndex = Math.max(startIndex - 1, 0);
      } else if (dx <= -threshold) {
        targetIndex = Math.min(startIndex + 1, steps.length - 1);
      } else {
        targetIndex = startIndex;
      }

      activateStep(steps[targetIndex], true);
    }

    // Swipe na seção inteira
    section.addEventListener("pointerdown", onSwipePointerDown, { passive: true });
    section.addEventListener("pointermove", onSwipePointerMove, { passive: true });
    window.addEventListener("pointerup", onSwipePointerUp, { passive: true });
    window.addEventListener("pointercancel", onSwipePointerUp, { passive: true });

    /* -------------------------
       Desktop behavior
    ------------------------- */
    steps.forEach((stepEl) => {
      const onHoverPreview = () => {
        if (mqMobile.matches) return;
        activateStep(stepEl, false);
      };

      if (canHover) {
        stepEl.addEventListener("pointerenter", onHoverPreview);
        stepEl.addEventListener("mouseenter", onHoverPreview);
      }

      stepEl.addEventListener("click", (e) => {
        // Evita click fantasma após swipe no mobile
        if (Date.now() < suppressClicksUntil) {
          e.preventDefault();
          e.stopPropagation();
          return;
        }

        activateStep(stepEl, true);
      });

      stepEl.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          activateStep(stepEl, true);
        }
      });
    });

    if (canHover) {
      const onLeaveRail = () => {
        if (mqMobile.matches) return;
        hoverStep = null;
        if (activeStep) animatePanelTo(activeStep, { commitActive: false });
      };

      stepsRail.addEventListener("pointerleave", onLeaveRail);
      stepsRail.addEventListener("mouseleave", onLeaveRail);
    }

    /* -------------------------
       Mobile dots
    ------------------------- */
    function buildDots() {
      if (!dotsWrap) return;

      if (!mqMobile.matches) {
        dotsWrap.innerHTML = "";
        return;
      }

      dotsWrap.innerHTML = steps
        .map((_, i) => {
          const activeClass = i === 0 ? " is-active" : "";
          return `<button type="button" class="dot${activeClass}" data-i="${i}" aria-label="Go to service step ${i + 1}"></button>`;
        })
        .join("");

      updateActiveDot();
    }

    if (dotsWrap) {
      dotsWrap.addEventListener("click", (e) => {
        const target = e.target;
        if (!(target instanceof Element)) return;

        const dot = target.closest(".dot");
        if (!dot) return;

        const idx = Number(dot.dataset.i);
        const stepEl = steps[idx];
        if (!stepEl) return;

        activateStep(stepEl, true);
      });
    }

    // Scroll mobile sincroniza step ativo (sem chamar activateStep para não "voltar")
    let rafScroll = false;
    stepsRail.addEventListener(
      "scroll",
      () => {
        if (!mqMobile.matches) return;
        if (rafScroll) return;

        rafScroll = true;
        requestAnimationFrame(() => {
          const railW = stepsRail.clientWidth;
          const center = stepsRail.scrollLeft + railW / 2;

          let bestIndex = 0;
          let bestDist = Infinity;

          steps.forEach((el, i) => {
            const elCenter = el.offsetLeft + el.offsetWidth / 2;
            const dist = Math.abs(elCenter - center);
            if (dist < bestDist) {
              bestDist = dist;
              bestIndex = i;
            }
          });

          const centeredStep = steps[bestIndex];
          if (centeredStep) {
            setActiveFromScroll(centeredStep);
          } else {
            updateActiveDot();
          }

          rafScroll = false;
        });
      },
      { passive: true }
    );

    /* -------------------------
       Init
    ------------------------- */
    const initialStepEl =
      steps.find((s) => s.classList.contains("is-active")) || steps[0];

    if (!initialStepEl) return;

    activeStep = initialStepEl.dataset.step;
    hoverStep = null;

    setSelectedVisual(activeStep);
    renderTemplate(activeStep);

    function reInit() {
      buildDots();

      if (mqMobile.matches) {
        const idx = Math.max(
          0,
          steps.findIndex((s) => s.dataset.step === activeStep)
        );
        scrollStepToCenter(idx, false);
        updateActiveDot();
      }
    }

    reInit();

    if (mqMobile.addEventListener) {
      mqMobile.addEventListener("change", reInit);
    } else if (mqMobile.addListener) {
      mqMobile.addListener(reInit);
    }

    window.addEventListener("resize", () => {
      if (!mqMobile.matches) return;
      updateActiveDot();
    });

    console.log("Service process initialized:", {
      activeStep,
      templates: Object.fromEntries(
        Object.entries(tplByStep).map(([k, v]) => [k, !!v])
      )
    });
  }

  /* init robusto (funciona com defer ou sem defer) */
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initServiceProcess);
  } else {
    initServiceProcess();
  }
})();

/* =========================================================
   SERVICE GALLERY (Mobile carousel dots - centered track)
========================================================= */
(() => {
  const track = document.getElementById("serviceGalleryTrack");
  const dotsWrap = document.getElementById("serviceGalleryDots");
  if (!track || !dotsWrap) return;

  const mq = window.matchMedia("(max-width: 900px)");
  let dots = [];
  let rafId = null;

  function getCards() {
    return Array.from(track.querySelectorAll(".galleryCard"));
  }

  function scrollCardToCenter(card) {
    const cardCenter = card.offsetLeft + (card.offsetWidth / 2);
    const targetLeft = cardCenter - (track.clientWidth / 2);
    track.scrollTo({ left: targetLeft, behavior: "smooth" });
  }

  function buildDots() {
    dotsWrap.innerHTML = "";
    dots = [];

    const cards = getCards();
    cards.forEach((card, index) => {
      const btn = document.createElement("button");
      btn.className = "galleryDot";
      btn.type = "button";
      btn.setAttribute("aria-label", `Go to photo ${index + 1}`);

      btn.addEventListener("click", () => {
        scrollCardToCenter(card);
      });

      dotsWrap.appendChild(btn);
      dots.push(btn);
    });

    updateActiveDot();
  }

  function updateActiveDot() {
    if (!mq.matches || !dots.length) return;

    const cards = getCards();
    const viewportCenter = track.scrollLeft + (track.clientWidth / 2);

    let activeIndex = 0;
    let minDist = Infinity;

    cards.forEach((card, i) => {
      const cardCenter = card.offsetLeft + (card.offsetWidth / 2);
      const dist = Math.abs(cardCenter - viewportCenter);

      if (dist < minDist) {
        minDist = dist;
        activeIndex = i;
      }
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle("is-active", i === activeIndex);
    });
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

      // garante estado correto após layout/reflow (spacers ::before/::after)
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

  // Se o breakpoint mudar (ex.: rotate tablet / resize)
  if (mq.addEventListener) {
    mq.addEventListener("change", initOrReset);
  } else if (mq.addListener) {
    mq.addListener(initOrReset);
  }

  // in case script loads after DOMContentLoaded
  initOrReset();
})();
/* =========================================================
   SERVICE GALLERY LIGHTBOX
========================================================= */
(() => {
  const lightbox = document.getElementById("lightbox");
  const imgEl = document.getElementById("lightboxImg");
  const capEl = document.getElementById("lightboxCaption");
  const countEl = document.getElementById("lightboxCount");

  if (!lightbox || !imgEl || !capEl || !countEl) return;

  const btnPrev = lightbox.querySelector("[data-lb-prev]");
  const btnNext = lightbox.querySelector("[data-lb-next]");
  const closeEls = Array.from(lightbox.querySelectorAll("[data-lb-close]"));
  const dialog = lightbox.querySelector(".lightbox__dialog");

  const track = document.getElementById("serviceGalleryTrack");
  if (!track) return;

  const cards = Array.from(track.querySelectorAll(".galleryCard"));

  const items = cards
    .map((card) => {
      const image = card.querySelector("img");
      const caption = card.querySelector("figcaption");
      return {
        card,
        src: image ? image.getAttribute("src") : "",
        alt: image ? image.getAttribute("alt") : "",
        caption: caption ? caption.textContent.trim() : ""
      };
    })
    .filter((x) => x.src);

  if (!items.length) return;

  let isOpen = false;
  let activeIndex = 0;
  let lastFocused = null;

  function lockBody(lock) {
    document.body.style.overflow = lock ? "hidden" : "";
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

  cards.forEach((card, idx) => {
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
    dialog.addEventListener("pointercancel", () => { tracking = false; }, { passive: true });
  }
})();