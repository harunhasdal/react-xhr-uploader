/* eslint-env node */
var execSync = require('child_process').execSync;
var stat = require('fs').stat;

function exec(command) {
  execSync(command, {
    stdio: [0, 1, 2]
  });
}

stat('dist-modules', (error, stats) => {
  // Skip building on Travis
  if (process.env.TRAVIS) {
    return;
  }

  if (error || !stats.isDirectory()) {
    exec('npm i babel-cli babel-preset-es2015 babel-preset-react');
    exec('npm run dist:modules');
  }
});
