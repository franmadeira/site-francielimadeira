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

  const pluginDemoData = {
    utilidades: {
      group: "Grátis",
      title: "Plugin Utilidades",
      description: "O queridinho da comunidade, o Utilidades nasceu de problemas reais de modelagem. Do espelho ao efeito de luz, pequenas ferramentas que salvam teu ritmo no SketchUp.",
      bullets: ["Menos tarefas manuais", "Disponível no portal, sem custo"],
      note: "Basta criar a conta no portal.",
      media: "video",
      src: "assets/images/video-utilidades-web.mp4",
      poster: "assets/images/video-utilidades-poster.jpg",
      alt: "Demonstração do Plugin Utilidades automatizando tarefas no SketchUp",
      cta: "Usar gratuitamente",
      href: "https://app.francielimadeira.com",
    },
    anotacoes: {
      group: "Grátis",
      title: "Plugin Anotações",
      description: "Registra informações técnicas diretamente no modelo, com cálculo automático e o mesmo padrão em todos os projetos.",
      bullets: ["Anotações inteligentes", "Mais padrão na documentação"],
      note: "Basta criar a conta no portal.",
      media: "image",
      src: "assets/images/anotacoes_01.png",
      alt: "Plugin Anotações inserindo informações técnicas no modelo",
      cta: "Usar gratuitamente",
      href: "https://app.francielimadeira.com",
    },
    sketchup: {
      group: "Assinatura",
      title: "SketchUp Inteligente",
      description: "Gera cenas, plantas, cortes e detalhamentos a partir do modelo e exporta tudo em lote.",
      bullets: ["Organização automática do modelo", "Exportação em lote"],
      note: "Incluso nos planos Individual e Premium.",
      media: "image",
      src: "assets/images/skt_inteligente_01.png",
      alt: "SketchUp Inteligente organizando cenas e vistas do projeto",
      cta: "Experimentar 15 dias",
      href: "https://app.francielimadeira.com",
      lesson: "https://youtube.com/playlist?list=PLINQE5LCTA2MVn0ulZzURq9lT7gS5yp7V",
    },
    tecnicos: {
      group: "Assinatura",
      title: "Pontos Técnicos e Iluminação",
      description: "Organiza elétrica, hidráulica e iluminação com blocos dinâmicos e relatórios gerados automaticamente.",
      bullets: ["Edição em lote das informações", "Relatórios sem digitação"],
      note: "Incluso nos planos Individual e Premium.",
      media: "video",
      src: "assets/images/video-tec-completo.mp4",
      alt: "Demonstração do plugin Pontos Técnicos e Iluminação",
      cta: "Experimentar 15 dias",
      href: "https://app.francielimadeira.com",
      lesson: "https://youtube.com/playlist?list=PLINQE5LCTA2MVn0ulZzURq9lT7gS5yp7V",
    },
    layout: {
      group: "Assinatura",
      title: "Layout Inteligente",
      description: "Leva o projeto do 3D para o LayOut com escala e estrutura de prancha definidas.",
      bullets: ["Criação de pranchas", "Detalhamento técnico mais rápido"],
      note: "Disponível no plano Premium.",
      media: "video",
      src: "assets/images/video-layout-completo.mp4",
      alt: "Demonstração do plugin Layout Inteligente",
      cta: "Experimentar 15 dias",
      href: "https://app.francielimadeira.com",
    },
    esquadrias: {
      group: "Assinatura",
      title: "Plugin Esquadrias",
      description: "Crie e organize portas, janelas e esquadrias integradas ao modelo, com mais agilidade e padrão no projeto.",
      bullets: ["Modelagem organizada de esquadrias", "Informações integradas ao projeto"],
      note: "Incluso nos planos Individual e Premium.",
      media: "image",
      src: "assets/images/skt_inteligente_02.png",
      alt: "Projeto no SketchUp com portas, janelas e esquadrias organizadas",
      cta: "Experimentar 15 dias",
      href: "https://app.francielimadeira.com",
    },
    marcenaria: {
      group: "Assinatura",
      title: "Plugin Marcenaria",
      description: "Modele e detalhe marcenaria com ferramentas integradas ao seu fluxo no SketchUp.",
      bullets: ["Modelagem de marcenaria mais ágil", "Detalhamento integrado ao projeto"],
      note: "Incluso nos planos Individual e Premium.",
      media: "image",
      src: "assets/images/skt_inteligente_03.png",
      alt: "Projeto de marcenaria detalhado no SketchUp",
      cta: "Experimentar 15 dias",
      href: "https://app.francielimadeira.com",
    },
    notion: {
      group: "Avulso",
      title: "Template Notion",
      description: "Projetos, tarefas e prazos do escritório reunidos em um só template, com rotina de acompanhamento pronta.",
      bullets: ["Gestão completa de projetos", "Rotina estruturada"],
      note: "Compra única, separada da assinatura.",
      media: "image",
      src: "assets/icons/notion.png",
      alt: "Template Notion para gestão de projetos",
      cta: "Comprar na Hotmart",
      href: "https://go.hotmart.com/N54776543T?dp=1",
      lesson: "https://youtu.be/ZDjPR-IKoL0",
    },
  };

  const pluginDemoButtons = document.querySelectorAll("[data-demo-plugin]");
  const pluginDemoResult = document.querySelector("#plugin-demo-result");

  function renderPluginDemo(key, animate = true) {
    const data = pluginDemoData[key];
    if (!data || !pluginDemoResult) return;

    pluginDemoButtons.forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.demoPlugin === key));
    });

    const mediaMarkup = data.media === "video"
      ? `<video src="${data.src}" ${data.poster ? `poster="${data.poster}"` : ""} autoplay muted loop playsinline aria-label="${data.alt}"></video>`
      : `<img src="${data.src}" alt="${data.alt}">`;
    const lessonLink = data.lesson
      ? `<a class="btn btn-secondary" href="${data.lesson}" target="_blank" rel="noopener">Assistir aula</a>`
      : "";

    pluginDemoResult.innerHTML = `
      <div class="plugin-demo-media">${mediaMarkup}</div>
      <span class="plugin-demo-chip">${data.group}</span>
      <h3>${data.title}</h3>
      <p>${data.description}</p>
      <ul>${data.bullets.map((item) => `<li>${item}</li>`).join("")}</ul>
      <p class="plugin-demo-note">${data.note}</p>
      <div class="plugin-demo-actions">
        <a class="btn btn-primary" href="${data.href}" target="_blank" rel="noopener">${data.cta}</a>
        ${lessonLink}
      </div>`;

    if (animate) {
      pluginDemoResult.classList.remove("is-changing");
      void pluginDemoResult.offsetWidth;
      pluginDemoResult.classList.add("is-changing");
    }
  }

  pluginDemoButtons.forEach((button) => {
    button.addEventListener("click", () => renderPluginDemo(button.dataset.demoPlugin));
  });

  function getInitials(name) {
    if (typeof name !== "string") return "CL";

    const parts = name.trim().split(/\s+/).filter(Boolean);

    if (parts.length === 0) return "CL";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();

    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }

  function normalizeTestimonialText(text) {
    if (typeof text !== "string") return "";

    return text
      .trim()
      .replace(/^[\s"'“”]+/, "")
      .replace(/[\s"'“”]+$/, "");
  }

  function renderTestimonials(items) {
    const testimonialsGrid = document.querySelector(".testimonials-grid");
    if (!testimonialsGrid) return;

    testimonialsGrid.innerHTML = "";

    items.forEach((item) => {
      const card = document.createElement("article");
      card.className = "testimonial-card";

      const quote = document.createElement("p");
      quote.className = "testimonial-quote";
      quote.textContent = "“";

      const text = document.createElement("p");
      text.className = "testimonial-text";
      text.textContent = normalizeTestimonialText(item.text);

      const footer = document.createElement("div");
      footer.className = "testimonial-footer";

      const avatar = document.createElement("div");
      avatar.className = "testimonial-avatar";
      avatar.textContent = getInitials(item.name);

      const meta = document.createElement("div");
      meta.className = "testimonial-meta";

      const author = document.createElement("p");
      author.className = "testimonial-author";
      author.textContent = item.name || "Cliente";

      const roleLocation = document.createElement("p");
      roleLocation.className = "testimonial-role-location";
      roleLocation.textContent = item.role_location || "";

      meta.appendChild(author);
      meta.appendChild(roleLocation);

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
        meta.appendChild(instagramLink);
      }

      footer.appendChild(avatar);
      footer.appendChild(meta);

      card.appendChild(quote);
      card.appendChild(text);
      card.appendChild(footer);

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

  function initFeedbackCarousel() {
    const feedbackTrack = document.querySelector(".feedback-track");
    if (!feedbackTrack || feedbackTrack.dataset.loopReady === "true") return;

    const originalItems = Array.from(feedbackTrack.children);
    if (!originalItems.length) return;

    originalItems.forEach((item) => {
      const clone = item.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      feedbackTrack.appendChild(clone);
    });

    feedbackTrack.dataset.loopReady = "true";
  }

  function syncFeedbackReferenceHeight() {
    const feedbackTrack = document.querySelector(".feedback-track");
    const feedbackReferenceImage = document.querySelector(
      ".feedback-shot--reference img",
    );
    if (!feedbackTrack || !feedbackReferenceImage) return;

    const applyReference = () => {
      const renderedHeight =
        feedbackReferenceImage.getBoundingClientRect().height;
      if (!renderedHeight) return;
      feedbackTrack.style.setProperty(
        "--feedback-reference-height",
        `${Math.round(renderedHeight)}px`,
      );
    };

    if (feedbackReferenceImage.complete) {
      applyReference();
    } else {
      feedbackReferenceImage.addEventListener("load", applyReference, {
        once: true,
      });
    }

    window.addEventListener("resize", applyReference);
  }

  initFeedbackCarousel();
  syncFeedbackReferenceHeight();

  const allPageVideos = document.querySelectorAll("video");

  function forceVideoMuted(videoEl) {
    if (!videoEl) return;

    videoEl.defaultMuted = true;
    videoEl.muted = true;
    videoEl.volume = 0;

    if (!videoEl.dataset.lockMuted) {
      videoEl.addEventListener("volumechange", function () {
        if (!videoEl.muted || videoEl.volume !== 0) {
          videoEl.muted = true;
          videoEl.volume = 0;
        }
      });
      videoEl.dataset.lockMuted = "true";
    }
  }

  allPageVideos.forEach((videoEl) => forceVideoMuted(videoEl));

  // FAQ Accordion
  const faqQuestions = document.querySelectorAll(".faq-question");

  faqQuestions.forEach((question, index) => {
    const answer = question.nextElementSibling;
    const questionId = `faq-question-${index + 1}`;
    const answerId = `faq-answer-${index + 1}`;

    question.id = questionId;
    question.setAttribute("aria-expanded", "false");
    question.setAttribute("aria-controls", answerId);
    if (answer) {
      answer.id = answerId;
      answer.setAttribute("role", "region");
      answer.setAttribute("aria-labelledby", questionId);
      answer.setAttribute("aria-hidden", "true");
    }

    question.addEventListener("click", function () {
      const faqItem = this.parentElement;
      const isActive = faqItem.classList.contains("active");

      // Close all FAQ items
      document.querySelectorAll(".faq-item").forEach((item) => {
        item.classList.remove("active");
        const itemQuestion = item.querySelector(".faq-question");
        const itemAnswer = item.querySelector(".faq-answer");
        itemQuestion?.setAttribute("aria-expanded", "false");
        itemAnswer?.setAttribute("aria-hidden", "true");
        if (itemAnswer) itemAnswer.style.maxHeight = "0px";
      });

      // Open clicked item if it wasn't active
      if (!isActive) {
        faqItem.classList.add("active");
        this.setAttribute("aria-expanded", "true");
        answer?.setAttribute("aria-hidden", "false");
        if (answer) answer.style.maxHeight = `${answer.scrollHeight}px`;
      }
    });
  });

  window.addEventListener("resize", () => {
    document.querySelectorAll(".faq-item.active .faq-answer").forEach((answer) => {
      answer.style.maxHeight = `${answer.scrollHeight}px`;
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

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      closeMediaLightbox();
    }
  });
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

  function animateCount(el) {
    if (!el || el.dataset.counted === "true") return;

    const target = Number(el.dataset.target || 0);
    const suffix = el.dataset.suffix || "";
    const duration = 1300;
    const startedAt = performance.now();

    el.dataset.counted = "true";

    function frame(now) {
      const elapsed = now - startedAt;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(target * eased);

      el.textContent = `${current.toLocaleString("pt-BR")}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(frame);
      }
    }

    requestAnimationFrame(frame);
  }

  function initProcessHighlightCount() {
    const counters = document.querySelectorAll(".js-countup");
    const section = document.querySelector(".process-highlight");
    if (!counters.length || !section) return;

    const counterObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          counters.forEach((counter) => animateCount(counter));
          obs.disconnect();
        });
      },
      {
        threshold: 0.35,
      },
    );

    counterObserver.observe(section);
  }

  initProcessHighlightCount();

  const legalModal = document.getElementById("legal-modal");
  const legalModalTitle = document.getElementById("legal-modal-title");
  const legalModalBody = document.getElementById("legal-modal-body");
  const legalDocumentButtons = document.querySelectorAll("[data-legal-doc]");
  let legalModalOpener = null;

  const legalDocuments = {
    terms: {
      title: "Termos de Uso",
      template: "legal-terms-template",
    },
    privacy: {
      title: "Política de Privacidade",
      template: "legal-privacy-template",
    },
    refund: {
      title: "Cancelamento e Reembolso",
      template: "legal-refund-template",
    },
  };

  function openLegalModal(documentKey, opener) {
    if (!legalModal || !legalModalTitle || !legalModalBody) return;
    const documentData = legalDocuments[documentKey];
    const template = documentData
      ? document.getElementById(documentData.template)
      : null;
    if (!documentData || !template) return;

    legalModalOpener = opener || null;
    legalModalTitle.textContent = documentData.title;
    legalModalBody.replaceChildren(template.content.cloneNode(true));
    legalModalBody.scrollTop = 0;
    legalModal.classList.add("is-open");
    legalModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    legalModal.querySelector(".legal-modal__close")?.focus();
  }

  function closeLegalModal() {
    if (!legalModal || !legalModal.classList.contains("is-open")) return;
    legalModal.classList.remove("is-open");
    legalModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    legalModalBody?.replaceChildren();
    legalModalOpener?.focus();
    legalModalOpener = null;
  }

  legalDocumentButtons.forEach((button) => {
    button.addEventListener("click", () => {
      openLegalModal(button.dataset.legalDoc, button);
    });
  });

  legalModal?.addEventListener("click", (event) => {
    if (event.target.closest("[data-legal-close]")) {
      closeLegalModal();
    }
  });

  legalModal?.addEventListener("keydown", (event) => {
    if (event.key !== "Tab") return;
    const focusable = Array.from(
      legalModal.querySelectorAll(
        'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
      ),
    );
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeLegalModal();
  });

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
