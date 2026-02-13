// Interactive Carousel and Plugin Cards
document.addEventListener("DOMContentLoaded", function () {
  const nav = document.querySelector("nav");
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelectorAll(".nav-links a");

  if (menuToggle && nav) {
    menuToggle.addEventListener("click", function () {
      nav.classList.toggle("nav-open");
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", function () {
        nav.classList.remove("nav-open");
      });
    });
  }

  function renderTestimonials(items) {
    const testimonialsGrid = document.querySelector(".testimonials-grid");
    if (!testimonialsGrid) return;

    testimonialsGrid.innerHTML = "";

    items.forEach((item) => {
      const card = document.createElement("article");
      card.className = "testimonial-card";

      const text = document.createElement("p");
      text.className = "testimonial-text";
      text.textContent = item.text;

      const author = document.createElement("p");
      author.className = "testimonial-author";
      author.textContent = item.name || "Cliente";

      const roleLocation = document.createElement("p");
      roleLocation.className = "testimonial-role-location";
      roleLocation.textContent = item.role_location || "";

      card.appendChild(text);
      card.appendChild(author);
      card.appendChild(roleLocation);

      const hasInstagram =
        typeof item.instagram_handle === "string" &&
        item.instagram_handle.trim() !== "" &&
        typeof item.instagram_url === "string" &&
        item.instagram_url.trim() !== "";
      if (hasInstagram) {
        const instagramLink = document.createElement("a");
        instagramLink.className = "testimonial-instagram";
        instagramLink.href = item.instagram_url;
        instagramLink.target = "_blank";
        instagramLink.rel = "noopener";
        instagramLink.textContent = `@${item.instagram_handle.replace(/^@/, "")}`;
        card.appendChild(instagramLink);
      }

      testimonialsGrid.appendChild(card);
    });
  }

  async function loadTestimonials() {
    const testimonialsGrid = document.querySelector(".testimonials-grid");
    if (!testimonialsGrid) return;

    const source = testimonialsGrid.getAttribute("data-source");
    if (!source) return;

    try {
      const response = await fetch(source, { cache: "no-store" });
      if (!response.ok) return;

      const payload = await response.json();
      if (!Array.isArray(payload) || payload.length === 0) return;

      const isValid = payload.every(
        (item) =>
          item &&
          typeof item.text === "string" &&
          typeof item.name === "string" &&
          typeof item.role_location === "string",
      );
      if (!isValid) return;

      renderTestimonials(payload);
    } catch (_error) {
      // Keep fallback content if loading fails.
    }
  }

  loadTestimonials();

  // Plugin card click functionality
  const pluginCards = document.querySelectorAll(".plugin-card");
  const carouselSlides = document.querySelectorAll(".carousel-slide");
  const pluginsTrack = document.querySelector(".plugins-track");
  const pluginsPrevBtn = document.querySelector(".plugin-carousel-btn.prev");
  const pluginsNextBtn = document.querySelector(".plugin-carousel-btn.next");
  const carouselScrollOffset = 80;
  const mobilePluginsMedia = window.matchMedia("(max-width: 768px)");

  function centerPluginCard(card, behavior = "smooth") {
    if (!pluginsTrack || !card || !mobilePluginsMedia.matches) return;

    const trackRect = pluginsTrack.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();
    const cardCenterWithinTrack =
      cardRect.left - trackRect.left + pluginsTrack.scrollLeft + cardRect.width / 2;
    const targetScrollLeft = Math.max(
      0,
      cardCenterWithinTrack - pluginsTrack.clientWidth / 2,
    );

    pluginsTrack.scrollTo({
      left: targetScrollLeft,
      behavior,
    });
  }

  function getActiveProductIndex() {
    return Array.from(pluginCards).findIndex((card) =>
      card.classList.contains("active"),
    );
  }

  function updatePluginCarouselButtons() {
    if (!pluginsPrevBtn || !pluginsNextBtn || pluginCards.length === 0) return;

    const activeIndex = getActiveProductIndex();
    const hasActive = activeIndex >= 0;
    pluginsPrevBtn.disabled = !hasActive || activeIndex === 0;
    pluginsNextBtn.disabled = !hasActive || activeIndex === pluginCards.length - 1;
  }

  if (pluginsTrack && pluginsPrevBtn && pluginsNextBtn) {
    pluginsPrevBtn.addEventListener("click", function () {
      const activeIndex = getActiveProductIndex();
      const targetIndex = activeIndex > 0 ? activeIndex - 1 : 0;
      const targetCard = pluginCards[targetIndex];
      const productId = targetCard?.getAttribute("data-product");
      if (productId) {
        activateProduct(productId, { scrollPage: false });
      }
    });

    pluginsNextBtn.addEventListener("click", function () {
      const activeIndex = getActiveProductIndex();
      const startIndex = activeIndex >= 0 ? activeIndex : 0;
      const targetIndex = Math.min(pluginCards.length - 1, startIndex + 1);
      const targetCard = pluginCards[targetIndex];
      const productId = targetCard?.getAttribute("data-product");
      if (productId) {
        activateProduct(productId, { scrollPage: false });
      }
    });

    window.addEventListener("resize", function () {
      updatePluginCarouselButtons();
      const activeCard = Array.from(pluginCards).find((card) =>
        card.classList.contains("active"),
      );
      if (activeCard) {
        centerPluginCard(activeCard, "auto");
      }
    });
    updatePluginCarouselButtons();
  }

  function buildMobilePluginDetails() {
    pluginCards.forEach((card) => {
      const existingDetails = card.querySelector(".plugin-mobile-details");
      if (existingDetails) {
        existingDetails.remove();
      }

      const productId = card.getAttribute("data-product");
      const sourceSlide = document.querySelector(`[data-content="${productId}"]`);
      const sourceText = sourceSlide
        ? sourceSlide.querySelector(".carousel-text")
        : null;

      if (!sourceText) {
        return;
      }

      const detailsWrapper = document.createElement("div");
      detailsWrapper.className = "plugin-mobile-details";

      const detailsContent = sourceText.cloneNode(true);
      const detailsTitle = detailsContent.querySelector("h3");
      if (detailsTitle) {
        detailsTitle.remove();
      }

      detailsWrapper.appendChild(detailsContent);
      card.appendChild(detailsWrapper);
    });
  }

  buildMobilePluginDetails();

  function setActiveProduct(productId) {
    const cards = Array.from(pluginCards);
    const activeIndex = cards.findIndex(
      (card) => card.getAttribute("data-product") === productId,
    );

    cards.forEach((card, index) => {
      const isActive = index === activeIndex;
      const isPrev = index === activeIndex - 1;
      const isNext = index === activeIndex + 1;

      card.classList.toggle("active", isActive);
      card.classList.toggle("is-prev", isPrev);
      card.classList.toggle("is-next", isNext);
    });

    const activeCard = activeIndex >= 0 ? cards[activeIndex] : null;
    if (activeCard) {
      centerPluginCard(activeCard, "smooth");
    }
    updatePluginCarouselButtons();
  }

  function activateProduct(productId, options = {}) {
    const { scrollPage = false } = options;
    setActiveProduct(productId);

    // Hide all slides
    carouselSlides.forEach((slide) => slide.classList.remove("active"));

    // Show target slide
    const targetSlide = document.querySelector(`[data-content="${productId}"]`);
    if (!targetSlide) {
      return;
    }

    targetSlide.classList.add("active");

    // Reset image carousel to first slide
    const imageSlides = targetSlide.querySelectorAll(".image-slide");
    imageSlides.forEach((img, idx) => {
      img.classList.toggle("active", idx === 0);
    });

    if (!scrollPage || mobilePluginsMedia.matches) {
      return;
    }

    // Scroll to carousel smoothly with offset
    const carouselSection = document.querySelector(".carousel-wrapper");
    if (carouselSection) {
      const sectionTop =
        carouselSection.getBoundingClientRect().top + window.pageYOffset;
      const targetTop = Math.max(0, sectionTop - carouselScrollOffset - 150);
      window.scrollTo({
        top: targetTop,
        behavior: "smooth",
      });
    }
  }

  pluginCards.forEach((card) => {
    card.addEventListener("click", function () {
      const productId = this.getAttribute("data-product");
      if (!productId) return;

      activateProduct(productId, { scrollPage: false });
    });
  });

  const initialActiveSlide = document.querySelector(".carousel-slide.active");
  const initialProductId =
    initialActiveSlide?.getAttribute("data-content") ||
    pluginCards[0]?.getAttribute("data-product");
  if (initialProductId) {
    setActiveProduct(initialProductId);
    const initialActiveCard = Array.from(pluginCards).find(
      (card) => card.getAttribute("data-product") === initialProductId,
    );
    if (initialActiveCard) {
      centerPluginCard(initialActiveCard, "auto");
    }
  }

  // Image carousel navigation within product slides
  const imageNavBtns = document.querySelectorAll(".image-nav-btn");

  imageNavBtns.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      const carouselImages = this.closest(".carousel-images");
      const imageSlides = carouselImages.querySelectorAll(".image-slide");
      const isNext = this.classList.contains("next");

      // Find current active slide
      let currentIndex = 0;
      imageSlides.forEach((slide, idx) => {
        if (slide.classList.contains("active")) {
          currentIndex = idx;
        }
      });

      // Calculate next index
      const nextIndex = isNext
        ? (currentIndex + 1) % imageSlides.length
        : (currentIndex - 1 + imageSlides.length) % imageSlides.length;

      // Update slides
      imageSlides.forEach((slide, idx) => {
        slide.classList.toggle("active", idx === nextIndex);
      });
    });
  });

  // FAQ Accordion
  const faqQuestions = document.querySelectorAll(".faq-question");

  faqQuestions.forEach((question) => {
    question.addEventListener("click", function () {
      const faqItem = this.parentElement;
      const isActive = faqItem.classList.contains("active");

      // Close all FAQ items
      document.querySelectorAll(".faq-item").forEach((item) => {
        item.classList.remove("active");
      });

      // Open clicked item if it wasn't active
      if (!isActive) {
        faqItem.classList.add("active");
      }
    });
  });

  // Screenshots Carousel
  let currentScreenshot = 0;
  const screenshotSlides = document.querySelectorAll(".screenshot-slide");
  const dots = document.querySelectorAll(".dot");
  const prevButton = document.querySelector(".carousel-button.prev");
  const nextButton = document.querySelector(".carousel-button.next");

  function showScreenshot(index) {
    // Hide all slides
    screenshotSlides.forEach((slide) => slide.classList.remove("active"));
    dots.forEach((dot) => dot.classList.remove("active"));

    // Show target slide
    if (screenshotSlides[index]) {
      screenshotSlides[index].classList.add("active");
    }
    if (dots[index]) {
      dots[index].classList.add("active");
    }

    currentScreenshot = index;
  }

  // Next button
  if (nextButton) {
    nextButton.addEventListener("click", function () {
      currentScreenshot = (currentScreenshot + 1) % screenshotSlides.length;
      showScreenshot(currentScreenshot);
    });
  }

  // Previous button
  if (prevButton) {
    prevButton.addEventListener("click", function () {
      currentScreenshot =
        (currentScreenshot - 1 + screenshotSlides.length) %
        screenshotSlides.length;
      showScreenshot(currentScreenshot);
    });
  }

  // Dots navigation
  dots.forEach((dot, index) => {
    dot.addEventListener("click", function () {
      showScreenshot(index);
    });
  });

  // Auto-play screenshots carousel (optional)
  setInterval(function () {
    if (screenshotSlides.length > 0) {
      currentScreenshot = (currentScreenshot + 1) % screenshotSlides.length;
      showScreenshot(currentScreenshot);
    }
  }, 5000); // Change every 5 seconds

  const LEADS_ENDPOINT = "https://site-francielimadeira.onrender.com/api/lead";
  // Download Modal
  const downloadModal = document.querySelector("#download-modal");
  const downloadButtons = document.querySelectorAll(".js-open-download");
  const downloadForm = document.querySelector("#download-form");
  const downloadEmail = document.querySelector("#download-email");
  const downloadConsent = document.querySelector("#download-consent");
  let currentDownloadUrl = "";

  function openDownloadModal(url) {
    if (!downloadModal) return;
    currentDownloadUrl = url || "";
    downloadModal.classList.add("active");
    downloadModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    if (downloadEmail) {
      downloadEmail.value = "";
      downloadEmail.focus();
    }
    if (downloadConsent) {
      downloadConsent.checked = false;
    }
  }

  function closeDownloadModal() {
    if (!downloadModal) return;
    downloadModal.classList.remove("active");
    downloadModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
  }

  downloadButtons.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopImmediatePropagation();
      const url = this.getAttribute("data-download-url");
      openDownloadModal(url);
    });
  });

  if (downloadModal) {
    downloadModal.addEventListener("click", function (e) {
      const target = e.target;
      if (target && target.hasAttribute("data-modal-close")) {
        closeDownloadModal();
      }
    });
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      closeDownloadModal();
    }
  });

  async function saveLeadToBrevo(email, consent) {
    try {
      const response = await fetch(LEADS_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, consent }),
      });

      if (response.ok) {
        return { ok: true };
      }

      if (response.status === 409) {
        return { ok: true, duplicate: true };
      }

      return { ok: false };
    } catch (error) {
      return { ok: false };
    }
  }

  function setDownloadStatus(message, type) {
    const statusEl = document.querySelector(".download-status");
    if (!statusEl) return;
    statusEl.textContent = message;
    statusEl.classList.remove("error", "success");
    if (type) {
      statusEl.classList.add(type);
    }
  }

  if (downloadForm) {
      downloadForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    if (!downloadEmail || !downloadEmail.checkValidity()) {
      downloadEmail.reportValidity();
      return;
    }
    if (!downloadConsent || !downloadConsent.checked) {
      downloadConsent.focus();
      return;
    }

    setDownloadStatus("Salvando seu email...", "");

    const result = await saveLeadToBrevo(downloadEmail.value.trim(), true);
    if (!result.ok) {
      setDownloadStatus("Nao foi possivel salvar seu email. Tente novamente.", "error");
      return;
    }

    if (result.duplicate) {
      setDownloadStatus("Email ja cadastrado. Abrindo o download...", "success");
    } else {
      setDownloadStatus("Tudo certo! Abrindo o download...", "success");
    }

    if (currentDownloadUrl) {
      window.open(currentDownloadUrl, "_blank", "noopener");
    }
  });
  }
  // Smooth scroll for navigation links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        const header = document.querySelector("header");
        const headerHeight = header ? header.getBoundingClientRect().height : 0;
        const extraOffset = 10;
        const targetTop =
          target.getBoundingClientRect().top +
          window.pageYOffset -
          headerHeight -
          extraOffset;

        window.scrollTo({
          top: Math.max(0, targetTop),
          behavior: "smooth",
        });
      }
    });
  });

  // Add scroll animation for elements
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, observerOptions);

  // Observe all sections
  document.querySelectorAll("section").forEach((section) => {
    section.style.opacity = "0";
    section.style.transform = "translateY(20px)";
    section.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(section);
  });
});
