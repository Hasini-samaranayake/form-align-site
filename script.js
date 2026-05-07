const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");
const navLinks = document.querySelectorAll(".nav a");
const heroLogoWrap = document.querySelector("#hero-logo-wrap");

if (menuButton && nav) {
  menuButton.addEventListener("click", () => {
    nav.classList.toggle("open");
  });
}

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    nav?.classList.remove("open");
  });
});

const setActiveNav = () => {
  const pagePath = window.location.pathname;
  const isDesignPage = pagePath.endsWith("/design-process.html");
  const hash = window.location.hash || "#home";

  navLinks.forEach((link) => {
    const target = new URL(link.href);
    const isDesignLink = target.pathname.endsWith("/design-process.html");
    const isIndexLink = target.pathname.endsWith("/index.html");
    const targetHash = target.hash || "#home";

    const isActive = isDesignPage
      ? isDesignLink
      : isIndexLink && targetHash === hash;

    link.classList.toggle("active", isActive);
    if (isActive) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
};

window.addEventListener("hashchange", setActiveNav);
setActiveNav();

if (heroLogoWrap) {
  const setLogoPop = () => {
    if (window.scrollY > 24) {
      heroLogoWrap.classList.add("popped");
    } else {
      heroLogoWrap.classList.remove("popped");
    }
  };

  window.addEventListener("scroll", setLogoPop, { passive: true });
  setLogoPop();
}
