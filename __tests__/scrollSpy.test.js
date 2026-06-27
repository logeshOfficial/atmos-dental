/**
 * @jest-environment jsdom
 */

describe('ScrollSpy', function () {
  var AtmosDental;

  beforeEach(function () {
    document.body.innerHTML =
      '<nav>' +
      '  <a href="#home" class="nav-link active">Home</a>' +
      '  <a href="#about" class="nav-link">About</a>' +
      '  <a href="#services" class="nav-link">Services</a>' +
      '</nav>' +
      '<section id="home"></section>' +
      '<section id="about"></section>' +
      '<section id="services"></section>';

    jest.resetModules();
    AtmosDental = require('../js/main');
  });

  afterEach(function () {
    document.body.innerHTML = '';
  });

  test('handleIntersection activates correct nav link when section intersects', function () {
    var navLinks = document.querySelectorAll('.nav-link');
    var entries = [{
      isIntersecting: true,
      target: document.getElementById('about')
    }];

    AtmosDental.scrollSpy.handleIntersection(entries, navLinks);

    expect(navLinks[0].classList.contains('active')).toBe(false);
    expect(navLinks[1].classList.contains('active')).toBe(true);
    expect(navLinks[2].classList.contains('active')).toBe(false);
  });

  test('handleIntersection ignores non-intersecting entries', function () {
    var navLinks = document.querySelectorAll('.nav-link');
    // Set initial state
    navLinks[0].classList.add('active');

    var entries = [{
      isIntersecting: false,
      target: document.getElementById('about')
    }];

    AtmosDental.scrollSpy.handleIntersection(entries, navLinks);

    // Should remain unchanged
    expect(navLinks[0].classList.contains('active')).toBe(true);
  });

  test('handleIntersection handles services section', function () {
    var navLinks = document.querySelectorAll('.nav-link');
    var entries = [{
      isIntersecting: true,
      target: document.getElementById('services')
    }];

    AtmosDental.scrollSpy.handleIntersection(entries, navLinks);

    expect(navLinks[0].classList.contains('active')).toBe(false);
    expect(navLinks[1].classList.contains('active')).toBe(false);
    expect(navLinks[2].classList.contains('active')).toBe(true);
  });

  test('handleIntersection handles home section', function () {
    var navLinks = document.querySelectorAll('.nav-link');
    // Remove initial active
    navLinks[0].classList.remove('active');
    navLinks[2].classList.add('active');

    var entries = [{
      isIntersecting: true,
      target: document.getElementById('home')
    }];

    AtmosDental.scrollSpy.handleIntersection(entries, navLinks);

    expect(navLinks[0].classList.contains('active')).toBe(true);
    expect(navLinks[2].classList.contains('active')).toBe(false);
  });

  test('handleIntersection with multiple entries processes all', function () {
    var navLinks = document.querySelectorAll('.nav-link');
    var entries = [
      { isIntersecting: false, target: document.getElementById('home') },
      { isIntersecting: true, target: document.getElementById('services') }
    ];

    AtmosDental.scrollSpy.handleIntersection(entries, navLinks);

    expect(navLinks[2].classList.contains('active')).toBe(true);
  });

  test('handleIntersection with unknown section id removes all active', function () {
    var navLinks = document.querySelectorAll('.nav-link');
    navLinks[0].classList.add('active');

    var unknownSection = document.createElement('section');
    unknownSection.id = 'unknown';
    document.body.appendChild(unknownSection);

    var entries = [{
      isIntersecting: true,
      target: unknownSection
    }];

    AtmosDental.scrollSpy.handleIntersection(entries, navLinks);

    navLinks.forEach(function (link) {
      expect(link.classList.contains('active')).toBe(false);
    });
  });
});
