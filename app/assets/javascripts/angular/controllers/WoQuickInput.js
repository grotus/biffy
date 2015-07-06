angular.module('biffy').controller('WoQuickInput', ['$scope', 'Workout', function($scope, Workout) {
    window.DSCOPE = $scope;
    $scope.workout = {
        input: '',
        output: {},
        data: [],
        dataStringified: '',
    };

    $scope.save = function () {
        Workout.api.save({workout: $scope.workout.data});
    };

    $scope.save_disabled = function () {
        if ($scope.workout.data.length === 0 
            || $scope.workout.data === undefined
            || $scope.workout.data.error !== undefined) {
            return true;
        }
        return false;
    }

    $scope.input_changed = function () {
        var input = $scope.workout.input;
        $scope.workout.output = input.split("\n");
        var output = $scope.workout.output;
        $scope.workout.data = [];
        var start = 0;
        var end = 0;
        var foundStart = false;
        for (var i = 0; i < output.length; i++) {
            var row = output[i];
            if (row[0] === '#') {
                start = i;
                foundStart = true;
            }
            if (foundStart && (row === '' || i === output.length-1))  {
                end = i;
                var result = $scope.process_workout(output.slice(start, end+1));
                foundStart = false;
                if (!result) break;
            }
        };

        $scope.workout.dataStringified = JSON.stringify($scope.workout.data, null, 2);
    };

    $scope.process_workout = function (rows) {
        if (rows.length < 1) return false;

        // Read date
        var dateRow = rows[0];
        var entryDate = dateRow.slice(1, dateRow.length).trim();
        var dateValidation = new Date(entryDate);
        if (isNaN(dateValidation.getDate())) {
            $scope.write_error('error bad date ' + dateRow);
            return false;
        }
        var wo = {entry_date: entryDate, workout_exercises_attributes: []};

        // read exercise rows
        var dataRows = rows.slice(1, rows.length);
        for (var i = 0; i < dataRows.length; i++) {
            var row = dataRows[i];
            if (row === '') continue;
            var ok = $scope.process_workout_row(row, wo);
            if (!ok) {
                $scope.write_error('bad input on ' + row);
                return false;
            }
        };

        $scope.workout.data.push(wo);
        return true;
    };

    $scope.process_workout_row = function (workoutRow, workoutObject) {
        if (count_token(workoutRow, ':') !== 1) return false;
        var exercise = { exercise_attributes: '', tag_list: [], workout_sets_attributes: []};
        var workout_row_split = workoutRow.split(':');
        var name_and_tags = workout_row_split[0];
        var exercise_raw_data = workout_row_split[1];

        exercise.exercise_attributes = {name: name_and_tags.split('(')[0].trim() };
        exercise.tag_list = $scope.get_tags(name_and_tags);
        var result = $scope.process_lifts(exercise, exercise_raw_data.trim());
        if (!result) return false;
        workoutObject.workout_exercises_attributes.push(exercise);
        return true;
    };

    $scope.get_tags = function (name_and_tags) {
        var start = name_and_tags.indexOf('(');
        if (start === -1) return [];
        var end = name_and_tags.indexOf(')');
        if (end === -1) end = name_and_tags.length;
        var tags = name_and_tags.slice(start+1, end).split(' ');
        return tags;
    };

    $scope.process_lifts = function (exerciseObject, exercise_raw_data) {
        var opening_paranthesis = exercise_raw_data.indexOf('(');
        var closing_paranthesis = exercise_raw_data.indexOf(')');
        if (!$scope.validate_exercise_paranthesis(opening_paranthesis, closing_paranthesis)) return false;

        var workset_raw_data = exercise_raw_data;
        // warmups
        if (opening_paranthesis !== -1) {
            var warmup_raw_data = exercise_raw_data.slice(opening_paranthesis+1, closing_paranthesis);
            $scope.process_set_row(exerciseObject, warmup_raw_data, true);

            workset_raw_data = exercise_raw_data.slice(closing_paranthesis+1, exercise_raw_data.length);
        };
        //console.log('worksets',workset_raw_data);
        $scope.process_set_row(exerciseObject, workset_raw_data, false);

        return true;
    }

    $scope.process_set_row = function (exerciseObject, raw_data, isWarmup) {
        var sets = raw_data.match(/\S+/g);
        if (sets === null) return false;
        for (var i = 0; i < sets.length; i++) {
            var set_chunk = sets[i];
            $scope.process_set_chunk(exerciseObject, set_chunk, isWarmup);
        };

    };

    $scope.process_set_chunk = function (exerciseObject, set_chunk, isWarmup) {
        set_chunk = set_chunk.toLowerCase();
        var weight = $scope.get_value(set_chunk);
        var xCount = count_token(set_chunk, 'x');

        if (xCount === 0) {
            // Expressed in form (weight). Must be a single.
            $scope.process_set_single(exerciseObject, set_chunk, isWarmup);
        }
        else if (xCount === 1) {
            // Expressed on form (weight)x(reps)[,reps][...]
            $scope.process_sets_variable(exerciseObject, set_chunk, isWarmup);
        }
        else if (xCount === 2) {
            // Expressed on form (weight)x(reps)x(sets)
            $scope.process_sets_across(exerciseObject, set_chunk, isWarmup);
        }
    };

    $scope.process_set_single = function (exerciseObject, set_chunk, isWarmup) {
        var weight = $scope.get_value(set_chunk);
        var isFail = set_chunk.indexOf('f') !== -1;
        var set = {weight: weight, reps: isFail ? 0 : 1, isWarmup: isWarmup, isFail: isFail};
        exerciseObject.workout_sets_attributes.push(set);
    };

    $scope.process_sets_variable = function (exerciseObject, set_chunk, isWarmup) {
        var weight = $scope.get_value(set_chunk);

        var reps_raw_data = set_chunk.split('x')[1].trim();

        if (reps_raw_data[reps_raw_data.length-1] === ',' || count_token(reps_raw_data, ',') === 0) { // just a single set
            $scope.add_set_data(exerciseObject, weight, isWarmup, reps_raw_data);
            return true;
        }

        var set_reps = reps_raw_data.split(',');
        for (var i = 0; i < set_reps.length; i++) {
            var reps = set_reps[i];
            $scope.add_set_data(exerciseObject, weight, isWarmup, reps);
        };
        return true;
    };

    $scope.process_sets_across = function (exerciseObject, set_chunk, isWarmup) {
        var weight = $scope.get_value(set_chunk);
        if (set_chunk[set_chunk.length-1] === ',') {
            set_chunk = set_chunk.slice(0, set_chunk.length-1);
        }
        var raw_data = set_chunk.split('x');
        raw_data = raw_data.slice(1, raw_data.length);
        var sets = raw_data[1];
        var reps = raw_data[0];

        var isFail = false;
        if (sets[sets.length-1] === 'f') {
            isFail = true;
            sets = sets.slice(0, sets.length-1);
        }

        sets = Number(sets);
        for (var i = 0; i < sets; i++) {
            var set_reps = reps;
            if (isFail && i === sets-1) set_reps = set_reps + 'f';
            $scope.add_set_data(exerciseObject, weight, isWarmup, set_reps);
        };

    };

    $scope.add_set_data = function (exerciseObject, weight, isWarmup, reps_raw_data) {
        var reps_data = $scope.get_reps_data(reps_raw_data);
        var set = {weight: weight,
                     reps: reps_data.completed_reps,
                   isFail: reps_data.isFail,
                 isWarmup: isWarmup };
        exerciseObject.workout_sets_attributes.push(set);
    };

    $scope.get_reps_data = function (reps_string) {
        var reps = reps_string;
        var completed_reps = 0;
        var isFail = false;
        if (reps === "f" || reps.indexOf('f') !== -1) {
            isFail = true;
            completed_reps = reps.length === 1 ? 0 : Number(reps.match(/^\d+/g)[0])-1;
        }
        else {
            completed_reps = Number(reps.match(/^\d+/g)[0]);
        }

        return {completed_reps: completed_reps, isFail: isFail};
    };

    $scope.get_value = function (chunk) {
        return chunk.match(/^(\d+([\.|,]\d+)?)/g)[0];
    };

    $scope.validate_exercise_paranthesis = function (opening_paranthesis, closing_paranthesis) {
        if (opening_paranthesis === -1 && closing_paranthesis !== -1) return false;
        if (opening_paranthesis !== -1 && closing_paranthesis === -1) return false;
        if (opening_paranthesis !== -1 && closing_paranthesis !== -1
            && opening_paranthesis > closing_paranthesis) return false;

        return true;
    };

    $scope.write_error = function (message) {
        $scope.workout.data = {error: true, message: message}
    };

}]);

function count_token (str, token) {
    var tokenRegex = new RegExp(token, 'g');
    return (str.match(tokenRegex)||[]).length;
}
