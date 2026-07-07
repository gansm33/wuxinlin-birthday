(function () {
  const profile = window.BIRTHDAY_PROFILE || {};

  const $ = (selector) => document.querySelector(selector);
  const PASSWORD = "zmh708";
  const AUTH_KEY = "zmh-birthday-unlocked";

  const setText = (selector, text) => {
    const node = $(selector);
    if (node && text !== undefined && text !== null) node.textContent = text;
  };

  function applyProfile() {
    document.title = profile.heroTitle || "生日快乐呀，张梦涵";
    setText("#profileBadge", profile.badge);
    setText("#heroTitle", profile.heroTitle);
    setText("#heroSubtitle", profile.heroSubtitle);
    setText("#birthdayText", profile.birthdayText);
    setText("#ageText", profile.age ? `${profile.age}岁生日快乐` : "生日快乐");
    setText("#footerLine", profile.footerLine);
    const signature = $("#signature");
    if (signature) {
      if (profile.signature) {
        signature.textContent = profile.signature;
        signature.hidden = false;
      } else {
        signature.hidden = true;
      }
    }

    const heroPhoto = $("#heroPhoto");
    const heroFrame = $("#heroPhotoFrame");
    if (heroPhoto && profile.heroPhoto?.src) {
      heroPhoto.src = profile.heroPhoto.src;
      heroPhoto.alt = profile.heroPhoto.alt || `${profile.name || "她"}的照片`;
      setText("#heroPhotoCaption", profile.heroPhoto.caption);
    } else if (heroFrame) {
      heroFrame.hidden = true;
    }

    const lines = $("#openingLines");
    if (lines) {
      lines.innerHTML = "";
      (profile.openingLines || []).forEach((line) => {
        const span = document.createElement("span");
        span.textContent = line;
        lines.appendChild(span);
      });
    }

    const letter = $("#letterContent");
    if (letter) {
      letter.innerHTML = "";
      (profile.letter || []).forEach((text) => {
        const p = document.createElement("p");
        p.textContent = text;
        letter.appendChild(p);
      });
    }

    const grid = $("#keywordGrid");
    if (grid) {
      grid.innerHTML = "";
      (profile.keywords || []).forEach((item, index) => {
        const card = document.createElement("article");
        card.className = "keyword-card";
        card.style.setProperty("--delay", `${index * 70}ms`);

        const copy = document.createElement("div");
        copy.className = "keyword-copy";
        const title = document.createElement("h3");
        title.textContent = item.title;
        const note = document.createElement("p");
        note.textContent = item.note;
        copy.append(title, note);

        const artKey = item.art || "sunny";
        const art = document.createElement("div");
        art.className = `keyword-art keyword-art-${artKey}`;
        art.setAttribute("aria-hidden", "true");

        const sticker = document.createElement("img");
        sticker.className = "art-sticker";
        sticker.src = `assets/illustrations/zmh-${artKey}.png`;
        sticker.alt = "";
        sticker.loading = "lazy";
        sticker.decoding = "async";

        art.appendChild(sticker);

        card.append(copy, art);
        grid.appendChild(card);
      });
    }

    const gallery = $("#photoGallery");
    if (gallery) {
      gallery.innerHTML = "";
      (profile.photos || []).forEach((photo, index) => {
        const figure = document.createElement("figure");
        figure.className = index === 0 ? "photo-card photo-card-featured" : "photo-card";

        const img = document.createElement("img");
        img.src = photo.src;
        img.alt = photo.alt || `${profile.name || "她"}的照片`;
        img.loading = index < 2 ? "eager" : "lazy";

        const caption = document.createElement("figcaption");
        caption.textContent = photo.caption || "被好好收藏的瞬间";

        figure.append(img, caption);
        gallery.appendChild(figure);
      });
    }
  }

  function createOpeningParticles() {
    const sky = $("#openingSky");
    if (!sky) return;

    for (let i = 0; i < 34; i += 1) {
      const dot = document.createElement("span");
      dot.className = "float-dot";
      dot.style.left = `${Math.random() * 100}%`;
      dot.style.animationDelay = `${Math.random() * 1400}ms`;
      dot.style.animationDuration = `${2600 + Math.random() * 1800}ms`;
      dot.style.setProperty("--size", `${5 + Math.random() * 8}px`);
      sky.appendChild(dot);
    }
  }

  function createSceneDecorations() {
    const fields = document.querySelectorAll(".decor-field");
    const colors = ["#f49ab4", "#d8a646", "#b9d9cd", "#fff1a8", "#d95f82"];
    const symbols = ["★", "✦", "✧", "✺"];

    fields.forEach((field, fieldIndex) => {
      field.innerHTML = "";
      const count = field.classList.contains("decor-rich") ? 46 : 28;

      for (let i = 0; i < count; i += 1) {
        const item = document.createElement("span");
        const isStar = i % 3 === 0;
        item.className = isStar ? "decor-star" : "decor-confetti";
        item.textContent = isStar ? symbols[(i + fieldIndex) % symbols.length] : "";
        item.style.left = `${Math.random() * 100}%`;
        item.style.top = `${Math.random() * 100}%`;
        item.style.setProperty("--color", colors[(i + fieldIndex) % colors.length]);
        item.style.setProperty("--rot", `${Math.random() * 180 - 90}deg`);
        item.style.setProperty("--delay", `${Math.random() * 2400}ms`);
        item.style.setProperty("--dur", `${3600 + Math.random() * 2800}ms`);
        field.appendChild(item);
      }
    });
  }

  function startOpening() {
    window.setTimeout(() => {
      document.body.classList.add("opening-done");
    }, 2100);
  }

  function setupWishButton() {
    const button = $("#wishButton");
    const text = $("#wishText");
    const wishes = profile.wishes || [];
    if (!button || !text || wishes.length === 0) return;

    let lastIndex = -1;
    button.addEventListener("click", () => {
      let nextIndex = Math.floor(Math.random() * wishes.length);
      if (wishes.length > 1) {
        while (nextIndex === lastIndex) {
          nextIndex = Math.floor(Math.random() * wishes.length);
        }
      }
      lastIndex = nextIndex;
      text.classList.remove("wish-pop");
      void text.offsetWidth;
      text.textContent = wishes[nextIndex];
      text.classList.add("wish-pop");
    });
  }

  function setupScenes() {
    const scenes = [...document.querySelectorAll(".story-scene")];
    if (scenes.length === 0) return;

    const goToScene = (index) => {
      scenes.forEach((scene, sceneIndex) => {
        const active = sceneIndex === index;
        scene.classList.toggle("is-active", active);
        scene.setAttribute("aria-hidden", active ? "false" : "true");
        if (active) {
          scene.querySelectorAll(".reveal").forEach((node) => node.classList.add("is-visible"));
        }
      });

      document.body.dataset.scene = String(index);
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    document.querySelectorAll("[data-next-scene]").forEach((button) => {
      button.addEventListener("click", () => {
        const next = Number(button.getAttribute("data-next-scene"));
        if (!Number.isNaN(next)) goToScene(next);
      });
    });

    goToScene(0);
  }

  function setupReveal() {
    const targets = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      targets.forEach((target) => target.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16 }
    );

    targets.forEach((target) => observer.observe(target));
  }

  function updateCountdown() {
    const node = $("#countdown");
    if (!node || !profile.countdownTarget) return;

    const target = new Date(profile.countdownTarget).getTime();
    if (Number.isNaN(target)) {
      node.hidden = true;
      return;
    }

    const diff = target - Date.now();
    if (diff <= 0) {
      node.textContent = "今天就是她的生日，祝她快乐满格";
      return;
    }

    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    node.textContent = `距离生日还有 ${days} 天 ${hours} 小时 ${minutes} 分钟`;
  }

  function initBirthdayPage() {
    applyProfile();
    createOpeningParticles();
    createSceneDecorations();
    startOpening();
    setupWishButton();
    setupScenes();
    setupReveal();
    updateCountdown();
    window.setInterval(updateCountdown, 60000);
  }

  function unlockBirthdayPage() {
    document.body.classList.remove("auth-locked");
    document.body.classList.add("auth-unlocked");
    initBirthdayPage();
  }

  function setupPasswordGate() {
    const form = $("#passwordForm");
    const input = $("#passwordInput");
    const error = $("#passwordError");

    if (window.sessionStorage.getItem(AUTH_KEY) === "true") {
      unlockBirthdayPage();
      return;
    }

    if (!form || !input) {
      unlockBirthdayPage();
      return;
    }

    window.setTimeout(() => input.focus(), 200);

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const value = input.value.trim();

      if (value === PASSWORD) {
        window.sessionStorage.setItem(AUTH_KEY, "true");
        unlockBirthdayPage();
        return;
      }

      if (error) error.textContent = "密码不对哦，再试一次。";
      input.value = "";
      input.focus();
      form.classList.remove("gate-shake");
      void form.offsetWidth;
      form.classList.add("gate-shake");
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    setupPasswordGate();
  });
})();
