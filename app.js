const express = require('express'),
        app = express(),
        appSettings = require('./config'),
        backend = require('./src/backend'),
        cors = require('cors'),
        engine = require('./src/RuleEngine'),
        path = require('path'),
        bodyParser = require('body-parser');;

const corsOptions = {
  origin: 'http://localhost:3000',
}

backend.connectClient();
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.get("/customers", async function(req, res) {
    //res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    //res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    var output = await backend.getAllCustomers();
    res.send(output)
});

app.post("/", async function(req, res) {
  var attr = [req.body.name, req.body.phone, req.body.email];
  var output = await backend.insertNewCustomer(attr);
  res.send(output);  
});

app.patch("/", async function(req, res) {  
  var attr = [req.body.status == 1 ? "Active" : "Inactive", req.body.id];
  var output = await backend.updateExistingCustomer(attr);
  res.send(output);  
});

app.delete("/customer/:id", async function(req, res) {
  var attr = [req.params.id];
  var output = await backend.DeleteCustomer(attr);
  res.send(output);
});

app.get('/Rules', async function(req,res){
    //res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    //res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    var output =  await backend.getAllRules();
    res.send(output);
});

app.post('/rules', async function(req, res){
  var newRule=req.body;
  //console.log(req.body)
  var output = await backend.createNewRule(newRule);
  console.log(output)
  res.send(output)
})

app.patch("/rules", async function(req, res) {  
  var objRule = req.body;
  var output = await backend.updateRule(objRule);
  res.send(output);  
});

app.get('/getDictionary', async function(req,res){
  var output = await backend.getDictioary();
  res.send(output);
});

app.get('/engine' , async function(req,res){
  var ouptut =  await  engine.executeEngine();
  res.send(ouptut);
  
})

app.get('/fact' , function(req, res){
  engine.getFacts();
});




app.listen(appSettings.server.port, function(){
    console.info(`http://${appSettings.server.server}:${appSettings.server.port}`)
});