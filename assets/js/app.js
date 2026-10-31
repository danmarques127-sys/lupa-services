(() => {
  const body = document.body;
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) =>
    Array.from(root.querySelectorAll(sel));

  // 1) Trigger paint animation on load
  window.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => body.classList.add("is-loaded"), 60);

    const yearEl = document.getElementById("year");

    if (yearEl) {
      yearEl.textContent = new Date().getFullYear();
    }
  });

  // 2) Sticky navbar
  const navbar = $("#navbar");
  const stickyThreshold = 50;

  const updateSticky = () => {
    if (!navbar) return;

    navbar.classList.toggle(
      "isScrolled",
      window.scrollY > stickyThreshold
    );
  };

  updateSticky();

  window.addEventListener("scroll", updateSticky, {
    passive: true
  });

  // 3) Mobile menu
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

      if (isOpen) {
        closeMobile();
      } else {
        openMobile();
      }
    });

    $$("[data-close]", mobileMenu).forEach((link) => {
      link.addEventListener("click", closeMobile);
    });

    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMobile();
      }
    });
  }

  // 4) Hero video rotation
  const videoA = $("#heroVideoA");
  const videoB = $("#heroVideoB");
  const videoC = $("#heroVideoC");

  const videos = [videoA, videoB, videoC].filter(Boolean);

  const prefersReduced =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const saveData =
    navigator.connection &&
    navigator.connection.saveData;

  const setActiveVideo = (index) => {
    videos.forEach((video, videoIndex) => {
      video.classList.toggle("is-active", videoIndex === index);

      try {
        if (videoIndex === index) {
          const playPromise = video.play?.();

          if (
            playPromise &&
            typeof playPromise.catch === "function"
          ) {
            playPromise.catch(() => {});
          }
        }
      } catch (_) {}
    });
  };

  if (prefersReduced || saveData) {
    videos.forEach((video) => {
      try {
        video.pause?.();
        video.removeAttribute("autoplay");
      } catch (_) {}

      video.style.display = "none";
    });
  } else if (videos.length === 1) {
    videos[0].classList.add("is-active");
  } else if (videos.length >= 2) {
    let currentVideo = 0;

    setActiveVideo(currentVideo);

    const ROTATE_EVERY_MS = 10000;

    window.setInterval(() => {
      currentVideo = (currentVideo + 1) % videos.length;
      setActiveVideo(currentVideo);
    }, ROTATE_EVERY_MS);
  }

  // 5) Generic reveal animation
  const genericReveals = $$(".reveal");

  if (genericReveals.length) {
    if ("IntersectionObserver" in window) {
      const revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            entry.target.classList.add("active");
            entry.target.classList.add("isIn");
            revealObserver.unobserve(entry.target);
          });
        },
        {
          threshold: 0.12
        }
      );

      genericReveals.forEach((element) => {
        revealObserver.observe(element);
      });
    } else {
      genericReveals.forEach((element) => {
        element.classList.add("active");
        element.classList.add("isIn");
      });
    }
  }

  // 6) Service Areas mobile carousel
  const serviceAreas = $("#service-areas");
  const areasRail = $("#areasRail");
  const areasDots = $("#areasDots");

  const areasPrevious = serviceAreas
    ? $(".areasNav--prev", serviceAreas)
    : null;

  const areasNext = serviceAreas
    ? $(".areasNav--next", serviceAreas)
    : null;

  if (serviceAreas && areasRail && areasDots) {
    const cards = $$(".areaCard", areasRail);

    if (cards.length) {
      areasDots.innerHTML = cards
        .map(
          (_, index) =>
            `<span
              class="dot ${index === 0 ? "is-active" : ""}"
              data-i="${index}"
            ></span>`
        )
        .join("");

      const dots = $$(".dot", areasDots);

      const scrollToAreaIndex = (index) => {
        const card = cards[index];

        if (!card) return;

        areasRail.scrollTo({
          left: card.offsetLeft,
          behavior: "smooth"
        });
      };

      const syncActiveAreaDot = () => {
        const currentLeft = areasRail.scrollLeft;

        let bestIndex = 0;
        let bestDistance = Infinity;

        cards.forEach((card, index) => {
          const distance = Math.abs(card.offsetLeft - currentLeft);

          if (distance < bestDistance) {
            bestDistance = distance;
            bestIndex = index;
          }
        });

        dots.forEach((dot, index) => {
          dot.classList.toggle("is-active", index === bestIndex);
        });

        return bestIndex;
      };

      if (areasPrevious) {
        areasPrevious.addEventListener("click", () => {
          const currentIndex = syncActiveAreaDot();
          scrollToAreaIndex(Math.max(0, currentIndex - 1));
        });
      }

      if (areasNext) {
        areasNext.addEventListener("click", () => {
          const currentIndex = syncActiveAreaDot();

          scrollToAreaIndex(
            Math.min(cards.length - 1, currentIndex + 1)
          );
        });
      }

      areasDots.addEventListener("click", (event) => {
        const dot = event.target.closest(".dot");

        if (!dot) return;

        scrollToAreaIndex(Number(dot.dataset.i));
      });

      areasRail.addEventListener(
        "scroll",
        () => {
          window.requestAnimationFrame(syncActiveAreaDot);
        },
        {
          passive: true
        }
      );

      syncActiveAreaDot();
    }
  }

  // 6.1) Services mobile carousel
  const servicesRail = $("#servicesRail");
  const servicesDots = $("#servicesDots");

  if (servicesRail && servicesDots) {
    const mobileServicesQuery =
      window.matchMedia("(max-width: 820px)");

    const cards = $$(".card.card--service", servicesRail);

    const buildServiceDots = () => {
      if (!cards.length || !mobileServicesQuery.matches) {
        servicesDots.innerHTML = "";
        return;
      }

      servicesDots.innerHTML = cards
        .map(
          (_, index) =>
            `<button
              type="button"
              class="dot ${index === 0 ? "is-active" : ""}"
              data-i="${index}"
              aria-label="Go to service ${index + 1}"
            ></button>`
        )
        .join("");
    };

    const getServiceDots = () => $$(".dot", servicesDots);

    const scrollToServiceIndex = (index) => {
      const card = cards[index];

      if (!card) return;

      const railWidth = servicesRail.clientWidth;
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;

      const targetLeft = Math.max(
        0,
        cardCenter - railWidth / 2
      );

      servicesRail.scrollTo({
        left: targetLeft,
        behavior: "smooth"
      });
    };

    const syncActiveServiceDot = () => {
      const dots = getServiceDots();

      if (!dots.length) return 0;

      const railWidth = servicesRail.clientWidth;
      const center = servicesRail.scrollLeft + railWidth / 2;

      let bestIndex = 0;
      let bestDistance = Infinity;

      cards.forEach((card, index) => {
        const cardCenter = card.offsetLeft + card.offsetWidth / 2;
        const distance = Math.abs(cardCenter - center);

        if (distance < bestDistance) {
          bestDistance = distance;
          bestIndex = index;
        }
      });

      dots.forEach((dot, index) => {
        dot.classList.toggle("is-active", index === bestIndex);
      });

      return bestIndex;
    };

    servicesDots.addEventListener("click", (event) => {
      const dot = event.target.closest(".dot");

      if (!dot) return;

      scrollToServiceIndex(Number(dot.dataset.i));
    });

    let servicesScrolling = false;

    servicesRail.addEventListener(
      "scroll",
      () => {
        if (!mobileServicesQuery.matches || servicesScrolling) {
          return;
        }

        servicesScrolling = true;

        window.requestAnimationFrame(() => {
          syncActiveServiceDot();
          servicesScrolling = false;
        });
      },
      {
        passive: true
      }
    );

    const initializeServicesCarousel = () => {
      buildServiceDots();
      syncActiveServiceDot();
    };

    initializeServicesCarousel();

    if (mobileServicesQuery.addEventListener) {
      mobileServicesQuery.addEventListener(
        "change",
        initializeServicesCarousel
      );
    } else {
      mobileServicesQuery.addListener(initializeServicesCarousel);
    }

    window.addEventListener("resize", () => {
      if (mobileServicesQuery.matches) {
        syncActiveServiceDot();
      }
    });
  }

  // 6.2) Reviews mobile carousel
  const reviewsRail = document.getElementById("reviewsRail");
  const reviewsDots = document.getElementById("reviewsDots");

  if (reviewsRail && reviewsDots) {
    const mobileReviewsQuery =
      window.matchMedia("(max-width: 820px)");

    const cards = Array.from(
      reviewsRail.querySelectorAll(".testimonial")
    );

    const buildReviewDots = () => {
      if (!cards.length || !mobileReviewsQuery.matches) {
        reviewsDots.innerHTML = "";
        return;
      }

      reviewsDots.innerHTML = cards
        .map(
          (_, index) =>
            `<button
              type="button"
              class="dot ${index === 0 ? "is-active" : ""}"
              data-i="${index}"
              aria-label="Go to review ${index + 1}"
            ></button>`
        )
        .join("");
    };

    const getReviewDots = () =>
      Array.from(reviewsDots.querySelectorAll(".dot"));

    const scrollToReviewIndex = (index) => {
      const card = cards[index];

      if (!card) return;

      const railWidth = reviewsRail.clientWidth;
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;

      const targetLeft = Math.max(
        0,
        cardCenter - railWidth / 2
      );

      reviewsRail.scrollTo({
        left: targetLeft,
        behavior: "smooth"
      });
    };

    const syncActiveReviewDot = () => {
      const dots = getReviewDots();

      if (!dots.length) return 0;

      const railWidth = reviewsRail.clientWidth;
      const center = reviewsRail.scrollLeft + railWidth / 2;

      let bestIndex = 0;
      let bestDistance = Infinity;

      cards.forEach((card, index) => {
        const cardCenter = card.offsetLeft + card.offsetWidth / 2;
        const distance = Math.abs(cardCenter - center);

        if (distance < bestDistance) {
          bestDistance = distance;
          bestIndex = index;
        }
      });

      dots.forEach((dot, index) => {
        dot.classList.toggle("is-active", index === bestIndex);
      });

      return bestIndex;
    };

    reviewsDots.addEventListener("click", (event) => {
      const dot = event.target.closest(".dot");

      if (!dot) return;

      scrollToReviewIndex(Number(dot.dataset.i));
    });

    let reviewsScrolling = false;

    reviewsRail.addEventListener(
      "scroll",
      () => {
        if (!mobileReviewsQuery.matches || reviewsScrolling) {
          return;
        }

        reviewsScrolling = true;

        window.requestAnimationFrame(() => {
          syncActiveReviewDot();
          reviewsScrolling = false;
        });
      },
      {
        passive: true
      }
    );

    const initializeReviewsCarousel = () => {
      buildReviewDots();
      syncActiveReviewDot();
    };

    initializeReviewsCarousel();

    if (mobileReviewsQuery.addEventListener) {
      mobileReviewsQuery.addEventListener(
        "change",
        initializeReviewsCarousel
      );
    } else {
      mobileReviewsQuery.addListener(initializeReviewsCarousel);
    }

    window.addEventListener("resize", () => {
      if (mobileReviewsQuery.matches) {
        syncActiveReviewDot();
      }
    });
  }

  // Blog mobile carousel
  const blogRail = document.getElementById("blogRail");
  const blogDots = document.getElementById("blogDots");

  if (blogRail && blogDots) {
    const mobileBlogQuery =
      window.matchMedia("(max-width: 980px)");

    const cards = Array.from(
      blogRail.querySelectorAll(".post")
    );

    const buildBlogDots = () => {
      if (!cards.length || !mobileBlogQuery.matches) {
        blogDots.innerHTML = "";
        return;
      }

      blogDots.innerHTML = cards
        .map(
          (_, index) =>
            `<button
              type="button"
              class="dot ${index === 0 ? "is-active" : ""}"
              data-i="${index}"
              aria-label="Go to post ${index + 1}"
            ></button>`
        )
        .join("");
    };

    const getBlogDots = () =>
      Array.from(blogDots.querySelectorAll(".dot"));

    const scrollToBlogIndex = (index) => {
      const card = cards[index];

      if (!card) return;

      blogRail.scrollTo({
        left: card.offsetLeft,
        behavior: "smooth"
      });
    };

    const syncActiveBlogDot = () => {
      const dots = getBlogDots();

      if (!dots.length) return 0;

      const currentLeft = blogRail.scrollLeft;

      let bestIndex = 0;
      let bestDistance = Infinity;

      cards.forEach((card, index) => {
        const distance = Math.abs(card.offsetLeft - currentLeft);

        if (distance < bestDistance) {
          bestDistance = distance;
          bestIndex = index;
        }
      });

      dots.forEach((dot, index) => {
        dot.classList.toggle("is-active", index === bestIndex);
      });

      return bestIndex;
    };

    blogDots.addEventListener("click", (event) => {
      const dot = event.target.closest(".dot");

      if (!dot) return;

      scrollToBlogIndex(Number(dot.dataset.i));
    });

    let blogScrolling = false;

    blogRail.addEventListener(
      "scroll",
      () => {
        if (!mobileBlogQuery.matches || blogScrolling) {
          return;
        }

        blogScrolling = true;

        window.requestAnimationFrame(() => {
          syncActiveBlogDot();
          blogScrolling = false;
        });
      },
      {
        passive: true
      }
    );

    const initializeBlogCarousel = () => {
      buildBlogDots();
      syncActiveBlogDot();
    };

    initializeBlogCarousel();

    if (mobileBlogQuery.addEventListener) {
      mobileBlogQuery.addEventListener(
        "change",
        initializeBlogCarousel
      );
    } else {
      mobileBlogQuery.addListener(initializeBlogCarousel);
    }

    window.addEventListener("resize", () => {
      if (mobileBlogQuery.matches) {
        syncActiveBlogDot();
      }
    });
  }

  // Trust bar mobile carousel
  const trustInner = document.getElementById("trustbarRail");
  const trustDots = document.getElementById("trustDots");

  const trustScroller =
    trustInner
      ?.closest(".lps-trustbar")
      ?.querySelector(".lps-trustbar__viewport") ||
    document.querySelector(".lps-trustbar__viewport");

  if (trustInner && trustDots && trustScroller) {
    const mobileTrustQuery =
      window.matchMedia("(max-width: 720px)");

    const cards = Array.from(
      trustInner.querySelectorAll(".lps-trustcard")
    );

    const buildTrustDots = () => {
      if (!cards.length || !mobileTrustQuery.matches) {
        trustDots.innerHTML = "";
        return;
      }

      trustDots.innerHTML = cards
        .map(
          (_, index) =>
            `<button
              type="button"
              class="dot ${index === 0 ? "is-active" : ""}"
              data-i="${index}"
              aria-label="Go to badge ${index + 1}"
            ></button>`
        )
        .join("");
    };

    const getTrustDots = () =>
      Array.from(trustDots.querySelectorAll(".dot"));

    const scrollToTrustIndex = (index) => {
      const card = cards[index];

      if (!card) return;

      const scrollerWidth = trustScroller.clientWidth;
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;

      const targetLeft = Math.max(
        0,
        cardCenter - scrollerWidth / 2
      );

      trustScroller.scrollTo({
        left: targetLeft,
        behavior: "smooth"
      });
    };

    const syncActiveTrustDot = () => {
      const dots = getTrustDots();

      if (!dots.length) return 0;

      const scrollerWidth = trustScroller.clientWidth;
      const center = trustScroller.scrollLeft + scrollerWidth / 2;

      let bestIndex = 0;
      let bestDistance = Infinity;

      cards.forEach((card, index) => {
        const cardCenter = card.offsetLeft + card.offsetWidth / 2;
        const distance = Math.abs(cardCenter - center);

        if (distance < bestDistance) {
          bestDistance = distance;
          bestIndex = index;
        }
      });

      dots.forEach((dot, index) => {
        dot.classList.toggle("is-active", index === bestIndex);
      });

      return bestIndex;
    };

    trustDots.addEventListener("click", (event) => {
      const dot = event.target.closest(".dot");

      if (!dot) return;

      scrollToTrustIndex(Number(dot.dataset.i));
    });

    let trustScrolling = false;

    trustScroller.addEventListener(
      "scroll",
      () => {
        if (!mobileTrustQuery.matches || trustScrolling) {
          return;
        }

        trustScrolling = true;

        window.requestAnimationFrame(() => {
          syncActiveTrustDot();
          trustScrolling = false;
        });
      },
      {
        passive: true
      }
    );

    const initializeTrustCarousel = () => {
      buildTrustDots();
      syncActiveTrustDot();
    };

    initializeTrustCarousel();

    if (mobileTrustQuery.addEventListener) {
      mobileTrustQuery.addEventListener(
        "change",
        initializeTrustCarousel
      );
    } else {
      mobileTrustQuery.addListener(initializeTrustCarousel);
    }

    window.addEventListener("resize", () => {
      if (mobileTrustQuery.matches) {
        syncActiveTrustDot();
      }
    });
  }

  // 7) FAQ accordion
  const faqItems = $$(".faqItem");

  if (faqItems.length) {
    const setFaqState = (item, open) => {
      const button = $(".faqQ", item);
      const answer = $(".faqA", item);
      const icon = $(".faqIcon", item);

      if (!button || !answer) return;

      button.setAttribute("aria-expanded", open ? "true" : "false");
      answer.classList.toggle("open", open);

      if (icon) {
        icon.textContent = open ? "−" : "+";
      }

      if (open) {
        answer.style.maxHeight = answer.scrollHeight + "px";
      } else {
        answer.style.maxHeight = "0px";
      }
    };

    const closeAllFaq = (exception = null) => {
      faqItems.forEach((item) => {
        if (exception && item === exception) return;
        setFaqState(item, false);
      });
    };

    faqItems.forEach((item) => {
      const button = $(".faqQ", item);
      const answer = $(".faqA", item);

      if (!button || !answer) return;

      const initiallyOpen =
        button.getAttribute("aria-expanded") === "true" ||
        answer.classList.contains("open");

      setFaqState(item, initiallyOpen);
    });

    faqItems.forEach((item) => {
      const button = $(".faqQ", item);

      if (!button) return;

      button.addEventListener("click", () => {
        const isOpen =
          button.getAttribute("aria-expanded") === "true";

        closeAllFaq(item);
        setFaqState(item, !isOpen);
      });
    });

    window.addEventListener(
      "resize",
      () => {
        faqItems.forEach((item) => {
          const button = $(".faqQ", item);
          const answer = $(".faqA", item);

          if (!button || !answer) return;

          const isOpen =
            button.getAttribute("aria-expanded") === "true";

          if (isOpen) {
            answer.style.maxHeight = answer.scrollHeight + "px";
          }
        });
      },
      {
        passive: true
      }
    );
  }

  // 8) Newsletter
  const newsletterForm =
    document.getElementById("newsletterForm");

  const newsletterMessage =
    document.getElementById("newsletterMsg");

  if (newsletterForm && newsletterMessage) {
    newsletterForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const input =
        newsletterForm.querySelector('input[type="email"]');

      const button = newsletterForm.querySelector("button");
      const email = input ? input.value.trim() : "";

      if (!email) return;

      if (button) {
        button.disabled = true;
      }

      await new Promise((resolve) => {
        window.setTimeout(resolve, 600);
      });

      newsletterMessage.classList.remove("hidden");
      newsletterForm.reset();

      window.setTimeout(() => {
        newsletterMessage.classList.add("hidden");
      }, 4500);

      if (button) {
        button.disabled = false;
      }

      console.log("Newsletter signup:", email);
    });
  }

  // 9) Quote form with Formspree
  const quoteForm = document.getElementById("quoteForm");
  const quoteSuccess = document.getElementById("quoteSuccess");

  // GTM must listen for quote_form_success. Do not also fire the old
  // Ads conversion from a button click or the generic form_submit event.
  if (quoteForm) {
    const submitButton =
      quoteForm.querySelector('button[type="submit"]') ||
      quoteForm.querySelector(".btn");

    let isSubmitting = false;
    let submittedSuccessfully = false;

    quoteForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      if (isSubmitting || submittedSuccessfully) return;

      if (!quoteForm.checkValidity()) {
        quoteForm.reportValidity();
        return;
      }

      const action = quoteForm.getAttribute("action");

      if (!action) {
        console.warn("quoteForm missing action URL.");
        return;
      }

      isSubmitting = true;

      if (submitButton) {
        submitButton.disabled = true;
      }

      try {
        const formData = new FormData(quoteForm);

        const response = await fetch(action, {
          method: "POST",
          body: formData,
          headers: {
            Accept: "application/json"
          }
        });

        if (response.ok) {
          submittedSuccessfully = true;

          // No names, email addresses, phone numbers or message text.
          try {
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
              event: "quote_form_success",
              form_id: "quoteForm"
            });
          } catch (trackingError) {
            console.error("Lead tracking error:", trackingError);
          }

          quoteForm.classList.add("hidden");

          if (quoteSuccess) {
            quoteSuccess.classList.remove("hidden");
          }

          // Keep the submitted field values in the DOM so the
          // configured Google tag selectors can read them.
          // Do not reset the quote form here.
        } else {
          let responseData = null;

          try {
            responseData = await response.json();
          } catch (_) {}

          const message =
            (responseData &&
              (responseData.error || responseData.message)) ||
            "Sorry — something went wrong. Please try again or call us.";

          window.alert(message);
        }
      } catch (error) {
        console.error("Quote submit error:", error);

        window.alert(
          "Network error. Please try again or call us."
        );
      } finally {
        isSubmitting = false;

        if (submitButton) {
          submitButton.disabled = submittedSuccessfully;
        }
      }
    });
  }

  // 10) About video autoplay and popup
  const aboutVideo = document.getElementById("aboutVideo");
  const videoPopup = document.getElementById("videoPopup");
  const popupVideo = document.getElementById("popupVideo");
  const popupClose = document.getElementById("videoPopupClose");

  const popupCloseTriggers = videoPopup
    ? Array.from(
        videoPopup.querySelectorAll("[data-video-popup-close]")
      )
    : [];

  let popupLastFocus = null;
  let aboutVideoIsVisible = false;

  // Plays the About video when it is visible
  const playAboutVideo = () => {
    if (
      !aboutVideo ||
      !aboutVideoIsVisible ||
      prefersReduced ||
      saveData ||
      videoPopup?.classList.contains("isOpen")
    ) {
      return;
    }

    aboutVideo.muted = true;
    aboutVideo.volume = 0;

    const playPromise = aboutVideo.play();

    if (
      playPromise &&
      typeof playPromise.catch === "function"
    ) {
      playPromise.catch(() => {});
    }
  };

  if (aboutVideo) {
    aboutVideo.muted = true;
    aboutVideo.volume = 0;

    if (
      "IntersectionObserver" in window &&
      !prefersReduced &&
      !saveData
    ) {
      const aboutVideoObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            aboutVideoIsVisible = entry.isIntersecting;

            if (entry.isIntersecting) {
              playAboutVideo();
            } else {
              aboutVideo.pause();
            }
          });
        },
        {
          threshold: 0.35
        }
      );

      aboutVideoObserver.observe(aboutVideo);
    } else if (!prefersReduced && !saveData) {
      aboutVideoIsVisible = true;
      playAboutVideo();
    }
  }

  // Attempts autoplay with sound at 15% volume
  const playPopupVideo = () => {
    if (!popupVideo || prefersReduced || saveData) {
      return;
    }

    popupVideo.currentTime = 0;
    popupVideo.volume = 0.15;
    popupVideo.muted = false;

    const soundPlayPromise = popupVideo.play();

    if (
      soundPlayPromise &&
      typeof soundPlayPromise.catch === "function"
    ) {
      soundPlayPromise.catch(() => {
        // Browser blocked autoplay with sound.
        // Starts muted automatically instead.
        popupVideo.muted = true;
        popupVideo.volume = 0;

        const mutedPlayPromise = popupVideo.play();

        if (
          mutedPlayPromise &&
          typeof mutedPlayPromise.catch === "function"
        ) {
          mutedPlayPromise.catch(() => {});
        }
      });
    }
  };

  const closeVideoPopup = () => {
    if (
      !videoPopup ||
      !videoPopup.classList.contains("isOpen")
    ) {
      return;
    }

    videoPopup.classList.remove("isOpen");
    videoPopup.setAttribute("aria-hidden", "true");
    body.classList.remove("videoPopupOpen");

    if (popupVideo) {
      popupVideo.pause();
      popupVideo.currentTime = 0;
    }

    if (
      popupLastFocus &&
      typeof popupLastFocus.focus === "function"
    ) {
      popupLastFocus.focus();
    }

    // Restarts About video if it is visible
    playAboutVideo();
  };

  const openVideoPopup = () => {
    if (
      !videoPopup ||
      videoPopup.classList.contains("isOpen")
    ) {
      return;
    }

    popupLastFocus = document.activeElement;

    // Prevent both videos from playing together
    if (aboutVideo) {
      aboutVideo.pause();
    }

    videoPopup.classList.add("isOpen");
    videoPopup.setAttribute("aria-hidden", "false");
    body.classList.add("videoPopupOpen");

    if (popupClose) {
      popupClose.focus();
    }

    playPopupVideo();
  };

  if (videoPopup) {
    window.addEventListener("load", () => {
      window.setTimeout(openVideoPopup, 450);
    });

    popupCloseTriggers.forEach((trigger) => {
      trigger.addEventListener("click", closeVideoPopup);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeVideoPopup();
      }
    });
  }
})();