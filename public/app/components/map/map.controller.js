(function () {
    'use strict';

    angular
        .module('LaFabriqueApp')
        .controller('MapController', MapController);

    MapController.$inject = ['MapFactory', 'RoomFactory', 'UserFactory'];

    function MapController(MapFactory, RoomFactory, UserFactory) {
        var vm = this;
        vm.loadGroups = loadGroups;
        vm.loadRooms = loadRooms;
        vm.loadUsers = loadUsers;

        function loadGroups(zone) {
            MapFactory.getDesktopGroupsByZone(zone)
                .then(function (data) {
                    vm.groups = data;
                    console.log(vm.groups);
                })
                .catch();
        }

        function loadUsers() {
            UserFactory.getUsers()
                .then(function (data) {
                    vm.users = data;
                })
                .catch();
        }

        vm.rooms = loadRooms;
        function loadRooms() {
            RoomFactory.getRooms()
                .then(function (data) {
                    handleClientLoad();

                    var clientId = '1093274570499-3254tc7cprnadm7m0j9ko91v40grk3ng.apps.googleusercontent.com';
                    var apiKey = 'AIzaSyCfY99eB6B9UbNc_6ZTikqEQ-dgtpNz5RY';
                    var scopes = 'https://www.googleapis.com/auth/calendar';

                    function handleClientLoad() {
                        gapi.client.setApiKey(apiKey);
                        window.setTimeout(checkAuth, 1);
                    }

                    function checkAuth() {
                        gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: true}, handleAuthResult);
                    }

                    function handleAuthResult(authResult) {
                        if (authResult && !authResult.error) {
                            makeApiCall();
                        } else {
                            handleAuthClick();
                        }
                    }

                    function handleAuthClick(event) {
                        gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: false}, handleAuthResult);
                        return false;
                    }

                    // Load the API and make an API call.  Display the results on the screen.
                    function makeApiCall() {

                        data.forEach(function (room) {

                            gapi.client.load('calendar', 'v3', function () {
                                var start_date = new Date();
                                var end_date = new Date();
                                end_date.setMinutes(end_date.getMinutes() + 1);
                                var request = gapi.client.calendar.events.list({
                                    "calendarId": room.idGoogle,
                                    "singleEvents": true,
                                    "orderBy": "startTime",
                                    "timeMin": start_date.toISOString(),
                                    "timeMax": end_date.toISOString()
                                });
                                request.execute(function (calendarEvent) {
                                    room.free = calendarEvent.items.length == 0;
                                    if (calendarEvent.items.length != 0) {
                                        room.occupants = calendarEvent.items[0].attendees;
                                    }
                                });
                            });
                        });
                        vm.rooms = data;
                        console.log(vm.rooms);
                    }
                })
                .catch();
        }


    };

})();
