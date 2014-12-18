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

    function toJSON(room) {
        return {
            objectId: room.id,
            name: room.get('name'),
            zone: room.get('zone'),
            idHtml: room.get('idHtml'),
            idGoogle: room.get('idGoogle'),
            free: 1
        };
    }

    function error(object, error) {
        console.error(error);
        error.status = 'ko';
        res.json(error);
    }

    return app;
}();