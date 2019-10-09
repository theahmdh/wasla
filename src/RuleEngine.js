const Engine = require('json-rules-engine').Engine,
        backend = require('./backend');

async function executeEngine(){
  let engine = new Engine();

  var results = await backend.getAllRules();
  var arrResults = results.rows;
  //console.log(JSON.stringify(results.rows))
  var rules = [];
  
  arrResults.map(rule => {  rules.push(
    {
        'conditions': (rule.Conditions), 
        'event': (rule.Events)
    }
) });

//console.log(rules);

rules.forEach( rule => {
  engine.addRule(rule);
});

  var customerFacts = await backend.getFacts();
  //console.log(customerFacts.rows);

  // let facts = {
  //       'Customer Inactivity': 30,
  //       'Count of Customer Promos': 5,
  //       'Sum of Customer Promos Cost': 50
  //     }

  const getFactsss = customerFacts.rows.map((fa) => {
    let factss = {
      'CustomerID': fa.ID,
      'Customer Inactivity': fa.LastStatusChange,
      'Count of Customer Promos': fa.PromosCount,
      'Sum of Customer Promos Cost': fa.TotalCost
    }
    //return factss;
    engine
    .run(factss)
    .then(results => {           
      results.events.forEach(event => {
        backend.persistExecutions( factss.CustomerID,event.params.message
        )               
      })      
    })    
  });
}



module.exports = { executeEngine }