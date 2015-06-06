angular.module('biffy').controller('BfCalc', ['$scope', function($scope) {
	window.DSCOPE = $scope;
	$scope.readings = {
		input: '',
		incomplete_input: false,
		list: [],
		series_averages: [],
		measurement_sum: 0,
		bf: 0,
	};
	
	$scope.reset = function () {
		$scope.readings.list = [];
		$scope.readings.series_averages = [];
		$scope.readings.measurement_sum = 0;
		$scope.readings.bf = 0;
	}

	$scope.input_changed = function (argument) {
		var readings = $scope.readings;

		var split_input = readings.input.match(/\S+/g);
		if (split_input === null) {
			readings.list = [];
			return;
		}
		var incomplete_count = split_input.length % 3;
		readings.incomplete_input = incomplete_count > 0;
		var limit = split_input.length - incomplete_count;
		if (limit < 3) {
			$scope.reset();
			return;
		}
		var filtered_list = split_input.slice(0, limit);
		readings.list = filtered_list;

		if (readings.list.length >= 3) {
			var result = bf.calculateBf(readings.list);
			readings.series_averages = _.map(result.series_averages, function (n) {
				return Math.round(n * 100) / 100;
			})
			readings.measurement_sum = Math.round(result.measurement_sum * 10) / 10;
			readings.bf = Math.round(result.bf * 10) / 10;
		}
	};

}]);


/*
 * BF calculation code
 *
 * CALCULATE BODY DENSITY AND FAT ACCORDING TO JACKSON-POLLOCK FORMULA
 *
 */
var bf = bf || {};

$.extend(true, bf, {
  ageFactor: 32,
  measuringPoints: 3,

  // Calculate body density from skinfold measurement sum
  bodyDensity: function (measurement_sum) {
  	return 1.10938 - (0.0008267 * measurement_sum) + (0.0000016 * measurement_sum*measurement_sum) - (0.0002574 * bf.ageFactor)
  },

  // Convert body density into body fat using the Siri equation
  bodyFat: function (body_density) {
  	return ((4.95/body_density) - 4.5) * 100
  },

  calculateBf: function (values) {
  	var measuring_points = bf.measuringPoints;
  	var size = values.length;
  	var numSeries = size / measuring_points;
		
		// calc average values for each measuring point  	
  	var final_averages = [];
  	for (var i = 0; i < measuring_points; i++) {
  		var series = _.filter(_.slice(values, i), function (x, n) {
  			return (n % measuring_points) === 0;
  		});
  		var series_avg = _.sum(series)/numSeries;
  		final_averages.push(series_avg);
  	};

  	// Sum the measurements
  	var measurement_sum = _.sum(values) / (size / measuring_points);

  	var result = {
  		series_averages: final_averages, 
  		measurement_sum: measurement_sum
  	};

  	// Calculate BF%
  	var bodyDensity = bf.bodyDensity(result.measurement_sum);
  	result.bf = bf.bodyFat(bodyDensity);

  	return result;
  }

});

