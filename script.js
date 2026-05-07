const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");
const navLinks = document.querySelectorAll(".nav a");
const brandLink = document.querySelector("#brand-link");
const brandLogo = document.querySelector(".brand-logo");
const matShowcase = document.querySelector(".mat-showcase");
const matImage = document.querySelector(".mat-image");

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

if (matImage && matShowcase) {
  matImage.addEventListener("error", () => {
    matShowcase.classList.add("missing-image");
  });
}
