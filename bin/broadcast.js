var mqtt = require('../MQTTClient.js');
var sys = require('sys');
var net = require('net');
var io = require('socket.io').listen(80);

/*

    MQTT 통신 소켓 리스닝.
    포트 관련 어떻게?

*/

var client = new mqtt.MQTTClient(1883, 'ser ur serverIP', 'set Uer ID');
io.sockets.on('connection', function(socket){
    console.log('connection server');
});