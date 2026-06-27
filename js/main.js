/**
 * Atmos Dental – main.js
 * Pure vanilla JS. No dependencies.
 *
 * Features:
 *  1. Sticky header shadow on scroll
 *  2. Mobile hamburger menu
 *  3. ScrollSpy – active nav link on scroll
 *  4. Fade-in on scroll via Intersection Observer
 *  5. Testimonials auto-sliding carousel with pause on hover
 *  6. Gallery lightbox
 *  7. Contact form success message
 */

'use strict';

/* ============================================================
   1. STICKY HEADER – add shadow when page is scrolled
   ============================================================ */
(function initStickyHeader() {
  const header = document.getElementById('site-header');
  if (!header) return;

  function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 10);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load
}());

/* ============================================================
   2. MOBILE HAMBURGER MENU
   ============================================================ */
(function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const menu      = document.getElementById('mobile-menu');
  const overlay   = document.getElementById('mobile-menu-overlay');
  const closeBtn  = document.getElementById('mobile-menu-close');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link, .mobile-cta');

  if (!hamburger || !menu) return;

  function openMenu() {
    menu.classList.add('open');
    overlay.classList.add('visible');
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    menu.setAttribute('aria-hidden', 'false');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    menu.classList.remove('open');
    overlay.classList.remove('visible');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-hidden', 'true');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', openMenu);
  closeBtn.addEventListener('click', closeMenu);
  overlay.addEventListener('click', closeMenu);

  mobileLinks.forEach(function(link) {
    link.addEventListener('click', closeMenu);
  });

  // Close on Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && menu.classList.contains('open')) closeMenu();
  });
}());

/* ============================================================
   3. SCROLLSPY – highlight active nav link
   ============================================================ */
(function initScrollSpy() {
  const sections = document.querySelectorAll('section[id], div[id="home"]');
  const navLinks = document.querySelectorAll('.nav-link');
  if (!navLinks.length) return;

  var headerH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 72;

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        var id = entry.target.getAttribute('id');
        navLinks.forEach(function(link) {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });
  }, {
    rootMargin: '-' + headerH + 'px 0px -55% 0px',
    threshold: 0
  });

  sections.forEach(function(section) { observer.observe(section); });
}());

/* ============================================================
   4. FADE-IN ON SCROLL – Intersection Observer
   ============================================================ */
(function initFadeIn() {
  var elements = document.querySelectorAll('.fade-in, .fade-in-right');
  if (!elements.length) return;

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  elements.forEach(function(el) { observer.observe(el); });
}());

/* ============================================================
   5. TESTIMONIALS CAROUSEL
      - Shows 3 cards on desktop, 2 on tablet, 1 on mobile
      - Auto-slides every 4 s, pauses on hover/focus
      - Prev / Next buttons + dots
   ============================================================ */
(function initCarousel() {
  var track   = document.getElementById('carousel-track');
  var prevBtn = document.getElementById('carousel-prev');
  var nextBtn = document.getElementById('carousel-next');
  var dotsWrap = document.getElementById('carousel-dots');
  if (!track || !prevBtn) return;

  var cards = Array.from(track.querySelectorAll('.testimonial-card'));
  var total = cards.length;
  var current = 0;
  var autoTimer = null;
  var INTERVAL = 4000;

  /* ----- Determine visible count from CSS ----- */
  function getVisible() {
    var w = window.innerWidth;
    if (w <= 640)  return 1;
    if (w <= 900)  return 2;
    return 3;
  }

  /* ----- Build dots ----- */
  function buildDots() {
    dotsWrap.innerHTML = '';
    var visible = getVisible();
    var dotCount = Math.ceil(total / visible);
    for (var i = 0; i < dotCount; i++) {
      var dot = document.createElement('button');
      dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
      dot.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
      dot.dataset.index = i;
      dot.addEventListener('click', function() {
        goTo(parseInt(this.dataset.index) * getVisible());
        resetAuto();
      });
      dotsWrap.appendChild(dot);
    }
  }

  /* ----- Update dots ----- */
  function updateDots() {
    var visible = getVisible();
    var activeDot = Math.floor(current / visible);
    var dots = dotsWrap.querySelectorAll('.carousel-dot');
    dots.forEach(function(d, i) {
      d.classList.toggle('active', i === activeDot);
      d.setAttribute('aria-selected', i === activeDot ? 'true' : 'false');
    });
  }

  /* ----- Move carousel ----- */
  function goTo(index) {
    var visible = getVisible();
    var maxIndex = total - visible;
    if (index < 0) index = 0;
    if (index > maxIndex) index = maxIndex;
    current = index;

    // Calculate width of one card including gap (gap = 1.5rem = 24px)
    var cardW = track.parentElement.offsetWidth;
    var gap = 24;
    var singleW = (cardW - gap * (visible - 1)) / visible;
    var offset = current * (singleW + gap);

    track.style.transform = 'translateX(-' + offset + 'px)';
    updateDots();
  }

  /* ----- Next / Prev ----- */
  function goNext() {
    var visible = getVisible();
    var next = current + visible;
    if (next >= total) next = 0;
    goTo(next);
  }

  function goPrev() {
    var visible = getVisible();
    var prev = current - visible;
    var maxIndex = total - visible;
    if (prev < 0) prev = maxIndex;
    goTo(prev);
  }

  nextBtn.addEventListener('click', function() { goNext(); resetAuto(); });
  prevBtn.addEventListener('click', function() { goPrev(); resetAuto(); });

  /* ----- Auto-play ----- */
  function startAuto() {
    autoTimer = setInterval(goNext, INTERVAL);
  }
  function stopAuto() {
    clearInterval(autoTimer);
    autoTimer = null;
  }
  function resetAuto() {
    stopAuto();
    startAuto();
  }

  /* ----- Pause on hover / focus ----- */
  var wrap = track.closest('.carousel-wrap');
  wrap.addEventListener('mouseenter', stopAuto);
  wrap.addEventListener('mouseleave', startAuto);
  wrap.addEventListener('focusin',   stopAuto);
  wrap.addEventListener('focusout',  startAuto);

  /* ----- Touch/swipe support ----- */
  var touchStartX = 0;
  track.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });
  track.addEventListener('touchend', function(e) {
    var dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) {
      if (dx < 0) goNext(); else goPrev();
      resetAuto();
    }
  }, { passive: true });

  /* ----- Resize handler ----- */
  var resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      buildDots();
      goTo(0);
    }, 200);
  });

  /* ----- Init ----- */
  buildDots();
  goTo(0);
  startAuto();
}());

/* ============================================================
   6. GALLERY LIGHTBOX
   ============================================================ */
(function initLightbox() {
  var lightbox   = document.getElementById('lightbox');
  var lbOverlay  = document.getElementById('lightbox-overlay');
  var lbClose    = document.getElementById('lightbox-close');
  var lbPlaceholder = document.getElementById('lightbox-placeholder');
  var lbCaption  = document.getElementById('lightbox-caption');
  var galleryItems = document.querySelectorAll('.gallery-item');

  if (!lightbox || !galleryItems.length) return;

  function openLightbox(item) {
    var label = item.dataset.label || '';
    var bg    = item.querySelector('.gallery-bg');
    var bgStyle = bg ? bg.style.background : 'linear-gradient(135deg,#0077CC,#00C9A7)';

    lbPlaceholder.style.background = bgStyle;
    lbCaption.textContent = label;

    lightbox.setAttribute('aria-hidden', 'false');
    lbOverlay.setAttribute('aria-hidden', 'false');
    lightbox.classList.add('visible');
    lbOverlay.classList.add('visible');
    document.body.style.overflow = 'hidden';
    lbClose.focus();
  }

  function closeLightbox() {
    lightbox.setAttribute('aria-hidden', 'true');
    lbOverlay.setAttribute('aria-hidden', 'true');
    lightbox.classList.remove('visible');
    lbOverlay.classList.remove('visible');
    document.body.style.overflow = '';
  }

  galleryItems.forEach(function(item) {
    item.addEventListener('click', function() { openLightbox(item); });
    item.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(item);
      }
    });
  });

  lbClose.addEventListener('click', closeLightbox);
  lbOverlay.addEventListener('click', closeLightbox);
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && lightbox.classList.contains('visible')) closeLightbox();
  });
}());

/* ============================================================
   7. CONTACT FORM – show success message on submit
   ============================================================ */
(function initContactForm() {
  var form    = document.getElementById('contact-form');
  var success = document.getElementById('form-success');
  if (!form || !success) return;

  var PHONE_RE = /^\+?[\d\s\-()]{7,15}$/;
  var MAX_NAME_LEN = 100;
  var MAX_PHONE_LEN = 20;
  var MAX_MSG_LEN = 2000;

  function sanitize(str) {
    var el = document.createElement('div');
    el.appendChild(document.createTextNode(str));
    return el.innerHTML;
  }

  function markInvalid(field, msg) {
    field.style.borderColor = '#CC2200';
    field.setAttribute('aria-invalid', 'true');
    field.setAttribute('title', msg);
    field.addEventListener('input', function() {
      field.style.borderColor = '';
      field.removeAttribute('aria-invalid');
      field.removeAttribute('title');
    }, { once: true });
  }

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    var nameEl  = form.querySelector('#form-name');
    var phoneEl = form.querySelector('#form-phone');
    var emailEl = form.querySelector('#form-email');
    var msgEl   = form.querySelector('#form-message');

    var name  = nameEl.value.trim().slice(0, MAX_NAME_LEN);
    var phone = phoneEl.value.trim().slice(0, MAX_PHONE_LEN);
    var email = emailEl.value.trim();
    var msg   = msgEl.value.trim().slice(0, MAX_MSG_LEN);

    var valid = true;

    if (!name) {
      markInvalid(nameEl, 'Name is required');
      valid = false;
    }

    if (!phone) {
      markInvalid(phoneEl, 'Phone number is required');
      valid = false;
    } else if (!PHONE_RE.test(phone)) {
      markInvalid(phoneEl, 'Enter a valid phone number');
      valid = false;
    }

    if (email && !emailEl.validity.valid) {
      markInvalid(emailEl, 'Enter a valid email address');
      valid = false;
    }

    if (!msg) {
      markInvalid(msgEl, 'Message is required');
      valid = false;
    }

    if (!valid) return;

    var sanitizedName  = sanitize(name);
    var sanitizedPhone = sanitize(phone);
    var sanitizedEmail = sanitize(email);
    var sanitizedMsg   = sanitize(msg);

    var submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending\u2026';

    setTimeout(function() {
      form.reset();
      success.classList.add('visible');
      success.setAttribute('aria-hidden', 'false');
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Message';

      setTimeout(function() {
        success.classList.remove('visible');
        success.setAttribute('aria-hidden', 'true');
      }, 6000);
    }, 900);
  });
}());
