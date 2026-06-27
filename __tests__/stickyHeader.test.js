/**
 * @jest-environment jsdom
 */

describe('Sticky Header', function () {
  var AtmosDental;

  beforeEach(function () {
    document.body.innerHTML = '<header id="site-header" class="site-header"></header>';
    jest.resetModules();
    AtmosDental = require('../js/main');
  });

  afterEach(function () {
    document.body.innerHTML = '';
  });

  test('init attaches header and runs onScroll', function () {
    AtmosDental.stickyHeader.init();
    var header = document.getElementById('site-header');
    expect(header).not.toBeNull();
  });

  test('adds "scrolled" class when scrollY > 10', function () {
    AtmosDental.stickyHeader.init();
    var header = document.getElementById('site-header');

    Object.defineProperty(window, 'scrollY', { value: 50, writable: true });
    AtmosDental.stickyHeader.onScroll();
    expect(header.classList.contains('scrolled')).toBe(true);
  });

  test('removes "scrolled" class when scrollY <= 10', function () {
    AtmosDental.stickyHeader.init();
    var header = document.getElementById('site-header');

    Object.defineProperty(window, 'scrollY', { value: 50, writable: true });
    AtmosDental.stickyHeader.onScroll();
    expect(header.classList.contains('scrolled')).toBe(true);

    Object.defineProperty(window, 'scrollY', { value: 5, writable: true });
    AtmosDental.stickyHeader.onScroll();
    expect(header.classList.contains('scrolled')).toBe(false);
  });

  test('does not add class at scrollY = 0', function () {
    AtmosDental.stickyHeader.init();
    var header = document.getElementById('site-header');

    Object.defineProperty(window, 'scrollY', { value: 0, writable: true });
    AtmosDental.stickyHeader.onScroll();
    expect(header.classList.contains('scrolled')).toBe(false);
  });

  test('adds class at boundary scrollY = 11', function () {
    AtmosDental.stickyHeader.init();
    var header = document.getElementById('site-header');

    Object.defineProperty(window, 'scrollY', { value: 11, writable: true });
    AtmosDental.stickyHeader.onScroll();
    expect(header.classList.contains('scrolled')).toBe(true);
  });

  test('does not add class at boundary scrollY = 10', function () {
    AtmosDental.stickyHeader.init();
    var header = document.getElementById('site-header');

    Object.defineProperty(window, 'scrollY', { value: 10, writable: true });
    AtmosDental.stickyHeader.onScroll();
    expect(header.classList.contains('scrolled')).toBe(false);
  });

  test('onScroll is a no-op when header element is missing', function () {
    document.body.innerHTML = '';
    jest.resetModules();
    var AD = require('../js/main');
    // Should not throw
    expect(function () { AD.stickyHeader.onScroll(); }).not.toThrow();
  });
});
