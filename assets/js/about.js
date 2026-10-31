(() => {
  const body = document.body;
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // 1) Trigger paint animation on load (mantém seu efeito)
  window.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => body.classList.add("is-loaded"), 60);

    // ====== Footer year ======
    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  });

  // 2) Sticky navbar (Gemini): adiciona .isScrolled no #navbar
  const navbar = $("#navbar");
  const stickyThreshold = 50;

  const updateSticky = () => {
    if (!navbar) return;
    navbar.classList.toggle("isScrolled", window.scrollY > stickyThreshold);
  };

  updateSticky();
  window.addEventListener("scroll", updateSticky, { passive: true });

  // 3) Mobile menu (Gemini): #navToggle + #mobileMenu
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

    $$("[data-close]", mobileMenu).forEach((a) =>
      a.addEventListener("click", closeMobile)
    );

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMobile();
    });
  }

  // 4) Video rotation (AGORA: 3 tags A/B/C alternando .is-active)
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

      // ajuste aqui: tempo de troca
      const ROTATE_EVERY_MS = 10000;

      setInterval(() => {
        current = (current + 1) % videos.length;
        setActiveVideo(current);
      }, ROTATE_EVERY_MS);
    }
  }

  /* =========================================================
     5) Generic Reveal (.reveal -> .active)
     Necessário para sections como Service Areas aparecerem.

     Também seta .isIn junto para compatibilidade
     com o footer do Gemini, que usa .reveal.isIn no CSS.
  ========================================================= */
  const genericReveals = $$(".reveal");
  if (genericReveals.length) {
    if ("IntersectionObserver" in window) {
      const io2 = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add("active");
              e.target.classList.add("isIn"); // compat Gemini
              io2.unobserve(e.target); // anima 1x e para
            }
          });
        },
        { threshold: 0.12 }
      );

      genericReveals.forEach((el) => io2.observe(el));
    } else {
      genericReveals.forEach((el) => {
        el.classList.add("active");
        el.classList.add("isIn"); // compat Gemini
      });
    }
  }

  /* =========================================================
     6) Service Areas — Mobile Carousel (dots)
     Funciona quando existir:
       #service-areas, #areasRail, #areasDots, .areaCard
     (setas são opcionais; você removeu elas, então não depende mais)
  ========================================================= */
  const serviceAreas = $("#service-areas");
  const rail = $("#areasRail");
  const dotsWrap = $("#areasDots");

  // setas opcionais (se existirem no HTML, ainda funcionam)
  const prev = serviceAreas ? $(".areasNav--prev", serviceAreas) : null;
  const next = serviceAreas ? $(".areasNav--next", serviceAreas) : null;

  if (serviceAreas && rail && dotsWrap) {
    const cards = $$(".areaCard", rail);

    if (cards.length) {
      // Build dots
      dotsWrap.innerHTML = cards
        .map(
          (_, i) =>
            `<span class="dot ${i === 0 ? "is-active" : ""}" data-i="${i}"></span>`
        )
        .join("");

      const dots = $$(".dot", dotsWrap);

      const scrollToIndex = (i) => {
        const card = cards[i];
        if (!card) return;
        rail.scrollTo({ left: card.offsetLeft, behavior: "smooth" });
      };

      const syncActiveDot = () => {
        const left = rail.scrollLeft;

        let bestI = 0;
        let bestD = Infinity;

        cards.forEach((c, i) => {
          const d = Math.abs(c.offsetLeft - left);
          if (d < bestD) {
            bestD = d;
            bestI = i;
          }
        });

        dots.forEach((d, i) => d.classList.toggle("is-active", i === bestI));
        return bestI;
      };

      // setas (se existirem)
      if (prev) {
        prev.addEventListener("click", () => {
          const i = syncActiveDot();
          scrollToIndex(Math.max(0, i - 1));
        });
      }

      if (next) {
        next.addEventListener("click", () => {
          const i = syncActiveDot();
          scrollToIndex(Math.min(cards.length - 1, i + 1));
        });
      }

      // click nos dots
      dotsWrap.addEventListener("click", (e) => {
        const dot = e.target.closest(".dot");
        if (!dot) return;
        scrollToIndex(Number(dot.dataset.i));
      });

      rail.addEventListener(
        "scroll",
        () => window.requestAnimationFrame(syncActiveDot),
        { passive: true }
      );

      // Initial sync
      syncActiveDot();
    }
  }

  /* =========================================================
     6.1) SERVICES — Mobile Carousel (DOTS)
     Requer:
       #servicesRail (na .grid3) e #servicesDots
       cards: .card.card--service
     Funciona só no mobile porque seu CSS já vira carousel em <= 820px
  ========================================================= */
  const servicesRail = $("#servicesRail"); // você adicionou no HTML
  const servicesDotsWrap = $("#servicesDots");

  if (servicesRail && servicesDotsWrap) {
    const mqServices = window.matchMedia("(max-width: 820px)");
    const cards = $$(".card.card--service", servicesRail);

    const buildDots = () => {
      // se não tiver cards, limpa e sai
      if (!cards.length) {
        servicesDotsWrap.innerHTML = "";
        return;
      }

      // só mostra dots no mobile (no desktop some)
      if (!mqServices.matches) {
        servicesDotsWrap.innerHTML = "";
        return;
      }

      servicesDotsWrap.innerHTML = cards
        .map(
          (_, i) =>
            `<button type="button" class="dot ${i === 0 ? "is-active" : ""}" data-i="${i}" aria-label="Go to service ${i + 1}"></button>`
        )
        .join("");
    };

    const getDots = () => $$(".dot", servicesDotsWrap);

    // scroll alinhando ao CENTER (porque seu CSS usa scroll-snap-align: center)
    const scrollToIndexCentered = (i) => {
      const card = cards[i];
      if (!card) return;

      const railW = servicesRail.clientWidth;
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const targetLeft = Math.max(0, cardCenter - railW / 2);

      servicesRail.scrollTo({ left: targetLeft, behavior: "smooth" });
    };

    const syncActiveDot = () => {
      const dots = getDots();
      if (!dots.length) return 0;

      const railW = servicesRail.clientWidth;
      const center = servicesRail.scrollLeft + railW / 2;

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
      if (!mqServices.matches) return;
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
    servicesDotsWrap.addEventListener("click", onDotsClick);
    servicesRail.addEventListener("scroll", onRailScroll, { passive: true });

    // muda quando entra/sai do breakpoint
    if (mqServices.addEventListener) {
      mqServices.addEventListener("change", reInit);
    } else {
      mqServices.addListener(reInit);
    }

    // se resize no mobile recalcular ativo
    window.addEventListener("resize", () => {
      if (!mqServices.matches) return;
      syncActiveDot();
    });
  }

  /* =========================================================
   6.2) REVIEWS — Mobile Carousel (DOTS)
   Requer:
     #reviewsRail (na .reviewsGrid) e #reviewsDots
     cards: .testimonial
========================================================= */
const reviewsRail = document.getElementById("reviewsRail");
const reviewsDotsWrap = document.getElementById("reviewsDots");

if (reviewsRail && reviewsDotsWrap) {
  const mqReviews = window.matchMedia("(max-width: 820px)");
  const cards = Array.from(reviewsRail.querySelectorAll(".testimonial"));

  const buildDots = () => {
    if (!cards.length) {
      reviewsDotsWrap.innerHTML = "";
      return;
    }

    // só no mobile (no desktop some)
    if (!mqReviews.matches) {
      reviewsDotsWrap.innerHTML = "";
      return;
    }

    reviewsDotsWrap.innerHTML = cards
      .map(
        (_, i) =>
          `<button type="button" class="dot ${i === 0 ? "is-active" : ""}" data-i="${i}" aria-label="Go to review ${i + 1}"></button>`
      )
      .join("");
  };

  const getDots = () => Array.from(reviewsDotsWrap.querySelectorAll(".dot"));

  // alinhando ao CENTER (porque seu CSS usa scroll-snap-align: center)
  const scrollToIndexCentered = (i) => {
    const card = cards[i];
    if (!card) return;

    const railW = reviewsRail.clientWidth;
    const cardCenter = card.offsetLeft + card.offsetWidth / 2;
    const targetLeft = Math.max(0, cardCenter - railW / 2);

    reviewsRail.scrollTo({ left: targetLeft, behavior: "smooth" });
  };

  const syncActiveDot = () => {
    const dots = getDots();
    if (!dots.length) return 0;

    const railW = reviewsRail.clientWidth;
    const center = reviewsRail.scrollLeft + railW / 2;

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
    if (!mqReviews.matches) return;
    if (rafScrolling) return;
    rafScrolling = true;
    requestAnimationFrame(() => {
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
  reviewsDotsWrap.addEventListener("click", onDotsClick);
  reviewsRail.addEventListener("scroll", onRailScroll, { passive: true });

  // breakpoint changes
  if (mqReviews.addEventListener) {
    mqReviews.addEventListener("change", reInit);
  } else {
    mqReviews.addListener(reInit);
  }

  // resize no mobile recalcular ativo
  window.addEventListener("resize", () => {
    if (!mqReviews.matches) return;
    syncActiveDot();
  });
}
/* =========================================================
   BLOG — Mobile Carousel (DOTS)
   Requer:
     #blogRail e #blogDots
     cards: .post
========================================================= */
const blogRail = document.getElementById("blogRail");
const blogDotsWrap = document.getElementById("blogDots");

if (blogRail && blogDotsWrap) {
  const mqBlog = window.matchMedia("(max-width: 980px)");
  const cards = Array.from(blogRail.querySelectorAll(".post"));

  const buildDots = () => {
    if (!cards.length) {
      blogDotsWrap.innerHTML = "";
      return;
    }

    if (!mqBlog.matches) {
      blogDotsWrap.innerHTML = "";
      return;
    }

    blogDotsWrap.innerHTML = cards
      .map(
        (_, i) =>
          `<button type="button" class="dot ${i === 0 ? "is-active" : ""}" data-i="${i}" aria-label="Go to post ${i + 1}"></button>`
      )
      .join("");
  };

  const getDots = () => Array.from(blogDotsWrap.querySelectorAll(".dot"));

  // seu snap é "start", então rola alinhando ao início
  const scrollToIndexStart = (i) => {
    const card = cards[i];
    if (!card) return;
    blogRail.scrollTo({ left: card.offsetLeft, behavior: "smooth" });
  };

  const syncActiveDot = () => {
    const dots = getDots();
    if (!dots.length) return 0;

    const left = blogRail.scrollLeft;

    let bestI = 0;
    let bestD = Infinity;

    cards.forEach((c, i) => {
      const d = Math.abs(c.offsetLeft - left);
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
    scrollToIndexStart(Number(dot.dataset.i));
  };

  let rafScrolling = false;
  const onRailScroll = () => {
    if (!mqBlog.matches) return;
    if (rafScrolling) return;
    rafScrolling = true;
    requestAnimationFrame(() => {
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
  blogDotsWrap.addEventListener("click", onDotsClick);
  blogRail.addEventListener("scroll", onRailScroll, { passive: true });

  if (mqBlog.addEventListener) {
    mqBlog.addEventListener("change", reInit);
  } else {
    mqBlog.addListener(reInit);
  }

  window.addEventListener("resize", () => {
    if (!mqBlog.matches) return;
    syncActiveDot();
  });
}
/* =========================================================
   TRUST BAR — Mobile Carousel (DOTS) ✅ (viewport scroll)
   Requer:
     #trustbarRail (inner) e #trustDots
     scroller: .lps-trustbar__viewport
     cards: .lps-trustcard
========================================================= */
const trustInner = document.getElementById("trustbarRail");
const trustDotsWrap = document.getElementById("trustDots");

// o elemento que realmente faz scroll no seu CSS é o viewport
const trustScroller =
  trustInner?.closest(".lps-trustbar")?.querySelector(".lps-trustbar__viewport") ||
  document.querySelector(".lps-trustbar__viewport");

if (trustInner && trustDotsWrap && trustScroller) {
  const mqTrust = window.matchMedia("(max-width: 720px)");
  const cards = Array.from(trustInner.querySelectorAll(".lps-trustcard"));

  const buildDots = () => {
    if (!cards.length) {
      trustDotsWrap.innerHTML = "";
      return;
    }

    // só no mobile
    if (!mqTrust.matches) {
      trustDotsWrap.innerHTML = "";
      return;
    }

    trustDotsWrap.innerHTML = cards
      .map(
        (_, i) =>
          `<button type="button" class="dot ${i === 0 ? "is-active" : ""}" data-i="${i}" aria-label="Go to badge ${i + 1}"></button>`
      )
      .join("");
  };

  const getDots = () => Array.from(trustDotsWrap.querySelectorAll(".dot"));

  // scroll alinhando ao CENTER (seu CSS usa scroll-snap-align: center)
  const scrollToIndexCentered = (i) => {
    const card = cards[i];
    if (!card) return;

    const scrollerW = trustScroller.clientWidth;
    const cardCenter = card.offsetLeft + card.offsetWidth / 2;
    const targetLeft = Math.max(0, cardCenter - scrollerW / 2);

    trustScroller.scrollTo({ left: targetLeft, behavior: "smooth" });
  };

  const syncActiveDot = () => {
    const dots = getDots();
    if (!dots.length) return 0;

    const scrollerW = trustScroller.clientWidth;
    const center = trustScroller.scrollLeft + scrollerW / 2;

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

  trustDotsWrap.addEventListener("click", (e) => {
    const dot = e.target.closest(".dot");
    if (!dot) return;
    scrollToIndexCentered(Number(dot.dataset.i));
  });

  let rafScrolling = false;
  trustScroller.addEventListener(
    "scroll",
    () => {
      if (!mqTrust.matches) return;
      if (rafScrolling) return;
      rafScrolling = true;
      requestAnimationFrame(() => {
        syncActiveDot();
        rafScrolling = false;
      });
    },
    { passive: true }
  );

  const reInit = () => {
    buildDots();
    syncActiveDot();
  };

  // init
  reInit();

  // breakpoint changes
  if (mqTrust.addEventListener) mqTrust.addEventListener("change", reInit);
  else mqTrust.addListener(reInit);

  window.addEventListener("resize", () => {
    if (!mqTrust.matches) return;
    syncActiveDot();
  });
}

  /* =========================================================
     7) FAQ (Gemini) — Accordion + ARIA + ícone +/− + maxHeight dinâmico
     Requer o HTML com:
       .faqItem, .faqQ (button), .faqA, .faqIcon
  ========================================================= */
  const faqItems = $$(".faqItem");

  if (faqItems.length) {
    const setFaqState = (item, open) => {
      const btn = $(".faqQ", item);
      const ans = $(".faqA", item);
      const icon = $(".faqIcon", item);
      if (!btn || !ans) return;

      btn.setAttribute("aria-expanded", open ? "true" : "false");
      ans.classList.toggle("open", open);

      // ícone
      if (icon) icon.textContent = open ? "−" : "+";

      // max-height dinâmico (melhor do que 240px fixo)
      if (open) {
        ans.style.maxHeight = ans.scrollHeight + "px";
      } else {
        ans.style.maxHeight = "0px";
      }
    };

    const closeAllFaq = (exceptItem = null) => {
      faqItems.forEach((it) => {
        if (exceptItem && it === exceptItem) return;
        setFaqState(it, false);
      });
    };

    // Init (respeita o markup inicial aria-expanded/open)
    faqItems.forEach((item) => {
      const btn = $(".faqQ", item);
      const ans = $(".faqA", item);
      if (!btn || !ans) return;

      const initialOpen =
        btn.getAttribute("aria-expanded") === "true" ||
        ans.classList.contains("open");

      setFaqState(item, initialOpen);
    });

    // Click handlers
    faqItems.forEach((item) => {
      const btn = $(".faqQ", item);
      if (!btn) return;

      btn.addEventListener("click", () => {
        const isOpen = btn.getAttribute("aria-expanded") === "true";
        closeAllFaq(item);
        setFaqState(item, !isOpen);
      });
    });

    // Recalcula alturas no resize (se tiver um aberto)
    window.addEventListener(
      "resize",
      () => {
        faqItems.forEach((item) => {
          const btn = $(".faqQ", item);
          const ans = $(".faqA", item);
          if (!btn || !ans) return;
          const open = btn.getAttribute("aria-expanded") === "true";
          if (open) ans.style.maxHeight = ans.scrollHeight + "px";
        });
      },
      { passive: true }
    );
  }

  /* =========================================================
     8) Newsletter do footer Gemini
     Requer:
       <form id="newsletterForm" class="newsletter">...</form>
       <p id="newsletterMsg" class="muted small hidden">...</p>
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

      // Simula envio (troque por fetch() quando conectar backend)
      await new Promise((r) => setTimeout(r, 600));

      newsletterMsg.classList.remove("hidden");
      newsletterForm.reset();

      setTimeout(() => newsletterMsg.classList.add("hidden"), 4500);

      if (btn) btn.disabled = false;

      console.log("Newsletter signup:", email);
    });
  }

  /* =========================================================
     9) Quote form (Formspree) — AJAX submit + Success card
     Requer:
       form#quoteForm
       div#quoteSuccess.hidden
  ========================================================= */
  const quoteForm = document.getElementById("quoteForm");
  const quoteSuccess = document.getElementById("quoteSuccess");

  if (quoteForm) {
    const submitBtn =
      quoteForm.querySelector('button[type="submit"]') ||
      quoteForm.querySelector(".btn");

    quoteForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const action = quoteForm.getAttribute("action");
      if (!action) {
        console.warn("quoteForm missing action URL.");
        return;
      }

      // UI: loading/disable
      if (submitBtn) submitBtn.disabled = true;

      try {
        const formData = new FormData(quoteForm);

        const res = await fetch(action, {
          method: "POST",
          body: formData,
          headers: {
            Accept: "application/json",
          },
        });

        if (res.ok) {
          // Hide form, show success card
          quoteForm.classList.add("hidden");
          if (quoteSuccess) quoteSuccess.classList.remove("hidden");
          quoteForm.reset();
        } else {
          // Try to read error
          let data = null;
          try {
            data = await res.json();
          } catch (_) {}

          const msg =
            (data && (data.error || data.message)) ||
            "Sorry — something went wrong. Please try again or call us.";

          alert(msg);
        }
      } catch (err) {
        console.error("Quote submit error:", err);
        alert("Network error. Please try again or call us.");
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }
})();

/* =========================================================
   (REMOVIDO) LUPA QUOTE — bloco antigo .lpsQuoteForm/.lps-reveal
   Motivo: não existe no seu HTML atual e era código morto.
========================================================= */
