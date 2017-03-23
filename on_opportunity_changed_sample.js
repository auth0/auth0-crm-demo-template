// This code will execute whenever an opportunity is changed.
// Use 1000+ Node.js modules here. 

module.exports = function(ctx, cb) {
  console.log('On opportunity changed:', ctx.body);
  var opportunity = ctx.body;
  
  if (opportunity.size > 1000) {
    // send e-mail to manager
  }
  
  cb(null, opportunity);
};
