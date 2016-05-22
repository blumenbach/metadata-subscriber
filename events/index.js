'use strict';
var redis = require('redis');
var sub = redis.createClient({"return_buffers": true});
var pub = redis.createClient(),
    Client = require('node-rest-client').Client,
    msgpack = require('msgpack-js');
sub.subscribe('chat#/#');

module.exports = function(io) {
    io.on('connection', function(socket) {
        /*
         When the user sends a chat message, publish it to everyone (including myself) using
         Redis' 'pub' client we created earlier.
         Notice that we are getting user's name from session.
         */
        socket.on('chat', function(data) {
            var msg = JSON.parse(data);
            var reply = JSON.stringify({
                action: 'message',
                user: socket.handshake.session.user,
                msg: msg.msg
            });
            console.dir(reply);
            pub.publish('chat', reply);
        });

        /*
         When a user joins the channel, publish it to everyone (including myself) using
         Redis' 'pub' client we created earlier.
         Notice that we are getting user's name from session.
         */
        socket.on('join', function() {
            var reply = JSON.stringify({
                action: 'control',
                user: socket.handshake.session.user,
                msg: ' joined the channel'
            });
            console.dir(reply);
            pub.publish('chat', reply);
        });

        //sub.on('message', function(channel, message) {
        //    socket.emit('chat#/#', message);
        //});
        /*
         Use Redis' 'sub' (subscriber) client to listen to any message from Redis to server.
         When a message arrives, send it back to browser using socket.io
         */
        sub.on('message', function(channel, res) {
            var client = new Client();
            var args = {
                headers: {"Accept": "application/json"}
            };
            var message = msgpack.decode(res);
            var chan = msgpack.decode(channel);
            var uri = message.data[1].data;
            console.log(uri);
            socket.emit('chat', uri);
            client.get(uri, args, function (data, response) {
                socket.emit('chat#/#', data);
            });
        });

    })
};