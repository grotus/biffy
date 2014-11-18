angular.module('biffyServices').factory('API', ['$resource',
 function($resource){
	return $resource('api/helloworld', {}, {
      // query: {method:'GET', params:{phoneId:'phones'}, isArray:true}
    });
}])