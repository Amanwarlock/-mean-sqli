const path = require("path");
const crypto = require("crypto");
var jwt = require("jsonwebtoken");
const mysql = require('mysql');
const db = global.db;
const mssql = global.mssql;

asyncMiddleware = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

function isLoggedIn(req,res){
    let token = req.headers["authorization"];
    validateToken(token).then(data=>{
        if(data.isValid){
            res.status(200).send({isLoggedIn: true});
        }else{
            res.status(200).send({isLoggedIn: false});
        }
    }).catch(e=>{
        res.status(200).send({isLoggedIn: false, error: e.message});
    })
}

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

function login(req,res){

    let body = req.swagger.params['data'].value;
    
    let query = `SELECT * FROM user WHERE email = '${body.email}' AND password = '${body.password}'`;
   
    db.query(query,(err,doc)=>{
        if(err) {
            res.status(403).send({message: err.message});
        }
        else if(doc) {
            let token = generateToken(doc[0]);
            doc[0].token = token;
            res.status(200).send(doc);
        }
        else res.status(403).send({message: `User not found`});
    });

    // let query = `SELECT * FROM user WHERE email = ? AND password = ? `;

    // db.query(query, [body.email, body.password],(err,doc)=>{
    //     if(err) {
    //         res.status(403).send({message: err.message});
    //     }
    //     else if(doc && doc.length) {
    //         let token = generateToken(doc[0]);
    //         doc[0].token = token;
    //         res.status(200).send(doc);
    //     }
    //     else res.status(403).send({message: `User not found`});
    // });

}


function generateToken(doc){
    let claim = {
        _id: doc._id,
        name: doc.name,
        email: doc.email,
    }
    return jwt.sign(claim, process.env.SECRET_KEY, { expiresIn: process.env.TOKEN_EXP });
}


module.exports = {
    v1_isLoggedIn: isLoggedIn,
    v1_login: login,
}