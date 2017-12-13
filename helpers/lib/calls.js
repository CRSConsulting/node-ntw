
const Promise = require('bluebird');
const cmd = require('node-cmd');

exports.getAsync = Promise.promisify(cmd.get, {
  multiArgs: true,
  context: cmd,
});

exports.delay = t => new Promise(((resolve) => {
  setTimeout(resolve, t);
}));