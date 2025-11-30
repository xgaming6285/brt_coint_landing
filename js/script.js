// Динамична година във footer-а
document.getElementById("year").textContent = new Date().getFullYear();

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
    if (
      window.innerWidth > 840 &&
      mobileMenu.classList.contains("active")
    ) {
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
        if (document.getElementById("fullName")) document.getElementById("fullName").value = data.fullName || "";
        if (document.getElementById("email")) document.getElementById("email").value = data.email || "";
        if (document.getElementById("walletAddress")) document.getElementById("walletAddress").value =
          data.walletAddress || "";
        if (document.getElementById("phoneNumber")) document.getElementById("phoneNumber").value =
          data.phoneNumber || "";
        if (document.getElementById("country")) document.getElementById("country").value = data.country || "";
        if (document.getElementById("investmentAmount")) document.getElementById("investmentAmount").value =
          data.investmentAmount || "";
        if (document.getElementById("referralCode")) document.getElementById("referralCode").value =
          data.referralCode || "";
        if (document.getElementById("acceptedTerms")) document.getElementById("acceptedTerms").checked =
          data.acceptedTerms || false;
        if (document.getElementById("receiveUpdates")) document.getElementById("receiveUpdates").checked =
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
        if (submitBtnText) submitBtnText.innerHTML = '<div class="spinner"></div> Обработка...';
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
          if (submitBtnText) submitBtnText.innerHTML = "✨ Регистрирай се за Pre-Sale";
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
    if (remaining === 0) {
      clearInterval(timerInterval);
    }
  }

  // Започни таймера
  updateCountdown(); // Извикай веднага
  const timerInterval = setInterval(updateCountdown, 1000); // После на всяка секунда
})();

