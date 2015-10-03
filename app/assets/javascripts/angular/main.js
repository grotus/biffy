Date.prototype.yyyymmdd = function() { // move to helpers.js or something
                              
  var yyyy = this.getFullYear().toString();                                    
  var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based         
  var dd  = this.getDate().toString();             
                      
  return yyyy + '-' + (mm[1]?mm:"0"+mm[0]) + '-' + (dd[1]?dd:"0"+dd[0]);
 }; 

/* Here we define modules and routes for angular */

angular.module('biffyServices', ['ngResource']);

angular.module('biffy', ['templates', 'ngRoute', 'biffyServices', 'authentication_redirect', 'tagListDirective'])
.config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {
	$routeProvider
		.when('/', {
			controller: 'HomeCtrl',
			templateUrl: 'Home.html'
		})
		.when('/login', {
			controller: 'LoginCtrl',
			templateUrl: 'Login.html'
		})
		.when('/bio', {
			controller: 'BioCtrl',
			templateUrl: 'Bio.html'
		})
		.when('/bfcalc', {
			controller: 'BfCalc',
			templateUrl: 'BfCalc.html'
		})
		.when('/workout', {
			resolve: {
				workoutsData: ['Workout', function (Workout) {
					return Workout.api.get();
				}],
			},
			controller: 'Workout',
			controllerAs: 'workouts',
			templateUrl: 'Workout.html'
		})
		.when('/workout/quickinput', {
			controller: 'WoQuickInput',
			templateUrl: 'WoQuickInput.html'
		})
		.otherwise({
			redirectTo: '/'
		});

	// Make CSRF protection work with rails+angular
	authToken = $("meta[name=\"csrf-token\"]").attr("content");
  $httpProvider.defaults.headers.common["X-CSRF-TOKEN"] = authToken;

  // Support PATCH method (just in case)
  $httpProvider.defaults.headers.patch['Content-Type'] = 'application/json';
}]);
