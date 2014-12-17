(function() {
	'use strict';

	angular
	.module('LaFabriqueApp')
	.factory('MapFactory', MapFactory);

	MapFactory.$inject = ['$http'];

	function MapFactory($http){
		return {
			getDesktopGroupsByZone: getDesktopGroupsByZone,
		}
		
		function getDesktopGroupsByZone(zone) {
			return $http.get('/api/desktop_group/zone/' + zone)
			.then(complete)
			.catch(failed);

			function complete(response) {
				return response.data;
			}
			function failed(error) {
				console.error('Map getDesktopGroupsByZone error: ' + error.data);
			}
		};
	};

})();