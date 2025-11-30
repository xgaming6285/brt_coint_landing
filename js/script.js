// Динамична година във footer-а
document.getElementById("year").textContent = new Date().getFullYear();

// ============================================
// PARTICLE ANIMATION SYSTEM
// ============================================
(function initParticles() {
  const canvas = document.getElementById("particles-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let particles = [];
  let animationId;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.5;
      this.speedY = (Math.random() - 0.5) * 0.5;
      this.opacity = Math.random() * 0.5 + 0.2;
      this.color = Math.random() > 0.5 ? "#4ade80" : "#38bdf8";
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
      if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.opacity;
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 120) {
          ctx.beginPath();
          ctx.strokeStyle = "#4ade80";
          ctx.globalAlpha = 0.1 * (1 - distance / 120);
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((particle) => {
      particle.update();
      particle.draw();
    });

    connectParticles();
    animationId = requestAnimationFrame(animate);
  }

  function init() {
    resizeCanvas();
    particles = [];
    const particleCount = Math.min(
      80,
      Math.floor((canvas.width * canvas.height) / 15000)
    );

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    animate();
  }

  window.addEventListener("resize", () => {
    cancelAnimationFrame(animationId);
    init();
  });

  init();
})();

// ============================================
// SOCIAL PROOF TOAST NOTIFICATIONS
// ============================================
(function initToastNotifications() {
  const toastContainer = document.getElementById("toastContainer");
  if (!toastContainer) return;

  const toastData = [
    {
      icon: "🎉",
      name: "Георги М.",
      action: "регистрира се за",
      amount: "$500",
      time: "преди 2 мин",
    },
    {
      icon: "🚀",
      name: "Мария К.",
      action: "купи BPR за",
      amount: "$1,200",
      time: "преди 5 мин",
    },
    {
      icon: "💎",
      name: "Иван П.",
      action: "регистрира се за",
      amount: "$250",
      time: "преди 8 мин",
    },
    {
      icon: "🔥",
      name: "Петър Д.",
      action: "купи BPR за",
      amount: "$3,000",
      time: "преди 12 мин",
    },
    {
      icon: "⚡",
      name: "Елена С.",
      action: "регистрира се за",
      amount: "$100",
      time: "преди 15 мин",
    },
    {
      icon: "🌟",
      name: "Димитър В.",
      action: "купи BPR за",
      amount: "$750",
      time: "преди 18 мин",
    },
    {
      icon: "💰",
      name: "Анна Б.",
      action: "регистрира се за",
      amount: "$2,500",
      time: "преди 22 мин",
    },
    {
      icon: "🎯",
      name: "Николай Р.",
      action: "купи BPR за",
      amount: "$420",
      time: "преди 25 мин",
    },
  ];

  let currentIndex = 0;
  let toastTimeout;

  function showToast() {
    const data = toastData[currentIndex];

    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = `
      <div class="toast-icon">${data.icon}</div>
      <div class="toast-content">
        <div class="toast-title">${data.name} ${data.action}</div>
        <div class="toast-subtitle"><span class="highlight">${data.amount}</span> в pre-sale</div>
      </div>
      <div class="toast-time">${data.time}</div>
    `;

    toastContainer.appendChild(toast);

    // Remove toast after 5 seconds
    setTimeout(() => {
      toast.classList.add("hiding");
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 400);
    }, 5000);

    currentIndex = (currentIndex + 1) % toastData.length;
  }

  // Show first toast after 3 seconds, then every 8-15 seconds randomly
  setTimeout(() => {
    showToast();

    function scheduleNextToast() {
      const delay = 8000 + Math.random() * 7000;
      toastTimeout = setTimeout(() => {
        showToast();
        scheduleNextToast();
      }, delay);
    }

    scheduleNextToast();
  }, 3000);
})();

// ============================================
// ANIMATED NUMBER COUNTERS
// ============================================
function animateCounter(
  element,
  target,
  duration = 2000,
  prefix = "",
  suffix = ""
) {
  const startTime = performance.now();
  const startValue = 0;

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Easing function (ease-out cubic)
    const easeOut = 1 - Math.pow(1 - progress, 3);
    const currentValue = Math.floor(
      startValue + (target - startValue) * easeOut
    );

    element.textContent = prefix + currentValue.toLocaleString() + suffix;
    element.classList.add("counting");

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.classList.remove("counting");
    }
  }

  requestAnimationFrame(update);
}

// ============================================
// SCROLL REVEAL ANIMATIONS
// ============================================
(function initScrollReveal() {
  // FIRST: Add reveal classes to sections
  document.querySelectorAll("section").forEach((section, index) => {
    if (!section.classList.contains("hero")) {
      section.classList.add("reveal");
      section.style.transitionDelay = `${index * 0.1}s`;
    }
  });

  // THEN: Query for all reveal elements (now including the sections we just added)
  const revealElements = document.querySelectorAll(
    ".reveal, .reveal-left, .reveal-right, .reveal-scale, .stagger-children"
  );

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");

          // If element has counter data, animate it
          const counter = entry.target.querySelector("[data-counter]");
          if (counter) {
            const target = parseInt(counter.dataset.counter);
            const prefix = counter.dataset.prefix || "";
            const suffix = counter.dataset.suffix || "";
            animateCounter(counter, target, 2000, prefix, suffix);
          }
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -50px 0px",
    }
  );

  // FINALLY: Observe all reveal elements
  revealElements.forEach((el) => revealObserver.observe(el));
})();

// ============================================
// LIVE PRICE TICKER ANIMATION
// ============================================
(function initPriceTicker() {
  const tickerPrice = document.getElementById("tickerPrice");
  const tickerChange = document.getElementById("tickerChange");
  const tickerParticipants = document.getElementById("tickerParticipants");

  if (!tickerPrice) return;

  let basePrice = 0.003;
  let participants = 1847;

  function updateTicker() {
    // Simulate small price fluctuations (±0.5%)
    const fluctuation = (Math.random() - 0.5) * 0.00003;
    basePrice += fluctuation;
    basePrice = Math.max(0.0029, Math.min(0.0032, basePrice)); // Keep in range

    const changePercent = ((basePrice - 0.003) / 0.003) * 100;

    tickerPrice.textContent = "$" + basePrice.toFixed(4);

    if (changePercent >= 0) {
      tickerChange.textContent = "+" + changePercent.toFixed(2) + "%";
      tickerChange.className = "ticker-change positive";
    } else {
      tickerChange.textContent = changePercent.toFixed(2) + "%";
      tickerChange.className = "ticker-change negative";
    }

    // Occasionally increase participants
    if (Math.random() > 0.7) {
      participants += Math.floor(Math.random() * 3) + 1;
      tickerParticipants.textContent = participants.toLocaleString();
    }
  }

  // Update every 3 seconds
  setInterval(updateTicker, 3000);
})();

// ============================================
// SMOOTH SECTION TRANSITIONS
// ============================================
(function enhanceNavigation() {
  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href === "#" || href === "#top") {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    });
  });
})();

// ============================================
// MAGNETIC BUTTON EFFECT
// ============================================
(function initMagneticButtons() {
  const buttons = document.querySelectorAll(".btn-primary");

  buttons.forEach((button) => {
    button.addEventListener("mousemove", function (e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      this.style.transform = `translateY(-3px) translate(${x * 0.1}px, ${
        y * 0.1
      }px) scale(1.02)`;
    });

    button.addEventListener("mouseleave", function () {
      this.style.transform = "";
    });
  });
})();

// Mobile Menu Toggle
const mobileMenuToggle = document.getElementById("mobileMenuToggle");
const mobileMenu = document.getElementById("mobileMenu");
const mobileMenuLinks = document.querySelectorAll(".mobile-menu-links a");

if (mobileMenuToggle && mobileMenu) {
  mobileMenuToggle.addEventListener("click", function () {
    const isActive = mobileMenuToggle.classList.toggle("active");
    mobileMenu.classList.toggle("active");
    mobileMenuToggle.setAttribute("aria-expanded", isActive);
    document.body.style.overflow = mobileMenu.classList.contains("active")
      ? "hidden"
      : "";
  });

  // Close mobile menu when clicking on a link
  mobileMenuLinks.forEach((link) => {
    link.addEventListener("click", function () {
      mobileMenuToggle.classList.remove("active");
      mobileMenu.classList.remove("active");
      mobileMenuToggle.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    });
  });

  // Close mobile menu on window resize if open
  window.addEventListener("resize", function () {
    if (window.innerWidth > 840 && mobileMenu.classList.contains("active")) {
      mobileMenuToggle.classList.remove("active");
      mobileMenu.classList.remove("active");
      mobileMenuToggle.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    }
  });
}

// Scroll to Top Button
const scrollToTopBtn = document.getElementById("scrollToTopBtn");

if (scrollToTopBtn) {
  window.addEventListener("scroll", function () {
    if (window.pageYOffset > 300) {
      scrollToTopBtn.classList.add("visible");
    } else {
      scrollToTopBtn.classList.remove("visible");
    }
  });

  scrollToTopBtn.addEventListener("click", function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

// Intersection Observer for fade-in animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver(function (entries) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("fade-in-up");
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe sections for animation
document.querySelectorAll("section").forEach((section) => {
  observer.observe(section);
});

// PDF Modal functionality
const pdfModal = document.getElementById("pdfModal");
const openWhitepaperBtn = document.getElementById("openWhitepaperBtn");
const closePdfModal = document.getElementById("closePdfModal");
const pdfIframe = document.getElementById("pdfIframe");

if (pdfModal && openWhitepaperBtn && closePdfModal) {
  // Open PDF modal
  openWhitepaperBtn.addEventListener("click", function () {
    if (pdfIframe) pdfIframe.src = "files/BPR_Token_Whitepaper.pdf";
    pdfModal.classList.add("active");
    document.body.style.overflow = "hidden"; // Prevent scrolling
  });

  // Close PDF modal
  closePdfModal.addEventListener("click", function () {
    pdfModal.classList.remove("active");
    if (pdfIframe) pdfIframe.src = ""; // Clear iframe
    document.body.style.overflow = ""; // Restore scrolling
  });

  // Close modal when clicking outside the content
  pdfModal.addEventListener("click", function (e) {
    if (e.target === pdfModal) {
      pdfModal.classList.remove("active");
      if (pdfIframe) pdfIframe.src = "";
      document.body.style.overflow = "";
    }
  });
}

// Close modal with Escape key
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    if (pdfModal && pdfModal.classList.contains("active")) {
      pdfModal.classList.remove("active");
      if (pdfIframe) pdfIframe.src = "";
      document.body.style.overflow = "";
    }
    if (registerModal && registerModal.classList.contains("active")) {
      saveFormData(); // Save form data when closing with Escape
      registerModal.classList.remove("active");
      document.body.style.overflow = "";
    }
  }
});

// Registration Modal functionality
const registerModal = document.getElementById("registerModal");
const closeRegisterModal = document.getElementById("closeRegisterModal");
const registrationForm = document.getElementById("registrationForm");
const formMessage = document.getElementById("formMessage");
const submitBtn = document.getElementById("submitBtn");
const submitBtnText = document.getElementById("submitBtnText");
const FORM_CACHE_KEY = "bpr_registration_form_cache";

if (registerModal) {
  // Get all CTA buttons that should open the registration modal
  const registerButtons = document.querySelectorAll(
    '.btn-primary, button[class*="btn-primary"]'
  );

  // Add click event to all register buttons
  registerButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      // Don't open modal if it's the whitepaper button
      if (button.id === "openWhitepaperBtn") return;

      e.preventDefault();
      openRegisterModal();
    });
  });

  // Save form data to localStorage
  function saveFormData() {
    if (!registrationForm) return;
    const formData = new FormData(registrationForm);
    const data = {
      fullName: formData.get("fullName") || "",
      email: formData.get("email") || "",
      walletAddress: formData.get("walletAddress") || "",
      phoneNumber: formData.get("phoneNumber") || "",
      country: formData.get("country") || "",
      investmentAmount: formData.get("investmentAmount") || "",
      referralCode: formData.get("referralCode") || "",
      acceptedTerms: formData.get("acceptedTerms") === "on",
      receiveUpdates: formData.get("receiveUpdates") === "on",
    };
    localStorage.setItem(FORM_CACHE_KEY, JSON.stringify(data));
  }

  // Load form data from localStorage
  function loadFormData() {
    const cachedData = localStorage.getItem(FORM_CACHE_KEY);
    if (cachedData) {
      try {
        const data = JSON.parse(cachedData);
        if (document.getElementById("fullName"))
          document.getElementById("fullName").value = data.fullName || "";
        if (document.getElementById("email"))
          document.getElementById("email").value = data.email || "";
        if (document.getElementById("walletAddress"))
          document.getElementById("walletAddress").value =
            data.walletAddress || "";
        if (document.getElementById("phoneNumber"))
          document.getElementById("phoneNumber").value = data.phoneNumber || "";
        if (document.getElementById("country"))
          document.getElementById("country").value = data.country || "";
        if (document.getElementById("investmentAmount"))
          document.getElementById("investmentAmount").value =
            data.investmentAmount || "";
        if (document.getElementById("referralCode"))
          document.getElementById("referralCode").value =
            data.referralCode || "";
        if (document.getElementById("acceptedTerms"))
          document.getElementById("acceptedTerms").checked =
            data.acceptedTerms || false;
        if (document.getElementById("receiveUpdates"))
          document.getElementById("receiveUpdates").checked =
            data.receiveUpdates || false;
      } catch (error) {
        console.error("Error loading cached form data:", error);
      }
    }
  }

  // Clear form cache
  function clearFormCache() {
    localStorage.removeItem(FORM_CACHE_KEY);
  }

  // Open register modal
  function openRegisterModal() {
    registerModal.classList.add("active");
    document.body.style.overflow = "hidden";
    loadFormData(); // Load cached data when opening
    hideMessage();

    // Focus first input field
    setTimeout(() => {
      const fullNameInput = document.getElementById("fullName");
      if (fullNameInput) fullNameInput.focus();
    }, 100);
  }

  // Close register modal (with caching)
  function closeRegisterModalHandler() {
    saveFormData(); // Save form data when closing via X button
    registerModal.classList.remove("active");
    document.body.style.overflow = "";
  }

  if (closeRegisterModal) {
    closeRegisterModal.addEventListener("click", closeRegisterModalHandler);
  }

  // Reset form
  function resetForm() {
    if (registrationForm) registrationForm.reset();
    hideMessage();
  }

  // Show message
  function showMessage(message, type) {
    if (formMessage) {
      formMessage.textContent = message;
      formMessage.className = `form-message ${type}`;
      formMessage.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }

  // Hide message
  function hideMessage() {
    if (formMessage) {
      formMessage.className = "form-message";
      formMessage.textContent = "";
    }
  }

  // Handle form submission
  if (registrationForm) {
    registrationForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      hideMessage();

      // Get form data
      const formData = new FormData(registrationForm);
      const data = {
        fullName: formData.get("fullName"),
        email: formData.get("email"),
        walletAddress: formData.get("walletAddress"),
        phoneNumber: formData.get("phoneNumber"),
        country: formData.get("country"),
        investmentAmount: formData.get("investmentAmount"),
        referralCode: formData.get("referralCode"),
        acceptedTerms: formData.get("acceptedTerms") === "on",
        receiveUpdates: formData.get("receiveUpdates") === "on",
      };

      // Basic validation
      if (!data.fullName || !data.email || !data.walletAddress) {
        showMessage("Моля попълни всички задължителни полета", "error");
        return;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        showMessage("Моля въведи валиден имейл адрес", "error");
        return;
      }

      if (!data.acceptedTerms) {
        showMessage("Трябва да приемеш условията, за да продължиш", "error");
        return;
      }

      // Validate wallet address format (basic check)
      if (
        !data.walletAddress.startsWith("0x") ||
        data.walletAddress.length !== 42
      ) {
        showMessage(
          "Моля въведи валиден Ethereum wallet адрес (0x...)",
          "error"
        );
        return;
      }

      // Validate wallet address contains only hex characters
      const walletRegex = /^0x[a-fA-F0-9]{40}$/;
      if (!walletRegex.test(data.walletAddress)) {
        showMessage("Wallet адресът съдържа невалидни символи", "error");
        return;
      }

      // Disable submit button
      if (submitBtn) {
        submitBtn.disabled = true;
        if (submitBtnText)
          submitBtnText.innerHTML = '<div class="spinner"></div> Обработка...';
      }

      try {
        // Send data to backend
        const response = await fetch("/api/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        const result = await response.json();

        if (response.ok && result.success) {
          showMessage("✅ " + result.message + " Благодарим ти!", "success");
          registrationForm.reset();
          clearFormCache(); // Clear cached data on successful submission

          // Close modal after 3 seconds
          setTimeout(() => {
            registerModal.classList.remove("active");
            document.body.style.overflow = "";
            hideMessage();
          }, 3000);
        } else {
          showMessage(
            "❌ " + (result.message || "Грешка при регистрацията"),
            "error"
          );
        }
      } catch (error) {
        console.error("Registration error:", error);
        showMessage(
          "❌ Грешка при свързване със сървъра. Моля опитай отново.",
          "error"
        );
      } finally {
        // Re-enable submit button
        if (submitBtn) {
          submitBtn.disabled = false;
          if (submitBtnText)
            submitBtnText.innerHTML = "✨ Регистрирай се за Pre-Sale";
        }
      }
    });
  }
}

// Countdown Timer - персонализиран за всеки потребител
(function () {
  const STORAGE_KEY = "bpr_countdown_start";
  const INITIAL_TIME = 5 * 3600 + 24 * 60 + 18; // 05:24:18 в секунди

  // Вземи или създай start time за този потребител
  let startTime = localStorage.getItem(STORAGE_KEY);
  if (!startTime) {
    startTime = Date.now();
    localStorage.setItem(STORAGE_KEY, startTime);
  } else {
    startTime = parseInt(startTime);
  }

  // Declare timerInterval before the function that uses it
  let timerInterval;

  function updateCountdown() {
    // Изчисли изминалото време
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    let remaining = INITIAL_TIME - elapsed;

    // Ако времето е изтекло, постави на 0
    if (remaining < 0) {
      remaining = 0;
    }

    // Изчисли часове, минути и секунди
    const hours = Math.floor(remaining / 3600);
    const minutes = Math.floor((remaining % 3600) / 60);
    const seconds = remaining % 60;

    // Обнови DOM елементите
    const hoursEl = document.getElementById("hours");
    const minutesEl = document.getElementById("minutes");
    const secondsEl = document.getElementById("seconds");

    if (hoursEl && minutesEl && secondsEl) {
      hoursEl.textContent = String(hours).padStart(2, "0") + "ч";
      minutesEl.textContent = String(minutes).padStart(2, "0") + "м";
      secondsEl.textContent = String(seconds).padStart(2, "0") + "с";
    }

    // Ако времето е изтекло, спри таймера
    if (remaining === 0 && timerInterval) {
      clearInterval(timerInterval);
    }
  }

  // Започни таймера
  updateCountdown(); // Извикай веднага
  timerInterval = setInterval(updateCountdown, 1000); // После на всяка секунда
})();
