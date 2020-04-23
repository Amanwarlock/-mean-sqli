
function heartbeat(req,res){
    res.status(200).send({message: 'Server Running'});
}

module.exports = {
    v1_heartbeat : heartbeat
}