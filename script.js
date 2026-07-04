(() => {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Mobile menu
  const toggle = document.querySelector(".nav-toggle");
  const menu = document.getElementById("menuMobile");
  if (toggle && menu) {
    const setExpanded = (expanded) => {
      toggle.setAttribute("aria-expanded", String(expanded));
      menu.classList.toggle("open", expanded);
    };

    toggle.addEventListener("click", () => {
      const expanded = toggle.getAttribute("aria-expanded") === "true";
      setExpanded(!expanded);
    });

    // Fechar ao clicar em um link
    menu.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => setExpanded(false));
    });

    // Fechar ao redimensionar para desktop
    window.addEventListener("resize", () => {
      if (window.innerWidth > 860) setExpanded(false);
    });
  }

  // Reveal on scroll (IntersectionObserver)
  const revealEls = Array.from(document.querySelectorAll("[data-reveal]"));
  if ("IntersectionObserver" in window && revealEls.length) {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.18 },
    );

    revealEls.forEach((el) => io.observe(el));
  } else {
    // Fallback: exibe tudo
    revealEls.forEach((el) => el.classList.add("revealed"));
  }

  // Smooth scroll (fallback manual)
  document.querySelectorAll("a[data-scroll-soft]").forEach((a) => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      if (!href || !href.startsWith("#")) return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  // FAQ accordion
  const faqItems = Array.from(document.querySelectorAll(".faq-item"));
  faqItems.forEach((item) => {
    const q = item.querySelector(".faq-q");
    const a = item.querySelector(".faq-a");
    if (!q || !a) return;

    q.addEventListener("click", () => {
      const isOpen = item.getAttribute("data-open") === "true";
      faqItems.forEach((it) => {
        if (it !== item) {
          it.setAttribute("data-open", "false");
          const qq = it.querySelector(".faq-q");
          const aa = it.querySelector(".faq-a");
          if (qq) qq.setAttribute("aria-expanded", "false");
          if (aa) aa.setAttribute("aria-hidden", "true");
        }
      });

      item.setAttribute("data-open", String(!isOpen));
      q.setAttribute("aria-expanded", String(!isOpen));
      a.setAttribute("aria-hidden", String(isOpen));
    });
  });

  // Animated counters
  const counterEls = Array.from(document.querySelectorAll(".num-value"));
  const prefersReduced =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const animateCounter = (el) => {
    const target = Number(el.getAttribute("data-count") || "0");
    const suffix = el.getAttribute("data-suffix") || "";
    if (!Number.isFinite(target)) return;

    const duration = 1100; // ms
    const start = performance.now();

    const from = 0;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - t, 3);
      const current = Math.round(from + (target - from) * eased);
      el.textContent = String(current) + suffix;
      if (t < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  if (
    !prefersReduced &&
    counterEls.length &&
    "IntersectionObserver" in window
  ) {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.35 },
    );
    counterEls.forEach((el) => io.observe(el));
  } else {
    // reduced motion: mostra valores finais
    counterEls.forEach((el) => {
      const target = Number(el.getAttribute("data-count") || "0");
      const suffix = el.getAttribute("data-suffix") || "";
      if (Number.isFinite(target)) el.textContent = String(target) + suffix;
    });
  }

  // WhatsApp link (fictício)
  const btnWhats = document.getElementById("btnWhatsApp");
  const phone = "5511988887766"; // fictício
  if (btnWhats) {
    const msg = encodeURIComponent("Olá! Gostaria de agendar uma consulta.");
    btnWhats.setAttribute("href", `https://wa.me/${phone}?text=${msg}`);
  }

  // Voltar ao topo
  const toTopEl = document.querySelector('.to-top[href="#topo"], .to-top');
  if (toTopEl) {
    const threshold = 300;

    const update = () => {
      const isVisible = window.scrollY > threshold;
      toTopEl.classList.toggle("is-visible", isVisible);
    };

    // Estado inicial
    update();

    window.addEventListener("scroll", update, { passive: true });

    // Click com scroll suave e foco acessível
    toTopEl.addEventListener("click", (e) => {
      // Evita o comportamento padrão do <a href="#topo"> para controlar o offset/foco
      e.preventDefault();
      const topo = document.getElementById("topo");
      (topo || document.body).scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      // Move o foco para o topo para leitores de tela
      if (topo) {
        topo.setAttribute("tabindex", "-1");
        topo.focus({ preventScroll: true });
        // Remove tabindex depois para não “poluir” navegação
        setTimeout(() => topo.removeAttribute("tabindex"), 500);
      }
    });
  }

  // Form (removido da UI no layout atual)
  // Mantido intencionalmente vazio para não quebrar o restante do script.
})();
