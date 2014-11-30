angular.module('biffy').controller('BioCtrl', ['$scope', '$filter', 'Biometrics', function($scope, $filter, Biometrics) {
	$scope.bio = {
		weight: 0.0,
		entry_date: new Date()
	};

	$scope.weight_readings = Biometrics.get(function (readings) { // skip the callback, we'll want this to default to 0 in a real scenario...
		$scope.bio.weight = readings[0].weight;
	});

	$scope.save = function () {
		Biometrics.save($scope.bio, function () {
			$scope.weight_readings = Biometrics.get();
		});
		
	};

}]);