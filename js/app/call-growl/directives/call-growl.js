app.directive('callGrowl', ['$log', '$timeout', 'conductorService', function ($log, $timeout, conductorService) {
    return {
        templateUrl: '/js/app/call-growl/templates/call-growl.html',
        restrict: 'E',
        replace: true,
        scope: {
            caller: '='
        },
        link: function ($scope, iElm, iAttrs, controller) {

            $scope.keypad = conductorService.keypad;
            $scope.incoming = conductorService.incoming;
            $scope.outgoing = conductorService.outgoing;

            TweenLite.set(iElm, {y: -350, opacity: 0})

            $scope.mic = {
                volume: true
            };

            $scope.iam = function (name){
                return name === iAttrs.caller;
            }


            $scope.available = function () {
                $scope.shrinkOut();
                $timeout(function () {
                    $scope.resetDefaultState();
                    /*
                    if the call that was ended was a transfer
                     */
                    var remainingCall = _.reject([$scope.incoming, $scope.outgoing], function(call){
                        if(call.state == null && call.min != null){
                            return call;
                        }
                    })[0];

                    if(!_.isEmpty(remainingCall)){
                        remainingCall.min = !remainingCall.min;
                        remainingCall.y = 0;
                    };

                }, 300);
            };


            $scope.decline = function () {
                this.slideOutRight();
                $timeout(function () {
                    $scope.resetDefaultState();
                }, 300);
            };

            $scope.resetDefaultState = function () {
                $scope.caller.state = null;
                $scope.keypad.state = null;
            };
            

            /**
             * when user clicked on minimized voice growl
             */
            $scope.togglePosition = function(){

                if($scope.caller.min == true){

                    if($scope.iam('incoming')){
                        $scope.swapMinState($scope.outgoing, $scope.incoming);
                    } else {
                        $scope.swapMinState($scope.incoming, $scope.outgoing);
                    }

                }

            };

            /**
             * swap the min state
             * @param {object} makeSmall call object put on bottom
             * @param {object} makeBig call object put on top
             */
            $scope.swapMinState = function(makeSmall,makeBig){

                makeSmall.min = true;
                makeSmall.z = 0;

                makeBig.min = false;
                makeBig.z = 1;

                $scope.$broadcast('min.changed')

            };
            
            $scope.$on('min.changed', function(){
                $scope.adjustMinimizedOffset()
            });

            /**
             * watch the z value for changes
             */
            $scope.$watch(function(){

                return $scope.caller.y;

            }, function(newVal, oldVal){

                if($scope.incoming.state != null && $scope.outgoing.state != null){
                    TweenLite.to(iElm,0.3,{ease:Back.easeInOut, y:newVal})
                }

            }, true)


            /**
             * adjust the Y offset of the minimized growl if needed
             */
            $scope.adjustMinimizedOffset = function (){

                /*
                    h = height of growl on top
                    x = offset from growl on top to absolute bottom
                    y = absolute total height
                    z = bottom growl height
                 */

                $timeout(function(){

                    var h = angular.element('.call-growl:not(.min)').height(),
                        z = angular.element('.call-growl.min').height(),
                        x = 40,
                        y = h + x;

                    if(y > z){
                        z = (y-z);
                    }

                    if(y < z){
                        z = -(z-y);
                    }

                    if($scope.incoming.min == true){
                        $scope.outgoing.y = 0;
                        $scope.incoming.y = z;
                    } else {
                        $scope.outgoing.y = z;
                        $scope.incoming.y = 0;
                    }

                },300)

            };

            /**
             *
             * @returns {boolean} true if there's two calls active
             */
            $scope.twoCallsActive = function(){
                if ($scope.incoming.state != null && $scope.outgoing.state != null){
                    return true;
                }
            }

            /**
             * @param {Number} duration The length of the animation.
             */
            $scope.slideOutRight = function () {
                TweenLite.to(iElm, 0.3, {y: 100, opacity: 0})
                TweenLite.set(iElm, {y: -350})
            };

            /**
             * @param {Number} duration The length of the animation.
             */
            $scope.shrinkOut = function () {
                TweenLite.to(iElm, 0.3, {scale: 0.7, opacity: 0})
                TweenLite.set(iElm, {y: -350, scale: 1})
            };

            /**
             * @param {Number} duration The length of the animation.
             */
            $scope.slideUp = function () {
                TweenLite.to(iElm, 0.3, {y: -350, opacity: 0})
            };

            /**
             * @param {Number} duration The length of the animation.
             */
            $scope.slideDown = function () {
                TweenLite.to(iElm, 0.3, {y: 0, opacity: 1})
            };


            $scope.$watch(function () {
                
                return $scope.caller.state
                
            }, function (newVal, oldVal) {

                if (newVal == 'incoming') {
                    TweenLite.to(iElm, 0.3, {y: 0, opacity: 1})
                }

                if (newVal == 'outgoing') {
                    TweenLite.set(iElm, {y: 0, opacity: 0});
                    TweenLite.fromTo(iElm, 0.3, {opacity: 0,scale:0.8},{opacity: 1, scale:1})
                }
                
                // first outgoing call
                if (newVal != null && $scope.iam('outgoing')){
                    $scope.swapMinState($scope.incoming, $scope.outgoing)
                }

                if(newVal != oldVal && $scope.twoCallsActive()){
                    $scope.adjustMinimizedOffset()
                }

            }, true);

            $scope.$watch(function () {
                
                return $scope.keypad.active
                
            }, function (newVal, oldVal) {
                /*
                 if the keypad.active == false && the call state is null animate it up
                 if the keypad.active == true && the call state is null animate it down
                 */
                if ($scope.caller.state != null && $scope.caller.state != 'incoming') {
                    if (newVal == true) {
                        $scope.slideDown();
                    }
                    if (newVal == false) {
                        $scope.slideUp()
                    }
                }

            });
            


        }
    }
}]);