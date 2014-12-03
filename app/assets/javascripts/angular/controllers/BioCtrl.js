angular.module('biffy').controller('BioCtrl', ['$scope', '$filter', 'Biometrics', function($scope, $filter, Biometrics) {
	$scope.bio = {
		weight: 0.0,
		percent: 0.0,
		entry_date: new Date()
	};

	$scope.readings = Biometrics.get();

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
		
	};

}]);