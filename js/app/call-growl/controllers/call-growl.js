app.controller('callGrowlController', ['$scope','conductorService','$log','$timeout',function($scope, conductorService, $log, $timeout){

	$scope.incoming = conductorService.incoming;
	$scope.outgoing = conductorService.outgoing;

	/*
	 watch for the out going call to start
	 if the incoming call is not active, then its a direct call
	 if the incoming call is active, then it's a transfer
	 */
	$scope.$watch(function(){

		return $scope.outgoing.state;

	}, function(newVal, oldVal){

		if(newVal == 'outgoing' && $scope.incoming.state != null){


		}

	}, true)

}]);