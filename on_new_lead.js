// You can use 900+ modules here. Supported modules: https://tehsis.github.io/webtaskio-canirequire/
// e.g.:

var request = require('request');

module.exports = function(ctx, cb) {
  console.log('On new lead:', ctx.body);
  
  var lead = ctx.body;
  
  if (lead.value > 1000) {
    // send an email, could use sendgrid or another module, for the demo we'll just use a dummy endpoint
    request.post({
      uri: ctx.secrets.email_url, // must be set to the email endpoint on the app task
      json: true,
      body: lead
    });
  }
  
  lead.expectedValue = (lead.value * .75).toString();
  lead.created = Date.now();

  // lead.profile = getProfileFromFullContact(lead.email);
  lead.profile = {
    vip: true,
    comment: 'This was added by custom code'
  };
 
  // return the newly created lead
  cb(null, lead);
};
