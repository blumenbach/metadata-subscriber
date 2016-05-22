var redis = require("redis")
    , subscriber = redis.createClient(),
    Client = require('node-rest-client').Client,
    msgpack = require('msgpack-js');

subscriber.on("message", function(channel, res) {
    var client = new Client();
    var args = {
        headers: {"Accept": "application/json"}
    };
    var message = msgpack.decode(res);
    console.log(message);
    var uri = message.data[1];
    console.log(uri);
 //   client.get(uri, args, function (meta, response) {
 //       console.log(meta);
 //       console.log(response);
 //   });    
});

subscriber.subscribe("meta#/#");

