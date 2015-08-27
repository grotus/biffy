// Testing the 'Controller as'-method here
angular.module('biffy').controller('Workout', 
  ['$scope', 'Workout', 'workoutsData', function($scope, Workout, workoutsData) {
    window.DSCOPE = $scope;
    this.helper = Workout;
    this.workouts = workoutsData;
    this.settings = {
      showWarmups: false
    };

    this.include_set = function (set) {
      return !set.warmup;
    };
  }]
);
