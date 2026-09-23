/* ▼ [scroll-reveal] セクション内のテキスト・カードを順に表示する */
(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealDelay = 220;
  const sectionTargets = [
    [
      ".hero-copy h1",
      ".hero-copy p",
      ".hero-actions",
      ".hero-product",
    ],
    [
      ".problem .narrow-heading h2",
      ".problem .narrow-heading p",
      ".problem .friction-list article",
    ],
    [
      ".how-it-works .split-heading > *",
      ".how-it-works .timeline-card",
    ],
    [
      ".find .split-heading > *",
      ".find .feature-card",
    ],
    [".voice-gallery"],
    [
      ".faq-layout h2",
      ".faq-list details",
    ],
    [
      ".purchase-card h2",
      ".purchase-card p",
      ".purchase-card a",
      ".purchase-card small",
    ],
  ];

  const targets = sectionTargets.flatMap((selectors) => selectors.flatMap((selector) => [...document.querySelectorAll(selector)]));
  targets.forEach((element, index) => {
    element.classList.add("reveal");
    const transitionDelay = element.closest(".hero") ? 0 : Math.min(index % 6, 4) * 90;
    element.style.setProperty("--reveal-delay", `${transitionDelay}ms`);
  });

  if (reduceMotion || !("IntersectionObserver" in window)) {
    targets.forEach((element) => element.classList.add("in"));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      let delay = revealDelay;
      if (entry.target.matches(".hero-copy h1")) delay = 1000;
      if (entry.target.matches(".hero-copy p")) delay = 1300;
      if (entry.target.matches(".hero-actions")) delay = 1600;
      if (entry.target.matches(".hero-product")) delay = 2400;
      window.setTimeout(() => entry.target.classList.add("in"), delay);
      observer.unobserve(entry.target);
    });
  }, {
    threshold: 0.12,
    rootMargin: "0px 0px -40px 0px",
  });

  targets.forEach((element) => observer.observe(element));
})();
/* ▲ [scroll-reveal] */

/* ▼ [voice-gallery] 声を矢印で切り替え、切り替えた声も1行ずつ表示する */
(() => {
  "use strict";

  const gallery = document.querySelector("[data-voice-gallery]");
  if (!gallery) return;

  const slides = [...gallery.querySelectorAll("[data-voice-gallery-slide]")];
  const previous = gallery.querySelector("[data-voice-gallery-previous]");
  const next = gallery.querySelector("[data-voice-gallery-next]");
  let activeIndex = 0;

  const showSlide = (index) => {
    activeIndex = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      const isActive = slideIndex === activeIndex;
      slide.hidden = !isActive;
      slide.classList.toggle("is-active", isActive);
    });
  };

  const hasMultipleSlides = slides.length > 1;
  previous.hidden = !hasMultipleSlides;
  next.hidden = !hasMultipleSlides;
  previous.addEventListener("click", () => showSlide(activeIndex - 1));
  next.addEventListener("click", () => showSlide(activeIndex + 1));
  showSlide(0);
})();
/* ▲ [voice-gallery] */

/* ▼ [hero-gallery] ヒーロー内の機能画面を手動で切り替える */
(() => {
  "use strict";

  const gallery = document.querySelector("[data-hero-gallery]");
  if (!gallery) return;

  const panels = [...gallery.querySelectorAll(".hero-gallery-panel")];
  const previous = gallery.querySelector("[data-hero-gallery-previous]");
  const next = gallery.querySelector("[data-hero-gallery-next]");
  const dots = [...gallery.querySelectorAll("[data-hero-gallery-dot]")];
  const pagination = gallery.querySelector(".hero-gallery-pagination");
  let activeIndex = 0;

  const showPanel = (index) => {
    activeIndex = (index + panels.length) % panels.length;
    panels.forEach((panel, panelIndex) => {
      const isActive = panelIndex === activeIndex;
      panel.classList.toggle("is-active", isActive);
      panel.hidden = !isActive;
    });
    dots.forEach((dot, dotIndex) => dot.classList.toggle("is-active", dotIndex === activeIndex));
    pagination.setAttribute("aria-label", `${activeIndex + 1}枚目を表示中`);
  };

  previous.addEventListener("click", () => showPanel(activeIndex - 1));
  next.addEventListener("click", () => showPanel(activeIndex + 1));
})();
/* ▲ [hero-gallery] */

/* ▼ [card-gallery] 説明カード内の実写を手動で切り替える */
(() => {
  "use strict";

  const lightbox = document.querySelector("[data-card-gallery-lightbox]");
  const lightboxImage = lightbox?.querySelector("[data-card-gallery-lightbox-image]");
  const lightboxCount = lightbox?.querySelector("[data-card-gallery-lightbox-count]");
  const lightboxPrevious = lightbox?.querySelector("[data-card-gallery-lightbox-previous]");
  const lightboxNext = lightbox?.querySelector("[data-card-gallery-lightbox-next]");
  const lightboxClose = lightbox?.querySelector("[data-card-gallery-lightbox-close]");
  let expandedGallery;

  const updateLightbox = () => {
    if (!expandedGallery || !lightboxImage || !lightboxCount) return;

    const index = expandedGallery.getActiveIndex();
    const image = expandedGallery.panels[index].querySelector("img");
    lightboxImage.src = image.currentSrc || image.src;
    lightboxImage.alt = image.alt;
    lightboxCount.textContent = `${index + 1} / ${expandedGallery.panels.length}`;
    const hasMultiplePanels = expandedGallery.panels.length > 1;
    if (lightboxPrevious) lightboxPrevious.hidden = !hasMultiplePanels;
    if (lightboxNext) lightboxNext.hidden = !hasMultiplePanels;
    lightboxCount.hidden = !hasMultiplePanels;
  };

  lightboxPrevious?.addEventListener("click", () => expandedGallery?.showPanel(expandedGallery.getActiveIndex() - 1));
  lightboxNext?.addEventListener("click", () => expandedGallery?.showPanel(expandedGallery.getActiveIndex() + 1));
  lightboxClose?.addEventListener("click", () => lightbox.close());
  lightbox?.addEventListener("click", (event) => {
    if (event.target === lightbox) lightbox.close();
  });
  lightbox?.addEventListener("close", () => {
    expandedGallery = undefined;
  });

  document.querySelectorAll("[data-card-gallery]").forEach((gallery) => {
    const panels = [...gallery.querySelectorAll(".card-gallery-panel")];
    const stage = gallery.querySelector(".card-gallery-stage");
    const previous = gallery.querySelector("[data-card-gallery-previous]");
    const next = gallery.querySelector("[data-card-gallery-next]");
    const dots = [...gallery.querySelectorAll("[data-card-gallery-dot]")];
    const pagination = gallery.querySelector(".card-gallery-pagination");
    let activeIndex = 0;
    let hideTimer;

    const showPanel = (index, immediately = false) => {
      const nextIndex = (index + panels.length) % panels.length;
      const outgoing = panels[activeIndex];
      const incoming = panels[nextIndex];

      clearTimeout(hideTimer);

      if (immediately) {
        panels.forEach((panel, panelIndex) => {
          const isActive = panelIndex === nextIndex;
          panel.hidden = !isActive;
          panel.classList.toggle("is-active", isActive);
        });
      } else if (nextIndex !== activeIndex) {
        incoming.hidden = false;
        incoming.classList.remove("is-active");
        requestAnimationFrame(() => {
          incoming.classList.add("is-active");
          outgoing.classList.remove("is-active");
        });
        hideTimer = setTimeout(() => {
          panels.forEach((panel, panelIndex) => {
            if (panelIndex !== nextIndex) panel.hidden = true;
          });
        }, 400);
      }

      activeIndex = nextIndex;
      dots.forEach((dot, dotIndex) => dot.classList.toggle("is-active", dotIndex === activeIndex));
      pagination.setAttribute("aria-label", `${activeIndex + 1}枚目を表示中`);
      updateLightbox();
    };

    const openLightbox = () => {
      if (!lightbox || !stage) return;
      expandedGallery = { panels, showPanel, getActiveIndex: () => activeIndex };
      updateLightbox();
      lightbox.showModal();
    };

    previous.addEventListener("click", () => showPanel(activeIndex - 1));
    next.addEventListener("click", () => showPanel(activeIndex + 1));
    stage.tabIndex = 0;
    stage.setAttribute("role", "button");
    stage.setAttribute("aria-label", "画像を拡大して見る");
    stage.addEventListener("click", openLightbox);
    stage.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openLightbox();
      }
    });
    showPanel(0, true);
  });
})();
/* ▲ [card-gallery] */
