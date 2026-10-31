(() => {
  const body = document.body;
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  /* =========================================================
     1) LOAD / YEAR
  ========================================================= */
  window.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => body.classList.add("is-loaded"), 60);

    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  });

  /* =========================================================
     2) STICKY NAVBAR
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
     3) MOBILE MENU
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

    $$("[data-close]", mobileMenu).forEach((a) =>
      a.addEventListener("click", closeMobile)
    );

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMobile();
    });
  }

  /* =========================================================
     4) HERO VIDEO ROTATION
     - compatível com:
       A) #heroVideoA / #heroVideoB / #heroVideoC
       B) qualquer .hero-video dentro de #pageHero
  ========================================================= */
  const vA = $("#heroVideoA");
  const vB = $("#heroVideoB");
  const vC = $("#heroVideoC");

  let videos = [vA, vB, vC].filter(Boolean);
  if (!videos.length) {
    videos = $$("#pageHero .hero-video");
  }

  const prefersReduced =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const saveData = navigator.connection && navigator.connection.saveData;

  const safePlay = (video) => {
    if (!video) return;
    try {
      const playPromise = video.play?.();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(() => {});
      }
    } catch (_) {}
  };

  const setActiveVideo = (idx) => {
    videos.forEach((v, i) => {
      const isActive = i === idx;
      v.classList.toggle("is-active", isActive);

      if (isActive) safePlay(v);
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
  } else if (videos.length) {
    videos.forEach((v) => {
      try {
        v.muted = true;
        v.defaultMuted = true;
        v.setAttribute("muted", "");
        v.setAttribute("playsinline", "");
        v.setAttribute("autoplay", "");
        v.setAttribute("loop", "");
      } catch (_) {}
    });

    if (videos.length === 1) {
      videos[0].classList.add("is-active");
      safePlay(videos[0]);
    } else {
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
     5) GENERIC REVEAL (.reveal -> .active + .isIn)
  ========================================================= */
  const genericReveals = $$(".reveal");

  if (genericReveals.length) {
    if ("IntersectionObserver" in window) {
      const io2 = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add("active");
              e.target.classList.add("isIn");
              io2.unobserve(e.target);
            }
          });
        },
        { threshold: 0.12 }
      );

      genericReveals.forEach((el) => io2.observe(el));
    } else {
      genericReveals.forEach((el) => {
        el.classList.add("active");
        el.classList.add("isIn");
      });
    }
  }

  /* =========================================================
     6) REVIEWS DATA HELPERS
  ========================================================= */
  const parseNum = (value, fallback = 0) => {
    if (value == null) return fallback;
    const cleaned = String(value).replace(/[^\d.]/g, "");
    const n = parseFloat(cleaned);
    return Number.isFinite(n) ? n : fallback;
  };

  const reviewCards = $$(".reviewCard");

  const getCardData = (card) => ({
    el: card,
    rating: Number(card.dataset.rating || 0),
    service: (card.dataset.service || "all").toLowerCase(),
    city: (card.dataset.city || "").toLowerCase(),
    topics: (card.dataset.topics || "").toLowerCase(),
    text: (card.textContent || "").toLowerCase(),
    dateText:
      $("time.reviewCard__date", card)?.getAttribute("datetime") ||
      $("time.reviewCard__date", card)?.textContent ||
      "",
  });

  const parseDateValue = (dateText) => {
    const time = Date.parse(dateText);
    return Number.isFinite(time) ? time : 0;
  };

  /* =========================================================
     7) REVIEW SUMMARY / COUNTERS
  ========================================================= */
  const ratingTargets = $$("[data-google-rating], [data-google-rating-large]");
  const countTargets = $$(
    "[data-google-review-count], [data-google-review-count-inline]"
  );
  const visibleTargets = $$("[data-results-visible]");
  const totalTargets = $$("[data-results-total]");
  const reviewSummaryTarget = $("[data-review-summary]");
  const featuredTextTarget = $("[data-featured-review-text]");
  const featuredAuthorTarget = $("[data-featured-review-author]");
  const featuredServiceTarget = $("[data-featured-review-service]");

  const updateReviewTotals = () => {
    const total = reviewCards.length;
    const visible = reviewCards.filter(
      (card) => !card.hasAttribute("hidden") && card.style.display !== "none"
    ).length;

    totalTargets.forEach((el) => {
      el.textContent = String(total);
    });

    visibleTargets.forEach((el) => {
      el.textContent = String(visible);
    });

    if (reviewCards.length) {
      const ratings = reviewCards.map((card) => Number(card.dataset.rating || 0));
      const avg = ratings.reduce((sum, n) => sum + n, 0) / ratings.length;
      const rounded = Math.round(avg * 10) / 10;

      ratingTargets.forEach((el) => {
        el.textContent = rounded.toFixed(1);
      });

      countTargets.forEach((el) => {
        el.textContent = String(total);
      });
    }
  };

  const updateReviewSummaryMentions = () => {
    if (!reviewSummaryTarget || !reviewCards.length) return;

    const bucket = new Map();

    reviewCards.forEach((card) => {
      const topics = (card.dataset.topics || "")
        .split(/\s+/)
        .map((t) => t.trim())
        .filter(Boolean);

      topics.forEach((topic) => {
        bucket.set(topic, (bucket.get(topic) || 0) + 1);
      });
    });

    const top = [...bucket.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([key]) =>
        key
          .replace(/-/g, " ")
          .replace(/\b\w/g, (m) => m.toUpperCase())
      );

    if (top.length) {
      reviewSummaryTarget.textContent = top.join(" • ");
    }
  };

  const updateFeaturedReview = () => {
    if (
      !featuredTextTarget ||
      !featuredAuthorTarget ||
      !featuredServiceTarget ||
      !reviewCards.length
    ) {
      return;
    }

    const best = reviewCards
      .map((card) => ({
        card,
        rating: Number(card.dataset.rating || 0),
        dateValue: parseDateValue(
          $("time.reviewCard__date", card)?.getAttribute("datetime") ||
            $("time.reviewCard__date", card)?.textContent ||
            ""
        ),
      }))
      .sort((a, b) => {
        if (b.rating !== a.rating) return b.rating - a.rating;
        return b.dateValue - a.dateValue;
      })[0];

    if (!best?.card) return;

    const text = $(".reviewCard__text", best.card)?.textContent?.trim() || "";
    const name =
      $(".reviewCard__name", best.card)?.textContent?.trim() || "Customer";
    const service =
      $(".reviewCard__meta", best.card)?.textContent?.split("•")[1]?.trim() ||
      "Painting Project";

    if (text) featuredTextTarget.textContent = `“${text}”`;
    featuredAuthorTarget.textContent = name;
    featuredServiceTarget.textContent = service;
  };

  updateReviewTotals();
  updateReviewSummaryMentions();
  updateFeaturedReview();

  /* =========================================================
     8) REVIEWS FILTER / SEARCH / SORT / LOAD MORE
     Requer:
       #reviewSearch
       #reviewSort
       #reviewService
       #reviewRating
       .filterChip
       #loadMoreReviews
       #reviewsEmptyState
  ========================================================= */
  const reviewSearch = $("#reviewSearch");
  const reviewSort = $("#reviewSort");
  const reviewService = $("#reviewService");
  const reviewRating = $("#reviewRating");
  const filterChips = $$(".filterChip");
  const loadMoreBtn = $("#loadMoreReviews");
  const reviewsEmptyState = $("#reviewsEmptyState");
  const reviewsGrid = $("#reviewsGrid");

  const INITIAL_VISIBLE = 6;
  const LOAD_MORE_STEP = 6;

  let activeTopic = "all";
  let visibleLimit = INITIAL_VISIBLE;

  const setEmptyState = (isEmpty) => {
    if (!reviewsEmptyState) return;
    reviewsEmptyState.classList.toggle("hidden", !isEmpty);
  };

  const sortCards = (cards) => {
    const mode = reviewSort?.value || "newest";
    const sorted = [...cards];

    if (mode === "highest") {
      sorted.sort((a, b) => {
        const ra = Number(a.dataset.rating || 0);
        const rb = Number(b.dataset.rating || 0);
        if (rb !== ra) return rb - ra;

        const da = parseDateValue(
          $("time.reviewCard__date", a)?.getAttribute("datetime") ||
            $("time.reviewCard__date", a)?.textContent ||
            ""
        );
        const db = parseDateValue(
          $("time.reviewCard__date", b)?.getAttribute("datetime") ||
            $("time.reviewCard__date", b)?.textContent ||
            ""
        );
        return db - da;
      });
    } else if (mode === "relevant") {
      const query = (reviewSearch?.value || "").trim().toLowerCase();

      sorted.sort((a, b) => {
        const aData = getCardData(a);
        const bData = getCardData(b);

        const score = (data) => {
          let s = 0;

          if (query) {
            if (data.text.includes(query)) s += 4;
            if (data.service.includes(query)) s += 3;
            if (data.city.includes(query)) s += 2;
            if (data.topics.includes(query)) s += 2;
          }

          if (activeTopic !== "all" && data.topics.includes(activeTopic)) s += 2;
          s += data.rating;

          return s;
        };

        const scoreA = score(aData);
        const scoreB = score(bData);

        if (scoreB !== scoreA) return scoreB - scoreA;

        const da = parseDateValue(aData.dateText);
        const db = parseDateValue(bData.dateText);
        return db - da;
      });
    } else {
      sorted.sort((a, b) => {
        const da = parseDateValue(
          $("time.reviewCard__date", a)?.getAttribute("datetime") ||
            $("time.reviewCard__date", a)?.textContent ||
            ""
        );
        const db = parseDateValue(
          $("time.reviewCard__date", b)?.getAttribute("datetime") ||
            $("time.reviewCard__date", b)?.textContent ||
            ""
        );
        return db - da;
      });
    }

    return sorted;
  };

  const getFilteredCards = () => {
    const query = (reviewSearch?.value || "").trim().toLowerCase();
    const service = (reviewService?.value || "all").toLowerCase();
    const minRating = (reviewRating?.value || "all").toLowerCase();

    return reviewCards.filter((card) => {
      const data = getCardData(card);

      const matchesQuery =
        !query ||
        data.text.includes(query) ||
        data.service.includes(query) ||
        data.city.includes(query) ||
        data.topics.includes(query);

      const matchesService = service === "all" || data.service === service;

      const matchesRating =
        minRating === "all" || data.rating >= Number(minRating);

      const matchesTopic =
        activeTopic === "all" || data.topics.includes(activeTopic);

      return matchesQuery && matchesService && matchesRating && matchesTopic;
    });
  };

  const applyReviewFilters = ({ resetVisibleLimit = false } = {}) => {
    if (resetVisibleLimit) {
      visibleLimit = INITIAL_VISIBLE;
    }

    const filtered = getFilteredCards();
    const sorted = sortCards(filtered);

    reviewCards.forEach((card) => {
      card.hidden = true;
      card.style.display = "none";
    });

    sorted.forEach((card, index) => {
      const shouldShow = index < visibleLimit;
      card.hidden = !shouldShow;
      card.style.display = shouldShow ? "" : "none";
    });

    if (reviewsGrid) {
      sorted.forEach((card) => reviewsGrid.appendChild(card));
    }

    const shownCount = Math.min(visibleLimit, sorted.length);
    visibleTargets.forEach((el) => {
      el.textContent = String(shownCount);
    });

    totalTargets.forEach((el) => {
      el.textContent = String(sorted.length);
    });

    setEmptyState(sorted.length === 0);

    if (loadMoreBtn) {
      loadMoreBtn.style.display =
        sorted.length > visibleLimit ? "inline-flex" : "none";
    }
  };

  if (reviewSearch) {
    reviewSearch.addEventListener("input", () => {
      applyReviewFilters({ resetVisibleLimit: true });
    });
  }

  if (reviewSort) {
    reviewSort.addEventListener("change", () => {
      applyReviewFilters({ resetVisibleLimit: false });
    });
  }

  if (reviewService) {
    reviewService.addEventListener("change", () => {
      applyReviewFilters({ resetVisibleLimit: true });
    });
  }

  if (reviewRating) {
    reviewRating.addEventListener("change", () => {
      applyReviewFilters({ resetVisibleLimit: true });
    });
  }

  if (filterChips.length) {
    filterChips.forEach((chip) => {
      chip.addEventListener("click", () => {
        activeTopic = chip.dataset.filter || "all";

        filterChips.forEach((c) =>
          c.classList.toggle("is-active", c === chip)
        );

        applyReviewFilters({ resetVisibleLimit: true });
      });
    });
  }

  if (loadMoreBtn) {
    loadMoreBtn.addEventListener("click", () => {
      visibleLimit += LOAD_MORE_STEP;
      applyReviewFilters({ resetVisibleLimit: false });
    });
  }

  applyReviewFilters({ resetVisibleLimit: true });

  /* =========================================================
     9) OPTIONAL GOOGLE / REMOTE REVIEWS HOOK
  ========================================================= */
  const buildReviewCardHTML = (review) => {
    const name = review.author_name || review.name || "Verified Customer";
    const rating = Number(review.rating || 5);
    const text = review.text || "Excellent experience from start to finish.";
    const city = review.city || "Massachusetts";
    const service = review.service || "Painting Project";
    const topics = Array.isArray(review.topics) ? review.topics : [];
    const dateText =
      review.time ||
      review.date ||
      review.relative_time_description ||
      new Date().toISOString().slice(0, 10);

    const serviceData = String(service).toLowerCase().replace(/\s+/g, "-");
    const topicsData = topics.length
      ? topics.join(" ")
      : "quality professionalism";
    const initials = name.trim().charAt(0).toUpperCase();
    const stars = "★★★★★".slice(0, Math.max(0, Math.min(5, rating)));

    return `
      <article
        class="reviewCard"
        data-rating="${rating}"
        data-service="${serviceData}"
        data-city="${String(city).toLowerCase()}"
        data-topics="${topicsData}"
      >
        <header class="reviewCard__header">
          <div class="reviewCard__avatar" aria-hidden="true">${initials}</div>
          <div class="reviewCard__identity">
            <h3 class="reviewCard__name">${name}</h3>
            <p class="reviewCard__meta">${city} • ${service}</p>
          </div>
          <div class="reviewCard__rating" aria-label="${rating} star review">${stars}</div>
        </header>

        <div class="reviewCard__body">
          <p class="reviewCard__text">${text}</p>
        </div>

        <footer class="reviewCard__footer">
          ${topics
            .map(
              (topic) =>
                `<span class="reviewCard__tag">${String(topic)
                  .replace(/-/g, " ")
                  .replace(/\b\w/g, (m) => m.toUpperCase())}</span>`
            )
            .join("")}
          <time class="reviewCard__date" datetime="${dateText}">${dateText}</time>
        </footer>
      </article>
    `;
  };

  const hydrateRemoteReviews = () => {
    if (!reviewsGrid) return;
    const external = window.LUPA_REVIEWS_DATA;

    if (!Array.isArray(external) || !external.length) return;

    reviewsGrid.innerHTML = external.map(buildReviewCardHTML).join("");

    const freshCards = $$(".reviewCard", reviewsGrid);

    reviewCards.length = 0;
    freshCards.forEach((card) => reviewCards.push(card));

    updateReviewTotals();
    updateReviewSummaryMentions();
    updateFeaturedReview();
    applyReviewFilters({ resetVisibleLimit: true });
    initReviewsCarouselDots();
  };

  hydrateRemoteReviews();

  /* =========================================================
     10) REVIEWS MOBILE CAROUSEL DOTS
     Requer:
       #reviewsGrid
       #reviewsDots (opcional)
     Observação:
       No HTML atual de reviews não existe #reviewsDots.
       Este bloco funciona se você adicionar depois.
  ========================================================= */
  function initReviewsCarouselDots() {
    const reviewsRail = document.getElementById("reviewsGrid");
    const reviewsDotsWrap = document.getElementById("reviewsDots");

    if (!reviewsRail || !reviewsDotsWrap) return;

    const mqReviews = window.matchMedia("(max-width: 820px)");

    const getVisibleCards = () =>
      Array.from(reviewsRail.querySelectorAll(".reviewCard")).filter(
        (card) => !card.hidden && card.style.display !== "none"
      );

    const buildDots = () => {
      const cards = getVisibleCards();

      if (!cards.length || !mqReviews.matches) {
        reviewsDotsWrap.innerHTML = "";
        return;
      }

      reviewsDotsWrap.innerHTML = cards
        .map(
          (_, i) =>
            `<button type="button" class="dot ${
              i === 0 ? "is-active" : ""
            }" data-i="${i}" aria-label="Go to review ${i + 1}"></button>`
        )
        .join("");
    };

    const getDots = () =>
      Array.from(reviewsDotsWrap.querySelectorAll(".dot"));

    const scrollToIndexCentered = (i) => {
      const cards = getVisibleCards();
      const card = cards[i];
      if (!card) return;

      const railW = reviewsRail.clientWidth;
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const targetLeft = Math.max(0, cardCenter - railW / 2);

      reviewsRail.scrollTo({ left: targetLeft, behavior: "smooth" });
    };

    const syncActiveDot = () => {
      const dots = getDots();
      const cards = getVisibleCards();

      if (!dots.length || !cards.length) return 0;

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

    reviewsDotsWrap.removeEventListener("click", onDotsClick);
    reviewsDotsWrap.addEventListener("click", onDotsClick);

    reviewsRail.removeEventListener("scroll", onRailScroll);
    reviewsRail.addEventListener("scroll", onRailScroll, { passive: true });

    reInit();

    if (!reviewsRail.dataset.dotsBound) {
      if (mqReviews.addEventListener) {
        mqReviews.addEventListener("change", reInit);
      } else {
        mqReviews.addListener(reInit);
      }

      window.addEventListener("resize", () => {
        if (!mqReviews.matches) return;
        syncActiveDot();
      });

      reviewsRail.dataset.dotsBound = "true";
    }
  }

  initReviewsCarouselDots();

 /* =========================================================
   11) FAQ ACCORDION
   - padrão visual/layout igual ao print 2
   - cria .faqQ / .faqA / .faqIcon sem quebrar o HTML base
========================================================= */
const faqItems = $$("#reviews-faq .faqItem");

if (faqItems.length) {
  faqItems.forEach((item, index) => {
    const titleEl = $(".faqItem__title", item);
    const textEl = $(".faqItem__text", item);

    if (!titleEl || !textEl) return;

    if (!$(".faqQ", item)) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "faqQ";
      btn.setAttribute("aria-expanded", index === 0 ? "true" : "false");
      btn.setAttribute("aria-controls", `faqA-${index}`);
      btn.id = `faqQ-${index}`;

      btn.innerHTML = `
        <span class="faqQ__text">${titleEl.textContent.trim()}</span>
        <span class="faqIcon" aria-hidden="true">${index === 0 ? "−" : "+"}</span>
      `;

      titleEl.replaceWith(btn);
    }

    if (!$(".faqA", item)) {
      const wrapper = document.createElement("div");
      wrapper.className = `faqA${index === 0 ? " open" : ""}`;
      wrapper.id = `faqA-${index}`;
      wrapper.setAttribute("role", "region");
      wrapper.setAttribute("aria-labelledby", `faqQ-${index}`);
      wrapper.style.maxHeight = index === 0 ? "none" : "0px";

      const inner = document.createElement("div");
      inner.className = "faqA__inner";

      const p = document.createElement("p");
      p.textContent = textEl.textContent.trim();

      inner.appendChild(p);
      wrapper.appendChild(inner);
      textEl.replaceWith(wrapper);
    }
  });

  const faqItemsReady = $$("#reviews-faq .faqItem");

  const setFaqState = (item, open) => {
    const btn = $(".faqQ", item);
    const ans = $(".faqA", item);
    const icon = $(".faqIcon", item);

    if (!btn || !ans) return;

    btn.setAttribute("aria-expanded", open ? "true" : "false");
    item.classList.toggle("is-open", open);
    ans.classList.toggle("open", open);

    if (icon) icon.textContent = open ? "−" : "+";

    if (open) {
      ans.style.maxHeight = ans.scrollHeight + "px";
    } else {
      ans.style.maxHeight = "0px";
    }
  };

  const closeAllFaq = (exceptItem = null) => {
    faqItemsReady.forEach((it) => {
      if (exceptItem && it === exceptItem) return;
      setFaqState(it, false);
    });
  };

  faqItemsReady.forEach((item, index) => {
    const btn = $(".faqQ", item);
    const ans = $(".faqA", item);

    if (!btn || !ans) return;

    const initialOpen =
      btn.getAttribute("aria-expanded") === "true" ||
      ans.classList.contains("open") ||
      index === 0;

    setFaqState(item, initialOpen);

    btn.addEventListener("click", () => {
      const isOpen = btn.getAttribute("aria-expanded") === "true";

      if (isOpen) {
        setFaqState(item, false);
      } else {
        closeAllFaq(item);
        setFaqState(item, true);
      }
    });
  });

  window.addEventListener(
    "resize",
    () => {
      faqItemsReady.forEach((item) => {
        const btn = $(".faqQ", item);
        const ans = $(".faqA", item);
        if (!btn || !ans) return;

        const open = btn.getAttribute("aria-expanded") === "true";
        if (open) {
          ans.style.maxHeight = ans.scrollHeight + "px";
        }
      });
    },
    { passive: true }
  );
}

  /* =========================================================
     12) NEWSLETTER
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
     13) HASH SCROLL
     Example:
       reviews.html#reviews-feed
  ========================================================= */
  const hash = window.location.hash;
  if (hash && hash === "#reviews-feed") {
    const target = document.getElementById("reviews-feed");
    if (target) {
      setTimeout(() => {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 120);
    }
  }
})();