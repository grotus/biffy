angular.module('biffy').controller('HomeCtrl', ['$scope', 'API', function($scope, API) {
	$scope.helloworld = API.get();
}]);