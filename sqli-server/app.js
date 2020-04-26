'use strict';

var SwaggerExpress = require('swagger-express-mw');
var app = require('express')();
const bp = require("body-parser");
var jwt = require("jsonwebtoken");
const mysql = require('mysql');
const sql = require('mssql');
require("dotenv").config();
module.exports = app; // for testing

var connection = mysql.createConnection({
  host     : process.env.DB_HOST,
  port     : 3306,
  user     : process.env.DB_USER,
  password : process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  multipleStatements: true
});

// MS SQL------------------------------------------------------------------------------------------------------------

const mssqlConfig = {
  user: 'TSINNOVATE-12\aman',
  password: '',
  server: 'TSINNOVATE-12', // You can use 'localhost\\instance' to connect to named instance
  database: 'sqlidb' ,
  options : {
    encrypt : false,
  }
}

// sql.connect(mssqlConfig).then(pool => {
//   // Query
//   console.log("-ddddddddddddddddddddddddddddddd",pool);
 
// }).catch(err => {
//   console.log('logging err');
//   console.log(err);
// })

// sql.on('error', err => {
//   console.log('logging sql.on err');
//   console.log(err);
// })


// var dbConn = new sql.Connection(mssqlConfig);
// dbConn.connect().then(function () {
//   var request = new sql.Request(dbConn);
//   global.mssql = request;
// })


// MY SQL------------------------------------------------------------------------------------------------------------
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

app.use(bp.json({limit: '50mb'}));
app.use(bp.urlencoded({limit: '50mb',extended: true}));

const SKIP_URLS = ['/api/v1/login', '/api/v1/isLoggedIn'];

app.use(function (req, res, next) {
  if (SKIP_URLS.indexOf(req.url) >= 0 || (req.url.indexOf("?") >= 0 && SKIP_URLS.indexOf(req.url.split("?")[0]))) {
    next();
  }
  else if (req.headers["authorization"] || req.headers["x-access-token"] || req.headers['authentication']) {
    const token = req.headers["authorization"] || req.headers["x-access-token"] || req.headers['authentication'];
    validateToken(token).then(data=> {
      if(data.isValid){
        req.user = data.user;
        next();
      }else{
        res.status(401).send({ "message": "UnAuthorized , Authorization failed" });
      }
    }).catch(e=> res.status(401).send({ "message": "UnAuthorized , Authorization failed" }));
  } else {
    res.status(403).send({ "message": "No Token , Access Forbidden" });
  }
});

function validateToken(token){
  return new Promise((resolve,reject)=>{
      // Validate JWT token;
      const jwtPromise = new Promise((resolve,reject)=>{
          jwt.verify(token, process.env.SECRET_KEY, function (err, decoded) {
              if (err) {
                reject(new Error(`JWT Token invalid`));
              } else {
                resolve(decoded);
              }
            });
      });

      jwtPromise.then(decoded => {
        resolve({isValid: true, user: decoded});
      }).catch(e =>{
          reject(e);
      });
     
  });
}

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