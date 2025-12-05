// Dark mode functionality
function toggleDarkMode() {
  const html = document.documentElement;
  const isDarkMode = html.classList.toggle("dark");

  // Save preference to localStorage
  localStorage.setItem("darkMode", isDarkMode ? "enabled" : "disabled");

  // Update icons
  updateDarkModeIcons(isDarkMode);
}

function updateDarkModeIcons(isDarkMode) {
  const sunIcon = document.getElementById("sun-icon");
  const moonIcon = document.getElementById("moon-icon");
  const sunIconMobile = document.getElementById("sun-icon-mobile");
  const moonIconMobile = document.getElementById("moon-icon-mobile");

  if (isDarkMode) {
    sunIcon?.classList.add("hidden");
    moonIcon?.classList.remove("hidden");
    sunIconMobile?.classList.add("hidden");
    moonIconMobile?.classList.remove("hidden");
  } else {
    sunIcon?.classList.remove("hidden");
    moonIcon?.classList.add("hidden");
    sunIconMobile?.classList.remove("hidden");
    moonIconMobile?.classList.add("hidden");
  }
}

// Check for saved dark mode preference on page load
document.addEventListener("DOMContentLoaded", function () {
  const darkMode = localStorage.getItem("darkMode");

  if (darkMode === "enabled") {
    document.documentElement.classList.add("dark");
    updateDarkModeIcons(true);
  }
});

// Header scroll effect
let lastScroll = 0;
window.addEventListener("scroll", function () {
  const header = document.getElementById("header");
  const currentScroll = window.pageYOffset;

  if (currentScroll > 100) {
    header.classList.add("shadow-md");
  } else {
    header.classList.remove("shadow-md");
  }

  lastScroll = currentScroll;
});

// Mobile menu toggle
function toggleMobileMenu() {
  const mobileMenu = document.getElementById("mobile-menu");
  mobileMenu.classList.toggle("hidden");
}

// Smooth scrolling
function scrollToSection(id) {
  const element = document.getElementById(id);
  if (element) {
    const headerHeight = 80;
    const elementPosition = element.offsetTop - headerHeight;
    window.scrollTo({
      top: elementPosition,
      behavior: "smooth",
    });

    // Close mobile menu if open
    const mobileMenu = document.getElementById("mobile-menu");
    if (!mobileMenu.classList.contains("hidden")) {
      mobileMenu.classList.add("hidden");
    }
  }
}
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}
// Demo modal placeholder function
function showDemo() {
  window.location.href = "payslip.html";
}

// Smooth scroll for all anchor links (runs when the page content is loaded)
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = this.getAttribute("href");
      if (target && target !== "#") {
        scrollToSection(target.substring(1));
      }
    });
  });
});

// Intersection Observer for scroll animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver(function (entries) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("active");
    }
  });
}, observerOptions);

// Observe all reveal elements (runs when the page content is loaded)
document.addEventListener("DOMContentLoaded", function () {
  const reveals = document.querySelectorAll(".reveal");
  reveals.forEach((el) => observer.observe(el));
});
