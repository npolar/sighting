'use strict';
var _ = require('lodash');

var Texxt = function () {

  // Extract the first capture (1) for all regex matches in text
  this.extract = function(text, regex, capture_capture) {

    var extracted = [];
    var m;
    var capture_which_capture = capture_capture || 1;

    while ((m = regex.exec(text)) !== null) {
      if (m.index === regex.lastIndex) {
        regex.lastIndex++;
      }
      extracted.push(m[capture_which_capture]);
    }
    return _.uniq(extracted);
  };

};

module.exports = Texxt;
