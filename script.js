const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");
const navLinks = document.querySelectorAll(".nav a");
const brandLink = document.querySelector("#brand-link");
const brandLogo = document.querySelector(".brand-logo");
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

if (brandLogo && brandLink) {
  brandLogo.addEventListener("error", () => {
    brandLink.classList.add("has-fallback");
  });
}

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
