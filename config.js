const fs = require('fs');
const path = require('path');

const config = {
    server: {
      port: 5000,
      server: 'localhost'
    },
    databaseLocal: {
        host: 'localhost',
        user: 'postgres',
        password: 'manager',
        database: 'Wasla'
        //port: 27979       
    },
    database: {
      host: 'pg-213c9aab-ahmd22488-f61c.aivencloud.com',
      user: 'avnadmin',
      password: 'dorl1o7a4o9q2wut',
      database: 'Wasla',
      port: '27979',
      ssl      : {
        ca   : fs.readFileSync(path.join(__dirname, 'src', 'ca.pem'))
      }
  },
    database_aiven: {
      host: 'ec2-54-247-171-30.eu-west-1.compute.amazonaws.com',
      user: 'zmapdrkdnxyziz',
      password: 'c5e7a3dd1dd0cb6d80f72f52e9901675701b9217df5cce1256ab63e971fecd4f',
      database: 'd4kcap7beibmo0',
      port: '5432'
  },
  };
  
  module.exports = config;
  
