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
  try {
    const header = document.getElementById('site-header');
    if (!header) {
      console.warn('[Atmos] #site-header not found – sticky header disabled.');
      return;
    }

    function onScroll() {
      header.classList.toggle('scrolled', window.scrollY > 10);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run once on load
  } catch (err) {
    console.error('[Atmos] Sticky header init failed:', err);
  }
}());

/* ============================================================
   2. MOBILE HAMBURGER MENU
   ============================================================ */
(function initMobileMenu() {
  try {
    const hamburger = document.getElementById('hamburger');
    const menu      = document.getElementById('mobile-menu');
    const overlay   = document.getElementById('mobile-menu-overlay');
    const closeBtn  = document.getElementById('mobile-menu-close');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link, .mobile-cta');

    if (!hamburger || !menu) {
      console.warn('[Atmos] #hamburger or #mobile-menu not found – mobile menu disabled.');
      return;
    }

    if (!overlay)  console.warn('[Atmos] #mobile-menu-overlay not found – overlay behaviour disabled.');
    if (!closeBtn) console.warn('[Atmos] #mobile-menu-close not found – close button disabled.');

    function openMenu() {
      menu.classList.add('open');
      if (overlay) {
        overlay.classList.add('visible');
        overlay.setAttribute('aria-hidden', 'false');
      }
      hamburger.classList.add('open');
      hamburger.setAttribute('aria-expanded', 'true');
      menu.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      menu.classList.remove('open');
      if (overlay) {
        overlay.classList.remove('visible');
        overlay.setAttribute('aria-hidden', 'true');
      }
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      menu.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    hamburger.addEventListener('click', openMenu);
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);
    if (overlay)  overlay.addEventListener('click', closeMenu);

    mobileLinks.forEach(function(link) {
      link.addEventListener('click', closeMenu);
    });

    // Close on Escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && menu.classList.contains('open')) closeMenu();
    });
  } catch (err) {
    console.error('[Atmos] Mobile menu init failed:', err);
  }
}());

/* ============================================================
   3. SCROLLSPY – highlight active nav link
   ============================================================ */
(function initScrollSpy() {
  try {
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
  } catch (err) {
    console.error('[Atmos] ScrollSpy init failed:', err);
  }
}());

/* ============================================================
   4. FADE-IN ON SCROLL – Intersection Observer
   ============================================================ */
(function initFadeIn() {
  try {
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
  } catch (err) {
    console.error('[Atmos] Fade-in init failed:', err);
  }
}());

/* ============================================================
   5. TESTIMONIALS CAROUSEL
      - Shows 3 cards on desktop, 2 on tablet, 1 on mobile
      - Auto-slides every 4 s, pauses on hover/focus
      - Prev / Next buttons + dots
   ============================================================ */
(function initCarousel() {
  try {
  var track   = document.getElementById('carousel-track');
  var prevBtn = document.getElementById('carousel-prev');
  var nextBtn = document.getElementById('carousel-next');
  var dotsWrap = document.getElementById('carousel-dots');
  if (!track || !prevBtn || !nextBtn) {
    console.warn('[Atmos] Carousel elements missing (track/prev/next) – carousel disabled.');
    return;
  }
  if (!dotsWrap) console.warn('[Atmos] #carousel-dots not found – dot navigation disabled.');

  var cards = Array.from(track.querySelectorAll('.testimonial-card'));
  var total = cards.length;
  if (total === 0) {
    console.warn('[Atmos] No .testimonial-card elements found – carousel disabled.');
    return;
  }
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
    if (!dotsWrap) return;
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
    if (!dotsWrap) return;
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
  if (wrap) {
    wrap.addEventListener('mouseenter', stopAuto);
    wrap.addEventListener('mouseleave', startAuto);
    wrap.addEventListener('focusin',   stopAuto);
    wrap.addEventListener('focusout',  startAuto);
  } else {
    console.warn('[Atmos] .carousel-wrap not found – hover-pause disabled.');
  }

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
  } catch (err) {
    console.error('[Atmos] Carousel init failed:', err);
  }
}());

/* ============================================================
   6. GALLERY LIGHTBOX
   ============================================================ */
(function initLightbox() {
  try {
    var lightbox   = document.getElementById('lightbox');
    var lbOverlay  = document.getElementById('lightbox-overlay');
    var lbClose    = document.getElementById('lightbox-close');
    var lbPlaceholder = document.getElementById('lightbox-placeholder');
    var lbCaption  = document.getElementById('lightbox-caption');
    var galleryItems = document.querySelectorAll('.gallery-item');

    if (!lightbox || !galleryItems.length) {
      console.warn('[Atmos] #lightbox or .gallery-item elements not found – lightbox disabled.');
      return;
    }

    if (!lbOverlay)     console.warn('[Atmos] #lightbox-overlay not found – overlay behaviour disabled.');
    if (!lbClose)       console.warn('[Atmos] #lightbox-close not found – close button disabled.');
    if (!lbPlaceholder) console.warn('[Atmos] #lightbox-placeholder not found – preview background disabled.');
    if (!lbCaption)     console.warn('[Atmos] #lightbox-caption not found – captions disabled.');

    function openLightbox(item) {
      var label = item.dataset.label || '';
      var bg    = item.querySelector('.gallery-bg');
      var bgStyle = bg ? bg.style.background : 'linear-gradient(135deg,#0077CC,#00C9A7)';

      if (lbPlaceholder) lbPlaceholder.style.background = bgStyle;
      if (lbCaption) lbCaption.textContent = label;

      lightbox.setAttribute('aria-hidden', 'false');
      lightbox.classList.add('visible');
      if (lbOverlay) {
        lbOverlay.setAttribute('aria-hidden', 'false');
        lbOverlay.classList.add('visible');
      }
      document.body.style.overflow = 'hidden';
      if (lbClose) lbClose.focus();
    }

    function closeLightbox() {
      lightbox.setAttribute('aria-hidden', 'true');
      lightbox.classList.remove('visible');
      if (lbOverlay) {
        lbOverlay.setAttribute('aria-hidden', 'true');
        lbOverlay.classList.remove('visible');
      }
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

    if (lbClose)   lbClose.addEventListener('click', closeLightbox);
    if (lbOverlay) lbOverlay.addEventListener('click', closeLightbox);
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && lightbox.classList.contains('visible')) closeLightbox();
    });
  } catch (err) {
    console.error('[Atmos] Lightbox init failed:', err);
  }
}());

/* ============================================================
   7. CONTACT FORM – show success message on submit
   ============================================================ */
(function initContactForm() {
  try {
    var form    = document.getElementById('contact-form');
    var success = document.getElementById('form-success');
    if (!form || !success) {
      console.warn('[Atmos] #contact-form or #form-success not found – contact form disabled.');
      return;
    }

    var nameEl  = form.querySelector('#form-name');
    var phoneEl = form.querySelector('#form-phone');
    var msgEl   = form.querySelector('#form-message');
    var submitBtn = form.querySelector('button[type="submit"]');

    if (!nameEl || !phoneEl || !msgEl) {
      console.error('[Atmos] Required form fields (#form-name, #form-phone, #form-message) missing – contact form disabled.');
      return;
    }
    if (!submitBtn) {
      console.warn('[Atmos] Submit button not found – form submission may not work correctly.');
    }

    form.addEventListener('submit', function(e) {
      e.preventDefault();

      // Basic validation
      var name  = nameEl.value.trim();
      var phone = phoneEl.value.trim();
      var msg   = msgEl.value.trim();

      if (!name || !phone || !msg) {
        // Highlight empty required fields
        [
          { el: nameEl,  val: name  },
          { el: phoneEl, val: phone },
          { el: msgEl,   val: msg   }
        ].forEach(function(field) {
          if (!field.val) {
            field.el.style.borderColor = '#CC2200';
            field.el.addEventListener('input', function() {
              field.el.style.borderColor = '';
            }, { once: true });
          }
        });
        return;
      }

      // Simulate async submission
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending\u2026';
      }

      setTimeout(function() {
        try {
          form.reset();
          success.classList.add('visible');
          success.setAttribute('aria-hidden', 'false');
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Message';
          }

          // Hide success message after 6 s
          setTimeout(function() {
            success.classList.remove('visible');
            success.setAttribute('aria-hidden', 'true');
          }, 6000);
        } catch (submitErr) {
          console.error('[Atmos] Error during form submission callback:', submitErr);
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Message';
          }
        }
      }, 900);
    });
  } catch (err) {
    console.error('[Atmos] Contact form init failed:', err);
  }
}());
