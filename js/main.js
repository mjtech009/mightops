/* =====================================================
   MightOps — main.js
   - Posts form data to Google Apps Script (Sheets + email)
   - Nav scroll behaviour
   - Fade-in animations
   ===================================================== */

/* ─────────────────────────────────────────
   ⚙️  CONFIGURATION
   After deploying appscript.gs as a Web App,
   paste the deployment URL below.
   ───────────────────────────────────────── */
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzH6GOrCAw_LOH2Kiwfof2NoryGg-YsIpnuQrPT7Gd8hWE2O9DBZFRhOJmgoIOWYQPg4w/exec';

/* ─────────────────────────────────────────
   Nav scroll behaviour
   ───────────────────────────────────────── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
});

/* Mobile nav toggle */
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', navLinks.classList.contains('open'));
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

/* ─────────────────────────────────────────
   Fade-in on scroll (IntersectionObserver)
   ───────────────────────────────────────── */
const fadeEls = document.querySelectorAll(
  '.skill-card, .project-card, .blog-card, .stat-item, .consultant-card, .section-header, .projects-header, .contact-info, .contact-form'
);
fadeEls.forEach((el, i) => {
  el.classList.add('fade-in');
  el.style.transitionDelay = `${(i % 4) * 80}ms`;
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

fadeEls.forEach(el => observer.observe(el));

/* ─────────────────────────────────────────
   Contact form submission
   ───────────────────────────────────────── */
const form       = document.getElementById('contactForm');
const statusEl   = document.getElementById('formStatus');
const submitBtn  = document.getElementById('submitBtn');
const btnText    = submitBtn.querySelector('.btn-text');
const btnLoading = submitBtn.querySelector('.btn-loading');

function setStatus(type, msg) {
  statusEl.className = `form-status ${type}`;
  statusEl.textContent = msg;
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  /* Validation */
  let valid = true;
  form.querySelectorAll('[required]').forEach(field => {
    if (!field.value.trim()) {
      field.style.borderColor = '#f87171';
      valid = false;
    } else {
      field.style.borderColor = '';
    }
  });
  if (!valid) {
    setStatus('error', 'Please fill in all required fields.');
    return;
  }

  const data = {
    first_name : form.firstName.value.trim(),
    last_name  : form.lastName.value.trim(),
    email      : form.email.value.trim(),
    phone      : form.phone.value.trim(),
    company    : form.company.value.trim(),
    interest   : form.interest.value,
    message    : form.message.value.trim(),
  };

  /* Loading state */
  submitBtn.disabled        = true;
  btnText.style.display     = 'none';
  btnLoading.style.display  = 'inline';
  statusEl.className        = 'form-status';

  try {
    /* no-cors: request goes through but response is opaque — that's fine */
    fetch(APPS_SCRIPT_URL, {
      method:  'POST',
      mode:    'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(data)
    });

    /* Small UX delay so the loader feels real */
    await new Promise(r => setTimeout(r, 900));

    setStatus('success', "✓ Message sent! We'll get back to you within 24 hours.");
    form.reset();
  } catch {
    setStatus('error', "Something went wrong. Please email info@mightops.com directly.");
  } finally {
    submitBtn.disabled       = false;
    btnText.style.display    = 'inline';
    btnLoading.style.display = 'none';
  }
});

/* Remove red border on input change */
form.querySelectorAll('.form-input').forEach(input => {
  input.addEventListener('input', () => { input.style.borderColor = ''; });
});
