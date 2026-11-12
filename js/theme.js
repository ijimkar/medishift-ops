/* =========================================================
   MediShift Ops — js/theme.js
   FR-07: Persistent light/dark theme switcher
   FR-05: Mobile hamburger navigation drawer
   Loaded on all 5 pages.
   ========================================================= */
"use strict";

const THEME_KEY = "medishift-theme";

/* ---------------------------------------------------------
   1. Apply the saved theme IMMEDIATELY (before anything else)
   so the page does not flash light mode for dark-mode users.
   --------------------------------------------------------- */
function getSavedTheme() {
  try {
    return window.localStorage.getItem(THEME_KEY);
  } catch (error) {
    // localStorage can be blocked (e.g. private browsing)
    return null;
  }
}

function saveTheme(theme) {
  try {
    window.localStorage.setItem(THEME_KEY, theme);
  } catch (error) {
    console.warn("Could not save theme preference:", error);
  }
}

if (getSavedTheme() === "dark") {
  document.documentElement.setAttribute("data-theme", "dark");
}

/* ---------------------------------------------------------
   2. Theme toggle button
   --------------------------------------------------------- */
const themeToggle = document.getElementById("themeToggle");

// Update the button icon + accessible label to match the current theme.
// Light mode shows a moon (click for Dark Mode), dark mode shows a sun (click for Light Mode).
function updateThemeButton(theme) {
  if (!themeToggle) return;

  if (theme === "dark") {
    themeToggle.textContent = "☀️";
    themeToggle.setAttribute("aria-label", "Switch to Light Mode");
    themeToggle.setAttribute("title", "Light Mode");
  } else {
    themeToggle.textContent = "🌙";
    themeToggle.setAttribute("aria-label", "Switch to Dark Mode");
    themeToggle.setAttribute("title", "Dark Mode");
  }
}

// Set the correct icon on page load
const currentTheme =
  document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
updateThemeButton(currentTheme);

if (themeToggle) {
  themeToggle.addEventListener("click", function () {
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    const newTheme = isDark ? "light" : "dark";

    document.documentElement.setAttribute("data-theme", newTheme);
    saveTheme(newTheme);
    updateThemeButton(newTheme);
  });
}

/* ---------------------------------------------------------
   3. Mobile hamburger menu
   Toggles .nav-open on .nav-links (and on .navbar so the
   hamburger bars animate into an "X").
   --------------------------------------------------------- */
const hamburgerBtn = document.getElementById("hamburgerBtn");
const navLinks = document.querySelector(".nav-links");
const navbar = document.querySelector(".navbar");

function closeMobileMenu() {
  if (!navLinks) return;
  navLinks.classList.remove("nav-open");
  if (navbar) navbar.classList.remove("nav-open");
  if (hamburgerBtn) {
    hamburgerBtn.setAttribute("aria-expanded", "false");
    hamburgerBtn.setAttribute("aria-label", "Open navigation menu");
  }
}

if (hamburgerBtn && navLinks) {
  hamburgerBtn.addEventListener("click", function () {
    const isOpen = navLinks.classList.toggle("nav-open");
    if (navbar) navbar.classList.toggle("nav-open", isOpen);

    hamburgerBtn.setAttribute("aria-expanded", String(isOpen));
    hamburgerBtn.setAttribute(
      "aria-label",
      isOpen ? "Close navigation menu" : "Open navigation menu"
    );
  });

  // Close the drawer after a link is tapped
  navLinks.addEventListener("click", function (event) {
    if (event.target.closest("a")) closeMobileMenu();
  });

  // Close the drawer if the window is resized up to desktop width
  window.addEventListener("resize", function () {
    if (window.innerWidth >= 768) closeMobileMenu();
  });
}