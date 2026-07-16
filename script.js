// FormAlign — shared interactions

// Mobile nav toggle
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
  navLinks.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      navLinks.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    })
  );
}

// Scroll-reveal
const revealEls = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window && revealEls.length) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add("in"));
}

// Hero live-feedback demo loop
const fcFill = document.querySelector(".fc-bar-fill");
const fcStatus = document.querySelector(".fc-status");
const fcCue = document.querySelector(".fc-cue");
const fcValue = document.querySelector(".fc-value");
if (fcFill && fcStatus && fcCue) {
  const states = [
    { pct: 62, good: false, cue: "Shift your weight forward" },
    { pct: 80, good: true, cue: "Good form — hold it there" },
    { pct: 88, good: false, cue: "Ease off the front foot" },
    { pct: 79, good: true, cue: "Good form — hold it there" },
  ];
  let i = 0;
  const apply = () => {
    const s = states[i % states.length];
    fcFill.style.width = s.pct + "%";
    fcFill.classList.toggle("warn", !s.good);
    fcStatus.textContent = s.good ? "Good form" : "Adjust";
    fcStatus.classList.toggle("good", s.good);
    fcStatus.classList.toggle("adjust", !s.good);
    fcCue.textContent = s.cue;
    if (fcValue) fcValue.textContent = s.pct + "%";
    i++;
  };
  apply();
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    setInterval(apply, 2600);
  }
}

// Animate dashboard bars when revealed
const animatedBars = document.querySelectorAll("[data-width]");
if (animatedBars.length && "IntersectionObserver" in window) {
  const barIO = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.style.width = e.target.dataset.width;
          barIO.unobserve(e.target);
        }
      });
    },
    { threshold: 0.4 }
  );
  animatedBars.forEach((el) => barIO.observe(el));
} else {
  animatedBars.forEach((el) => (el.style.width = el.dataset.width));
}

// Waitlist form (Formspree)
const waitlistForm = document.querySelector("#waitlist-form");
if (waitlistForm) {
  waitlistForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = waitlistForm.querySelector("button[type=submit]");
    const original = btn.textContent;
    btn.disabled = true;
    btn.textContent = "Joining…";
    try {
      const res = await fetch(waitlistForm.action, {
        method: "POST",
        body: new FormData(waitlistForm),
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error("submit failed");
      document.querySelector("#form-body").hidden = true;
      document.querySelector("#form-success").hidden = false;
    } catch (err) {
      btn.disabled = false;
      btn.textContent = original;
      const note = document.querySelector("#form-error");
      if (note) note.hidden = false;
    }
  });
}

// Footer year
document.querySelectorAll(".year").forEach((el) => {
  el.textContent = new Date().getFullYear();
});
