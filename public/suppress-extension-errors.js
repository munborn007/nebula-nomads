// This script runs BEFORE Next.js loads to catch extension errors early
(function() {
  'use strict';
  function isExtensionError(msg, stack) {
    var s = (stack || '') + (msg || '');
    return /chrome-extension:\/\//.test(s) ||
      /evmAsk\.js/.test(s) ||
      /Extension context invalidated/.test(s) ||
      /Unexpected error/.test(s) ||
      (/evmAsk|extension|selectExtension|wallet/.test(s) && /request|connect/.test(s));
  }
  
  // Suppress console errors from extensions
  var origError = console.error;
  console.error = function() {
    var msg = Array.prototype.join.call(arguments, ' ');
    var stack = (arguments[0] && arguments[0].stack) || '';
    if (isExtensionError(msg, stack) || (msg === 'Unexpected error' && stack.indexOf('evmAsk') !== -1)) {
      return; // Silently ignore
    }
    origError.apply(console, arguments);
  };
  
  // Catch unhandled rejections from extensions BEFORE Next.js sees them
  window.addEventListener('unhandledrejection', function(event) {
    var r = event.reason;
    var msg = (r && r.message) || (r && r.toString && r.toString()) || '';
    var stack = (r && r.stack) || '';
    if (isExtensionError(msg, stack)) {
      event.preventDefault();
      event.stopImmediatePropagation();
      event.stopPropagation();
      return false;
    }
  }, true); // Use capture phase
  
  // Catch synchronous errors from extensions
  window.onerror = function(msg, url, line, col, err) {
    var stack = (err && err.stack) || '';
    if (isExtensionError(msg, stack)) {
      return true; // Suppress error
    }
    return false;
  };
})();
