angular.module('biffy').controller('BioCtrl', ['$scope', '$filter', 'Biometrics', function($scope, $filter, Biometrics) {
	$scope.bio = {
		weight: 0.0, // get last recorded weight form API instead
		entry_date: new Date()
	};

	$scope.weight_readings = Biometrics.get(function (readings) {
		$scope.bio.weight = readings[0].weight;
	});

	$scope.save = function () {
		Biometrics.save($scope.bio);
		$scope.weight_readings = Biometrics.get();
	};

}]);