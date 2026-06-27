/**
 * @jest-environment jsdom
 */

describe('Testimonials Carousel', function () {
  var AtmosDental;

  function setupCarouselDOM() {
    document.body.innerHTML =
      '<div class="carousel-wrap">' +
      '  <div id="carousel-track">' +
      '    <article class="testimonial-card">Card 1</article>' +
      '    <article class="testimonial-card">Card 2</article>' +
      '    <article class="testimonial-card">Card 3</article>' +
      '    <article class="testimonial-card">Card 4</article>' +
      '    <article class="testimonial-card">Card 5</article>' +
      '  </div>' +
      '  <button id="carousel-prev">Prev</button>' +
      '  <div id="carousel-dots"></div>' +
      '  <button id="carousel-next">Next</button>' +
      '</div>';
  }

  beforeEach(function () {
    jest.useFakeTimers();
    setupCarouselDOM();
    jest.resetModules();
    AtmosDental = require('../js/main');
  });

  afterEach(function () {
    jest.useRealTimers();
    document.body.innerHTML = '';
  });

  describe('getVisible', function () {
    test('returns 1 for mobile (width <= 640)', function () {
      Object.defineProperty(window, 'innerWidth', { value: 375, writable: true, configurable: true });
      expect(AtmosDental.carousel.getVisible()).toBe(1);
    });

    test('returns 2 for tablet (641-900)', function () {
      Object.defineProperty(window, 'innerWidth', { value: 768, writable: true, configurable: true });
      expect(AtmosDental.carousel.getVisible()).toBe(2);
    });

    test('returns 3 for desktop (> 900)', function () {
      Object.defineProperty(window, 'innerWidth', { value: 1024, writable: true, configurable: true });
      expect(AtmosDental.carousel.getVisible()).toBe(3);
    });

    test('returns 1 at boundary 640', function () {
      Object.defineProperty(window, 'innerWidth', { value: 640, writable: true, configurable: true });
      expect(AtmosDental.carousel.getVisible()).toBe(1);
    });

    test('returns 2 at boundary 900', function () {
      Object.defineProperty(window, 'innerWidth', { value: 900, writable: true, configurable: true });
      expect(AtmosDental.carousel.getVisible()).toBe(2);
    });

    test('returns 3 at boundary 901', function () {
      Object.defineProperty(window, 'innerWidth', { value: 901, writable: true, configurable: true });
      expect(AtmosDental.carousel.getVisible()).toBe(3);
    });
  });

  describe('goTo', function () {
    test('sets current index', function () {
      Object.defineProperty(window, 'innerWidth', { value: 375, writable: true, configurable: true });
      AtmosDental.carousel.goTo(2);
      expect(AtmosDental.carousel.getCurrent()).toBe(2);
    });

    test('clamps negative index to 0', function () {
      AtmosDental.carousel.goTo(-5);
      expect(AtmosDental.carousel.getCurrent()).toBe(0);
    });

    test('clamps index beyond max', function () {
      Object.defineProperty(window, 'innerWidth', { value: 1024, writable: true, configurable: true });
      AtmosDental.carousel.goTo(100);
      // max = total(5) - visible(3) = 2
      expect(AtmosDental.carousel.getCurrent()).toBe(2);
    });

    test('applies translateX transform to track', function () {
      Object.defineProperty(window, 'innerWidth', { value: 375, writable: true, configurable: true });
      AtmosDental.carousel.goTo(1);
      var track = document.getElementById('carousel-track');
      expect(track.style.transform).toContain('translateX');
    });
  });

  describe('goNext', function () {
    test('advances by visible count', function () {
      Object.defineProperty(window, 'innerWidth', { value: 375, writable: true, configurable: true });
      AtmosDental.carousel.goTo(0);
      AtmosDental.carousel.goNext();
      expect(AtmosDental.carousel.getCurrent()).toBe(1);
    });

    test('wraps to 0 when past end', function () {
      Object.defineProperty(window, 'innerWidth', { value: 375, writable: true, configurable: true });
      AtmosDental.carousel.goTo(4);
      AtmosDental.carousel.goNext();
      expect(AtmosDental.carousel.getCurrent()).toBe(0);
    });
  });

  describe('goPrev', function () {
    test('moves back by visible count', function () {
      Object.defineProperty(window, 'innerWidth', { value: 375, writable: true, configurable: true });
      AtmosDental.carousel.goTo(2);
      AtmosDental.carousel.goPrev();
      expect(AtmosDental.carousel.getCurrent()).toBe(1);
    });

    test('wraps to maxIndex when at 0', function () {
      Object.defineProperty(window, 'innerWidth', { value: 375, writable: true, configurable: true });
      AtmosDental.carousel.goTo(0);
      AtmosDental.carousel.goPrev();
      // maxIndex = 5-1 = 4
      expect(AtmosDental.carousel.getCurrent()).toBe(4);
    });
  });

  describe('buildDots', function () {
    test('creates correct number of dots for mobile', function () {
      Object.defineProperty(window, 'innerWidth', { value: 375, writable: true, configurable: true });
      AtmosDental.carousel.buildDots();
      var dots = document.querySelectorAll('.carousel-dot');
      expect(dots.length).toBe(5); // 5 cards, 1 visible = 5 dots
    });

    test('creates correct number of dots for desktop', function () {
      Object.defineProperty(window, 'innerWidth', { value: 1024, writable: true, configurable: true });
      AtmosDental.carousel.buildDots();
      var dots = document.querySelectorAll('.carousel-dot');
      expect(dots.length).toBe(2); // ceil(5/3) = 2 dots
    });

    test('first dot is active by default', function () {
      AtmosDental.carousel.buildDots();
      var firstDot = document.querySelector('.carousel-dot');
      expect(firstDot.classList.contains('active')).toBe(true);
      expect(firstDot.getAttribute('aria-selected')).toBe('true');
    });

    test('dots have correct role and aria-label', function () {
      AtmosDental.carousel.buildDots();
      var dots = document.querySelectorAll('.carousel-dot');
      dots.forEach(function (dot, i) {
        expect(dot.getAttribute('role')).toBe('tab');
        expect(dot.getAttribute('aria-label')).toBe('Go to slide ' + (i + 1));
      });
    });
  });

  describe('updateDots', function () {
    test('marks correct dot as active after goTo', function () {
      Object.defineProperty(window, 'innerWidth', { value: 375, writable: true, configurable: true });
      AtmosDental.carousel.buildDots();
      AtmosDental.carousel.goTo(2);
      var dots = document.querySelectorAll('.carousel-dot');
      expect(dots[2].classList.contains('active')).toBe(true);
      expect(dots[0].classList.contains('active')).toBe(false);
    });
  });

  describe('Auto-play', function () {
    test('startAuto sets an interval timer', function () {
      AtmosDental.carousel.stopAuto();
      AtmosDental.carousel.startAuto();
      expect(AtmosDental.carousel.getAutoTimer()).not.toBeNull();
    });

    test('stopAuto clears the timer', function () {
      AtmosDental.carousel.startAuto();
      AtmosDental.carousel.stopAuto();
      expect(AtmosDental.carousel.getAutoTimer()).toBeNull();
    });

    test('resetAuto restarts the timer', function () {
      AtmosDental.carousel.startAuto();
      var firstTimer = AtmosDental.carousel.getAutoTimer();
      AtmosDental.carousel.resetAuto();
      var secondTimer = AtmosDental.carousel.getAutoTimer();
      expect(secondTimer).not.toBeNull();
      expect(secondTimer).not.toBe(firstTimer);
    });

    test('auto-play advances carousel after interval', function () {
      Object.defineProperty(window, 'innerWidth', { value: 1024, writable: true, configurable: true });
      AtmosDental.carousel.goTo(0);
      AtmosDental.carousel.stopAuto();
      AtmosDental.carousel.startAuto();

      jest.advanceTimersByTime(4000);
      // visible=3 on desktop, so goNext moves by 3, but clamped to max=2
      expect(AtmosDental.carousel.getCurrent()).toBe(2);
    });
  });

  describe('Button clicks', function () {
    test('next button advances carousel', function () {
      Object.defineProperty(window, 'innerWidth', { value: 1024, writable: true, configurable: true });
      AtmosDental.carousel.goTo(0);
      document.getElementById('carousel-next').click();
      // visible=3, so moves to index 2 (clamped from 3)
      expect(AtmosDental.carousel.getCurrent()).toBe(2);
    });

    test('prev button moves carousel back', function () {
      Object.defineProperty(window, 'innerWidth', { value: 1024, writable: true, configurable: true });
      AtmosDental.carousel.goTo(2);
      document.getElementById('carousel-prev').click();
      // prev = 2-3 = -1 => wraps to maxIndex = 5-3 = 2
      expect(AtmosDental.carousel.getCurrent()).toBe(2);
    });
  });

  describe('Dot clicks', function () {
    test('clicking a dot navigates to the corresponding slide group', function () {
      Object.defineProperty(window, 'innerWidth', { value: 375, writable: true, configurable: true });
      AtmosDental.carousel.buildDots();
      var dots = document.querySelectorAll('.carousel-dot');
      // Click the third dot (index 2), visible=1 so goTo(2*1=2)
      dots[2].click();
      expect(AtmosDental.carousel.getCurrent()).toBe(2);
    });

    test('clicking first dot returns to start', function () {
      Object.defineProperty(window, 'innerWidth', { value: 375, writable: true, configurable: true });
      AtmosDental.carousel.buildDots();
      AtmosDental.carousel.goTo(3);
      var dots = document.querySelectorAll('.carousel-dot');
      dots[0].click();
      expect(AtmosDental.carousel.getCurrent()).toBe(0);
    });
  });

  describe('Touch/swipe support', function () {
    test('swipe left triggers goNext', function () {
      Object.defineProperty(window, 'innerWidth', { value: 375, writable: true, configurable: true });
      AtmosDental.carousel.goTo(0);
      var track = document.getElementById('carousel-track');

      track.dispatchEvent(new TouchEvent('touchstart', {
        changedTouches: [{ clientX: 200 }]
      }));
      track.dispatchEvent(new TouchEvent('touchend', {
        changedTouches: [{ clientX: 100 }]
      }));

      expect(AtmosDental.carousel.getCurrent()).toBe(1);
    });

    test('swipe right triggers goPrev', function () {
      Object.defineProperty(window, 'innerWidth', { value: 375, writable: true, configurable: true });
      AtmosDental.carousel.goTo(2);
      var track = document.getElementById('carousel-track');

      track.dispatchEvent(new TouchEvent('touchstart', {
        changedTouches: [{ clientX: 100 }]
      }));
      track.dispatchEvent(new TouchEvent('touchend', {
        changedTouches: [{ clientX: 200 }]
      }));

      expect(AtmosDental.carousel.getCurrent()).toBe(1);
    });

    test('small swipe does nothing', function () {
      Object.defineProperty(window, 'innerWidth', { value: 375, writable: true, configurable: true });
      AtmosDental.carousel.goTo(1);
      var track = document.getElementById('carousel-track');

      track.dispatchEvent(new TouchEvent('touchstart', {
        changedTouches: [{ clientX: 200 }]
      }));
      track.dispatchEvent(new TouchEvent('touchend', {
        changedTouches: [{ clientX: 180 }]
      }));

      expect(AtmosDental.carousel.getCurrent()).toBe(1);
    });
  });

  describe('Resize handler', function () {
    test('resize rebuilds dots and resets to index 0', function () {
      Object.defineProperty(window, 'innerWidth', { value: 375, writable: true, configurable: true });
      AtmosDental.carousel.goTo(3);
      expect(AtmosDental.carousel.getCurrent()).toBe(3);

      window.dispatchEvent(new Event('resize'));
      jest.advanceTimersByTime(200);

      expect(AtmosDental.carousel.getCurrent()).toBe(0);
      var dots = document.querySelectorAll('.carousel-dot');
      expect(dots.length).toBe(5);
    });
  });

  describe('Hover/focus pause', function () {
    test('mouseenter stops auto-play', function () {
      var wrap = document.querySelector('.carousel-wrap');
      wrap.dispatchEvent(new Event('mouseenter'));
      expect(AtmosDental.carousel.getAutoTimer()).toBeNull();
    });

    test('mouseleave restarts auto-play', function () {
      var wrap = document.querySelector('.carousel-wrap');
      wrap.dispatchEvent(new Event('mouseenter'));
      expect(AtmosDental.carousel.getAutoTimer()).toBeNull();
      wrap.dispatchEvent(new Event('mouseleave'));
      expect(AtmosDental.carousel.getAutoTimer()).not.toBeNull();
    });

    test('focusin stops auto-play', function () {
      var wrap = document.querySelector('.carousel-wrap');
      wrap.dispatchEvent(new Event('focusin'));
      expect(AtmosDental.carousel.getAutoTimer()).toBeNull();
    });

    test('focusout restarts auto-play', function () {
      var wrap = document.querySelector('.carousel-wrap');
      wrap.dispatchEvent(new Event('focusin'));
      wrap.dispatchEvent(new Event('focusout'));
      expect(AtmosDental.carousel.getAutoTimer()).not.toBeNull();
    });
  });
});
