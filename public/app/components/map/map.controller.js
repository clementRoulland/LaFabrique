(function () {
    'use strict';

    angular
        .module('LaFabriqueApp')
        .controller('MapController', MapController);

    MapController.$inject = ['DeskFactory', 'RoomFactory', 'UserFactory', '$scope'];

    function MapController(DeskFactory, RoomFactory, UserFactory, $scope) {
        var vm = this;

        vm.loadGroups = loadGroups;
        vm.loadRooms = loadRooms;
        vm.loadUsers = loadUsers;
        vm.onDropToDesk = onDropToDesk;
        vm.onDragFromDesk = onDragFromDesk;
        vm.onDropToStack = onDropToStack;
        vm.googleConnect = googleConnect;

        // charline
        //var clientId = '667329706372-tqqdq7g47i908aq1o5hh0rcr8o4p9s2l.apps.googleusercontent.com';
        //var apiKey = 'AIzaSyCoTCpix7-1J2uoZDeNWuBrW0SpFqkvnro';
        //jérémy
        var clientId = '1093274570499-3254tc7cprnadm7m0j9ko91v40grk3ng.apps.googleusercontent.com';
        var apiKey = 'AIzaSyCfY99eB6B9UbNc_6ZTikqEQ-dgtpNz5RY';
        //clement
        //var clientId = '1041314402552-16v78jod7ot759svtt2duc9s2ejkuiu7.apps.googleusercontent.com';
        //var apiKey = 'AIzaSyBZ8qJ4uPi_xRl4RSLd3NdIEovycxo7vVs';
        //fabien
        var clientId = '982590332371-9oig79t588rnf7qrr6e0p2gk5qgn0m8h.apps.googleusercontent.com';
        var apiKey = 'AIzaSyBiCbCx8y5RkUSvumROQ-IqxR-IPY2X_sY';
        //prod 
        //var clientId = '1041314402552-bhq652ar91lkgt0p34b9lfc5s35lfuh3.apps.googleusercontent.com';
        //var apiKey = 'AIzaSyDZBvhfuJWIckuow7JeZRaE3FLxVid24VI';

        var scopes = 'https://www.googleapis.com/auth/calendar';
        var isLoggedWithGoogle = false;

        function onDropToDesk(data, evt, desktop) {
            if (desktop.user) {
                vm.users.push(desktop.user);
            }
            desktop.user = data;
            DeskFactory.setDeskUser(desktop, data);
            var index = vm.users.indexOf(data);
            vm.users.splice(index, 1);
        }

        function onDragFromDesk(data, evt, desktop) {
            vm.users.push(desktop.user);
            desktop.user = undefined;
            DeskFactory.setDeskUser(desktop, undefined);
        }

        function onDropToStack(data, evt) {

        }

        function loadGroups(zone) {
            DeskFactory.getDesksGroupsByZone(zone)
                .then(function (data) {
                    vm.groups = data;
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

        function googleConnect() {
            gapi.client.setApiKey(apiKey);
            window.setTimeout(checkAuth, 1);
            function checkAuth() {
                gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: true}, handleAuthResult);
            }

            function handleAuthResult(authResult) {
                if (authResult && !authResult.error) {
                    isLoggedWithGoogle = true;
                } else {
                    gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: false}, handleAuthResult);
                }
            }
        }

        function loadRooms() {
            RoomFactory.getRooms()
                .then(function (data) {
                    vm.rooms = data;
                    if (isLoggedWithGoogle) {
                        angular.forEach(data, function (room, key) {
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
                                request.then(function (resp) {
                                    var calendarEvent = resp.result;
                                    room.free = calendarEvent.items.length == 0;
                                    if (calendarEvent.items.length != 0) {
                                        room.occupants = calendarEvent.items[0].attendees;
                                        angular.forEach(calendarEvent.items[0].attendees, function (attendee, key) {
                                            if (attendee.responseStatus == 'accepted') {
                                                angular.forEach(vm.groups, function (group, keyGroup) {
                                                    angular.forEach(group.desktops, function (desktop, keyDesktop) {
                                                        if (desktop.user && desktop.user.email == attendee.email) {
                                                            vm.groups[keyGroup].desktops[keyDesktop].user.free = 0;
                                                        }
                                                    });
                                                });
                                            }
                                        });
                                    }
                                    //vm.rooms[key] = room;
                                    $scope.$apply(function(){vm.rooms[key] = room});
                                });
                            });
                        });
                    }
                })
                .catch();
        }


    };

})();
