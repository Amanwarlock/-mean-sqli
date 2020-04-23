const path = require("path");
const crypto = require("crypto");
var jwt = require("jsonwebtoken");
const mysql = require('mysql');
const db = global.db;

function isLoggedIn(req,res){
    res.status(200).send({isLoggedIn: true});
}

function login(req,res){
    let body = req.swagger.params['data'].value;
    let query = `SELECT * FROM user WHERE email=${body.email}`;
    console.log("query ------", query);
    db.query(query, (err,doc)=>{
        if(err) res.status(403).send({message: err.message});
        else if(doc) res.status(200).send(doc);
        else res.status(403).send({message: `User not found`});
    })
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