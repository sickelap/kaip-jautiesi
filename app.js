"use strict";

var express = require('express');
var app = express();
var http = require('http');
var server = http.createServer(app).listen(3010);
var io = require('socket.io').listen(server);
var db = require('nosql').load(__dirname + '/db.nosql');
var _ = require('lodash');

io.set('log level', 1);
io.configure(function () {
    io.set("transports", ["xhr-polling"]);
    io.set("polling duration", 20);
});

app.use(express.static(__dirname + '/public'));
app.get('/', function (req, res) {
    res.sendfile(__dirname + '/public/index.html');
});
app.post('/', function (req, res) {
    res.sendfile(__dirname + '/public/index.html');
});

var config = [
    { name: 'PALAIMINTAS', count: 0, color: '#754DFF' },
    { name: 'NUSIVYLES',   count: 0, color: '#983B47' },
    { name: 'APGAUTAS',    count: 0, color: '#71335A' },
    { name: 'ĮSIMYLĖJĘS',  count: 0, color: '#383973' },
    { name: 'IŠSIGANDĘS',  count: 0, color: '#174D20' },
    { name: 'APSVAIGĘS',   count: 0, color: '#246282' },
    { name: 'PIKTAS',      count: 0, color: '#225635' },
    { name: 'SUSIŽAVĖJĘS', count: 0, color: '#412750' },
    { name: 'PAMESTAS',    count: 0, color: '#776E0E' },
    { name: 'SUSIGĖDĘS',   count: 0, color: '#53341E' },
    { name: 'LIGOTAS',     count: 0, color: '#49247F' }
];

// initialize
db.all(
    function(doc) { return doc; },
    function(items){
        var missing = _.filter(config, function(item) {
            return _.find(items, item.name);
        });
        db.insert(missing);
    }
);

io.sockets.on('connection', function (socket) {
    db.all(
        function(doc) { return doc; },
        function(items){ socket.emit('emotions', items); }
    );
    socket.on('submit', function (item) {
        db.update(function(doc) {
            if (doc.name == item) {
                doc.count = (doc.count || 0) + 1;
                socket.broadcast.emit('emotion', doc);
            }
            return doc;
        });
    });
});
