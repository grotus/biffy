// Testing the 'Controller as'-method here
angular.module('biffy').controller('Workout', 
  ['$scope', 'Workout', 'workoutsData', function($scope, Workout, workoutsData) {
    window.DSCOPE = $scope;
    this.helper = Workout;
    this.workouts = workoutsData;
    this.settings = {
      showWarmups: false
    };
    this.volume_data = [];


    this.include_set = function (set) {
      return !set.warmup;
    };

    this.get_volume = function (exercise) {
      var volume = 0;
      for (var i = exercise.workout_sets.length - 1; i >= 0; i--) {
        var set = exercise.workout_sets[i];
        if (!set.warmup) {
          volume += (set.weight*set.reps);
        };
      };
      return volume;
    };

    this.update_volume_data = function () {
      this.volume_data = [];
      for (var i = this.workouts.length - 1; i >= 0; i--) {
        var workout = this.workouts[i];
        workout.volume_data = this.exercise_volume(workout.exercise_volume);
      };
    };

    this.exercise_volume = function (exercises) {
      var ex_vol_list = [];
      for (var i = exercises.length - 1; i >= 0; i--) {
        var ex = exercises[i];
        var volume = get_volume(ex);
        ex_vol_list.push({name: ex.exercise.name, volume: volume});
      };
      return ex_vol_list;
    };

  }]
);
