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
   Shared namespace for testability
   ============================================================ */
var AtmosDental = (typeof window !== 'undefined' ? window : {}).AtmosDental || {};

/* ============================================================
   1. STICKY HEADER – add shadow when page is scrolled
   ============================================================ */
AtmosDental.stickyHeader = (function initStickyHeader() {
  var header = typeof document !== 'undefined' ? document.getElementById('site-header') : null;

  function onScroll() {
    if (!header) return;
    header.classList.toggle('scrolled', window.scrollY > 10);
  }

  function init() {
    header = document.getElementById('site-header');
    if (!header) return;
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  if (typeof document !== 'undefined' && header) {
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  return { onScroll: onScroll, init: init };
}());

/* ============================================================
   2. MOBILE HAMBURGER MENU
   ============================================================ */
AtmosDental.mobileMenu = (function initMobileMenu() {
  function openMenu(menu, overlay, hamburger) {
    menu.classList.add('open');
    if (overlay) overlay.classList.add('visible');
    if (hamburger) {
      hamburger.classList.add('open');
      hamburger.setAttribute('aria-expanded', 'true');
    }
    menu.setAttribute('aria-hidden', 'false');
    if (overlay) overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu(menu, overlay, hamburger) {
    menu.classList.remove('open');
    if (overlay) overlay.classList.remove('visible');
    if (hamburger) {
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    }
    menu.setAttribute('aria-hidden', 'true');
    if (overlay) overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function init() {
    var hamburger = document.getElementById('hamburger');
    var menu      = document.getElementById('mobile-menu');
    var overlay   = document.getElementById('mobile-menu-overlay');
    var closeBtn  = document.getElementById('mobile-menu-close');
    var mobileLinks = document.querySelectorAll('.mobile-nav-link, .mobile-cta');

    if (!hamburger || !menu) return;

    hamburger.addEventListener('click', function() { openMenu(menu, overlay, hamburger); });
    if (closeBtn) closeBtn.addEventListener('click', function() { closeMenu(menu, overlay, hamburger); });
    if (overlay) overlay.addEventListener('click', function() { closeMenu(menu, overlay, hamburger); });

    mobileLinks.forEach(function(link) {
      link.addEventListener('click', function() { closeMenu(menu, overlay, hamburger); });
    });

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && menu.classList.contains('open')) closeMenu(menu, overlay, hamburger);
    });
  }

  // Auto-init if DOM elements exist
  if (typeof document !== 'undefined' && document.getElementById('hamburger') && document.getElementById('mobile-menu')) {
    init();
  }

  return { openMenu: openMenu, closeMenu: closeMenu, init: init };
}());

/* ============================================================
   3. SCROLLSPY – highlight active nav link
   ============================================================ */
AtmosDental.scrollSpy = (function initScrollSpy() {
  function handleIntersection(entries, navLinks) {
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
  }

  function init() {
    var sections = document.querySelectorAll('section[id], div[id="home"]');
    var navLinks = document.querySelectorAll('.nav-link');
    if (!navLinks.length) return;

    var headerH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 72;

    var observer = new IntersectionObserver(function(entries) {
      handleIntersection(entries, navLinks);
    }, {
      rootMargin: '-' + headerH + 'px 0px -55% 0px',
      threshold: 0
    });

    sections.forEach(function(section) { observer.observe(section); });
  }

  if (typeof document !== 'undefined' && document.querySelectorAll('.nav-link').length) {
    init();
  }

  return { handleIntersection: handleIntersection, init: init };
}());

/* ============================================================
   4. FADE-IN ON SCROLL – Intersection Observer
   ============================================================ */
AtmosDental.fadeIn = (function initFadeIn() {
  function handleFadeIntersection(entries, observer) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }

  function init() {
    var elements = document.querySelectorAll('.fade-in, .fade-in-right');
    if (!elements.length) return;

    var observer = new IntersectionObserver(function(entries) {
      handleFadeIntersection(entries, observer);
    }, { threshold: 0.12 });

    elements.forEach(function(el) { observer.observe(el); });
  }

  if (typeof document !== 'undefined' && document.querySelectorAll('.fade-in, .fade-in-right').length) {
    init();
  }

  return { handleFadeIntersection: handleFadeIntersection, init: init };
}());

/* ============================================================
   5. TESTIMONIALS CAROUSEL
      - Shows 3 cards on desktop, 2 on tablet, 1 on mobile
      - Auto-slides every 4 s, pauses on hover/focus
      - Prev / Next buttons + dots
   ============================================================ */
AtmosDental.carousel = (function initCarousel() {
  var track, prevBtn, nextBtn, dotsWrap, cards, total, current, autoTimer;
  var INTERVAL = 4000;

  function getVisible() {
    var w = window.innerWidth;
    if (w <= 640)  return 1;
    if (w <= 900)  return 2;
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
      dot.addEventListener('click', function() {
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
    dots.forEach(function(d, i) {
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

  function getCurrent() { return current; }
  function getAutoTimer() { return autoTimer; }

  function init() {
    track   = document.getElementById('carousel-track');
    prevBtn = document.getElementById('carousel-prev');
    nextBtn = document.getElementById('carousel-next');
    dotsWrap = document.getElementById('carousel-dots');
    if (!track || !prevBtn) return;

    cards = Array.from(track.querySelectorAll('.testimonial-card'));
    total = cards.length;
    current = 0;
    autoTimer = null;

    nextBtn.addEventListener('click', function() { goNext(); resetAuto(); });
    prevBtn.addEventListener('click', function() { goPrev(); resetAuto(); });

    var wrap = track.closest('.carousel-wrap');
    wrap.addEventListener('mouseenter', stopAuto);
    wrap.addEventListener('mouseleave', startAuto);
    wrap.addEventListener('focusin',   stopAuto);
    wrap.addEventListener('focusout',  startAuto);

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

    var resizeTimer;
    window.addEventListener('resize', function() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function() {
        buildDots();
        goTo(0);
      }, 200);
    });

    buildDots();
    goTo(0);
    startAuto();
  }

  if (typeof document !== 'undefined' && document.getElementById('carousel-track') && document.getElementById('carousel-prev')) {
    init();
  }

  return {
    getVisible: getVisible,
    buildDots: buildDots,
    updateDots: updateDots,
    goTo: goTo,
    goNext: goNext,
    goPrev: goPrev,
    startAuto: startAuto,
    stopAuto: stopAuto,
    resetAuto: resetAuto,
    getCurrent: getCurrent,
    getAutoTimer: getAutoTimer,
    init: init
  };
}());

/* ============================================================
   6. GALLERY LIGHTBOX
   ============================================================ */
AtmosDental.lightbox = (function initLightbox() {
  function openLightbox(item, lbPlaceholder, lbCaption, lightbox, lbOverlay, lbClose) {
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

  function closeLightbox(lightbox, lbOverlay) {
    lightbox.setAttribute('aria-hidden', 'true');
    lbOverlay.setAttribute('aria-hidden', 'true');
    lightbox.classList.remove('visible');
    lbOverlay.classList.remove('visible');
    document.body.style.overflow = '';
  }

  function init() {
    var lightbox   = document.getElementById('lightbox');
    var lbOverlay  = document.getElementById('lightbox-overlay');
    var lbClose    = document.getElementById('lightbox-close');
    var lbPlaceholder = document.getElementById('lightbox-placeholder');
    var lbCaption  = document.getElementById('lightbox-caption');
    var galleryItems = document.querySelectorAll('.gallery-item');

    if (!lightbox || !galleryItems.length) return;

    galleryItems.forEach(function(item) {
      item.addEventListener('click', function() { openLightbox(item, lbPlaceholder, lbCaption, lightbox, lbOverlay, lbClose); });
      item.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox(item, lbPlaceholder, lbCaption, lightbox, lbOverlay, lbClose);
        }
      });
    });

    lbClose.addEventListener('click', function() { closeLightbox(lightbox, lbOverlay); });
    lbOverlay.addEventListener('click', function() { closeLightbox(lightbox, lbOverlay); });
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && lightbox.classList.contains('visible')) closeLightbox(lightbox, lbOverlay);
    });
  }

  if (typeof document !== 'undefined' && document.getElementById('lightbox') && document.querySelectorAll('.gallery-item').length) {
    init();
  }

  return { openLightbox: openLightbox, closeLightbox: closeLightbox, init: init };
}());

/* ============================================================
   7. CONTACT FORM – show success message on submit
   ============================================================ */
AtmosDental.contactForm = (function initContactForm() {
  function validateAndSubmit(form, success) {
    var name  = form.querySelector('#form-name').value.trim();
    var phone = form.querySelector('#form-phone').value.trim();
    var msg   = form.querySelector('#form-message').value.trim();

    if (!name || !phone || !msg) {
      [
        { el: form.querySelector('#form-name'),    val: name  },
        { el: form.querySelector('#form-phone'),   val: phone },
        { el: form.querySelector('#form-message'), val: msg   }
      ].forEach(function(field) {
        if (!field.val) {
          field.el.style.borderColor = '#CC2200';
          field.el.addEventListener('input', function() {
            field.el.style.borderColor = '';
          }, { once: true });
        }
      });
      return false;
    }
    return true;
  }

  function init() {
    var form    = document.getElementById('contact-form');
    var success = document.getElementById('form-success');
    if (!form || !success) return;

    form.addEventListener('submit', function(e) {
      e.preventDefault();

      if (!validateAndSubmit(form, success)) return;

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
  }

  if (typeof document !== 'undefined' && document.getElementById('contact-form') && document.getElementById('form-success')) {
    init();
  }

  return { validateAndSubmit: validateAndSubmit, init: init };
}());

/* ============================================================
   Export for testing (Node.js / Jest)
   ============================================================ */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AtmosDental;
}
