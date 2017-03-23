// This code will execute whenever a new lead is created.
// Use 1000+ Node.js modules here. 

module.exports = function(ctx, cb) {
  console.log('On new lead:', ctx.body);
  
  var lead = ctx.body;
  
  if (lead.value > 1000) {
    // Send e-mail to manager
    // ...
  }

  // lead.profile = getProfileFromFullContact(lead.email);
  lead.profile = {
    vip: true,
    comment: 'This was added by custom code'
  };
 
  // return the newly created lead
  cb(null, lead);
};
