const root = document.documentElement;
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const supportsFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
let cursorIdleTimer;

const translations = {
  en: {
    "meta.title": "etgar.ai | A private AI operating layer for your life",
    "meta.description": "A working personal AI prototype for people who want an AI system that remembers, coordinates, and stays under their control.",
    "nav.how": "How it works",
    "nav.proof": "What exists",
    "nav.interest": "Early interest",
    "hero.eyebrow": "Working private prototype",
    "hero.title": "A private AI operating layer for your life.",
    "hero.lede": "For people who want an AI system that remembers, coordinates, and stays under their control, with a personal OS live and working 24/7 in the background.",
    "hero.primaryCta": "Register interest",
    "hero.secondaryCta": "See what it does",
    "intro.kicker": "The idea",
    "intro.title": "Not another chatbot. A personal system that lives where life already happens.",
    "intro.body": 'etgar.ai is a working pilot of a private personal OS with long-term memory. It creates and manages a readable second-brain vault that stays active across daily life. <a href="#proof">See what exists today.</a>',
    "works.kicker": "How it works",
    "works.title": "Three ideas make it different.",
    "feature.memory.title": "It remembers from sources",
    "feature.memory.body": "The assistant builds and maintains a second-brain vault from real notes, logs, tasks, and records, not vague chat memory. Important facts are traceable back to where they came from.",
    "feature.coordinate.title": "It coordinates across life",
    "feature.coordinate.body": "It can work across email, calendar, Trello, WhatsApp, Telegram, grocery lists, travel plans, vendor tracking, and Home Assistant scenes, lights, sensors, cameras, cleaning robots, watering, alert systems, and smart routines that coordinate across the home.",
    "feature.control.title": "Transparency and control stay in your hands",
    "feature.control.body": "The system is built around clear permissions. Anything that enters long-term memory requires human approval, and control of the knowledge always stays with you. It is model-agnostic rather than locked to one provider.",
    "inside.kicker": "Inside the prototype",
    "inside.title": "A small team of focused agents, not one giant generalist.",
    "inside.main.title": "Main assistant",
    "inside.main.body": "A live personal OS for private conversation, memory, inbox, tasks, and daily coordination.",
    "inside.trip.title": "Trip agent",
    "inside.trip.body": "Dedicated travel planning inside family trip groups.",
    "inside.grocery.title": "Grocery agent",
    "inside.grocery.body": "Shared shopping list management with automatic cleanup and categories.",
    "inside.home.title": "Home control",
    "inside.home.body": "Home Assistant access for lights, scenes, sensors, cameras, cleaning robots, watering, alerts, and household routines.",
    "inside.finance.title": "Finance ops",
    "inside.finance.body": "WhatsApp capture for personal and SME invoices, receipts, payments, reimbursements, and follow-ups.",
    "inside.watchdogs.title": "Watchdogs",
    "inside.watchdogs.body": "Nightly checks, fallbacks, canary questions, and backups.",
    "proof.kicker": "What exists today",
    "proof.title": "Already working, still evolving.",
    "proof.messaging.title": "WhatsApp and Telegram",
    "proof.messaging.body": "Daily interaction in private and family contexts.",
    "proof.vault.title": "Memory vault",
    "proof.vault.body": "A self-managed second brain for notes, decisions, tasks, receipts, and context that stays readable over time.",
    "proof.home.title": "Home and family ops",
    "proof.home.body": "Home Assistant, cameras, cleaning, watering, alerts, groceries, and trips.",
    "proof.inbox.title": "Inbox and calendar",
    "proof.inbox.body": "Summaries, lookups, and day-ahead awareness.",
    "proof.tasks.title": "Tasks and projects",
    "proof.tasks.body": "Trello and monday.com workflows, personal notes, and project continuity.",
    "proof.finance.title": "Personal and SME finance",
    "proof.finance.body": "Invoices, receipts, payments, reimbursements, vendor tracking, and shared expenses captured from WhatsApp.",
    "proof.approval.title": "Human-approved memory",
    "proof.approval.body": "Weekly review before facts enter long-term memory.",
    "proof.models.title": "LLM-Agnostic Uptime & Routing",
    "proof.models.body": "Automatic fall back across Claude, OpenAI, and Google in case provider is down, credits are out, or a task requires deep thinking.",
    "proof.resilience.title": "Resilience layer",
    "proof.resilience.body": "Always-on checks, fallbacks, backups, and maintenance logs.",
    "founder.kicker": "Who is behind it",
    "founder.title": 'Built by <a href="https://www.linkedin.com/in/etgar1/" target="_blank" rel="noopener">Etgar Bonar</a> as a personal system that works in practice, born from personal need and a lot of curiosity.',
    "founder.body": "",
    "interest.kicker": "Early interest",
    "interest.title": "Let's explore where this could help.",
    "interest.body": "",
    "interest.cta": "Tell me what interests you",
    "footer.questions": 'Questions: <a href="mailto:ai@bonar1.com">ai@bonar1.com</a>',
    "footer.privacy": "Privacy: this site uses Cloudflare Web Analytics and email links. No forms or ad tracking.",
    "mailto.primary": "mailto:ai@bonar1.com?subject=Interested%20in%20etgar.ai&body=Hi%20Etgar%2C%0A%0AI%27m%20interested%20in%20the%20private%20AI%20operating%20layer.%20Tell%20me%20more.%0A",
    "mailto.interest": "mailto:ai@bonar1.com?subject=Interested%20in%20etgar.ai&body=Hi%20Etgar%2C%0A%0AI%27m%20interested%20in%20the%20private%20AI%20operating%20layer.%20A%20bit%20about%20what%20I%27d%20want%20it%20to%20help%20with%3A%0A",
    "toggle.label": "עברית",
    "toggle.aria": "Switch to Hebrew",
  },
  he: {
    "meta.title": "שכבת הפעלה פרטית של AI לחיים | etgar.ai",
    "meta.description": "אב טיפוס עובד של AI אישי לאנשים שרוצים מערכת שזוכרת, מתאמת, ונשארת בשליטתם.",
    "nav.how": "איך זה עובד",
    "nav.proof": "מה כבר קיים",
    "nav.interest": "שיחת היכרות",
    "hero.eyebrow": "אב-טיפוס פרטי בפעולה",
    "hero.title": "מערכת ההפעלה האישית שלך, מבוססת AI.",
    "hero.lede": "לאנשים שלא מתפשרים על פרטיות ושליטה. מערכת הבינה המלאכותית הפרטית שלך זוכרת, מסנכרנת ופועלת ברקע מסביב לשעון, כדי לנהל עבורך את החיים בצורה חכמה וחלקה.",
    "hero.primaryCta": "אני רוצה לשמוע עוד",
    "hero.secondaryCta": "איך זה עובד?",
    "intro.kicker": "הרעיון מאחורי המערכת",
    "intro.title": "לא עוד צ'אטבוט. מערכת אישית שחיה איפה שהחיים שלך קורים.",
    "intro.body": 'etgar.ai הוא פיילוט פעיל של מערכת הפעלה אישית (Personal OS) בעלת זיכרון לטווח ארוך. היא יוצרת ומנהלת עבורך כספת זיכרון, מוח שני קריא ומתעדכן, ומשתלבת באופן טבעי באפליקציות ובמכשירים שבהם אתה כבר משתמש.',
    "works.kicker": "איך זה עובד",
    "works.title": "שלושה עקרונות שעושים את ההבדל.",
    "feature.memory.title": "זיכרון מבוסס מקורות אמינים",
    "feature.memory.body": "המערכת שואבת מידע מתוך פתקים, יומנים, משימות ורשומות קיימות, לא מזיכרון צ'אט מעורפל. כל עובדה ניתנת למעקב ישיר חזרה למקור שלה.",
    "feature.coordinate.title": "סנכרון מלא של כל תחומי החיים",
    "feature.coordinate.body": "חיבור רציף בין המייל, היומן, Trello, וואטסאפ וטלגרם, ועד רשימות קניות, תכנון טיולים, מעקב ספקים ומערכות בית חכם: תאורה, מצלמות, השקיה ועוד.",
    "feature.control.title": "שקיפות ושליטה מלאה בידיים שלך",
    "feature.control.body": "המערכת בנויה על הרשאות ברורות. כל מידע שנכנס לזיכרון ארוך-הטווח דורש אישור אנושי, והשליטה על הידע נשארת תמיד אצלך. היא לא נעולה לספק מודלים אחד.",
    "inside.kicker": "בתוך האב טיפוס",
    "inside.title": "צוות קטן של סוכנים ממוקדים, לא גנרליסט ענק אחד.",
    "inside.main.title": "עוזר ראשי",
    "inside.main.body": "מערכת הפעלה אישית חיה לשיחות פרטיות, זיכרון, אימייל, משימות ותיאום יומיומי.",
    "inside.trip.title": "סוכן נסיעות",
    "inside.trip.body": "תכנון נסיעות ייעודי בתוך קבוצות משפחתיות.",
    "inside.grocery.title": "סוכן קניות",
    "inside.grocery.body": "ניהול רשימת קניות משותפת עם ניקוי אוטומטי וקטגוריות.",
    "inside.home.title": "שליטה בבית",
    "inside.home.body": "גישה ל-Home Assistant עבור אורות, סצנות, חיישנים, מצלמות, רובוט ניקיון, השקיה, התראות ורוטינות ביתיות.",
    "inside.finance.title": "ניהול פיננסי",
    "inside.finance.body": "קליטה מ-WhatsApp של חשבוניות, קבלות, תשלומים, החזרים ומעקבי תשלום לאנשים פרטיים ולעסקים קטנים.",
    "inside.watchdogs.title": "מנגנוני בקרה",
    "inside.watchdogs.body": "בדיקות ליליות, נתיבי גיבוי, שאלות קנרית, וגיבויים.",
    "proof.kicker": "מה קיים היום",
    "proof.title": "זה כבר עובד, ועדיין מתפתח.",
    "proof.messaging.title": "ערוצי WhatsApp ו-Telegram",
    "proof.messaging.body": "אינטראקציה יומיומית בהקשרים פרטיים ומשפחתיים.",
    "proof.vault.title": "כספת זיכרון ומוח שני",
    "proof.vault.body": "יצירה וניהול מתמשך של מרחב ידע אישי: פתקים, החלטות, משימות, קבלות והקשרים שנשמרים בצורה קריאה וניתנת לבדיקה.",
    "proof.home.title": "בית ומשפחה",
    "proof.home.body": "ה-Home Assistant, מצלמות, ניקיון, השקיה, התראות, קניות ונסיעות.",
    "proof.inbox.title": "אימייל ויומן",
    "proof.inbox.body": "סיכומים, חיפושים ומודעות ליום הקרוב.",
    "proof.tasks.title": "משימות ופרויקטים",
    "proof.tasks.body": "תהליכי עבודה ב-Trello וב-monday.com, הערות אישיות והמשכיות פרויקטים.",
    "proof.finance.title": "פיננסים אישיים ולעסקים קטנים",
    "proof.finance.body": "חשבוניות, קבלות, תשלומים, החזרים, מעקב ספקים והוצאות משותפות שנקלטות מ-WhatsApp.",
    "proof.approval.title": "זיכרון באישור אנושי",
    "proof.approval.body": "סקירה שבועית לפני שעובדות נכנסות לזיכרון ארוך טווח.",
    "proof.models.title": "זמינות LLM רציפה וגמישות ספקים מלאה",
    "proof.models.body": "מעבר אוטומטי בין Claude, OpenAI ו-Google בזמן תקלות ספק, סיום קרדיטים, או כשמשימה דורשת חשיבה מעמיקה.",
    "proof.resilience.title": "שכבת אמינות",
    "proof.resilience.body": "בדיקות קבועות, נתיבי גיבוי, גיבויים ולוגים של תחזוקה.",
    "founder.kicker": "מי עומד מאחורי זה",
    "founder.title": 'נבנה על ידי <a href="https://www.linkedin.com/in/etgar1/" target="_blank" rel="noopener">אתגר בונר</a> כמערכת אישית שעובדת בפועל ונולדה מתוך צורך אישי וסקרנות רבה.',
    "founder.body": "",
    "interest.kicker": "עניין ראשוני",
    "interest.title": "בואו נבדוק איפה זה יכול לעזור לכם.",
    "interest.body": "",
    "interest.cta": "כתבו מה מעניין אתכם",
    "footer.questions": 'שאלות: <a href="mailto:ai@bonar1.com">ai@bonar1.com</a>',
    "footer.privacy": "פרטיות: האתר משתמש ב-Cloudflare Web Analytics ובקישורי אימייל. אין טפסים או מעקב פרסומי.",
    "mailto.primary": "mailto:ai@bonar1.com?subject=%D7%9E%D7%AA%D7%A2%D7%A0%D7%99%D7%99%D7%9F%20%D7%91-etgar.ai&body=%D7%94%D7%99%20%D7%90%D7%AA%D7%92%D7%A8%2C%0A%0A%D7%90%D7%A0%D7%99%20%D7%9E%D7%AA%D7%A2%D7%A0%D7%99%D7%99%D7%9F%20%D7%91%D7%A9%D7%9B%D7%91%D7%AA%20%D7%94%D7%A4%D7%A2%D7%9C%D7%94%20%D7%A4%D7%A8%D7%98%D7%99%D7%AA%20%D7%A9%D7%9C%20AI.%20%D7%90%D7%A9%D7%9E%D7%97%20%D7%9C%D7%A9%D7%9E%D7%95%D7%A2%20%D7%A2%D7%95%D7%93.%0A",
    "mailto.interest": "mailto:ai@bonar1.com?subject=%D7%9E%D7%AA%D7%A2%D7%A0%D7%99%D7%99%D7%9F%20%D7%91-etgar.ai&body=%D7%94%D7%99%20%D7%90%D7%AA%D7%92%D7%A8%2C%0A%0A%D7%90%D7%A0%D7%99%20%D7%9E%D7%AA%D7%A2%D7%A0%D7%99%D7%99%D7%9F%20%D7%91%D7%A9%D7%9B%D7%91%D7%AA%20%D7%94%D7%A4%D7%A2%D7%9C%D7%94%20%D7%A4%D7%A8%D7%98%D7%99%D7%AA%20%D7%A9%D7%9C%20AI.%20%D7%9E%D7%94%20%D7%A9%D7%94%D7%99%D7%99%D7%AA%D7%99%20%D7%A8%D7%95%D7%A6%D7%94%20%D7%A9%D7%96%D7%94%20%D7%99%D7%A2%D7%96%D7%95%D7%A8%20%D7%9C%D7%99%20%D7%90%D7%99%D7%AA%D7%95%3A%0A",
    "toggle.label": "English",
    "toggle.aria": "Switch to English",
  },
};

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function getStoredLanguage() {
  const requestedLanguage = new URLSearchParams(window.location.search).get("lang");
  if (requestedLanguage === "he" || requestedLanguage === "en") {
    return requestedLanguage;
  }

  const storedLanguage = window.localStorage.getItem("etgarAiLanguage");
  return storedLanguage === "he" ? "he" : "en";
}

function syncLanguageUrl(language) {
  const url = new URL(window.location.href);

  if (language === "he") {
    url.searchParams.set("lang", "he");
  } else {
    url.searchParams.delete("lang");
  }

  window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
}

function applyLanguage(language) {
  const dictionary = translations[language] || translations.en;
  const html = document.documentElement;
  const metaDescription = document.querySelector('meta[name="description"]');
  const ogDescription = document.querySelector('meta[property="og:description"]');
  const toggleLabel = document.querySelector("[data-language-toggle-label]");
  const toggleButton = document.querySelector("[data-language-toggle]");

  html.lang = language === "he" ? "he" : "en";
  html.dir = language === "he" ? "rtl" : "ltr";
  document.title = dictionary["meta.title"];

  if (metaDescription) {
    metaDescription.setAttribute("content", dictionary["meta.description"]);
  }

  if (ogDescription) {
    ogDescription.setAttribute("content", dictionary["hero.lede"]);
  }

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const value = dictionary[element.dataset.i18n];
    if (value) element.textContent = value;
  });

  document.querySelectorAll("[data-i18n-html]").forEach((element) => {
    const value = dictionary[element.dataset.i18nHtml];
    if (value) element.innerHTML = value;
  });

  document.querySelectorAll("[data-i18n-href]").forEach((element) => {
    const value = dictionary[element.dataset.i18nHref];
    if (value) element.setAttribute("href", value);
  });

  if (toggleLabel) {
    toggleLabel.textContent = dictionary["toggle.label"];
  }

  if (toggleButton) {
    toggleButton.setAttribute("aria-label", dictionary["toggle.aria"]);
  }

  window.localStorage.setItem("etgarAiLanguage", language);
  syncLanguageUrl(language);
}

function initLanguageToggle() {
  const toggleButton = document.querySelector("[data-language-toggle]");
  const currentLanguage = getStoredLanguage();

  applyLanguage(currentLanguage);

  if (!toggleButton) return;

  toggleButton.addEventListener("click", () => {
    const nextLanguage = document.documentElement.lang === "he" ? "en" : "he";
    applyLanguage(nextLanguage);
  });
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

window.addEventListener("scroll", updateScrollEffects, { passive: true });
window.addEventListener("resize", updateScrollEffects);

initLanguageToggle();
updateScrollEffects();
initReveals();
initCursorEffects();
