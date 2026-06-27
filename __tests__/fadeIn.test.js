/**
 * @jest-environment jsdom
 */

describe('Fade-in on Scroll', function () {
  var AtmosDental;

  beforeEach(function () {
    document.body.innerHTML =
      '<div class="fade-in">One</div>' +
      '<div class="fade-in">Two</div>' +
      '<div class="fade-in-right">Three</div>';

    jest.resetModules();
    AtmosDental = require('../js/main');
  });

  afterEach(function () {
    document.body.innerHTML = '';
  });

  test('handleFadeIntersection adds "visible" class when intersecting', function () {
    var el = document.querySelector('.fade-in');
    var mockObserver = { unobserve: jest.fn() };
    var entries = [{ isIntersecting: true, target: el }];

    AtmosDental.fadeIn.handleFadeIntersection(entries, mockObserver);

    expect(el.classList.contains('visible')).toBe(true);
  });

  test('handleFadeIntersection calls unobserve after adding visible', function () {
    var el = document.querySelector('.fade-in');
    var mockObserver = { unobserve: jest.fn() };
    var entries = [{ isIntersecting: true, target: el }];

    AtmosDental.fadeIn.handleFadeIntersection(entries, mockObserver);

    expect(mockObserver.unobserve).toHaveBeenCalledWith(el);
  });

  test('handleFadeIntersection does nothing when not intersecting', function () {
    var el = document.querySelector('.fade-in');
    var mockObserver = { unobserve: jest.fn() };
    var entries = [{ isIntersecting: false, target: el }];

    AtmosDental.fadeIn.handleFadeIntersection(entries, mockObserver);

    expect(el.classList.contains('visible')).toBe(false);
    expect(mockObserver.unobserve).not.toHaveBeenCalled();
  });

  test('handleFadeIntersection handles multiple entries', function () {
    var els = document.querySelectorAll('.fade-in, .fade-in-right');
    var mockObserver = { unobserve: jest.fn() };
    var entries = [
      { isIntersecting: true, target: els[0] },
      { isIntersecting: false, target: els[1] },
      { isIntersecting: true, target: els[2] }
    ];

    AtmosDental.fadeIn.handleFadeIntersection(entries, mockObserver);

    expect(els[0].classList.contains('visible')).toBe(true);
    expect(els[1].classList.contains('visible')).toBe(false);
    expect(els[2].classList.contains('visible')).toBe(true);
    expect(mockObserver.unobserve).toHaveBeenCalledTimes(2);
  });

  test('handleFadeIntersection works with fade-in-right class', function () {
    var el = document.querySelector('.fade-in-right');
    var mockObserver = { unobserve: jest.fn() };
    var entries = [{ isIntersecting: true, target: el }];

    AtmosDental.fadeIn.handleFadeIntersection(entries, mockObserver);

    expect(el.classList.contains('visible')).toBe(true);
  });
});
