"use strict";

const root = document.documentElement;
const themeToggle = document.getElementById("themeToggle");
const themeStorageKey = "olaide-portfolio-theme";

function applyTheme(theme) {
  const isDark = theme === "dark";
  root.dataset.theme = isDark ? "dark" : "light";
  root.setAttribute("data-bs-theme", isDark ? "dark" : "light");
  themeToggle.setAttribute("aria-label", `Switch to ${isDark ? "light" : "dark"} theme`);
  themeToggle.querySelector('[data-theme-icon="moon"]').hidden = isDark;
  themeToggle.querySelector('[data-theme-icon="sun"]').hidden = !isDark;
}

let savedTheme;
try {
  savedTheme = localStorage.getItem(themeStorageKey);
} catch (error) {
  console.warn("Theme preference could not be read from local storage.", error);
}
applyTheme(savedTheme === "dark" ? "dark" : "light");

themeToggle.addEventListener("click", () => {
  const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
  applyTheme(nextTheme);
  try {
    localStorage.setItem(themeStorageKey, nextTheme);
  } catch (error) {
    console.warn("Theme preference could not be saved to local storage.", error);
  }
});

const filterButtons = document.querySelectorAll(".filter-button");
const galleryItems = document.querySelectorAll(".gallery-item");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    filterButtons.forEach((item) => {
      const isActive = item === button;
      item.classList.toggle("is-active", isActive);
      item.setAttribute("aria-pressed", String(isActive));
    });

    galleryItems.forEach((item) => {
      item.hidden = filter !== "all" && item.dataset.category !== filter;
    });
  });
});

document.querySelectorAll(".video-tile").forEach((tile) => {
  const video = tile.querySelector("video");
  const playButton = tile.querySelector(".video-play");

  playButton.addEventListener("click", () => {
    video.controls = true;
    video.play().catch((error) => {
      console.error("Could not play the creative work video.", error);
    });
  });

  video.addEventListener("play", () => tile.classList.add("is-playing"));
  video.addEventListener("pause", () => tile.classList.remove("is-playing"));
  video.addEventListener("ended", () => tile.classList.remove("is-playing"));
});

const contactForm = document.getElementById("contactForm");
contactForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(contactForm);
  const name = encodeURIComponent(formData.get("name").trim());
  const email = encodeURIComponent(formData.get("email").trim());
  const subject = encodeURIComponent(formData.get("subject").trim() || "Portfolio enquiry");
  const message = encodeURIComponent(formData.get("message").trim());
  const body = `${message}%0A%0A${name}%20(${email})`;

  window.location.href = `mailto:olaideololade8@gmail.com?subject=${subject}&body=${body}`;
});

document.querySelectorAll("section[id]").forEach((section) => {
  const heading = section.querySelector("h2");
  if (!heading) return;

  const permalink = document.createElement("a");
  permalink.className = "section-permalink";
  permalink.href = `#${section.id}`;
  permalink.setAttribute("aria-label", `Link to ${heading.textContent}`);
  permalink.textContent = " #";
  heading.append(permalink);
});

const previewWindows = document.querySelectorAll(".preview-window");
const resizePreviews = () => {
  previewWindows.forEach((preview) => {
    const iframe = preview.querySelector("iframe");
    iframe.style.transform = `scale(${preview.clientWidth / 1280})`;
  });
};

if ("ResizeObserver" in window) {
  const previewObserver = new ResizeObserver(resizePreviews);
  previewWindows.forEach((preview) => previewObserver.observe(preview));
} else {
  window.addEventListener("resize", resizePreviews);
}
resizePreviews();
