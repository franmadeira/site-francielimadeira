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

  // Plugin card click functionality
  const pluginCards = document.querySelectorAll(".plugin-card");
  const carouselSlides = document.querySelectorAll(".carousel-slide");
  const carouselScrollOffset = 80;

  pluginCards.forEach((card) => {
    card.addEventListener("click", function () {
      const productId = this.getAttribute("data-product");

      // Hide all slides
      carouselSlides.forEach((slide) => slide.classList.remove("active"));

      // Show target slide
      const targetSlide = document.querySelector(
        `[data-content="${productId}"]`,
      );
      if (targetSlide) {
        targetSlide.classList.add("active");

        // Reset image carousel to first slide
        const imageSlides = targetSlide.querySelectorAll(".image-slide");
        imageSlides.forEach((img, idx) => {
          img.classList.toggle("active", idx === 0);
        });

        // Scroll to carousel smoothly with offset
        const carouselSection = document.querySelector(".carousel-wrapper");
        if (carouselSection) {
          const sectionTop =
            carouselSection.getBoundingClientRect().top + window.pageYOffset;
          const targetTop = Math.max(
            0,
            sectionTop - carouselScrollOffset - 150,
          );
          window.scrollTo({
            top: targetTop,
            behavior: "smooth",
          });
        }
      }
    });
  });

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
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
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
