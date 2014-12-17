(function() {
	'use strict';

	angular
	.module('LaFabriqueApp')
	.controller('MapController', MapController);

	MapController.$inject = [];

	function MapController() {
		var vm = this;

		vm.groups = [
			{
			'name' : 'ilot-etage-1',
			'desktops' : [
				{
					'name' : 'etage-1-1',
					'user' : {
						'username' : 'Jérémy'
					},
					'phone' : null
				},
				{
					'name' : 'etage-1-2',
					'user' : {
						'username' : 'Clément'
					},
					phone : {
						'number' : 42
					}
				},
				{
					'name' : 'etage-1-3',
					'user' : {
						'username' : 'Charline'
					},
					phone : {
						'number' : null
					}
				},
				{
					'name' : 'etage-1-4',
					'user' : {
						'username' : 'Fabien'
					},
					'phone' : null
				},
				{
					'name' : 'etage-1-5',
					'user' : {
						'username' : 'a'
					},
					phone : {
						'number' : null
					}
				},
				{
					'name' : 'etage-1-6',
					'user' : {
						'username' : 'b'
					},
					phone : {
						'number' : null
					}
				}
			]},
			{
			'name' : 'ilot-etage-2',
			'desktops' : [
				{
					'name' : 'etage-2-1',
					'user' : null,
					'phone' : null
				},
				{
					'name' : 'etage-2-2',
					'user' : null,
					phone : {
						'number' : 42
					}
				},
				{
					'name' : 'etage-2-3',
					'user' : null,
					phone : {
						'number' : null
					}
				},
				{
					'name' : 'etage-2-4',
					'user' : null,
					'phone' : null
				},
				{
					'name' : 'etage-2-5',
					'user' : null,
					phone : {
						'number' : null
					}
				},
				{
					'name' : 'etage-2-6',
					'user' : null,
					phone : {
						'number' : null
					}
				}
			]}
		];

		console.log(vm.groups);

		// without seats
		vm.users = [
			{
				name: "à placer"
			},
			{
				name: "à placer 2"
			}
		];


	};

})();
