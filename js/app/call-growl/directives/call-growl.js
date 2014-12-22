app.directive('callGrowl', function($log){
	return {
		scope: {
			type: '='
		},
		restrict:'E',
		templateUrl: '/js/app/call-growl/templates/call-growl.html',
		link: function($scope, iElm, iAttrs, controller) {
			
			$log.log($scope.type)

		}
	}
});