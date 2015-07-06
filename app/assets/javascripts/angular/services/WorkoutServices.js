angular.module('biffyServices').factory('Workout', ['$resource',
 function($resource) {
	return {
		smog: function () {
			return "SMOG!";
		},
		api: $resource('api/workout', {}, {
	      get: {method:'GET', isArray:true},
	      save: {method:'POST'},
	      delete_entry: {url:'api/workout/:id', method:'DELETE'}
	    }),

	};
}]);