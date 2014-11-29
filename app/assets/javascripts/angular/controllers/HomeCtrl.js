angular.module('biffy').controller('HomeCtrl', ['$scope', 'HelloWorld', function($scope, HelloWorld) {
	$scope.helloworld = HelloWorld.get();
}]);