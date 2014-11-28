angular.module('biffy').controller('BioCtrl', ['$scope', '$filter', function($scope, $filter) {
	$scope.bio = {
		weight: 0.0, // get last recorded weight form API instead
		entry_date: new Date()
	};


	$scope.save = function () {
	};

}]);