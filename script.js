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

function initThreads() {
  const threads = Array.from(document.querySelectorAll("[data-thread]"));
  if (!threads.length) return;

  if (reduceMotion || !("IntersectionObserver" in window)) return;

  // The viewport only gets its fixed height under .motion-enabled, and the
  // player measures that height. Add it synchronously so the first follow()
  // does not measure an unclipped track and conclude there is no overflow.
  root.classList.add("motion-enabled");

  function parts(thread) {
    return Array.from(thread.querySelectorAll(".thread-msg, .thread-typing"));
  }

  function follow(thread) {
    const track = thread.querySelector(".thread-track");
    const viewport = thread.querySelector(".thread-viewport");
    if (!track || !viewport) return;
    const overflow = track.scrollHeight - viewport.clientHeight;
    track.style.transform = `translateY(${-Math.max(0, overflow)}px)`;
  }

  function reset(thread) {
    parts(thread).forEach((node) => {
      node.classList.remove("is-shown");
      if (node.classList.contains("thread-msg")) node.style.display = "none";
    });
    const track = thread.querySelector(".thread-track");
    if (track) track.style.transform = "translateY(0)";
  }

  // Safety net: if the sequence never starts, the thread must not sit empty.
  function revealAll(thread) {
    parts(thread).forEach((node) => {
      if (node.classList.contains("thread-typing")) {
        node.classList.remove("is-shown");
        return;
      }
      node.style.display = "block";
      node.classList.add("is-shown");
    });
    follow(thread);
  }

  function play(thread) {
    if (thread.dataset.playing === "1") return;
    thread.dataset.playing = "1";
    thread.dataset.started = "1";

    const replay = thread.querySelector(".thread-replay");
    if (replay) replay.hidden = true;

    reset(thread);

    let delay = 380;

    parts(thread).forEach((node) => {
      const isTyping = node.classList.contains("thread-typing");

      window.setTimeout(() => {
        if (isTyping) {
          node.classList.add("is-shown");
        } else {
          node.style.display = "block";
          void node.offsetHeight;
          node.classList.add("is-shown");
        }
        follow(thread);
      }, delay);

      if (isTyping) {
        delay += 1350;
        window.setTimeout(() => node.classList.remove("is-shown"), delay - 60);
      } else {
        delay += node.dataset.hold ? Number(node.dataset.hold) : 1500;
      }
    });

    window.setTimeout(() => {
      thread.dataset.playing = "0";
      if (replay) replay.hidden = false;
    }, delay);
  }

  threads.forEach((thread) => {
    reset(thread);

    const replay = thread.querySelector(".thread-replay");
    if (replay) replay.addEventListener("click", () => play(thread));

    window.setTimeout(() => {
      if (thread.dataset.started !== "1") revealAll(thread);
    }, 5000);
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        play(entry.target);
      });
    },
    { threshold: 0.25 },
  );

  threads.forEach((thread) => observer.observe(thread));
}

initThreads();
