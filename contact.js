/* =========================================================
   contact.js
   CONTACT PAGE
   - Sticky / reveal navbar
   - Mobile menu
   - Hero background video rotation
   - Reveal on scroll
   - FAQ accordion
   - Quote form submit (Formspree AJAX + success state)
   - Smooth anchor scroll with navbar offset
   - Payment methods mobile carousel
   - Footer year
   - Newsletter local feedback
========================================================= */
(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  /* =========================================================
     1) NAVBAR
  ========================================================== */
  const navbar = $("#navbar");
  const navToggle = $("#navToggle");
  const mobileMenu = $("#mobileMenu");
  const scrollSentinel = $("#scrollSentinel");
  const navCloseLinks = $$("[data-close]", mobileMenu || document);

  function setMenuState(isOpen) {
    if (!navToggle || !mobileMenu) return;

    navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    navToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
    mobileMenu.setAttribute("aria-hidden", isOpen ? "false" : "true");

    navToggle.classList.toggle("is-active", isOpen);
    mobileMenu.classList.toggle("is-open", isOpen);
    document.body.classList.toggle("nav-open", isOpen);
  }

  function closeMenu() {
    setMenuState(false);
  }

  function openMenu() {
    setMenuState(true);
  }

  function toggleMenu() {
    const expanded = navToggle?.getAttribute("aria-expanded") === "true";
    setMenuState(!expanded);
  }

  if (navToggle && mobileMenu) {
    navToggle.addEventListener("click", toggleMenu);

    navCloseLinks.forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMenu();
    });

    document.addEventListener("click", (e) => {
      if (!mobileMenu.classList.contains("is-open")) return;
      const clickedInsideMenu = mobileMenu.contains(e.target);
      const clickedToggle = navToggle.contains(e.target);
      if (!clickedInsideMenu && !clickedToggle) closeMenu();
    });
  }

  if (navbar) {
    const updateNavbarScrolled = () => {
      const y = window.scrollY || window.pageYOffset || 0;
      navbar.classList.toggle("is-scrolled", y > 10);
    };

    updateNavbarScrolled();
    window.addEventListener("scroll", updateNavbarScrolled, { passive: true });

    if (scrollSentinel && "IntersectionObserver" in window) {
      const navObserver = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          navbar.classList.toggle("is-past-sentinel", !entry.isIntersecting);
        },
        {
          root: null,
          threshold: 0,
          rootMargin: "0px 0px 0px 0px",
        }
      );
      navObserver.observe(scrollSentinel);
    }
  }

  /* =========================================================
     2) HERO VIDEO ROTATION
  ========================================================== */
  const heroVideos = $$(".hero-video");
  let activeVideoIndex = Math.max(
    0,
    heroVideos.findIndex((v) => v.classList.contains("is-active"))
  );

  function showVideo(index) {
    if (!heroVideos.length) return;

    heroVideos.forEach((video, i) => {
      const isActive = i === index;
      video.classList.toggle("is-active", isActive);

      try {
        if (isActive) {
          video.play().catch(() => {});
        }
      } catch (_) {}
    });

    activeVideoIndex = index;
  }

  function nextVideo() {
    if (heroVideos.length <= 1) return;
    const nextIndex = (activeVideoIndex + 1) % heroVideos.length;
    showVideo(nextIndex);
  }

  if (heroVideos.length) {
    showVideo(activeVideoIndex < 0 ? 0 : activeVideoIndex);

    heroVideos.forEach((video) => {
      video.addEventListener("ended", nextVideo);
    });

    // fallback timer in case loop/ended behavior varies by browser
    window.setInterval(nextVideo, 7000);
  }

  /* =========================================================
     3) SMOOTH SCROLL (internal anchors)
  ========================================================== */
  function getNavbarOffset() {
    return navbar ? navbar.offsetHeight + 12 : 12;
  }

  function smoothScrollToHash(hash) {
    if (!hash || hash === "#") return;
    const target = document.querySelector(hash);
    if (!target) return;

    const top = target.getBoundingClientRect().top + window.pageYOffset - getNavbarOffset();

    window.scrollTo({
      top,
      behavior: "smooth",
    });
  }

  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;

    const href = a.getAttribute("href");
    if (!href || href === "#") return;

    const target = document.querySelector(href);
    if (!target) return;

    e.preventDefault();
    closeMenu();
    smoothScrollToHash(href);
  });

  /* =========================================================
     4) REVEAL ON SCROLL
  ========================================================== */
  const revealEls = $$(".reveal");

  function activateReveal(el) {
    el.classList.add("active");
    el.classList.add("isIn");
  }

  if ("IntersectionObserver" in window && revealEls.length) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          activateReveal(entry.target);
          revealObserver.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -8% 0px",
      }
    );

    revealEls.forEach((el) => revealObserver.observe(el));
  } else {
    revealEls.forEach(activateReveal);
  }

  /* =========================================================
     5) FAQ ACCORDION
  ========================================================== */
  const faqItems = $$(".faqItem");

  function openFaq(item) {
    if (!item) return;

    const btn = $(".faqQ", item);
    const answer = $(".faqA", item);
    const icon = $(".faqIcon", item);

    item.classList.add("is-open");
    if (btn) btn.setAttribute("aria-expanded", "true");
    if (answer) {
      answer.style.display = "block";
      answer.classList.add("open");
      answer.style.maxHeight = `${answer.scrollHeight}px`;
    }
    if (icon) icon.textContent = "−";
  }

  function closeFaq(item) {
    if (!item) return;

    const btn = $(".faqQ", item);
    const answer = $(".faqA", item);
    const icon = $(".faqIcon", item);

    item.classList.remove("is-open");
    if (btn) btn.setAttribute("aria-expanded", "false");
    if (answer) {
      answer.classList.remove("open");
      answer.style.maxHeight = "0px";
      window.setTimeout(() => {
        if (!item.classList.contains("is-open")) {
          answer.style.display = "";
        }
      }, 280);
    }
    if (icon) icon.textContent = "+";
  }

  function toggleFaq(item) {
    const isOpen = item.classList.contains("is-open");

    faqItems.forEach((faq) => {
      if (faq !== item) closeFaq(faq);
    });

    if (isOpen) {
      closeFaq(item);
    } else {
      openFaq(item);
    }
  }

  faqItems.forEach((item, index) => {
    const btn = $(".faqQ", item);
    const answer = $(".faqA", item);

    if (btn) {
      const startsOpen = item.classList.contains("is-open") || btn.getAttribute("aria-expanded") === "true";

      if (startsOpen) {
        openFaq(item);
      } else if (answer) {
        answer.style.maxHeight = "0px";
      }

      btn.addEventListener("click", () => toggleFaq(item));
    }

    // fallback: first open if nothing is open
    if (index === 0 && !faqItems.some((f) => f.classList.contains("is-open"))) {
      openFaq(item);
    }
  });

  /* =========================================================
     6) QUOTE FORM (AJAX FORMspree)
  ========================================================== */
  const quoteForm = $("#quoteForm");
  const quoteSuccess = $("#quoteSuccess");
  const quoteReplyTo = quoteForm?.querySelector('input[name="_replyto"]');
  const submitBtn = quoteForm?.querySelector('button[type="submit"]');
  const emailField = quoteForm?.querySelector('input[name="email"]');

  function setSubmitLoading(isLoading) {
    if (!submitBtn) return;

    submitBtn.disabled = isLoading;
    submitBtn.classList.toggle("is-loading", isLoading);

    if (isLoading) {
      submitBtn.dataset.originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = 'SENDING REQUEST <span class="btn__arrow" aria-hidden="true">…</span>';
    } else if (submitBtn.dataset.originalText) {
      submitBtn.innerHTML = submitBtn.dataset.originalText;
    }
  }

  async function handleQuoteSubmit(e) {
    e.preventDefault();
    if (!quoteForm) return;

    if (!quoteForm.checkValidity()) {
      quoteForm.reportValidity();
      return;
    }

    if (quoteReplyTo && emailField) {
      quoteReplyTo.value = emailField.value.trim();
    }

    const formData = new FormData(quoteForm);

    // honeypot
    const gotcha = String(formData.get("_gotcha") || "").trim();
    if (gotcha) return;

    setSubmitLoading(true);

    try {
      const response = await fetch(quoteForm.action, {
        method: quoteForm.method || "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Form request failed");
      }

      quoteForm.reset();

      if (quoteSuccess) {
        quoteSuccess.classList.remove("hidden");
        quoteSuccess.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }

      quoteForm.style.display = "none";
    } catch (err) {
      alert("There was a problem sending your message. Please try again or contact us directly by phone or email.");
      console.error(err);
    } finally {
      setSubmitLoading(false);
    }
  }

  if (quoteForm) {
    quoteForm.addEventListener("submit", handleQuoteSubmit);
  }

  /* =========================================================
     7) PAYMENT METHODS MINI CAROUSEL (MOBILE)
  ========================================================== */
  const paymentCarousels = $$(".paymentMethodsMini");

  function initPaymentMethodsCarousel(section) {
    if (!section) return null;

    const viewport = $(".paymentMethodsMini__viewport", section);
    const grid = $(".paymentMethodsMini__grid", section);
    if (!viewport || !grid) return null;

    const mobileMQ = window.matchMedia("(max-width: 820px)");
    const reducedMotionMQ = window.matchMedia("(prefers-reduced-motion: reduce)");

    let rafId = 0;
    let isPaused = false;
    let isEnabled = false;
    let singleSetWidth = 0;
    let originalCount = 0;
    let resumeTimer = null;
    let resizeTimer = null;
    let touchPauseTimer = null;

    const SPEED = 55.35;

    function getOriginalItems() {
      return Array.from(grid.children).filter((el) => !el.hasAttribute("data-payment-clone"));
    }

    function cleanupClones() {
      Array.from(grid.children).forEach((el) => {
        if (el.hasAttribute("data-payment-clone")) {
          el.remove();
        }
      });
    }

    function measureSingleSetWidth() {
      const originals = getOriginalItems();
      if (!originals.length) return 0;

      const first = originals[0];
      const last = originals[originals.length - 1];
      const width = (last.offsetLeft + last.offsetWidth) - first.offsetLeft;

      return Math.max(0, width);
    }

    function stopAnimation() {
      if (rafId) {
        window.cancelAnimationFrame(rafId);
        rafId = 0;
      }
    }

    function animate() {
      if (!isEnabled || isPaused || !mobileMQ.matches || reducedMotionMQ.matches) {
        rafId = window.requestAnimationFrame(animate);
        return;
      }

      if (singleSetWidth <= 0) {
        singleSetWidth = measureSingleSetWidth();
      }

      if (singleSetWidth > 0) {
        viewport.scrollLeft += SPEED;

        if (viewport.scrollLeft >= singleSetWidth) {
          viewport.scrollLeft -= singleSetWidth;
        }
      }

      rafId = window.requestAnimationFrame(animate);
    }

    function buildMobileLoop() {
      cleanupClones();

      const originals = getOriginalItems();
      originalCount = originals.length;

      if (!originals.length) return;

      const frag = document.createDocumentFragment();
      originals.forEach((item) => {
        const clone = item.cloneNode(true);
        clone.setAttribute("data-payment-clone", "true");
        clone.setAttribute("aria-hidden", "true");
        frag.appendChild(clone);
      });

      grid.appendChild(frag);
      singleSetWidth = measureSingleSetWidth();
      viewport.scrollLeft = 0;
    }

    function enable() {
      if (isEnabled) return;

      buildMobileLoop();
      isEnabled = true;
      section.classList.add("is-payment-carousel");
    }

    function disable() {
      isEnabled = false;
      section.classList.remove("is-payment-carousel");
      cleanupClones();
      viewport.scrollLeft = 0;
      singleSetWidth = 0;
    }

    function syncMode() {
      if (mobileMQ.matches && !reducedMotionMQ.matches) {
        enable();
      } else {
        disable();
      }
    }

    function pause() {
      isPaused = true;
    }

    function resume() {
      isPaused = false;
    }

    function resumeLater(delay = 1200) {
      window.clearTimeout(resumeTimer);
      resumeTimer = window.setTimeout(() => {
        resume();
      }, delay);
    }

    function onManualInteraction() {
      if (!isEnabled) return;
      pause();
      resumeLater(1400);
    }

    function onResize() {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        const hadEnabled = isEnabled;
        syncMode();

        if (hadEnabled || isEnabled) {
          singleSetWidth = measureSingleSetWidth();
          if (isEnabled && singleSetWidth > 0 && viewport.scrollLeft >= singleSetWidth) {
            viewport.scrollLeft = viewport.scrollLeft % singleSetWidth;
          }
        }
      }, 120);
    }

    viewport.addEventListener("mouseenter", pause);
    viewport.addEventListener("mouseleave", resume);
    viewport.addEventListener("focusin", pause);
    viewport.addEventListener("focusout", () => resumeLater(300));
    viewport.addEventListener("scroll", onManualInteraction, { passive: true });

    viewport.addEventListener("touchstart", () => {
      pause();
      window.clearTimeout(touchPauseTimer);
    }, { passive: true });

    viewport.addEventListener("touchend", () => {
      window.clearTimeout(touchPauseTimer);
      touchPauseTimer = window.setTimeout(() => {
        resumeLater(900);
      }, 120);
    }, { passive: true });

    viewport.addEventListener("touchcancel", () => {
      window.clearTimeout(touchPauseTimer);
      resumeLater(900);
    }, { passive: true });

    if (typeof mobileMQ.addEventListener === "function") {
      mobileMQ.addEventListener("change", syncMode);
      reducedMotionMQ.addEventListener("change", syncMode);
    } else if (typeof mobileMQ.addListener === "function") {
      mobileMQ.addListener(syncMode);
      reducedMotionMQ.addListener(syncMode);
    }

    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("orientationchange", onResize, { passive: true });

    syncMode();
    rafId = window.requestAnimationFrame(animate);

    return {
      destroy() {
        stopAnimation();
        disable();
        window.clearTimeout(resumeTimer);
        window.clearTimeout(resizeTimer);
        window.clearTimeout(touchPauseTimer);
      },
    };
  }

  const paymentCarouselInstances = paymentCarousels
    .map((section) => initPaymentMethodsCarousel(section))
    .filter(Boolean);

  /* =========================================================
     8) FOOTER YEAR
  ========================================================== */
  const yearEl = $("#year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  /* =========================================================
     9) NEWSLETTER FEEDBACK
  ========================================================== */
  const newsletterForm = $("#newsletterForm");
  const newsletterMsg = $("#newsletterMsg");

  if (newsletterForm) {
    newsletterForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const emailInput = newsletterForm.querySelector('input[type="email"]');
      if (!emailInput || !emailInput.value.trim()) {
        emailInput?.reportValidity?.();
        return;
      }

      newsletterForm.reset();
      if (newsletterMsg) {
        newsletterMsg.classList.remove("hidden");
      }
    });
  }

  /* =========================================================
     10) ACCESSIBILITY / EXTERNAL CTA SANITY
  ========================================================== */
  const phoneLinks = $$('a[href^="tel:"]');
  const smsLinks = $$('a[href^="sms:"]');
  const mailLinks = $$('a[href^="mailto:"]');

  phoneLinks.forEach((a) => {
    if (!a.hasAttribute("aria-label")) {
      a.setAttribute("aria-label", `Call ${a.textContent.trim() || "Lupa Painting Services"}`);
    }
  });

  smsLinks.forEach((a) => {
    if (!a.hasAttribute("aria-label")) {
      a.setAttribute("aria-label", "Send a text message");
    }
  });

  mailLinks.forEach((a) => {
    if (!a.hasAttribute("aria-label")) {
      a.setAttribute("aria-label", "Send an email");
    }
  });

  /* =========================================================
     11) INITIAL STATE FIXES
  ========================================================== */
  closeMenu();

  if (window.location.hash && document.querySelector(window.location.hash)) {
    window.setTimeout(() => {
      smoothScrollToHash(window.location.hash);
    }, 120);
  }

  // keep reference alive in case you later want debugging access
  window.__paymentCarouselInstances = paymentCarouselInstances;
})();