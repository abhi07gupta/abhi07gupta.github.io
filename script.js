(() => {
  const root = document.documentElement;
  const body = document.body;
  const menuButton = document.querySelector(".menu-toggle");
  const mobileNav = document.querySelector(".mobile-nav");
  const copyButton = document.querySelector(".contact-actions button");
  const copyStatus = document.querySelector(".copy-status");
  const emailAddress = "abhi07gupta@gmail.com";
  let scrollFrame = 0;

  function updateScrollState() {
    const maximum = Math.max(1, root.scrollHeight - window.innerHeight);
    root.style.setProperty("--scroll-progress", String(Math.min(1, window.scrollY / maximum)));
    body.classList.toggle("has-scrolled", window.scrollY > 20);
    scrollFrame = 0;
  }

  function requestScrollUpdate() {
    if (!scrollFrame) scrollFrame = window.requestAnimationFrame(updateScrollState);
  }

  function setMenuOpen(open) {
    if (!menuButton || !mobileNav) return;
    menuButton.setAttribute("aria-expanded", String(open));
    const label = menuButton.querySelector("span");
    if (label) label.textContent = open ? "Close" : "Menu";
    mobileNav.classList.toggle("is-open", open);
    body.classList.toggle("menu-open", open);
  }

  if (menuButton && mobileNav) {
    menuButton.addEventListener("click", () => {
      setMenuOpen(menuButton.getAttribute("aria-expanded") !== "true");
    });
    mobileNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => setMenuOpen(false));
    });
    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    });
    window.addEventListener("resize", () => {
      if (window.innerWidth > 860) setMenuOpen(false);
    });
  }

  const revealElements = Array.from(document.querySelectorAll("[data-reveal]"));
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reducedMotion || !("IntersectionObserver" in window)) {
    revealElements.forEach((element) => element.classList.add("is-visible"));
  } else {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -12%", threshold: 0.08 });
    revealElements.forEach((element) => observer.observe(element));
  }

  async function copyEmailAddress() {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(emailAddress);
      } else {
        const field = document.createElement("textarea");
        field.value = emailAddress;
        field.setAttribute("readonly", "");
        field.style.position = "fixed";
        field.style.opacity = "0";
        body.appendChild(field);
        field.select();
        const copied = document.execCommand("copy");
        field.remove();
        if (!copied) throw new Error("Copy command was unavailable");
      }
      if (copyStatus) copyStatus.textContent = "Email copied. Paste it into your preferred email service.";
    } catch {
      if (copyStatus) copyStatus.textContent = `Copy was blocked. Please use ${emailAddress}.`;
    }
  }

  if (copyButton) copyButton.addEventListener("click", copyEmailAddress);
  updateScrollState();
  window.addEventListener("scroll", requestScrollUpdate, { passive: true });
})();
