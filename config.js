const fs = require('fs');

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
        ca   : fs.readFileSync('src\\ca.pem')
      }
  },
  };
  
  module.exports = config;
  