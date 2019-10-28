const pg = require('pg'),
        appSettings = require('../config');

const client = new pg.Client(process.env.DATABASE_URL || appSettings.database); 

function connectClient(){
    try{
        client.connect();
        console.log('Connected');
    }
    catch(err){
        console.log(err);
    }
}

async function insertNewCustomer(attr){
    var query = 'INSERT INTO public."Customers"("FullName", "PhoneNumber", "Email", "Status")VALUES ($1, $2, $3, "Active")';
    const results = await client.query(query, attr);    
    return results;
}

async function updateExistingCustomer(attr){
    var query = 'UPDATE "Customers" SET "Status" = $1 WHERE "ID" = $2';
    const results = await client.query(query, attr);
    return results;
}

async function DeleteCustomer(attr){
    var query = 'DELETE FROM "CUSTOMERS" WHERE "ID" = $1';
    const results = await client.query(query, attr);
    return results;
}

async function getAllCustomers(){
    var query = 'SELECT ROW_NUMBER() OVER (order by "FullName", "PromoName" DESC) AS "Seq", "Customers"."ID", "FullName", "Email", "PhoneNumber", "Customers"."Status" AS "isCustomerActive",DATE_PART(\'day\', NOW() - "LastStatusChange") AS "LastStatusChange", "PromoName", "Cost" AS "PromoCost","Expiry" AS "PromoExpiry" FROM "CustomerPromos" LEFT JOIN "Customers" on "CustomerPromos"."CustomerID" = "Customers"."ID" LEFT JOIN "Promos" on "CustomerPromos"."PromoID" = "Promos"."ID"';
    //var query = 'SELECT * FROM "Customers" ORDER BY "ID"'
    const results = await client.query(query);
    return results;
}

async function getAllRules(){
    //var query = 'Select ROW_NUMBER() OVER (order by "FullName", "PromoName" DESC) AS "Seq", "CustomerID", "FullName", "Email", "PhoneNumber", "Status", "PromoName",  "Active" AS "isPromoActive", "Cost" AS "PromoCost", "Expiry" AS "PromoExpiry" from "CustomerPromo" LEFT JOIN "Customers" on "CustomerPromo"."CustomerID" = "Customers"."ID" LEFT JOIN "Promos" on "CustomerPromo"."PromoID" = "Promos"."ID"';
    var query = 'SELECT * FROM public."RuleBase" WHERE "Active" = true  ORDER BY "ID" --limit 2';
    
    const results = await client.query(query);
    
    return results;
}

async function getFacts(){
    var query = 'SELECT "Customers"."ID", DATE_PART(\'day\', NOW() - "LastStatusChange") AS "LastStatusChange", SUM("Cost") AS "TotalCost" , COUNT("Customers"."ID") AS "PromosCount" FROM "CustomerPromos" LEFT JOIN "Customers" on "CustomerPromos"."CustomerID" = "Customers"."ID" LEFT JOIN "Promos" on "CustomerPromos"."PromoID" = "Promos"."ID" GROUP BY "Customers"."ID" ORDER BY "Customers"."ID"'
    var results = await client.query(query);
    return results
}

async function getDictioary(){
    //var query = 'Select ROW_NUMBER() OVER (order by "FullName", "PromoName" DESC) AS "Seq", "CustomerID", "FullName", "Email", "PhoneNumber", "Status", "PromoName",  "Active" AS "isPromoActive", "Cost" AS "PromoCost", "Expiry" AS "PromoExpiry" from "CustomerPromo" LEFT JOIN "Customers" on "CustomerPromo"."CustomerID" = "Customers"."ID" LEFT JOIN "Promos" on "CustomerPromo"."PromoID" = "Promos"."ID"';
    var query = 'SELECT * FROM public."Localization" ORDER BY "ID"';    
    const results = await client.query(query);    
    return results;
}

async function updateRule(rule){
    var newRule = JSON.parse(JSON.stringify(rule));

    var queryUpdateRule = `UPDATE "RuleBase" SET "Active" = ${newRule.Active}, "Conditions" = '${JSON.stringify(newRule.Conditions)}', "Events" = '${JSON.stringify(newRule.Events)}' WHERE "ID" = ${newRule.ID} `;
    //console.log(queryUpdateRule);
    var output = await client.query(queryUpdateRule);
    return output;
}

async function createNewRule(rule){
    
    var newRule = JSON.parse(JSON.stringify(rule));
    //console.log(newRule);
    var insertRule = `INSERT INTO "RuleBase" ("RuleName", "RuleCategory", "Active", "Conditions", "Events") VALUES ('${newRule.RuleName}', '${newRule.RuleCategory}', ${newRule.Active}, '${JSON.stringify(newRule.Conditions)}', '${JSON.stringify(newRule.Events)}')`;
    //[newRule.RuleName, newRule.RuleCategory, newRule.Active, JSON.stringify(newRule.Conditions), JSON.stringify(newRule.Events)],
    var output = await client.query(insertRule);
    return output;
}

async function persistExecutions(custID, execResult){
    var insertExec = `INSERT INTO "EngineExecutions" ("Timestamp", "CustomerID", "Result") VALUES (NOW(), ${custID}, '${execResult}')`
    var output = await client.query(insertExec);
    //console.log(output.result);
    return output;
}

async function getEngineExecutions(){
    var getExecs = 'SELECT * FROM "EngineExecutions"';
    var output = await client.query(getExecs);
    return output;
}

module.exports = { connectClient, insertNewCustomer, updateExistingCustomer, DeleteCustomer, getAllCustomers, getAllRules, getDictioary, getFacts, updateRule, createNewRule, persistExecutions, getEngineExecutions};
