(function() {
	'use strict';

	angular
	.module('LaFabriqueApp')
	.directive("myQtip", function () {
		return function (scope, element, attrs) {
			var text = element.attr('qtip-content') || null,
			title = element.attr('qtip-title') || null;

			scope.qtipSkin = (attrs.skin ? "qtip-" + attrs.skin : "qtip-dark");

			element.qtip({
				content: {
					text: text
					/*,title: title*/
				},

				style: {
					classes: scope.qtipSkin + " qtip-rounded qtip-shadow "
				},
				show: {
					event: 'click mouseover',
					solo: true
				},
				hide: {
					event: (scope.closeButton == true ? "false" : "click mouseleave"),
					delay: 300,
	                fixed: (($(this).hover || attrs.fixed) ? true : false),  //prevent the tooltip from hiding when set to true
	                leave: false
	            },
	            position: {
	                viewport: $(window),// Keep it on-screen at all times if possible
	                target: (attrs.target ? attrs.target :"event"),
	                my: "bottom left",
	                at:  "top right"
	            }
	        });

			scope.$on("$destroy", function () {
	            $(element).qtip('destroy', true); // Immediately destroy all tooltips belonging to the selected elements
	        });

			$('[my-qtip]').css("display", "inline-block");
		}
	});

})();