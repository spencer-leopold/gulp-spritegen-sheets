'use strict';

var gutil = require('gulp-util');
var through2 = require('through2');
var SpritegenSheets = require('spritegen-sheets');

module.exports = function (opts) {
	opts = opts || {};
  var files = [];

  var onData = function (file, encoding, cb) {
    if (file.path) {
      files.push(file.path);
    }

    cb();
  };

  var onEnd = function(cb) {
    var _this = this;
    var src, instance, config;
    opts.streams = true;
    opts.logger = gutil;
    opts.src = files;

    instance = new SpritegenSheets(opts);
    instance.start();

    instance.on('update', function(stream) {
      _this.emit('update', stream);
    });

    cb();
  };

  return through2.obj(onData, onEnd);
};
