angular.module('biffy').controller('BioCtrl', ['$scope', '$filter', 'Biometrics', function($scope, $filter, Biometrics) {
	$scope.bio = {
		weight: 0.0,
		percent: 0.0,
		note: "",
		entry_date: new Date()
	};
	$scope.editabletest = 0; // IS THIS EVEN USED?
	$scope.settings = {
		show: {
			date: true,
			raw_wt: false,
			avg_wt: true,
			composition: false,
			tags: false,
			note: true
		},
		precision: 1,
    };

	$scope.get_fresh_readings = function () {
		$scope.readings = Biometrics.get(function () {
			$scope.date_changed();

			for (var i = $scope.readings.length - 1; i >= 0; i--) {
				$scope.readings[i].moving_avg_weight = $scope.get_moving_avg(i);
			};
		});
	};
	$scope.get_fresh_readings();

	$scope.range_select = {
		index_a: null,
		index_b: null,
		next_select: 0,
		count: 0, // redundant now?
		is_selected: function (index) {
			if (this.index_a === null && this.index_b === null) return false;
			return index === this.index_a || index === this.index_b;
			// if (this.index_a === null) return index === this.index_b; 
			// if (this.index_b === null) return index === this.index_a;

			// return index >= Math.min(this.index_a, this.index_b)
			// 	 && index <= Math.max(this.index_a, this.index_b);
		},
		oldest_date: function () {
			return $scope.readings[Math.max(this.index_a, this.index_b)].entry_date;
		},
		newest_date: function () {
			return $scope.readings[Math.min(this.index_a, this.index_b)].entry_date;
		}
	};

	// Simple first version of a moving average
	// Does not account for missing data points, so not truly a 7-day moving avg
	$scope.get_moving_avg = function (index) {
		var readings = $scope.readings;
		var total_entries = readings.length;
		var span = Math.min(total_entries - index, 7);
		var final_index = index + span;
		var moving_avg_weight = 0;
		for (var i = final_index - 1; i >= index; i--) {
			moving_avg_weight += readings[i].weight / span;
		};
		return moving_avg_weight;
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
			$scope.get_fresh_readings();
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
		ranger.count = oldest - newest + 1; // redundant now?

		var readings = $scope.readings;
		var data = {
			wt_old: readings[oldest].moving_avg_weight,
			wt_new: readings[newest].moving_avg_weight,
			wt_delta: readings[newest].moving_avg_weight - readings[oldest].moving_avg_weight,
		};

		ranger.data = data;
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
			$scope.get_fresh_readings();
		});
	};

}]);