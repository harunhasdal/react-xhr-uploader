require('babel-register');
const jsdom = require('jsdom').jsdom;

// Set up dummy DOM and provide `window` and `document.`
global.document = jsdom('<!doctype html><html><body></body></html>');
global.window = document.defaultView;
const exposedProperties = ['window', 'navigator', 'document'];
Object.keys(document.defaultView).forEach(property => {
  if (typeof global[property] === 'undefined') {
    exposedProperties.push(property);
    global[property] = document.defaultView[property];
  }
});
global.requestAnimationFrame = function(callback) {
  setTimeout(callback, 0);
};
// Set variables and cookies here
global.navigator = {
  userAgent: 'node.js',
  plugins: []
};
