(function() {
	'use strict';

	angular
	.module('LaFabriqueApp')
	.config(Config);

	Config.$inject = ['$stateProvider', '$urlRouterProvider'];

	function Config($stateProvider, $urlRouterProvider) {

		$urlRouterProvider.otherwise('/map/etage');

		$stateProvider
		.state('commun', {
			url: '/map/commun',
			templateUrl: '/app/components/map/commun.view.html',
			controller: 'MapController',
			controllerAs: 'vm'
		})
		.state('rdc', {
			url: '/map/rdc',
			templateUrl: '/app/components/map/rdc.view.html',
			controller: 'MapController',
			controllerAs: 'vm'
		})
		.state('etage', {
			url: '/map/etage',
			templateUrl: '/app/components/map/etage.view.html',
			controller: 'MapController',
			controllerAs: 'vm'
		});
	};

})();
