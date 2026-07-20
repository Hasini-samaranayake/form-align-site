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

// Multi-step waitlist quiz
const quiz = document.querySelector("#quiz");
if (quiz) {
  const order = ["hook", "q1", "q2", "q3", "done"];
  const stepEls = {};
  order.forEach((s) => (stepEls[s] = quiz.querySelector(`.quiz-step[data-step="${s}"]`)));
  const progress = quiz.querySelector("#quiz-progress");
  const bar = quiz.querySelector("#quiz-progress-bar");
  const progressFor = { q1: 33, q2: 66, q3: 100 };
  const state = { name: "", contact: "", level: "", challenge: [], feature: "" };
  let current = "hook";

  const show = (step) => {
    Object.values(stepEls).forEach((el) => el.classList.remove("is-active"));
    stepEls[step].classList.add("is-active");
    current = step;
    if (progressFor[step]) {
      progress.hidden = false;
      bar.style.width = progressFor[step] + "%";
    } else {
      progress.hidden = true;
    }
    const input = stepEls[step].querySelector("input");
    if (input) setTimeout(() => input.focus(), 60);
  };

  // Option selection
  quiz.querySelectorAll(".quiz-opts").forEach((group) => {
    const multi = group.dataset.multi === "true";
    const key = group.dataset.key;
    group.querySelectorAll(".quiz-opt").forEach((opt) => {
      opt.addEventListener("click", () => {
        if (multi) {
          opt.classList.toggle("sel");
        } else {
          group.querySelectorAll(".quiz-opt").forEach((o) => o.classList.remove("sel"));
          opt.classList.add("sel");
        }
        const sel = [...group.querySelectorAll(".quiz-opt.sel")].map((o) => o.dataset.value);
        state[key] = multi ? sel : sel[0] || "";
        const cta = group.closest(".quiz-step").querySelector('[data-action="next"],[data-action="submit"]');
        if (cta) cta.disabled = sel.length === 0;
      });
    });
  });

  const validContact = (v) => {
    v = v.trim();
    const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
    const phone = /^\+?[\d][\d\s().-]{6,}$/.test(v);
    return email || phone;
  };

  const submit = async () => {
    const btn = stepEls.q3.querySelector('[data-action="submit"]');
    const orig = btn.textContent;
    btn.disabled = true;
    btn.textContent = "Joining…";
    const payload = {
      firstName: state.name,
      contact: state.contact,
      level: state.level,
      challenge: state.challenge.join("; "),
      feature: state.feature,
    };
    const endpoint = quiz.dataset.endpoint;
    try {
      if (endpoint) {
        await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(payload),
        });
      }
    } catch (e) {
      /* Still show the payoff; submission can be retried from the backend side. */
    }
    const feat = quiz.querySelector("#payoff-feature");
    if (feat && state.feature) feat.textContent = state.feature;
    show("done");
  };

  quiz.addEventListener("click", (e) => {
    const act = e.target.closest("[data-action]")?.dataset.action;
    if (!act) return;
    if (act === "start") {
      const name = quiz.querySelector("#q-name").value.trim();
      const contact = quiz.querySelector("#q-contact").value.trim();
      const err = quiz.querySelector("#q-contact-err");
      if (!name) return quiz.querySelector("#q-name").focus();
      if (!validContact(contact)) {
        err.hidden = false;
        return quiz.querySelector("#q-contact").focus();
      }
      err.hidden = true;
      state.name = name;
      state.contact = contact;
      show("q1");
    } else if (act === "next") {
      const flow = ["q1", "q2", "q3"];
      show(flow[flow.indexOf(current) + 1]);
    } else if (act === "back") {
      const flow = ["hook", "q1", "q2", "q3"];
      show(flow[Math.max(0, flow.indexOf(current) - 1)]);
    } else if (act === "submit") {
      submit();
    }
  });
}

// Footer year
document.querySelectorAll(".year").forEach((el) => {
  el.textContent = new Date().getFullYear();
});
