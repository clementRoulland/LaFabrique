(function () {
    'use strict';

    angular
        .module('LaFabriqueApp')
        .factory('UserFactory', UserFactory);

    UserFactory.$inject = ['$http'];

    function UserFactory($http) {
        return {
            getUsers: getUsers,
        }

        function getUsers(zone) {
            return $http.get('/user/')
                .then(complete)
                .catch(failed);

            function complete(response) {
                console.log(response.data);
                return response.data;
            }

            function failed(error) {
                console.error('User getUsers error: ' + error.data);
            }
        };
    };

})();