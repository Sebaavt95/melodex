import '@testing-library/jest-dom';

// Polyfill Pointer Capture API for Radix UI components (Select, etc.)
// JSDOM does not implement hasPointerCapture / setPointerCapture / releasePointerCapture
if (!HTMLElement.prototype.hasPointerCapture) {
  HTMLElement.prototype.hasPointerCapture = () => false;
}
if (!HTMLElement.prototype.setPointerCapture) {
  HTMLElement.prototype.setPointerCapture = () => {};
}
if (!HTMLElement.prototype.releasePointerCapture) {
  HTMLElement.prototype.releasePointerCapture = () => {};
}

// Polyfill scrollIntoView for Radix UI Select viewport
if (!HTMLElement.prototype.scrollIntoView) {
  HTMLElement.prototype.scrollIntoView = () => {};
}
