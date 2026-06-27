/**
 * Atmos Dental – main.js
 * Pure vanilla JS. No dependencies (except js/utils.js loaded first).
 *
 * Features:
 *  1. Sticky header shadow on scroll
 *  2. Mobile hamburger menu (via ModalManager)
 *  3. ScrollSpy – active nav link on scroll
 *  4. Fade-in on scroll via Intersection Observer
 *  5. Data-driven rendering of services, gallery, testimonials, contacts
 *  6. Testimonials auto-sliding carousel with pause on hover
 *  7. Gallery lightbox (via ModalManager)
 *  8. Contact form success message
 */

'use strict';

/* ============================================================
   0. DATA-DRIVEN RENDERING – populate repeated sections from SiteData
   ============================================================ */
(function initRendering() {
  renderList(
    document.getElementById('services-grid'),
    SiteData.services,
    Templates.serviceCard
  );
  renderList(
    document.getElementById('gallery-grid'),
    SiteData.gallery,
    Templates.galleryItem
  );
  renderList(
    document.getElementById('carousel-track'),
    SiteData.testimonials,
    Templates.testimonialCard
  );
  renderList(
    document.getElementById('contact-items'),
    SiteData.contactItems,
    Templates.contactItem
  );
}());

/* ============================================================
   1. STICKY HEADER – add shadow when page is scrolled
   ============================================================ */
(function initStickyHeader() {
  var header = document.getElementById('site-header');
  if (!header) return;

  function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 10);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}());

/* ============================================================
   2. MOBILE HAMBURGER MENU – uses shared ModalManager
   ============================================================ */
(function initMobileMenu() {
  var hamburger = document.getElementById('hamburger');
  var menu      = document.getElementById('mobile-menu');
  var overlay   = document.getElementById('mobile-menu-overlay');
  var closeBtn  = document.getElementById('mobile-menu-close');
  var mobileLinks = document.querySelectorAll('.mobile-nav-link, .mobile-cta');

  if (!hamburger || !menu) return;

  var menuCfg = {
    panels: [
      { el: menu, activeClass: 'open' },
      { el: overlay, activeClass: 'visible' }
    ],
    onClose: function () {
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  };

  function openMenu() {
    ModalManager.open(menuCfg);
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    ModalManager.close(menuCfg);
  }

  hamburger.addEventListener('click', openMenu);
  closeBtn.addEventListener('click', closeMenu);
  overlay.addEventListener('click', closeMenu);

  mobileLinks.forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });
}());

/* ============================================================
   3. SCROLLSPY – highlight active nav link
   ============================================================ */
(function initScrollSpy() {
  var sections = document.querySelectorAll('section[id], div[id="home"]');
  var navLinks = document.querySelectorAll('.nav-link');
  if (!navLinks.length) return;

  var headerH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 72;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var id = entry.target.getAttribute('id');
        navLinks.forEach(function (link) {
          link.classList.toggle('active', link.getAttribute('href') === '#' + id);
        });
      }
    });
  }, {
    rootMargin: '-' + headerH + 'px 0px -55% 0px',
    threshold: 0
  });

  sections.forEach(function (section) { observer.observe(section); });
}());

/* ============================================================
   4. FADE-IN ON SCROLL – Intersection Observer
   ============================================================ */
(function initFadeIn() {
  var elements = document.querySelectorAll('.fade-in, .fade-in-right');
  if (!elements.length) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  elements.forEach(function (el) { observer.observe(el); });
}());

/* ============================================================
   5. TESTIMONIALS CAROUSEL
   ============================================================ */
(function initCarousel() {
  var track    = document.getElementById('carousel-track');
  var prevBtn  = document.getElementById('carousel-prev');
  var nextBtn  = document.getElementById('carousel-next');
  var dotsWrap = document.getElementById('carousel-dots');
  if (!track || !prevBtn) return;

  var cards = Array.from(track.querySelectorAll('.testimonial-card'));
  var total = cards.length;
  var current = 0;
  var autoTimer = null;
  var INTERVAL = 4000;

  function getVisible() {
    var w = window.innerWidth;
    if (w <= 640) return 1;
    if (w <= 900) return 2;
    return 3;
  }

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
      dot.addEventListener('click', function () {
        goTo(parseInt(this.dataset.index) * getVisible());
        resetAuto();
      });
      dotsWrap.appendChild(dot);
    }
  }

  function updateDots() {
    var visible = getVisible();
    var activeDot = Math.floor(current / visible);
    var dots = dotsWrap.querySelectorAll('.carousel-dot');
    dots.forEach(function (d, i) {
      d.classList.toggle('active', i === activeDot);
      d.setAttribute('aria-selected', i === activeDot ? 'true' : 'false');
    });
  }

  function goTo(index) {
    var visible = getVisible();
    var maxIndex = total - visible;
    if (index < 0) index = 0;
    if (index > maxIndex) index = maxIndex;
    current = index;

    var cardW = track.parentElement.offsetWidth;
    var gap = 24;
    var singleW = (cardW - gap * (visible - 1)) / visible;
    var offset = current * (singleW + gap);

    track.style.transform = 'translateX(-' + offset + 'px)';
    updateDots();
  }

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

  nextBtn.addEventListener('click', function () { goNext(); resetAuto(); });
  prevBtn.addEventListener('click', function () { goPrev(); resetAuto(); });

  function startAuto() { autoTimer = setInterval(goNext, INTERVAL); }
  function stopAuto() { clearInterval(autoTimer); autoTimer = null; }
  function resetAuto() { stopAuto(); startAuto(); }

  var wrap = track.closest('.carousel-wrap');
  wrap.addEventListener('mouseenter', stopAuto);
  wrap.addEventListener('mouseleave', startAuto);
  wrap.addEventListener('focusin', stopAuto);
  wrap.addEventListener('focusout', startAuto);

  var touchStartX = 0;
  track.addEventListener('touchstart', function (e) {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });
  track.addEventListener('touchend', function (e) {
    var dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) {
      if (dx < 0) goNext(); else goPrev();
      resetAuto();
    }
  }, { passive: true });

  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      buildDots();
      goTo(0);
    }, 200);
  });

  buildDots();
  goTo(0);
  startAuto();
}());

/* ============================================================
   6. GALLERY LIGHTBOX – uses shared ModalManager
   ============================================================ */
(function initLightbox() {
  var lightbox      = document.getElementById('lightbox');
  var lbOverlay     = document.getElementById('lightbox-overlay');
  var lbClose       = document.getElementById('lightbox-close');
  var lbPlaceholder = document.getElementById('lightbox-placeholder');
  var lbCaption     = document.getElementById('lightbox-caption');
  var galleryItems  = document.querySelectorAll('.gallery-item');

  if (!lightbox || !galleryItems.length) return;

  var lightboxCfg = {
    panels: [
      { el: lightbox, activeClass: 'visible' },
      { el: lbOverlay, activeClass: 'visible' }
    ]
  };

  function openLightbox(item) {
    var label = item.dataset.label || '';
    var bg = item.querySelector('.gallery-bg');
    var bgStyle = bg ? bg.style.background : 'linear-gradient(135deg,#0077CC,#00C9A7)';

    lbPlaceholder.style.background = bgStyle;
    lbCaption.textContent = label;

    ModalManager.open(lightboxCfg);
    lbClose.focus();
  }

  function closeLightbox() {
    ModalManager.close(lightboxCfg);
  }

  galleryItems.forEach(function (item) {
    item.addEventListener('click', function () { openLightbox(item); });
    item.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(item);
      }
    });
  });

  lbClose.addEventListener('click', closeLightbox);
  lbOverlay.addEventListener('click', closeLightbox);
}());

/* ============================================================
   7. CONTACT FORM – show success message on submit
   ============================================================ */
(function initContactForm() {
  var form    = document.getElementById('contact-form');
  var success = document.getElementById('form-success');
  if (!form || !success) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var fields = [
      { el: form.querySelector('#form-name'), required: true },
      { el: form.querySelector('#form-phone'), required: true },
      { el: form.querySelector('#form-message'), required: true }
    ];

    var valid = true;
    fields.forEach(function (field) {
      if (field.required && !field.el.value.trim()) {
        valid = false;
        field.el.style.borderColor = '#CC2200';
        field.el.addEventListener('input', function () {
          field.el.style.borderColor = '';
        }, { once: true });
      }
    });

    if (!valid) return;

    var submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending\u2026';

    setTimeout(function () {
      form.reset();
      success.classList.add('visible');
      success.setAttribute('aria-hidden', 'false');
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Message';

      setTimeout(function () {
        success.classList.remove('visible');
        success.setAttribute('aria-hidden', 'true');
      }, 6000);
    }, 900);
  });
}());
