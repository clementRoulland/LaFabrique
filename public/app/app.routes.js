(function() {
	'use strict';

	angular
	.module('LaFabriqueApp')
	.config(Config);

	Config.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider'];

	function Config($stateProvider, $urlRouterProvider, $locationProvider) {

		$stateProvider
		.state('commun', {
			url: '/map/commun',
			templateUrl: '/app/components/map/commun.view.html',
			controller: 'MapController',
			controllerAs: 'vm'
		});

		$stateProvider
		.state('rdc', {
			url: '/map/rdc',
			templateUrl: '/app/components/map/rdc.view.html',
			controller: 'MapController',
			controllerAs: 'vm'
		});

		$stateProvider
		.state('etage', {
			url: '/map/etage',
			templateUrl: '/app/components/map/etage.view.html',
			controller: 'MapController',
			controllerAs: 'vm'
		});

		$urlRouterProvider.otherwise('/map/etage');

		// use the HTML5 History API
		$locationProvider.html5Mode(true);
	};

})();
