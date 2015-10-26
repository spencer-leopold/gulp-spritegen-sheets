'use strict';

var gutil = require('gulp-util');
var through2 = require('through2');
var SpritegenSheets = require('spritegen-sheets');
var sheets = {};

module.exports = function (opts) {
	opts = opts || {};

  var onData = function (file, encoding, cb) {
    if (file.path) {
      files.push(file.path);
    }

    cb();
  };

  var onEnd = function(cb) {
    var src, instance, config;
    var _this = this;
    opts.streams = true;
    opts.logger = gutil;
    opts.src = sheets;

    instance = new SpritegenSheets(opts);
    instance.start();

    instance.on('update', function(stream) {
      _this.emit('update', stream);
    });

    cb();
  };

  return through2.obj(onData, onEnd);
};

module.exports.add = function (opts) {
  opts = opts || {};
  sheets[opts.name] = [];

  var onData = function (file, encoding, cb) {
    if (file.path) {
      sheets[opts.name].push(file.path);
    }

    cb();
  };

  var onEnd = function(cb) {
    cb();
  };

  return through2.obj(onData, onEnd);
};
