var app = new (require('express'))();
var bodyParser = require('body-parser');
var request = require('request');
var util = require('util');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.get('/', (req, res) => res.redirect('/app/leads'));
app.get('/leads', (req, res) => res.send(leadsView(req.webtaskContext.secrets)));
app.get('/settings/new', (req, res) => res.send(afterView(req.webtaskContext.secrets)));
app.post('/api/email', (req,res) => {
  console.log('email received for lead: ' + req.body.name)
  res.end();
});
app.post('/api/leads', (req,res) => {
  request.post(
  {
    uri: req.webtaskContext.secrets.on_new_lead,
    json:true,
    body: req.body
  },function(req1, res1) {
    res.send(res1.body);
  });
});

module.exports = app;

function leadsView(secrets) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
      <meta name="description" content="ContosoCRM">
      <title>Contoso CRM</title>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
      <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet">
      <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,300italic,700,700italic">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/5.0.0/normalize.min.css">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/milligram/1.2.4/milligram.min.css">
      <style>
        html, body {
          height: 100%;
        }
        .c-menu-container {
          min-height: 100%;
        }
        .row.c-header { 
          background-color: #ddd; 
          padding-top: 2rem;
          padding-left: 2rem;
          padding-bottom: 0rem;
        }
        .column.c-header {
          padding-left: 0;
        }
        .column.c-menu { 
          background-color: #eee; 
          padding-top: 20px;
          padding-left: 20px;
          padding-right: 0;
          padding-bottom: 0rem;
          min-height: 100%;
        }
        .column.c-content {
          min-height: 100%;
          padding-top: 15px;
        }
        pre {
          padding-left: 2rem;
        }
      </style>
    </head>
    <body>
      <div class="row c-header">
        <div class="column c-header">
          <h1>Contoso CRM<h1>
        </div>
      </div>
      <div class="row c-menu-container">
        <div class="c-menu column column-10" >
          <a href="/app/leads">Leads</a><br>
          Accounts<br>
          Opportunities<br>
          Reports<br>
          <a href="/app/settings/new">Settings</a><br>
        </div>
        <div class="column column-80 c-content" id="newLead">
          <h2>Leads</h2>
          <h4>Add new lead</h4>
          <form>
            <fieldset>
              <label for="lead">Name</label>
              <input type="text" placeholder="Enter lead name..." id="lead" name="name">
              <label for="opportunity">Value</label>
              <input type="Number" placeholder="Enter potential value in USD..." id="opportunity" name="value">
            </fieldset>
          </form>
          <button id="create" class="button">Create new lead</button>
        </div>
        <div class="column column-80 c-content" id="leadResult" style="display:none">
          <h2>Leads</h2>
          <h4>New lead record</h4>
          <pre id="leadRecord"></pre>
        <div>
      </div>
      <script>
        $(function () {
          $('#create').click(function () {
            var data = $('form').serialize();
            $('#newLead').hide();
            $.post('${secrets.api_leads}', data, (response) => {
              $('#leadRecord').html(JSON.stringify(response, null, 2));
              $('#leadResult').show();
            });
          });
        });
      </script>
    </body>
    </html>`;
}

var afterView = function(secrets) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
      <meta name="description" content="ContosoCRM">
      <title>Contoso CRM</title>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
      <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet">
      <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,300italic,700,700italic">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/5.0.0/normalize.min.css">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/milligram/1.2.4/milligram.min.css">
      <style>
        html, body {
          height: 100%;
        }
        .c-description {
          margin-bottom:10px;
        }
        .c-menu-container {
          min-height: 100%;
        }
        .row.c-header { 
          background-color: #ddd; 
          padding-top: 2rem;
          padding-left: 2rem;
          padding-bottom: 0rem;
        }
        .column.c-header {
          padding-left: 0;
        }
        .column.c-menu { 
          background-color: #eee; 
          padding-top: 20px;
          padding-left: 20px;
          padding-right: 0;
          padding-bottom: 0rem;
          min-height: 100%;
        }
        .column.c-content {
          min-height: 100%;
          padding-top: 15px;
        }
        .button.c-button {
          margin-left: 0px;
        }
        iframe {
          display: inline-block;
          padding-left: 20px;
          width: 100%;
          position: relative;
          top: -65px;
          min-height: 60rem;
          border: 0;
        }
        label {
          margin-top: 20px;
        }
        .c-code-container {
          display: none;
          width: 100%;
          overflow: hidden;
          margin-bottom: -40px;
          margin-top: 40px;
        }    
      </style>
    </head>
    <body>
      <div class="row c-header">
        <div class="column c-header">
          <h1>Contoso CRM<h1>
        </div>
      </div>
      <div class="row c-menu-container">
        <div class="c-menu column column-10" >
          <a href="/app/leads">Leads</a><br>
          Accounts<br>
          Opportunities<br>
          Reports<br>
          <a href="/app/settings/new">Settings</a><br>
        </div>
        <div class="column column-25 c-content">
          <h2>Settings</h2>
          <h4>Custom Actions</h4>
          <form>
            <fieldset>
              <label for="lead">On new lead</label>
              <p class="c-description">Modify lead information before it is stored in the system</p>
              <a id="onnewlead" class="button button-outline c-button" target="_blank">Edit code</a>
              <label for="opportunity">On opportunity changed</label>
              <p class="c-description">Inspect and modify opportunity information when it is changed</p>
              <a id="onopportunitychanged" class="button button-outline c-button" target="_blank">Edit code</a>
            </fieldset>
          </form>
        </div>
        <div id="code-container1" class="column column-60 c-code-container">
          <iframe id="code1" height="800px" width="100%"></iframe>
        </div>
        <div id="code-container2" class="column column-60 c-code-container">
          <iframe id="code2" height="800px" width="100%"></iframe>
        </div>
      </div>
      <script>
      $(function () {
        $('#onnewlead').click(function () {
          $('#code-container1').show();
          $('#code-container2').hide();
          $('#code1').attr('src', '${secrets.edit_on_new_lead}');
        });
        $('#onopportunitychanged').click(function () {
          $('#code-container1').hide();
          $('#code-container2').show();
          $('#code2').attr('src', '${secrets.edit_on_opportunity_changed}');
        });    
      });
      </script>
    </body>
    </html>`;
};
