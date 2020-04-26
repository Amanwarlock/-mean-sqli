const db = global.db;
const async = require('async');
const inventoryList = require("../helpers/inventory.data");

const TABLE_NAME = "inventory";

function loadInventory(req,res){
    console.log("Loading inventory into database ......");
    async.waterfall([
        _dropTable(),
        _createTable,
        _insertIntoTable
    ],function(err,result){
        if(err){
            res.status(400).send({message: `Error occured while inserting inventory records into database`, error: err.message});
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
        insert(inventoryList).then(d=>{
            callback(null, result);
        }).catch(e => callback(e));
    }
   
}

function dropInventoryTable(req,res){
    drop().then().catch(e => res.status(400).send({message: e.message}));
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

function insert(dataArr){
    return new Promise((resolve,reject)=>{
        let query = `INSERT INTO ${TABLE_NAME} (productName,product_id,price,quantity) VALUES ?`;
        db.query(query, [dataArr], (err,result)=>{
            if(err){
                reject(err);
            }else{
                resolve(result);
            }
        });
    });
}

function createTable(){
    return new Promise((resolve,reject)=>{
        let query = `CREATE TABLE ${TABLE_NAME} (
                _id INT AUTO_INCREMENT PRIMARY KEY,
                productName VARCHAR(255),
                product_id INT,
                price DECIMAL(5,2),
                quantity INT
            )`;

        db.query(query, function(err,result){
            if(err) reject(err);
            else resolve(result);
        });
    });
}


function updateInventory(req,res){
    let body = req.swagger.params['data'].value;
    let query = `UPDATE ${TABLE_NAME} SET price=${body.price} WHERE _id=${body._id}`;
    db.query(query,function(err,result){
        if(err){
            res.status(403).send({message: err.message});
        }else{
            res.status(200).send(result);
        }
    });
}

module.exports = {
    v1_loadInventory: loadInventory,
    v1_dropInventoryTable: dropInventoryTable,
    v1_updateInventory: updateInventory,

}