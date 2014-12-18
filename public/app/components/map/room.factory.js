(function() {
	'use strict';

	angular
	.module('LaFabriqueApp')
	.factory('RoomFactory', RoomFactory);

	RoomFactory.$inject = ['$http'];

	function RoomFactory($http){
		return {
			getRooms: getRooms,
		}
		
		function getRooms() {
			return $http.get('/api/room/')
				.then(complete)
				.catch(failed);

			function complete(response) {
				return response.data;
			}
			function failed(error) {
				console.error('Map getRooms error: ' + error.data);
			}
		};


		function getRoomNowEvent(roomGoogleId) {

		};
	};

})();