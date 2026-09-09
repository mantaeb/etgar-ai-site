const root = document.documentElement;
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const supportsFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
let cursorIdleTimer;

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function updateScrollEffects() {
  const hero = document.querySelector(".hero");

  if (hero) {
    const heroHeight = hero.offsetHeight || window.innerHeight;
    const heroProgress = clamp(window.scrollY / (heroHeight * 0.72), 0, 1);
    root.style.setProperty("--twilight", heroProgress.toFixed(3));
  }
}

function initReveals() {
  if (reduceMotion || !("IntersectionObserver" in window)) return;

  const revealElements = document.querySelectorAll(".reveal-on-scroll");
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
      threshold: 0.18,
      rootMargin: "0px 0px -56px 0px",
    },
  );

  revealElements.forEach((element) => observer.observe(element));
  window.requestAnimationFrame(() => root.classList.add("motion-enabled"));
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

  document.querySelectorAll(".cursor-reactive, .section-kicker, .eyebrow").forEach((element) => {
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

function restoreFragmentPosition() {
  if (!window.location.hash) return;

  const target = document.querySelector(window.location.hash);
  if (!target) return;

  window.requestAnimationFrame(() => target.scrollIntoView());
}

window.addEventListener("scroll", updateScrollEffects, { passive: true });
window.addEventListener("resize", updateScrollEffects);
window.addEventListener("load", restoreFragmentPosition);

updateScrollEffects();
initReveals();
initCursorEffects();
restoreFragmentPosition();
window.setTimeout(restoreFragmentPosition, 350);

function initScenes() {
  if (reduceMotion || !("IntersectionObserver" in window)) return;

  const scenes = document.querySelectorAll(".scene-scan, .scene-redacted");
  if (!scenes.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in-view");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.35 },
  );

  scenes.forEach((scene) => observer.observe(scene));
}

function initSceneScroll() {
  if (reduceMotion) return;

  const frames = Array.from(document.querySelectorAll(".scene-tall .scene-frame"));
  if (!frames.length) return;

  function updateSceneScroll() {
    frames.forEach((frame) => {
      const image = frame.querySelector("img");
      if (!image) return;

      const travel = image.offsetHeight - frame.offsetHeight;
      if (travel <= 0) {
        frame.style.setProperty("--scene-shift", "0px");
        return;
      }

      const rect = frame.getBoundingClientRect();
      const span = window.innerHeight + rect.height;
      const progress = clamp((window.innerHeight - rect.top) / span, 0, 1);
      frame.style.setProperty("--scene-shift", `${(-travel * progress).toFixed(1)}px`);
    });
  }

  window.addEventListener("scroll", updateSceneScroll, { passive: true });
  window.addEventListener("resize", updateSceneScroll);
  window.addEventListener("load", updateSceneScroll);
  updateSceneScroll();
}

initScenes();
initSceneScroll();
