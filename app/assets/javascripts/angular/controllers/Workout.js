// Testing the 'Controller as'-method here
angular.module('biffy').controller('Workout', 
  ['$scope', 'Workout', 'workoutsData', function($scope, Workout, workoutsData) {
    window.DSCOPE = $scope;
    this.helper = Workout;
    this.workouts = workoutsData;

    console.log('workouts is', this.workouts);
  }]
);
