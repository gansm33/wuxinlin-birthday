const profile = window.BIRTHDAY_PROFILE;

const $ = (selector) => document.querySelector(selector);
const PASSWORD_DIGEST = "9a99c53db9722161c0ec8d9353098a46bea36287bfbc404c3156da41719140f7";

async function digestText(value) {
  const bytes = new TextEncoder().encode(value);
  const hash = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(hash)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function setupPasswordGate() {
  const gate = $("#passwordGate");
  const form = $("#passwordForm");
  const input = $("#passwordInput");
  const toggle = $("#passwordToggle");
  const error = $("#passwordError");
  if (!gate || !form || !input) return;

  const unlock = () => {
    sessionStorage.setItem("wxl-birthday-access", "granted");
    gate.classList.add("unlocked");
    document.body.classList.remove("password-locked");
    setTimeout(() => {
      gate.hidden = true;
      $("#enterButton")?.focus({ preventScroll: true });
    }, 570);
  };

  if (sessionStorage.getItem("wxl-birthday-access") === "granted") {
    gate.hidden = true;
    document.body.classList.remove("password-locked");
  } else {
    requestAnimationFrame(() => input.focus({ preventScroll: true }));
  }

  toggle?.addEventListener("click", () => {
    const show = input.type === "password";
    input.type = show ? "text" : "password";
    toggle.textContent = show ? "隐藏" : "显示";
    toggle.setAttribute("aria-label", show ? "隐藏密码" : "显示密码");
    input.focus();
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const digest = await digestText(input.value);
    if (digest === PASSWORD_DIGEST) {
      error.textContent = "";
      unlock();
      return;
    }
    error.textContent = "口令不正确，请再试一次。";
    form.classList.remove("invalid");
    void form.offsetWidth;
    form.classList.add("invalid");
    input.select();
  });
}

function renderProfile() {
  document.title = `${profile.displayName}，生日快乐`;
  $("#heroName").textContent = profile.displayName;
  $("#heroMessage").textContent = profile.heroMessage;

  $("#traits").innerHTML = profile.traits.map((trait) => `
    <article class="trait-card reveal">
      <span>${trait.number}</span>
      <h3>${trait.title}</h3>
      <p>${trait.text}</p>
    </article>
  `).join("");

  $("#letterBody").innerHTML = profile.letter.map((paragraph) => `<p>${paragraph}</p>`).join("");

  $("#photoGrid").innerHTML = profile.gallery.map((photo, index) => `
    <button class="photo-card ${photo.size} reveal" type="button"
      style="--rotate: ${photo.rotate}" data-photo-index="${index}"
      aria-label="查看大图：${photo.caption}">
      <img src="${photo.src}" alt="${photo.alt}" loading="${index > 2 ? "lazy" : "eager"}">
      <span>${photo.caption}</span>
    </button>
  `).join("");
}

function updateCountdown() {
  const target = new Date(profile.birthday);
  const now = new Date();
  const distance = target - now;
  const fields = ["days", "hours", "minutes", "seconds"];

  if (distance <= 0) {
    fields.forEach((field) => $(`#${field}`).textContent = "00");
    $("#countdownNote").textContent = "今天的主角，生日快乐！";
    return;
  }

  const values = [
    Math.floor(distance / 86400000),
    Math.floor((distance % 86400000) / 3600000),
    Math.floor((distance % 3600000) / 60000),
    Math.floor((distance % 60000) / 1000)
  ];

  fields.forEach((field, index) => {
    $(`#${field}`).textContent = String(values[index]).padStart(2, "0");
  });
}

function setupReveal() {
  const elements = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    elements.forEach((element) => element.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  elements.forEach((element) => observer.observe(element));
}

function setupLightbox() {
  const dialog = $("#lightbox");
  const image = $("#lightboxImage");
  const caption = $("#lightboxCaption");

  document.querySelectorAll(".photo-card").forEach((card) => {
    card.addEventListener("click", () => {
      const photo = profile.gallery[Number(card.dataset.photoIndex)];
      image.src = photo.src;
      image.alt = photo.alt;
      caption.textContent = photo.caption;
      dialog.showModal();
    });
  });

  $(".lightbox-close").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
}

function setupMusic() {
  const button = $("#musicButton");
  const label = $("#musicLabel");

  if (!profile.music.src) {
    label.textContent = profile.music.title;
    button.addEventListener("click", () => {
      label.textContent = "把 MP3 放进 assets/music 后即可启用";
    });
    return;
  }

  const audio = new Audio(profile.music.src);
  audio.loop = true;
  button.setAttribute("aria-label", `播放音乐：${profile.music.title}`);
  label.textContent = profile.music.title;
  button.addEventListener("click", async () => {
    if (audio.paused) {
      await audio.play();
      button.classList.add("playing");
      button.setAttribute("aria-label", `暂停音乐：${profile.music.title}`);
    } else {
      audio.pause();
      button.classList.remove("playing");
      button.setAttribute("aria-label", `播放音乐：${profile.music.title}`);
    }
  });
}

function launchConfetti() {
  const canvas = $("#confetti");
  const context = canvas.getContext("2d");
  const colors = ["#8c3f32", "#d49b72", "#e2ba62", "#496953", "#f3e5c8"];
  let pieces = [];
  let frame = 0;

  const resize = () => {
    canvas.width = window.innerWidth * devicePixelRatio;
    canvas.height = window.innerHeight * devicePixelRatio;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  };

  resize();
  pieces = Array.from({ length: 120 }, () => ({
    x: Math.random() * window.innerWidth,
    y: -20 - Math.random() * window.innerHeight * 0.4,
    size: 5 + Math.random() * 8,
    speed: 2 + Math.random() * 4,
    swing: Math.random() * Math.PI * 2,
    color: colors[Math.floor(Math.random() * colors.length)]
  }));

  function draw() {
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);
    pieces.forEach((piece) => {
      piece.y += piece.speed;
      piece.swing += 0.05;
      context.save();
      context.translate(piece.x + Math.sin(piece.swing) * 18, piece.y);
      context.rotate(piece.swing);
      context.fillStyle = piece.color;
      context.fillRect(-piece.size / 2, -piece.size / 3, piece.size, piece.size * 0.65);
      context.restore();
    });
    pieces = pieces.filter((piece) => piece.y < window.innerHeight + 30);
    frame += 1;
    if (pieces.length && frame < 500) requestAnimationFrame(draw);
    else context.clearRect(0, 0, window.innerWidth, window.innerHeight);
  }

  draw();
}

function renderGiftSlides() {
  const container = $("#giftSlides");
  if (!container || !profile.gifts) return;

  container.innerHTML = profile.gifts.map((gift, index) => `
    <article class="gift-slide gift-detail-slide gift-theme-${index + 1}" data-gift-slide="${index}">
      <div class="gift-page-copy">
        <p class="gift-progress">GIFT ${gift.number} / 03</p>
        <p class="gift-theme">${gift.theme}</p>
        <h2>${gift.title}</h2>
        <div class="gift-message" id="giftMessage${index}" tabindex="-1">
          <span class="gift-message-icon" aria-hidden="true">${gift.icon}</span>
          <p>${gift.message}</p>
        </div>
        <button class="gift-next-button" type="button" data-gift-next="${index}" hidden>
          ${index < profile.gifts.length - 1 ? "去拆下一份礼物" : "看看最后的收尾"} <span aria-hidden="true">→</span>
        </button>
      </div>
      <div class="present-stage">
        <p class="present-hint">点击礼物盒打开</p>
        <button class="present-box" type="button" data-gift-open="${index}" aria-label="打开第 ${index + 1} 份礼物：${gift.theme}">
          <span class="present-glow" aria-hidden="true"></span>
          <span class="present-bow" aria-hidden="true"></span>
          <span class="present-lid" aria-hidden="true"></span>
          <span class="present-body" aria-hidden="true"></span>
          <span class="present-ribbon" aria-hidden="true"></span>
          <strong aria-hidden="true">${gift.number}</strong>
        </button>
        <p class="present-opened-label">礼物已打开</p>
      </div>
    </article>
  `).join("");
}

function setupGiftJourney() {
  const journey = $("#giftJourney");
  const startButton = $("#startGiftsButton");
  const stackButton = $("#giftStackButton");
  if (!journey || !startButton || !profile.gifts) return;

  const showSlide = (id) => {
    journey.querySelectorAll(".gift-slide").forEach((slide) => {
      const active = slide.dataset.giftSlide === String(id);
      slide.classList.toggle("active", active);
      slide.setAttribute("aria-hidden", String(!active));
    });
    const activeSlide = journey.querySelector(".gift-slide.active");
    activeSlide?.scrollIntoView({ behavior: "smooth", block: "start" });
    setTimeout(() => activeSlide?.querySelector("button, a, [tabindex='-1']")?.focus({ preventScroll: true }), 450);
  };

  const beginGifts = () => showSlide(0);
  startButton.addEventListener("click", beginGifts);
  stackButton?.addEventListener("click", beginGifts);

  journey.addEventListener("click", (event) => {
    const openButton = event.target.closest("[data-gift-open]");
    if (openButton && !openButton.classList.contains("opened")) {
      const index = Number(openButton.dataset.giftOpen);
      const slide = openButton.closest(".gift-slide");
      openButton.classList.add("opened");
      openButton.disabled = true;
      slide.classList.add("gift-is-open");
      slide.querySelector(".gift-message").classList.add("shown");
      slide.querySelector(".gift-next-button").hidden = false;
      if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) launchConfetti();
      setTimeout(() => slide.querySelector(".gift-message").focus({ preventScroll: true }), 500);
      return;
    }

    const nextButton = event.target.closest("[data-gift-next]");
    if (nextButton) {
      const index = Number(nextButton.dataset.giftNext);
      showSlide(index < profile.gifts.length - 1 ? index + 1 : "complete");
    }
  });
}

function setupEntrance() {
  const entrance = $("#birthdayEntrance");
  const button = $("#enterButton");
  if (!entrance || !button) return;

  requestAnimationFrame(() => button.focus({ preventScroll: true }));

  button.addEventListener("click", () => {
    if (window.location.hash) {
      history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
    }
    window.scrollTo({ top: 0, behavior: "auto" });
    entrance.classList.add("opened");
    document.body.classList.remove("entrance-active");
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) launchConfetti();
    setTimeout(() => {
      entrance.hidden = true;
      $(".brand")?.focus({ preventScroll: true });
    }, 780);
  });
}

renderProfile();
renderGiftSlides();
updateCountdown();
setInterval(updateCountdown, 1000);
setupReveal();
setupLightbox();
setupMusic();
setupGiftJourney();
setupEntrance();
setupPasswordGate();
