var tagListDirective = angular.module('tagListDirective', []);

(function () {

	var directive = function () {
		return {
			restrict: 'EA', //E = element, A = attribute, C = class, M = comment
			controllerAs: 'tagList',
			controller: function () {
				//this.tags = [];
			},
			// @ one-way, = two-way, & binds functions
			scope: {
				tags: '='
			},
			bindToController: true,
			//template: '<span>hey</span>',
			templateUrl: 'tagListDirective.html'
		};
	};

	tagListDirective.directive('tagList', directive);

}());