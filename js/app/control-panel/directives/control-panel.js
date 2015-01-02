app.directive('controlPanel', function($log, conductorService, $timeout){
	return {
		templateUrl:'/js/app/control-panel/templates/control-panel.html',
		restrict:'E',
		replace:true,
		scope: {
			state : "=",
			active: '='
		},
		link: function($scope, iElm, iAttrs, controller) {

			$scope.more = false; // shows user search
			$scope.showKeypad = false; // shows keypad
			$scope.incoming = conductorService.incoming; // the incoming call
			$scope.outgoing = conductorService.outgoing; // the outgoing call

			$scope.moreAction= function (){

				if($scope.more == false){
					// nothing is open
					$scope.more = !$scope.more;
				}
				else if($scope.showKeypad == true){
					//both more and keypad are open
					$scope.showKeypad = !$scope.showKeypad;
					$scope.more = !$scope.more;
				}
				else if($scope.more == true && $scope.showKeypad == false){
					// only more menu is open
					$scope.more = !$scope.more;
				}

			};

			// set it off canvas
			TweenLite.set(iElm, {y:-90})


			/*
			watch the outgoing calls
			if there's an outgoing call, then hide the keypad and panels
			if there's an outgoing call and there's no incoming call, change the panel state
			 */
			$scope.$watch(function(){

				return $scope.outgoing;

			}, function(outgoing){

				if(outgoing.state == 'outgoing'){
					$scope.hideAll();
					$scope.state = 'outgoing';
				}

				if(outgoing.state == 'in-call'){
					$scope.state = 'in-call';
				}

			}, true)

			/*
			 	watch the incoming call object
			 	watch the state value
			 	change the panel based on the state of the incoming call
			 */
			$scope.$watch(function($scope){
				
				return $scope.incoming;
				
			}, function(newVal){

				if (newVal.state == 'incoming') {

					/*
					 if you're already playing with the keypad and you recieve a call
					 minimize the keypad and all that other stuff
					 */
					if($scope.active == true){
						$scope.hideAll();
					}

					/*
					 if the keypad is off-screen and isn't active
					 */
					if($scope.active == false){
						$scope.animatePositionIn();
					}

					$scope.active = true;
					$scope.state = 'incoming'

				}

				if (newVal.state == 'in-call') {
					$scope.state = 'in-call'
				}

			}, true);

			/*
				watch keypad show/hide state
				controlled by the nav bar
			 */
			$scope.$watch(function($scope){

				return $scope.active;

			}, function(newVal){

				if (newVal == true) {
					$scope.hideAll();
					$scope.animatePositionIn();
				}

				if (newVal == false) {
					$scope.hideAll();
					$scope.animatePositionOut();
				}

			}, true)


			$scope.hideAll = function(){
				$scope.more = false;
				$scope.showKeypad = false;
			}

			$scope.animatePositionOut = function (){
				/*
				dont animate out if you're in a call
				 */
				if($scope.incoming.state != 'incoming'){
					TweenLite.to(iElm,0.3, {y:-90})
				}
			};

			$scope.animatePositionIn = function() {
				TweenLite.to(iElm, 0.3, {y: 0})
			}

			$scope.call = function (){
				/*
				is there another call going on at the moment?
				if there is, then this is a transfer
				if there isn't then this is a simple outgoing call
				if it's a simple outgoing call, then animate it in to show the state
				if it's a transfer,
				 */
				$scope.hideAll();
				$timeout(function(){
					$scope.outgoing.state = 'outgoing'
				},150)

			}

		}
	}
});