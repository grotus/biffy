/**
 * Authentication module, redirects to login page if not logged in
 * From http://technpol.wordpress.com/2013/09/23/angularjs-and-devise-authentication-with-a-rails-server/
 *
 * This will trigger when we try to access a resource on the rails server that returns 401.
 * This assumes that the access attempt is from Angular trying to get a resource.
 */

AuthRedirect = angular.module('authentication_redirect', []);

AuthRedirect.config(['$httpProvider', function($httpProvider){
  // Intercepts every http request.  If the response is success, pass it through.  If the response is an
  // error, and that error is 401 (unauthorised) then the user isn't logged in, redirect to the login page 
  var interceptor = function($q, $location, $rootScope) {
    return {
      'responseError': function(rejection) {
        if (rejection.status == 401) {
          $rootScope.$broadcast('event:unauthorized');
          $location.path('/login');
          return rejection;
        }
        return $q.reject(rejection);        
      }
    };
  };
  $httpProvider.interceptors.push(interceptor);
}]);