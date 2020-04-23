'use strict';

var SwaggerExpress = require('swagger-express-mw');
var app = require('express')();
const mysql = require('mysql');
require("dotenv").config();
module.exports = app; // for testing



var connection = mysql.createConnection({
  host     : process.env.DB_HOST,
  user     : process.env.DB_USER,
  password : process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});


global.db = connection;

connection.connect((err)=>{
  if(err){
    console.log("Error occured while connecting to sql server ", err);
    throw err
  }else{
    console.log("Connected to mysql database successfully ......");
  }
});

var config = {
  appRoot: __dirname // required config
};

SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }

  // install middleware
  swaggerExpress.register(app);

  var port = process.env.PORT || 10010;
  app.listen(port);
  console.log("Server started on port ", port);

});


/**
 * var split = err.message.split('\n')[0].split(path.sep);
 * 
 */

/**
 * MY SQL Connection issue
 * https://stackoverflow.com/questions/50093144/mysql-8-0-client-does-not-support-authentication-protocol-requested-by-server
 * 
 */