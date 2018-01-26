const path = require('path');

module.exports = function(req, res, next) {
  res.sendFile(path.join(process.cwd(), 'www-resource/build/index.html'))
};