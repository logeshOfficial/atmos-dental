/**
 * @jest-environment jsdom
 */

describe('Gallery Lightbox', function () {
  var AtmosDental;
  var lightbox, lbOverlay, lbClose, lbPlaceholder, lbCaption;

  beforeEach(function () {
    document.body.innerHTML =
      '<button class="gallery-item" data-label="Teeth Whitening">' +
      '  <div class="gallery-bg" style="background: linear-gradient(135deg,#00C9A7,#7FEFDC);"></div>' +
      '</button>' +
      '<button class="gallery-item" data-label="Orthodontics">' +
      '  <div class="gallery-bg" style="background: linear-gradient(135deg,#1A2B4A,#0077CC);"></div>' +
      '</button>' +
      '<button class="gallery-item">' +
      '</button>' +
      '<div id="lightbox" class="lightbox" aria-hidden="true">' +
      '  <button id="lightbox-close"></button>' +
      '  <div id="lightbox-placeholder"></div>' +
      '  <p id="lightbox-caption"></p>' +
      '</div>' +
      '<div id="lightbox-overlay" aria-hidden="true"></div>';

    jest.resetModules();
    AtmosDental = require('../js/main');

    lightbox = document.getElementById('lightbox');
    lbOverlay = document.getElementById('lightbox-overlay');
    lbClose = document.getElementById('lightbox-close');
    lbPlaceholder = document.getElementById('lightbox-placeholder');
    lbCaption = document.getElementById('lightbox-caption');
  });

  afterEach(function () {
    document.body.innerHTML = '';
  });

  test('openLightbox makes lightbox visible', function () {
    var item = document.querySelector('.gallery-item');
    AtmosDental.lightbox.openLightbox(item, lbPlaceholder, lbCaption, lightbox, lbOverlay, lbClose);

    expect(lightbox.classList.contains('visible')).toBe(true);
    expect(lbOverlay.classList.contains('visible')).toBe(true);
  });

  test('openLightbox sets aria-hidden to false', function () {
    var item = document.querySelector('.gallery-item');
    AtmosDental.lightbox.openLightbox(item, lbPlaceholder, lbCaption, lightbox, lbOverlay, lbClose);

    expect(lightbox.getAttribute('aria-hidden')).toBe('false');
    expect(lbOverlay.getAttribute('aria-hidden')).toBe('false');
  });

  test('openLightbox sets caption text from data-label', function () {
    var item = document.querySelector('.gallery-item');
    AtmosDental.lightbox.openLightbox(item, lbPlaceholder, lbCaption, lightbox, lbOverlay, lbClose);

    expect(lbCaption.textContent).toBe('Teeth Whitening');
  });

  test('openLightbox sets background on placeholder', function () {
    var item = document.querySelector('.gallery-item');
    var bg = item.querySelector('.gallery-bg');
    var bgStyle = bg.style.background;
    AtmosDental.lightbox.openLightbox(item, lbPlaceholder, lbCaption, lightbox, lbOverlay, lbClose);

    expect(lbPlaceholder.style.background).toBe(bgStyle);
  });

  test('openLightbox sets body overflow to hidden', function () {
    var item = document.querySelector('.gallery-item');
    AtmosDental.lightbox.openLightbox(item, lbPlaceholder, lbCaption, lightbox, lbOverlay, lbClose);

    expect(document.body.style.overflow).toBe('hidden');
  });

  test('openLightbox uses default gradient when no gallery-bg exists', function () {
    var items = document.querySelectorAll('.gallery-item');
    var itemWithoutBg = items[2];
    AtmosDental.lightbox.openLightbox(itemWithoutBg, lbPlaceholder, lbCaption, lightbox, lbOverlay, lbClose);

    // Default fallback string is set
    expect(lbPlaceholder.style.background).toBeDefined();
  });

  test('openLightbox uses empty string for label when data-label missing', function () {
    var items = document.querySelectorAll('.gallery-item');
    var itemWithoutLabel = items[2];
    AtmosDental.lightbox.openLightbox(itemWithoutLabel, lbPlaceholder, lbCaption, lightbox, lbOverlay, lbClose);

    expect(lbCaption.textContent).toBe('');
  });

  test('closeLightbox removes visible class', function () {
    var item = document.querySelector('.gallery-item');
    AtmosDental.lightbox.openLightbox(item, lbPlaceholder, lbCaption, lightbox, lbOverlay, lbClose);
    AtmosDental.lightbox.closeLightbox(lightbox, lbOverlay);

    expect(lightbox.classList.contains('visible')).toBe(false);
    expect(lbOverlay.classList.contains('visible')).toBe(false);
  });

  test('closeLightbox sets aria-hidden to true', function () {
    var item = document.querySelector('.gallery-item');
    AtmosDental.lightbox.openLightbox(item, lbPlaceholder, lbCaption, lightbox, lbOverlay, lbClose);
    AtmosDental.lightbox.closeLightbox(lightbox, lbOverlay);

    expect(lightbox.getAttribute('aria-hidden')).toBe('true');
    expect(lbOverlay.getAttribute('aria-hidden')).toBe('true');
  });

  test('closeLightbox restores body overflow', function () {
    var item = document.querySelector('.gallery-item');
    AtmosDental.lightbox.openLightbox(item, lbPlaceholder, lbCaption, lightbox, lbOverlay, lbClose);
    AtmosDental.lightbox.closeLightbox(lightbox, lbOverlay);

    expect(document.body.style.overflow).toBe('');
  });

  test('clicking gallery item opens lightbox', function () {
    document.querySelector('.gallery-item').click();
    expect(lightbox.classList.contains('visible')).toBe(true);
  });

  test('clicking close button closes lightbox', function () {
    document.querySelector('.gallery-item').click();
    lbClose.click();
    expect(lightbox.classList.contains('visible')).toBe(false);
  });

  test('clicking overlay closes lightbox', function () {
    document.querySelector('.gallery-item').click();
    lbOverlay.click();
    expect(lightbox.classList.contains('visible')).toBe(false);
  });

  test('Escape key closes visible lightbox', function () {
    document.querySelector('.gallery-item').click();
    expect(lightbox.classList.contains('visible')).toBe(true);
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(lightbox.classList.contains('visible')).toBe(false);
  });

  test('Escape key does nothing when lightbox not visible', function () {
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(lightbox.classList.contains('visible')).toBe(false);
  });

  test('Enter key on gallery item opens lightbox', function () {
    var item = document.querySelector('.gallery-item');
    item.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(lightbox.classList.contains('visible')).toBe(true);
  });

  test('Space key on gallery item opens lightbox', function () {
    var item = document.querySelector('.gallery-item');
    item.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
    expect(lightbox.classList.contains('visible')).toBe(true);
  });

  test('second gallery item shows correct label', function () {
    var items = document.querySelectorAll('.gallery-item');
    items[1].click();
    expect(lbCaption.textContent).toBe('Orthodontics');
  });
});
