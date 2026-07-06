const root = document.documentElement;
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const supportsFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
let cursorIdleTimer;

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function updateScrollEffects() {
  const hero = document.querySelector(".hero");
  const pageHeight = Math.max(root.scrollHeight - window.innerHeight, 1);
  const nightProgress = clamp(window.scrollY / pageHeight, 0, 1);

  root.style.setProperty("--night", Math.pow(nightProgress, 0.82).toFixed(3));

  if (hero) {
    const heroHeight = hero.offsetHeight || window.innerHeight;
    const heroProgress = clamp(window.scrollY / (heroHeight * 0.72), 0, 1);
    root.style.setProperty("--twilight", heroProgress.toFixed(3));
  }
}

function initReveals() {
  const revealElements = document.querySelectorAll(".reveal-on-scroll");

  if (reduceMotion) {
    revealElements.forEach((element) => element.classList.add("in-view"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.22,
      rootMargin: "0px 0px -72px 0px",
    },
  );

  revealElements.forEach((element) => observer.observe(element));
}

function initCursorEffects() {
  if (reduceMotion || !supportsFinePointer) return;

  window.addEventListener(
    "pointermove",
    (event) => {
      root.style.setProperty("--cursor-x", `${event.clientX}px`);
      root.style.setProperty("--cursor-y", `${event.clientY}px`);
      root.style.setProperty("--cursor-active", "1");

      window.clearTimeout(cursorIdleTimer);
      cursorIdleTimer = window.setTimeout(() => {
        root.style.setProperty("--cursor-active", "0");
      }, 1100);
    },
    { passive: true },
  );

  window.addEventListener("pointerleave", () => {
    root.style.setProperty("--cursor-active", "0");
  });

  document.querySelectorAll(".cursor-reactive").forEach((element) => {
    element.addEventListener("pointermove", (event) => {
      const rect = element.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;

      element.style.setProperty("--text-x", `${clamp(x, 0, 100).toFixed(1)}%`);
      element.style.setProperty("--text-y", `${clamp(y, 0, 100).toFixed(1)}%`);
      element.classList.add("is-lit");
    });

    element.addEventListener("pointerleave", () => {
      element.classList.remove("is-lit");
    });
  });
}

window.addEventListener("scroll", updateScrollEffects, { passive: true });
window.addEventListener("resize", updateScrollEffects);

updateScrollEffects();
initReveals();
initCursorEffects();
