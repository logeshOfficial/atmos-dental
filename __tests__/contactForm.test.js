/**
 * @jest-environment jsdom
 */

describe('Contact Form', function () {
  var AtmosDental;

  beforeEach(function () {
    jest.useFakeTimers();
    document.body.innerHTML =
      '<form id="contact-form">' +
      '  <input id="form-name" type="text" />' +
      '  <input id="form-phone" type="tel" />' +
      '  <textarea id="form-message"></textarea>' +
      '  <button type="submit">Send Message</button>' +
      '</form>' +
      '<div id="form-success" aria-hidden="true"></div>';

    jest.resetModules();
    AtmosDental = require('../js/main');
    AtmosDental.contactForm.init();
  });

  afterEach(function () {
    jest.useRealTimers();
    document.body.innerHTML = '';
  });

  describe('validateAndSubmit', function () {
    test('returns false when all fields are empty', function () {
      var form = document.getElementById('contact-form');
      var success = document.getElementById('form-success');
      var result = AtmosDental.contactForm.validateAndSubmit(form, success);
      expect(result).toBe(false);
    });

    test('returns false when name is empty', function () {
      document.getElementById('form-phone').value = '9876543210';
      document.getElementById('form-message').value = 'Hello';
      var form = document.getElementById('contact-form');
      var success = document.getElementById('form-success');
      var result = AtmosDental.contactForm.validateAndSubmit(form, success);
      expect(result).toBe(false);
    });

    test('returns false when phone is empty', function () {
      document.getElementById('form-name').value = 'John';
      document.getElementById('form-message').value = 'Hello';
      var form = document.getElementById('contact-form');
      var success = document.getElementById('form-success');
      var result = AtmosDental.contactForm.validateAndSubmit(form, success);
      expect(result).toBe(false);
    });

    test('returns false when message is empty', function () {
      document.getElementById('form-name').value = 'John';
      document.getElementById('form-phone').value = '9876543210';
      var form = document.getElementById('contact-form');
      var success = document.getElementById('form-success');
      var result = AtmosDental.contactForm.validateAndSubmit(form, success);
      expect(result).toBe(false);
    });

    test('returns true when all required fields are filled', function () {
      document.getElementById('form-name').value = 'John Doe';
      document.getElementById('form-phone').value = '9876543210';
      document.getElementById('form-message').value = 'I need an appointment';
      var form = document.getElementById('contact-form');
      var success = document.getElementById('form-success');
      var result = AtmosDental.contactForm.validateAndSubmit(form, success);
      expect(result).toBe(true);
    });

    test('trims whitespace-only values and returns false', function () {
      document.getElementById('form-name').value = '   ';
      document.getElementById('form-phone').value = '   ';
      document.getElementById('form-message').value = '   ';
      var form = document.getElementById('contact-form');
      var success = document.getElementById('form-success');
      var result = AtmosDental.contactForm.validateAndSubmit(form, success);
      expect(result).toBe(false);
    });

    test('highlights empty fields with red border', function () {
      var form = document.getElementById('contact-form');
      var success = document.getElementById('form-success');
      AtmosDental.contactForm.validateAndSubmit(form, success);

      expect(document.getElementById('form-name').style.borderColor).toBe('#cc2200');
      expect(document.getElementById('form-phone').style.borderColor).toBe('#cc2200');
      expect(document.getElementById('form-message').style.borderColor).toBe('#cc2200');
    });

    test('does not highlight filled fields', function () {
      document.getElementById('form-name').value = 'John';
      document.getElementById('form-phone').value = '9876543210';
      var form = document.getElementById('contact-form');
      var success = document.getElementById('form-success');
      AtmosDental.contactForm.validateAndSubmit(form, success);

      expect(document.getElementById('form-name').style.borderColor).not.toBe('#cc2200');
      expect(document.getElementById('form-phone').style.borderColor).not.toBe('#cc2200');
      expect(document.getElementById('form-message').style.borderColor).toBe('#cc2200');
    });

    test('clears red border on input after validation error', function () {
      var form = document.getElementById('contact-form');
      var success = document.getElementById('form-success');
      AtmosDental.contactForm.validateAndSubmit(form, success);

      var nameField = document.getElementById('form-name');
      expect(nameField.style.borderColor).toBe('#cc2200');

      nameField.dispatchEvent(new Event('input'));
      expect(nameField.style.borderColor).toBe('');
    });
  });

  describe('Form submission', function () {
    test('submit with valid data disables button and changes text', function () {
      document.getElementById('form-name').value = 'John Doe';
      document.getElementById('form-phone').value = '9876543210';
      document.getElementById('form-message').value = 'Need appointment';

      var form = document.getElementById('contact-form');
      form.dispatchEvent(new Event('submit', { cancelable: true }));

      var submitBtn = form.querySelector('button[type="submit"]');
      expect(submitBtn.disabled).toBe(true);
      expect(submitBtn.textContent).toBe('Sending\u2026');
    });

    test('submit with valid data shows success after 900ms', function () {
      document.getElementById('form-name').value = 'John Doe';
      document.getElementById('form-phone').value = '9876543210';
      document.getElementById('form-message').value = 'Need appointment';

      var form = document.getElementById('contact-form');
      form.dispatchEvent(new Event('submit', { cancelable: true }));

      jest.advanceTimersByTime(900);

      var success = document.getElementById('form-success');
      expect(success.classList.contains('visible')).toBe(true);
      expect(success.getAttribute('aria-hidden')).toBe('false');
    });

    test('submit re-enables button after 900ms', function () {
      document.getElementById('form-name').value = 'John Doe';
      document.getElementById('form-phone').value = '9876543210';
      document.getElementById('form-message').value = 'Need appointment';

      var form = document.getElementById('contact-form');
      form.dispatchEvent(new Event('submit', { cancelable: true }));

      jest.advanceTimersByTime(900);

      var submitBtn = form.querySelector('button[type="submit"]');
      expect(submitBtn.disabled).toBe(false);
      expect(submitBtn.textContent).toBe('Send Message');
    });

    test('success message hides after 6900ms total', function () {
      document.getElementById('form-name').value = 'John Doe';
      document.getElementById('form-phone').value = '9876543210';
      document.getElementById('form-message').value = 'Need appointment';

      var form = document.getElementById('contact-form');
      form.dispatchEvent(new Event('submit', { cancelable: true }));

      jest.advanceTimersByTime(900 + 6000);

      var success = document.getElementById('form-success');
      expect(success.classList.contains('visible')).toBe(false);
      expect(success.getAttribute('aria-hidden')).toBe('true');
    });

    test('submit with empty fields does not disable button', function () {
      var form = document.getElementById('contact-form');
      form.dispatchEvent(new Event('submit', { cancelable: true }));

      var submitBtn = form.querySelector('button[type="submit"]');
      expect(submitBtn.disabled).toBe(false);
    });

    test('submit with empty fields does not show success', function () {
      var form = document.getElementById('contact-form');
      form.dispatchEvent(new Event('submit', { cancelable: true }));

      jest.advanceTimersByTime(1000);

      var success = document.getElementById('form-success');
      expect(success.classList.contains('visible')).toBe(false);
    });
  });
});
