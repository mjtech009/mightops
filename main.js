/* =====================================================
   MightOps — main.js
   - EmailJS for SMTP email delivery (free, no backend)
   - localStorage for lead persistence → CSV download
   - Nav scroll behaviour
   - Fade-in animations
   ===================================================== */

/* ─────────────────────────────────────────
   ⚙️  CONFIGURATION — Edit these values
   ─────────────────────────────────────────
   Step 1: Sign up free at https://www.emailjs.com
   Step 2: Add Email Service (Gmail / SMTP / Outlook)
   Step 3: Create an Email Template (see README.md for template)
   Step 4: Replace the three values below
   ───────────────────────────────────────── */
const EMAILJS_PUBLIC_KEY  = 'YOUR_EMAILJS_PUBLIC_KEY';   // Account → API Keys
const EMAILJS_SERVICE_ID  = 'YOUR_SERVICE_ID';            // Email Services tab
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';           // Email Templates tab

/* ─────────────────────────────────────────
   Lead storage key (localStorage)
   ───────────────────────────────────────── */
const LEADS_KEY = 'mightops_leads';

/* ─────────────────────────────────────────
   Init EmailJS
   ───────────────────────────────────────── */
emailjs.init(EMAILJS_PUBLIC_KEY);

/* ─────────────────────────────────────────
   Nav scroll behaviour
   ───────────────────────────────────────── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

/* Mobile nav toggle */
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const isOpen = navLinks.classList.contains('open');
  navToggle.setAttribute('aria-expanded', isOpen);
});
/* Close nav on link click */
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
   Lead storage helpers
   ───────────────────────────────────────── */
function getLeads() {
  try {
    return JSON.parse(localStorage.getItem(LEADS_KEY)) || [];
  } catch {
    return [];
  }
}

function saveLead(data) {
  const leads = getLeads();
  leads.push({ ...data, submitted_at: new Date().toISOString() });
  localStorage.setItem(LEADS_KEY, JSON.stringify(leads));
}

/* ─────────────────────────────────────────
   CSV download
   ───────────────────────────────────────── */
document.getElementById('downloadCsv').addEventListener('click', () => {
  const leads = getLeads();
  if (!leads.length) {
    alert('No leads yet. Form submissions will appear here.');
    return;
  }
  const csv = Papa.unparse(leads, { header: true });
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `mightops_leads_${new Date().toISOString().slice(0,10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
});

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

  /* Basic client-side validation */
  const required = form.querySelectorAll('[required]');
  let valid = true;
  required.forEach(field => {
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

  /* Collect form data */
  const data = {
    first_name : form.firstName.value.trim(),
    last_name  : form.lastName.value.trim(),
    email      : form.email.value.trim(),
    phone      : form.phone.value.trim(),
    company    : form.company.value.trim(),
    interest   : form.interest.value,
    message    : form.message.value.trim(),
  };

  /* UI: loading state */
  submitBtn.disabled = true;
  btnText.style.display    = 'none';
  btnLoading.style.display = 'inline';
  statusEl.className = 'form-status';

  /* 1. Save to localStorage (CSV) */
  saveLead(data);

  /* 2. Send via EmailJS */
  const templateParams = {
    to_email    : 'info@mightops.com',
    from_name   : `${data.first_name} ${data.last_name}`,
    from_email  : data.email,
    phone       : data.phone || 'Not provided',
    company     : data.company || 'Not provided',
    interest    : data.interest,
    message     : data.message,
    reply_to    : data.email,
  };

  try {
    if (EMAILJS_PUBLIC_KEY === 'YOUR_EMAILJS_PUBLIC_KEY') {
      /* Dev mode: skip real send, just simulate */
      await new Promise(r => setTimeout(r, 900));
      console.log('[MightOps] EmailJS not configured yet — lead saved locally:', data);
      setStatus('success', '✓ Message received! Lead saved. (EmailJS not configured yet — see README.)');
    } else {
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
      setStatus('success', '✓ Message sent! We\'ll get back to you within 24 hours.');
    }

    form.reset();
  } catch (err) {
    console.error('EmailJS error:', err);
    setStatus('error', 'Email delivery failed — but your message is saved. Please contact info@mightops.com directly.');
  } finally {
    submitBtn.disabled = false;
    btnText.style.display    = 'inline';
    btnLoading.style.display = 'none';
  }
});

/* Remove red border on input change */
form.querySelectorAll('.form-input').forEach(input => {
  input.addEventListener('input', () => { input.style.borderColor = ''; });
});
