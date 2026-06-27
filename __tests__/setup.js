// Mock IntersectionObserver for jsdom
global.IntersectionObserver = class IntersectionObserver {
  constructor(callback, options) {
    this._callback = callback;
    this._options = options;
    this._elements = [];
  }
  observe(el) { this._elements.push(el); }
  unobserve(el) {
    this._elements = this._elements.filter(function (e) { return e !== el; });
  }
  disconnect() { this._elements = []; }
};
