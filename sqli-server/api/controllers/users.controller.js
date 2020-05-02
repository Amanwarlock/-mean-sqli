const db = global.db;
const async = require("async");
const userList = require("../helpers/users.data");

const TABLE_NAME = "user";

function loadUsers(req,res){
    console.log("Loading users into database ......");
    async.waterfall([
        _dropTable(),
        _createTable,
        _insertIntoTable
    ],function(err,result){
        if(err){
            res.status(400).send({message: `Error occured while inserting products into database`, error: err.message});
        }else{
            res.status(200).send(result);
        }
    });

    function _dropTable(){
        return function(callback){
            drop().then(d=>{
                callback(null,d);
            }).catch(e => callback(e));
        }
    }

    function _createTable(result, callback){
        createTable().then(d=>{
            callback(null,d);
        }).catch(e => callback(e));
    }

    function _insertIntoTable(result, callback){
        insert(userList).then(d=>{
            callback(null, result);
        }).catch(e => callback(e));
    }
}


function drop(){
    return new Promise((resolve,reject)=>{
        let query = `DROP TABLE IF EXISTS ${TABLE_NAME}`;
        db.query(query, function(err,result){
            if(err) reject(err);
            else resolve(result);
        });
    });
}

function createTable(){
    return new Promise((resolve,reject)=>{
        let query = `CREATE TABLE ${TABLE_NAME} (
                _id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255),
                email VARCHAR(255),
                password VARCHAR(255),
                role VARCHAR(255),
                card_number VARCHAR(255),
                cvv INT,
                validity VARCHAR(255),
                card_type VARCHAR(255)
            )`;

        db.query(query, function(err,result){
            if(err) reject(err);
            else resolve(result);
        });
    });
}

function insert(dataArr){
    return new Promise((resolve,reject)=>{
        let query = `INSERT INTO ${TABLE_NAME} (email,name,password,role,card_number,cvv,validity,card_type) VALUES ?`;
        db.query(query, [dataArr], (err,result)=>{
            if(err){
                reject(err);
            }else{
                resolve(result);
            }
        });
    });
}

module.exports = {
    v1_loadUsers: loadUsers
}