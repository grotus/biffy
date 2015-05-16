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

	$scope.range_select = {
		index_a: null,
		index_b: null,
		next_select: 0,
		count: 0,
		is_selected: function (index) {
			if (this.index_a === null && this.index_b === null) return false;
			if (this.index_a === null) return index === this.index_b; 
			if (this.index_b === null) return index === this.index_a;

			return index >= Math.min(this.index_a, this.index_b)
				 && index <= Math.max(this.index_a, this.index_b);
		},
		oldest_date: function () {
			return $scope.readings[Math.max(this.index_a, this.index_b)].entry_date;
		},
		newest_date: function () {
			return $scope.readings[Math.min(this.index_a, this.index_b)].entry_date;
		}
	};

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

	$scope.select_row = function (entry, index) {
		$scope.edit_row(entry);
		$scope.range_calculations(index);
	};

	$scope.range_calculations = function (index) {
		var ranger = $scope.range_select;
		if (ranger.next_select === 0) {
			ranger.index_a = index;
			if (ranger.index_b === null) ranger.index_b = index;
		}
		else ranger.index_b = index;
		ranger.next_select = (ranger.next_select+1) % 2;

		var newest = Math.min(ranger.index_a, ranger.index_b);
		var oldest = Math.max(ranger.index_a, ranger.index_b);
		ranger.count = oldest - newest + 1;

		var data = {
			period_avg_wt: null,
			wt_delta: null,
		};
		var readings = $scope.readings;
		for (var i = newest; i < oldest+1; i++) {
			var reading = readings[i];
			data.period_avg_wt += reading.weight;
		};

		data.period_avg_wt = data.period_avg_wt / ranger.count;
		data.wt_delta = readings[newest].weight - readings[oldest].weight;

		ranger.data = data;
		console.log(ranger);
		console.log(ranger.data);
	}

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
	};

}]);