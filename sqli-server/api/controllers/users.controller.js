const db = global.db;
const userList = require("../helpers/users.data");

const TABLE_NAME = "user";

function loadUsers(req,res){
    console.log("Loading users into database ......");
    let query = `INSERT INTO user (email,name,password) VALUES ?`;
    db.query(query, [userList], (err,result)=>{
        if(err){
            console.log("Error occured while inserting users into the database", err);
            res.status(400).send({message: err.message, info: `Error occured while inserting users into db`});
        }else{
            console.log("Result ----------", result);
            res.status(200).send(result);
        }
    });
}


function dropTable(){
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
                role VARCHAR(255)
            )`;

        db.query(query, function(err,result){
            if(err) reject(err);
            else resolve(result);
        });
    });
}

module.exports = {
    v1_loadUsers: loadUsers
}