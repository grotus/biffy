angular.module('biffyServices').factory('HelloWorld', ['$resource',
 function($resource){
	return $resource('api/helloworld', {}, {
      // query: {method:'GET', params:{phoneId:'phones'}, isArray:true}
    });
}])

