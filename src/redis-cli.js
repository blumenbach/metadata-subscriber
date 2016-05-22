var redis = require("redis"),
    subscriber = redis.createClient({"return_buffers": true}),
    Client = require('node-rest-client').Client,
    msgpack = require('msgpack-js');


subscriber.on("message", function(channel, res) {
    var client = new Client();
    var args = {
        headers: {"Accept": "application/json"}
    };
    var message = msgpack.decode(res);
    var uri = message.data[1].data;
    console.log(uri);
       client.get(uri, args, function (data, response) {
           console.log(data);
          // console.log(response);
       });    
});

subscriber.subscribe("meta#/#");

