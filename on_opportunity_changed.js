// This code will execute whenever an opportunity is changed in the system

// You can use 900+ modules here. Supported modules: https://tehsis.github.io/webtaskio-canirequire/
// e.g.:
var request = require('request');

module.exports = function(ctx, cb) {
  console.log('On opportunity changed:', ctx.body);
  var opportunity = ctx.body;
  
  if (opportunity.size > 1000) {
    // send e-mail to manager
  }
  
  cb(null, opportunity);
};
