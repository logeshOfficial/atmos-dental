/**
 * @jest-environment jsdom
 */

describe('Mobile Menu', function () {
  var AtmosDental;
  var menu, overlay, hamburger;

  beforeEach(function () {
    document.body.innerHTML =
      '<button id="hamburger" aria-expanded="false"></button>' +
      '<div id="mobile-menu" aria-hidden="true">' +
      '  <button id="mobile-menu-close"></button>' +
      '  <a href="#home" class="mobile-nav-link">Home</a>' +
      '  <a href="#about" class="mobile-nav-link">About</a>' +
      '  <a href="https://wa.me/123" class="mobile-cta">Book</a>' +
      '</div>' +
      '<div id="mobile-menu-overlay" aria-hidden="true"></div>';

    jest.resetModules();
    AtmosDental = require('../js/main');

    menu = document.getElementById('mobile-menu');
    overlay = document.getElementById('mobile-menu-overlay');
    hamburger = document.getElementById('hamburger');
  });

  afterEach(function () {
    document.body.innerHTML = '';
  });

  test('openMenu adds "open" class to menu and hamburger', function () {
    AtmosDental.mobileMenu.openMenu(menu, overlay, hamburger);
    expect(menu.classList.contains('open')).toBe(true);
    expect(hamburger.classList.contains('open')).toBe(true);
  });

  test('openMenu adds "visible" class to overlay', function () {
    AtmosDental.mobileMenu.openMenu(menu, overlay, hamburger);
    expect(overlay.classList.contains('visible')).toBe(true);
  });

  test('openMenu sets aria-expanded on hamburger to true', function () {
    AtmosDental.mobileMenu.openMenu(menu, overlay, hamburger);
    expect(hamburger.getAttribute('aria-expanded')).toBe('true');
  });

  test('openMenu sets aria-hidden to false on menu and overlay', function () {
    AtmosDental.mobileMenu.openMenu(menu, overlay, hamburger);
    expect(menu.getAttribute('aria-hidden')).toBe('false');
    expect(overlay.getAttribute('aria-hidden')).toBe('false');
  });

  test('openMenu sets body overflow to hidden', function () {
    AtmosDental.mobileMenu.openMenu(menu, overlay, hamburger);
    expect(document.body.style.overflow).toBe('hidden');
  });

  test('closeMenu removes "open" class from menu and hamburger', function () {
    AtmosDental.mobileMenu.openMenu(menu, overlay, hamburger);
    AtmosDental.mobileMenu.closeMenu(menu, overlay, hamburger);
    expect(menu.classList.contains('open')).toBe(false);
    expect(hamburger.classList.contains('open')).toBe(false);
  });

  test('closeMenu removes "visible" class from overlay', function () {
    AtmosDental.mobileMenu.openMenu(menu, overlay, hamburger);
    AtmosDental.mobileMenu.closeMenu(menu, overlay, hamburger);
    expect(overlay.classList.contains('visible')).toBe(false);
  });

  test('closeMenu sets aria-expanded on hamburger to false', function () {
    AtmosDental.mobileMenu.openMenu(menu, overlay, hamburger);
    AtmosDental.mobileMenu.closeMenu(menu, overlay, hamburger);
    expect(hamburger.getAttribute('aria-expanded')).toBe('false');
  });

  test('closeMenu restores body overflow', function () {
    AtmosDental.mobileMenu.openMenu(menu, overlay, hamburger);
    AtmosDental.mobileMenu.closeMenu(menu, overlay, hamburger);
    expect(document.body.style.overflow).toBe('');
  });

  test('closeMenu sets aria-hidden to true on menu and overlay', function () {
    AtmosDental.mobileMenu.openMenu(menu, overlay, hamburger);
    AtmosDental.mobileMenu.closeMenu(menu, overlay, hamburger);
    expect(menu.getAttribute('aria-hidden')).toBe('true');
    expect(overlay.getAttribute('aria-hidden')).toBe('true');
  });

  test('openMenu works without overlay', function () {
    AtmosDental.mobileMenu.openMenu(menu, null, hamburger);
    expect(menu.classList.contains('open')).toBe(true);
    expect(hamburger.classList.contains('open')).toBe(true);
  });

  test('openMenu works without hamburger', function () {
    AtmosDental.mobileMenu.openMenu(menu, overlay, null);
    expect(menu.classList.contains('open')).toBe(true);
    expect(overlay.classList.contains('visible')).toBe(true);
  });

  test('closeMenu works without overlay and hamburger', function () {
    AtmosDental.mobileMenu.openMenu(menu, null, null);
    AtmosDental.mobileMenu.closeMenu(menu, null, null);
    expect(menu.classList.contains('open')).toBe(false);
  });

  test('hamburger click opens menu', function () {
    hamburger.click();
    expect(menu.classList.contains('open')).toBe(true);
  });

  test('close button click closes menu', function () {
    hamburger.click();
    document.getElementById('mobile-menu-close').click();
    expect(menu.classList.contains('open')).toBe(false);
  });

  test('overlay click closes menu', function () {
    hamburger.click();
    overlay.click();
    expect(menu.classList.contains('open')).toBe(false);
  });

  test('mobile nav link click closes menu', function () {
    hamburger.click();
    document.querySelector('.mobile-nav-link').click();
    expect(menu.classList.contains('open')).toBe(false);
  });

  test('mobile CTA click closes menu', function () {
    hamburger.click();
    document.querySelector('.mobile-cta').click();
    expect(menu.classList.contains('open')).toBe(false);
  });

  test('Escape key closes open menu', function () {
    hamburger.click();
    expect(menu.classList.contains('open')).toBe(true);
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(menu.classList.contains('open')).toBe(false);
  });

  test('Escape key does nothing when menu is closed', function () {
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(menu.classList.contains('open')).toBe(false);
  });
});
