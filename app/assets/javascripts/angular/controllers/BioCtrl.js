angular.module('biffy').controller('BioCtrl', ['$scope', '$filter', 'Biometrics', function($scope, $filter, Biometrics) {
	$scope.bio = {
		weight: 0.0,
		percent: 0.0,
		entry_date: new Date()
	};

	$scope.readings = Biometrics.get(function () {
		$scope.date_changed();
	});

	$scope.save = function () {
		var save_data = {
			weight: $scope.bio.weight,
			percent: $scope.bio.percent / 100
		};
		if (angular.isDate($scope.bio.entry_date)) {
			save_data.entry_date = $scope.bio.entry_date.yyyymmdd();
		}
		else {
			save_data.entry_date = $scope.bio.entry_date; // for safety, shouldn't really happen anymore
		}

		Biometrics.save(save_data, function () {
			$scope.readings = Biometrics.get();
		});
		$scope.bio.weight = 0.0;
		$scope.bio.percent = 0.0;
	};

	$scope.date_changed = function (argument) {
		// this could be optimized by sending out a hash with the date as key
		$scope.bio.weight = 0.0;
		$scope.bio.percent = 0.0;
		for (var i = $scope.readings.length - 1; i >= 0; i--) {
			var reading = $scope.readings[i];
			if (reading.entry_date === $scope.bio.entry_date.yyyymmdd()) {
				$scope.bio.weight = reading.weight || 0.0;
				$scope.bio.percent = reading.percent || 0.0;
				break;
			};
		};
	}

}]);