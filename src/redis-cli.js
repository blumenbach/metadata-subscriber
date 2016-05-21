var redis = require("redis")
    , subscriber = redis.createClient(),
    Client = require('node-rest-client').Client;

subscriber.on("message", function(channel, res) {
    var client = new Client();
    var args = {
        headers: {"Accept": "application/json"}
    };    
    client.get(res, args, function (meta, response) {
        console.log(meta);
        console.log(response);
    });    
});

subscriber.subscribe("meta#/#");

