(function () {
    'use strict';

    angular
        .module('LaFabriqueApp')
        .controller('MapController', MapController);

    MapController.$inject = ['MapFactory', 'RoomFactory'];

    function MapController(MapFactory, RoomFactory) {
        var vm = this;
        vm.loadGroups = loadGroups;

        function loadGroups(zone) {
            MapFactory.getDesktopGroupsByZone(zone)
                .then(function (data) {
                    vm.groups = data;
                    console.log(vm.groups);
                })
                .catch();
        }

        // without seats
        vm.users = [
            {
                name: "à placer"
            },
            {
                name: "à placer 2"
            }
        ];

        vm.rooms = loadRooms;
        function loadRooms() {
            RoomFactory.getRooms()
                .then(function (data) {
                    vm.groups = data;
                })
                .catch();
        }

    };

})();
