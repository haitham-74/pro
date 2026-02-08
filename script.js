/**
 * =====================================================
 * HAITHAM ISMAIL - PORTFOLIO WEBSITE
 * Vanilla JavaScript - No frameworks
 * =====================================================
 */

/* ==================== DOM ELEMENTS ==================== */
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const navMenu = document.querySelector('.nav-menu');
const hamburger = document.getElementById('hamburger');
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle?.querySelector('.theme-icon');
const backToTop = document.getElementById('backToTop');
const progressBar = document.getElementById('progressBar');
const contactForm = document.getElementById('contactForm');
const typedTextElement = document.getElementById('typedText');

/* ==================== TYPING ANIMATION ==================== */
const typingPhrase = "Building AI solutions that solve real-world problems";
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 100;

function typeText() {
  if (!typedTextElement) return;

  const currentText = typingPhrase.substring(0, charIndex);

  if (isDeleting) {
    charIndex--;
    typingSpeed = 50;
  } else {
    charIndex++;
    typingSpeed = charIndex === typingPhrase.length ? 2000 : 100;
  }

  typedTextElement.textContent = currentText;

  if (!isDeleting && charIndex === typingPhrase.length) {
    typingSpeed = 2000; // Pause at end
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    typingSpeed = 500; // Pause before restart
  }

  setTimeout(typeText, typingSpeed);
}

// Start typing after a short delay
if (typedTextElement) {
  setTimeout(typeText, 500);
}

/* ==================== SMOOTH SCROLLING ==================== */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;

    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
      // Close mobile menu on link click
      navMenu?.classList.remove('active');
      hamburger?.classList.remove('active');
    }
  });
});

/* ==================== SCROLL REVEAL (IntersectionObserver) ==================== */
const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  },
  {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px',
  }
);

revealElements.forEach((el) => revealObserver.observe(el));

/* ==================== SKILL PROGRESS BARS ==================== */
const skillBars = document.querySelectorAll('.skill-progress');
const skillObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const progress = entry.target.getAttribute('data-progress');
        entry.target.style.setProperty('--progress-width', `${progress}%`);
        entry.target.classList.add('animated');
        skillObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.3 }
);

skillBars.forEach((bar) => skillObserver.observe(bar));

/* ==================== PROGRESS BAR (Scroll indicator) ==================== */
function updateProgressBar() {
  const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
  if (windowHeight <= 0) return;

  const scrolled = (window.scrollY / windowHeight) * 100;
  if (progressBar) {
    progressBar.style.width = `${scrolled}%`;
  }
}

window.addEventListener('scroll', updateProgressBar);
updateProgressBar();

/* ==================== NAVBAR - SCROLL EFFECT & ACTIVE SECTION ==================== */
const sections = document.querySelectorAll('section[id]');

function updateNavbarOnScroll() {
  const scrollY = window.scrollY;
  const navbarHeight = navbar?.offsetHeight || 70;

  // Add shadow when scrolled
  if (navbar) {
    navbar.classList.toggle('scrolled', scrollY > 50);
  }

  // Active section highlight
  let currentSection = '';
  sections.forEach((section) => {
    const sectionTop = section.offsetTop - navbarHeight;
    const sectionHeight = section.offsetHeight;

    if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
      currentSection = section.getAttribute('id');
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove('active');
    const href = link.getAttribute('href');
    if (href === `#${currentSection}`) {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', updateNavbarOnScroll);
updateNavbarOnScroll();

/* ==================== BACK TO TOP BUTTON ==================== */
function toggleBackToTop() {
  if (!backToTop) return;

  if (window.scrollY > 500) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }
}

window.addEventListener('scroll', toggleBackToTop);
toggleBackToTop();

backToTop?.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
});

/* ==================== DARK / LIGHT MODE TOGGLE ==================== */
const STORAGE_KEY = 'portfolio-theme';

function getPreferredTheme() {
  return localStorage.getItem(STORAGE_KEY) || 'dark';
}

function setTheme(theme) {
  document.body.classList.toggle('light-mode', theme === 'light');
  localStorage.setItem(STORAGE_KEY, theme);

  if (themeIcon) {
    themeIcon.classList.remove('fa-moon', 'fa-sun');
    themeIcon.classList.add(theme === 'dark' ? 'fa-moon' : 'fa-sun');
  }
}

// Initialize theme
setTheme(getPreferredTheme());

themeToggle?.addEventListener('click', () => {
  const current = document.body.classList.contains('light-mode') ? 'light' : 'dark';
  const next = current === 'dark' ? 'light' : 'dark';
  setTheme(next);
});

/* ==================== MOBILE HAMBURGER MENU ==================== */
hamburger?.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navMenu?.classList.toggle('active');
  document.body.style.overflow = navMenu?.classList.contains('active') ? 'hidden' : '';
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
  if (
    navMenu?.classList.contains('active') &&
    !navMenu.contains(e.target) &&
    !hamburger.contains(e.target)
  ) {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
    document.body.style.overflow = '';
  }
});

/* ==================== FORM VALIDATION ==================== */
const formFields = {
  name: document.getElementById('name'),
  email: document.getElementById('email'),
  message: document.getElementById('message'),
};

const formErrors = {
  name: document.getElementById('nameError'),
  email: document.getElementById('emailError'),
  message: document.getElementById('messageError'),
};

function showFieldError(field, message) {
  const formGroup = formFields[field]?.closest('.form-group');
  formGroup?.classList.add('error');
  if (formErrors[field]) {
    formErrors[field].textContent = message;
  }
}

function clearFieldError(field) {
  const formGroup = formFields[field]?.closest('.form-group');
  formGroup?.classList.remove('error');
  if (formErrors[field]) {
    formErrors[field].textContent = '';
  }
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateForm() {
  let isValid = true;

  // Name
  if (!formFields.name?.value.trim()) {
    showFieldError('name', 'Name is required');
    isValid = false;
  } else if (formFields.name.value.trim().length < 2) {
    showFieldError('name', 'Name must be at least 2 characters');
    isValid = false;
  } else {
    clearFieldError('name');
  }

  // Email
  if (!formFields.email?.value.trim()) {
    showFieldError('email', 'Email is required');
    isValid = false;
  } else if (!validateEmail(formFields.email.value.trim())) {
    showFieldError('email', 'Please enter a valid email address');
    isValid = false;
  } else {
    clearFieldError('email');
  }

  // Message
  if (!formFields.message?.value.trim()) {
    showFieldError('message', 'Message is required');
    isValid = false;
  } else if (formFields.message.value.trim().length < 10) {
    showFieldError('message', 'Message must be at least 10 characters');
    isValid = false;
  } else {
    clearFieldError('message');
  }

  return isValid;
}

// Clear errors on input
Object.keys(formFields).forEach((field) => {
  formFields[field]?.addEventListener('input', () => clearFieldError(field));
  formFields[field]?.addEventListener('blur', () => {
    if (formFields[field].value.trim()) {
      // Re-validate on blur if there's content
      if (field === 'email' && !validateEmail(formFields.email.value.trim())) {
        showFieldError('email', 'Please enter a valid email address');
      } else {
        clearFieldError(field);
      }
    }
  });
});

contactForm?.addEventListener('submit', (e) => {
  e.preventDefault();

  if (!validateForm()) return;

  // Simulate form submission (replace with actual backend)
  const submitBtn = contactForm.querySelector('.btn-submit');
  const originalText = submitBtn.innerHTML;
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
  submitBtn.disabled = true;

  // Simulate API call
  setTimeout(() => {
    submitBtn.innerHTML = '<i class="fas fa-check"></i>';
    submitBtn.style.background = 'linear-gradient(135deg, #27ae60, #2ecc71)';

    // Reset form
    contactForm.reset();
    Object.keys(formErrors).forEach((key) => clearFieldError(key));

    setTimeout(() => {
      submitBtn.innerHTML = originalText;
      submitBtn.style.background = '';
      submitBtn.disabled = false;
    }, 2000);
  }, 1500);
});

/* ==================== CV DOWNLOAD ==================== */
const cvButtons = document.querySelectorAll('#cvDownload, #heroCvDownload');

cvButtons.forEach((btn) => {
  btn?.addEventListener('click', (e) => {
    e.preventDefault();
    const cvPath = './Haitham_CV.pdf';
    const link = document.createElement('a');
    link.href = cvPath;
    link.download = 'Haitham_CV.pdf';
    link.click();
  });
});
