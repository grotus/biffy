
// var app = angular.module('editableDirective', ['ui']);
var app = angular.module('editableDirective', []);
//Include angular-ui dependency in resources on the side and as 'ui'
app.directive('editable', ['$compile', function($compile) {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      model: '=model',
      defaultValue: '@defaultval',
      removeFn: '=onDelete'
    },
    //templateUrl: 'editable-template.html',
    template: "<span><span class=\"c1\" ng-hide=\"editorEnabled\" ng-click=\"enableEditor();\">{{model | default:'Default Heading.'}}</span><input ng-show=\"editorEnabled\" ng-model=\"editModel\" ng-required ng-enter=\"unEdit()\" ng-blur=\"unEdit()\"/></span>",

    controller: function($scope) {},

    // Move type attribute to the input element
    // compile: function compile(tElement, tAttrs) {
    //   return function preLink(scope, iElement, iAttrs) {
    //     var $input = $(iElement).find("input");
    //     var typeAttr = $(iElement).prop("attributes")["type"];
    //     if (typeAttr) {
    //       $input.attr(typeAttr.name, typeAttr.value);
    //     };
    //     $compile($input)(scope);  //compile the input
    //   };
    // },

    // The linking function will add behavior to the template
    link: function(scope, element, attrs) {
      scope.editorEnabled = false;

      var $input = $(element).find("input");
      var typeAttr = $(element).prop("attributes")["type"];
      if (typeAttr) $input.attr(typeAttr.name, typeAttr.value);
      var stepAttr = $(element).prop("attributes")["step"];
      if (stepAttr) $input.attr(stepAttr.name, stepAttr.value);

      scope.unEdit = function($event) {
        scope.model = angular.copy(scope.editModel);
        scope.editorEnabled = false;
        if ($event != null) $event.preventDefault();
      };

      scope.enableEditor = function() {
        scope.editModel = angular.copy(scope.model);
        scope.editorEnabled = true;
        // The element enable needs focus and we wait for milliseconds before allowing focus on it.
        timer = setTimeout(function() {
          element.find('input').focus().select();
        }, 100);
      };
    }
  }
}]);

app.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
});

// app.controller('MyCtrl', function($scope) {
//   $scope.heading = "";
// });

app.filter('default', function() {
  return function(input, value) {
    return out =
      input != null && input != undefined && (input != "" || angular.isNumber(input)) ?
      input : value || '';
  }
});