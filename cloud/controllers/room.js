module.exports = function () {
    var express = require('express');
    var app = express();
    var Room = Parse.Object.extend('Room');
    var authentication = require('cloud/tools/require-user.js');

    app.get('/', authentication, getAll);


    function getAll(res, res) {
        var query = new Parse.Query(Room);
        query.find({
            success: function (results) {
                var rooms = new Array();
                results.forEach(function(room){
                    var roomToJson = toJSON(room);
                    rooms.push(roomToJson);
                });
                res.json(rooms);
            },
            error: error
        });
    };

    function toJSON(rooms) {
        return {
            objectId: rooms.id,
            name: rooms.get('name'),
            zone: rooms.get('zone'),
            idHtml: rooms.get('idHtml'),
            idGoogle: rooms.get('idGoogle')
        };
    }

    function error(object, error) {
        console.error(error);
        error.status = 'ko';
        res.json(error);
    }

    return app;
}();