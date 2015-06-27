angular.module('biffyServices').factory('HelloWorld', ['$resource',
 function($resource){
	return $resource('api/helloworld', {}, {
      // query: {method:'GET', params:{phoneId:'phones'}, isArray:true}
    });
}]);

angular.module('biffyServices').factory('Biometrics', ['$resource',
 function($resource){
	return $resource('api/biometrics', {}, {
      get: {method:'GET', isArray:true},
      save: {method:'POST'},
      delete_entry: {url:'api/biometrics/:id', method:'DELETE'}
    });
}]);

angular.module('biffyServices').factory('Workout', ['$resource',
 function($resource){
	return $resource('api/workout', {}, {
      get: {method:'GET', isArray:true},
      save: {method:'POST'},
      delete_entry: {url:'api/workout/:id', method:'DELETE'}
    });
}]);