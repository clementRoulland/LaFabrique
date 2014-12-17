(function() {
	'use strict';

	angular
	.module('LaFabriqueApp')
	.controller('MapController', MapController);

	MapController.$inject = [];

	function MapController() {
		var vm = this;

		vm.places = ['commun', 'rdc', 'etage'];

	};

})();
