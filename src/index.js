var redis = require("redis"),
    subscriber = redis.createClient({"return_buffers": true}),
    Client = require('node-rest-client').Client,
    msgpack = require('msgpack-js');


subscriber.on("message", function(channel, res) {
    var client = new Client();
    var args = {
        headers: {"Accept": "application/json"}
    };
    var uri = msgpack.decode(res);
    console.log(uri);
    client.get(uri, args, function (meta, response) {
        console.log(meta);
        console.log(response);
    });
});

subscriber.subscribe("meta#/#");

