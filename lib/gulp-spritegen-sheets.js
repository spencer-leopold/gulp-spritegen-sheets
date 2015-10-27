'use strict';

var gutil = require('gulp-util');
var through2 = require('through2');
var Readable = require('stream').Readable;
var SpritegenSheets = require('spritegen-sheets');
var mergeStream = require('merge-stream');
var instance;

module.exports = function (opts) {
	opts = opts || {};
  var files = [];
  var sheets = {};
  var name = opts.name || 'sprites';
  var sheetName;
  var mergedCss = mergeStream();
  var mergedImages = mergeStream();

  var onData = function (file, encoding, cb) {
    if (file.path) {
      sheetName = file.name || name;
      sheets[sheetName] = sheets[sheetName] || [];
      sheets[sheetName].push(file.path);
    }

    cb();
  };

  var onEnd = function(cb) {
    var src, instance, config, _this = this;
    opts.streams = true;
    opts.logger = gutil;
    opts.src = sheets;

    if (!instance) {
      instance = new SpritegenSheets(opts);
      instance.start().then(function(streams) {

        streams.forEach(function(stream) {
          mergedImages.add(stream.img);
          mergedCss.add(stream.css);
        });

        cb();
      });
    }

    instance.on('update', function(stream) {
      _this.emit('update', stream);
    });
  };

  var returnStream = through2.obj(onData, onEnd);
  returnStream.css = mergedCss;
  returnStream.img = mergedImages;
  return returnStream;
};

module.exports.add = function (opts) {
	opts = opts || {};

  var onData = function (file, encoding, cb) {
    if (file.path) {
      if (!file.name) {
        file.name = opts.name;
      }
    }

    cb(null, file);
  };

  return through2.obj(onData);
};
