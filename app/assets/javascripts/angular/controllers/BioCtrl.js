angular.module('biffy').controller('BioCtrl', ['$scope', '$filter', 'Biometrics', function($scope, $filter, Biometrics) {
	$scope.bio = {
		weight: 0.0,
		percent: 0.0,
		note: "",
		entry_date: new Date()
	};
	$scope.editabletest = 0;

	$scope.readings = Biometrics.get(function () {
		$scope.date_changed();
	});

	$scope.save = function () {
		var save_data = {
			weight: $scope.bio.weight,
			percent: $scope.bio.percent / 100,
			note: $scope.bio.note
		};
		if (angular.isDate($scope.bio.entry_date)) {
			save_data.entry_date = $scope.bio.entry_date.yyyymmdd();
		}
		else {
			save_data.entry_date = $scope.bio.entry_date; // for safety, shouldn't really happen anymore
		}

		Biometrics.save(save_data, function () {
			$scope.readings = Biometrics.get(function () {$scope.date_changed();});
		});
		// $scope.bio.weight = 0.0;
		// $scope.bio.percent = 0.0;
		// $scope.bio.note = "";
	};

	$scope.date_changed = function (argument) {
		// this could be optimized by sending out a hash with the date as key
		$scope.bio.weight = 0.0;
		$scope.bio.percent = 0.0;
		$scope.bio.note = "";
		for (var i = $scope.readings.length - 1; i >= 0; i--) {
			var reading = $scope.readings[i];
			if (reading.entry_date === $scope.bio.entry_date.yyyymmdd()) {
				$scope.bio.weight = reading.weight || 0.0;
				$scope.bio.percent = Math.round((reading.percent*100 + 0.00001)*10)/10 || 0.0;
				$scope.bio.note = reading.note;
				break;
			};
		};
	};

	$scope.edit_row = function (entry) {
		$scope.bio.entry_date = new Date(entry.entry_date); // makes assumptions about date formatting. Potential issue with future localization
		$scope.bio.weight = entry.weight;
		$scope.bio.percent = Math.round((entry.percent*100 + 0.00001)*10)/10 || 0.0;
		$scope.bio.note = entry.note;
	}

	$scope.delete_row = function (row_date) {
		var confirmed = confirm("Delete data for " + row_date + "?");
		if (confirmed === false) return;
		Biometrics.delete_entry({id: row_date}, function () {
			$scope.readings = Biometrics.get(function () {$scope.date_changed();});
		});
	}

}]);