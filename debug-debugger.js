// Debug script to help identify debugger pause sources
console.log('🔍 Debugger Pause Debugger');

// Check if debugger is being triggered
const originalDebugger = window.debugger;
let debuggerCallCount = 0;

// @ts-ignore
window.debugger = function() {
  debuggerCallCount++;
  console.log(`🚨 Debugger called ${debuggerCallCount} times`);
  console.trace('Debugger call stack:');
  return originalDebugger?.apply(this, arguments);
};

// Monitor for debugger statements in code
const originalEval = window.eval;
// @ts-ignore
window.eval = function(code) {
  if (code.includes('debugger')) {
    console.log('🚨 Debugger statement found in eval:', code);
  }
  return originalEval.call(this, code);
};

// Check browser dev tools settings
console.log('🔧 Browser Dev Tools Check:');
console.log('- Pause on exceptions:', 'Check your browser dev tools settings');
console.log('- Source maps enabled:', 'Check if source maps are causing issues');
console.log('- Console settings:', 'Check if "Pause on console errors" is enabled');

// Monitor console errors that might trigger debugger
const originalConsoleError = console.error;
console.error = function(...args) {
  console.log('🚨 Console error that might trigger debugger:', args);
  return originalConsoleError.apply(this, args);
};

console.log('✅ Debugger monitoring active. Check console for debugger triggers.');
