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
  console.log('email received for lead: ' + req.body.name);
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
    }
  );
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
      <meta name="description" content="{{brand}} CRM">
      <title>{{brand}} CRM</title>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
      <link rel="stylesheet" type="text/css" href="https://cdn.auth0.com/fonts/340567/BCE5F33B94B3B1134.css"/>
      <link rel="stylesheet" type="text/css" href="https://cdn.auth0.com/auth0-extend/assets/crm-sample-v1.0.css"/>
    </head>
    <body>
      <div class="crm">
        <div class="header">
          <div class="company">
            <h1>{{brand}} CRM</h1>
          </div>
          <div class="search">
            <i class="icon-budicon-489"></i>
            <input type="text" placeholder="type something to search"/>
          </div>
          <div class="user">
            John Doe
            <div class="avatar"></div>
          </div>
        </div>
        <div class="container">
          <div class="sidebar">
            <ol>
              <li class="active"><a href="/app/leads"><i class="icon-budicon-289"></i>Leads</a></li>
              <li><i class="icon-budicon-290"></i>Accounts</li>
              <li><i class="icon-budicon-209"></i>Opportunities</li>
              <li><i class="icon-budicon-706"></i>Reports</li>
              <li><a href="/app/settings/new"><i class="icon-budicon-329"></i>Settings</a></li>
            </ol>
          </div>
          <div class="content">
            <h1>Leads</h1>
            <div class="form-container">
              <h2>Add new lead</h2>
  
              <div class="form-content">
                <form class="lead-form">
                  <div>
                    <label for="lead">Name</label>
                    <input type="text" placeholder="Enter lead name..." id="lead" name="name">
                  </div>
                  <div>
                    <label for="opportunity">Value</label>
                    <input type="Number" placeholder="Enter potential value in USD..." id="opportunity" name="value">
                  </div>
                  <button id="create" class="button">Create new lead</button>
                </form>
                
                <div class="form-result" id="leadResult">
                  <pre id="leadRecord"></pre>
                <div>
              </div>
            </div>
          </div>             
            
          </div>
        </div>
      </div>
      <script>
        $(function () {
          $('#create').click(function (e) {
            e.stopPropagation();
            e.preventDefault();
            $('#create').attr('disabled', true);
            $('#create').text('Creating');
            
            var data = $('form').serialize();
            $('#newLead').hide();
            $.post('${secrets.api_leads}', data, (response) => {
              $('#leadRecord').html(JSON.stringify(response, null, 2));
              $('#leadResult').show();
              $('#create').attr('disabled', false);
              $('#create').text('Create new lead');
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
      <meta name="description" content="{{brand}} CRM">
      <title>{{brand}} CRM</title>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
      <link rel="stylesheet" type="text/css" href="https://cdn.auth0.com/fonts/340567/BCE5F33B94B3B1134.css"/>
      <link rel="stylesheet" type="text/css" href="https://cdn.auth0.com/auth0-extend/assets/crm-sample-v1.0.css"/>
    </head>
    <body>
      <div class="crm">
        <div class="header">
          <div class="company">
            <h1>{{brand}} CRM<h1>
          </div>
          <div class="search">
            <i class="icon-budicon-489"></i>
            <input type="text" placeholder="type something to search"/>
          </div>
          <div class="user">
            John Doe
            <div class="avatar"></div>
          </div>
        </div>
        <div class="container">
          <div class="sidebar">
            <ol>
              <li><a href="/app/leads"><i class="icon-budicon-289"></i>Leads</a></li>
              <li><i class="icon-budicon-290"></i>Accounts</li>
              <li><i class="icon-budicon-209"></i>Opportunities</li>
              <li><i class="icon-budicon-706"></i>Reports</li>
              <li class="active"><a href="/app/settings/new"><i class="icon-budicon-329"></i>Settings</a></li>
            </ol>
          </div>
          
          <div class="content" id="editor-content" style="display: none;">
              <a class="back" href="/app/settings/new"><i class="icon-budicon-463"></i>Back to settings</a>
              <div class="spinner-container">
                <div class="spinner-text">Loading</div>
                <div class="spinner spinner-sm">
                  <div class="circle"></div>
                </div>
              </div>
              <iframe id="code" height="100%" width="100%"></iframe>
          </div>
          
          <div class="content" id="settings-content">
            <h1>Settings</h1>
            <div class="list-container">
              <h2>Custom Actions</h2>
  
              <div class="list">
                <div class="list-item">
                    <div class="actions">
                      <button id="onnewlead"><i class="icon-budicon-263"></i>Edit</button>
                      <button><i class="icon-budicon-266"></i>Delete</button>
                    </div>
                    <h3>On new lead</h3>
                    <p>Modify lead information before it is stored in the system</p>
                </div>
                <div class="list-item">
                    <div class="actions">
                      <button id="onopportunitychanged"><i class="icon-budicon-263"></i>Edit</button>
                      <button><i class="icon-budicon-266"></i>Delete</button>
                    </div>
                    <h3>On opportunity changed</h3>
                    <p>Inspect and modify opportunity information when it is changed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    
      <script>
      function onLoad() {
        $('#spinner-container').hide();
      }
      
      $(function () {
        $('#onnewlead').click(function () {
          $('#settings-content').hide();
          $('.spinner-container').show();
          $('#editor-content').show();
          $('#code').attr('src', '${secrets.edit_on_new_lead}');
        });
        $('#onopportunitychanged').click(function () {
          $('#settings-content').hide();
          $('.spinner-container').show();
          $('#editor-content').show();
          $('#code').attr('src', '${secrets.edit_on_opportunity_changed}');
        });    
        
        $('#code').on('load', function () {
          $('.spinner-container').hide();
        });
      });
      </script>
    </body>
    </html>`;
};
