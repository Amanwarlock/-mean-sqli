const db = global.db;
const async = require('async');
const _ = require("lodash");
const productsList = require("../helpers/products.data");

const TABLE_NAME = "products";

function loadProducts(req,res){
    console.log("Loading products into database ......");
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
        insert(productsList).then(d=>{
            callback(null, result);
        }).catch(e => callback(e));
    }
   
}

function dropProductTable(req,res){
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
        let query = `INSERT INTO ${TABLE_NAME} (name,category,brand,inventory_id) VALUES ?`;
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
                name VARCHAR(255),
                category VARCHAR(255),
                brand VARCHAR(255),
                inventory_id INT
            )`;

        db.query(query, function(err,result){
            if(err) reject(err);
            else resolve(result);
        });
    });
}

function productList(req,res){
    let query = `
        SELECT p._id,p.name,p.category,p.brand,p.inventory_id,i.productName,i.product_id,i.price,i.quantity
        from ${TABLE_NAME} p
        INNER JOIN inventory i ON i.product_id = p._id
    `;
    db.query(query, function(err,list){
        if(err){
            res.status(400).send({message: `Error while getting product list`, error: err.message});
        }else{
            let group = _.groupBy(list, 'category');
            res.status(200).send(group);
        }
    });
}

module.exports = {
    v1_loadProducts: loadProducts,
    v1_dropProductTable: dropProductTable,
    v1_productList: productList,

}