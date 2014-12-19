(function () {
    'use strict';

    angular
        .module('LaFabriqueApp')
        .factory('DeskFactory', DeskFactory);

    DeskFactory.$inject = ['$http'];

    function DeskFactory($http) {
        return {
            getDesksGroupsByZone: getDesksGroupsByZone,
            setDeskUser: setDeskUser,
        }

        function getDesksGroupsByZone(zone) {
            return $http.get('/api/deskgroup/zone/' + zone)
                .then(complete)
                .catch(failed);

            function complete(response) {
                return response.data;
            }

            function failed(error) {
                console.error('DeskFactory getDesksGroupsByZone error: ' + error.data);
            }
        };

        function setDeskUser(desk, user) {
            return $http.get('/api/deskgroup/' + desk.objectId + '/user/' + (user?user.objectId:0));

            function complete(response) {
                return response.data;
            }

            function failed(error) {
                console.error('DeskFactory getDesksGroupsByZone error: ' + error.data);
            }
        };
    };

})();