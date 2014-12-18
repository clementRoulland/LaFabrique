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

        function loadUsers(){
            UserFactory.getUsers()
                .then(function (data) {
                    vm.users = data;
                })
                .catch();
        }

        function loadRooms() {
            RoomFactory.getRooms()
                .then(function (data) {
                    vm.groups = data;
                })
                .catch();
        }

    };

})();
