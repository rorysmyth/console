app.controller('callWorkerController', ['$scope','conductorService', function($scope, conductorService){

	$scope.conductor = conductorService;
	$scope.incoming = conductorService.incoming;
	$scope.outgoing = conductorService.outgoing;
	$scope.keypad= conductorService.keypad;

	$scope.callsYou = function (caller){
		$scope.incoming.state = "incoming";
	}

	$scope.hangsUp = function (caller){
		console.log(caller);
		caller.state = null;
	}

	$scope.answers = function (caller){
		caller.state = 'in-call';
	}

	$scope.togglePanel = function(){
		if($scope.incoming.state != 'incoming' ){
			$scope.keypad.active = !$scope.keypad.active;
		}

	}

}])