//TODO something
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

            $scope.transfer = {
                incoming: {hold:true},
                outgoing: {hold:false}
            }

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
                this.shrinkOut();
                $timeout(function () {
                    $scope.resetDefaultState();
                }, 300);
            };

            $scope.resetDefaultState = function () {
                $scope.caller.state = null;
                $scope.keypad.state = null;
            };


            /**
             * transfer hold button
             */
            $scope.transferHold = function(pressed){

                var bottom = $scope.transfer.incoming;
                var top = $scope.transfer.outgoing;
                
                if(top.hold ==  false && bottom.hold == true){

                    $log.log("first");

                    if(pressed == 'bottom'){
                        bottom.hold = false;
                        top.hold = true;
                    }

                    if(pressed == 'top'){
                        top.hold = true;
                        bottom.hold = true;
                    }

                }else if(top.hold ==  true && bottom.hold == false){

                    $log.log("second");

                    if(pressed == 'bottom'){
                        $log.log("here");
                        bottom.hold = true;
                    }

                    if(pressed == 'top'){
                        top.hold = false;
                        bottom.hold = true;
                    }

                } else if(top.hold ==  true && bottom.hold == true ){

                    $log.log("third");

                    if(pressed == 'bottom'){
                        bottom.hold = false;
                    }

                    if(pressed == 'top'){
                        top.hold = false;
                    }

                }
                


                //if($scope.transfer.incoming.hold == true && $scope.transfer.outgoing.hold == true && type == 'outgoing'){
                //    $scope.transfer.outgoing.hold = false
                //}
                //
                //if($scope.transfer.incoming.hold == true && $scope.transfer.outgoing.hold == true && type == 'incoming'){
                //    $scope.transfer.incoming.hold = false
                //}


            }

            /**
             * end call
             */
            $scope.endCall = function(){

                // slide the call out of view
                // if its transfer, remove min of the incoming
                // wati until the animation is finished
                // reset the state
                //
                $scope.removeMinStates()
                $scope.shrinkOut();
                $scope.incoming.y = 0;
                $scope.outgoing.y = 0;
                $timeout(function(){
                    $scope.caller.state = null
                },300)

            }

            /**
             * initiate a transfer
             */
            $scope.startTransfer = function() {
                $scope.caller.state = "on-hold-transfer";
                $scope.keypad.more = true;
            };

            /**
             * cancel a transfer
             */
            $scope.cancelTransfer = function() {

                $scope.caller.state = "in-call";
                $scope.keypad.more = false;

                if($scope.outgoing.state != null){
                    $scope.outgoing.state = null;
                }

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

            /**
             * swap the min state
             * @param {object} makeSmall call object put on bottom
             * @param {object} makeBig call object put on top
             */
            $scope.removeMinStates = function(){

                $scope.incoming.min = false;
                $scope.outgoing.min = false;

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
                    TweenLite.to(iElm,0.6,{ease:Back.easeInOut.config(3), y:newVal})
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

                },250)

            };

            /**
             * flip the dim on transfet
             */
            $scope.dimSwtich = function(){

            }

            /**
             * Transfer accepts call
             */
            $scope.transferAccepts = function(){
                $scope.caller.state = 'transfer-connected'
            }

            /**
             *
             * @returns {boolean} true if there's two calls active
             */
            $scope.twoCallsActive = function(){
                if ($scope.incoming.state != null && $scope.outgoing.state != null){
                    return true;
                }
            };

            /**
             * @param {Number} duration The length of the animation.
             */
            $scope.slideOutRight = function () {
                var tl = new TimelineMax();
                tl.to(iElm, 0.3, {x: 100, ease:Power2.easeOut, opacity: 0})
                tl.set(iElm, {x: 0})
            };

            /**
             * @param {Number} duration The length of the animation.
             */
            $scope.shrinkOut = function () {
                var tl = new TimelineMax();
                tl.to(iElm, 0.3, {scale: 0.7, ease:Power2.easeOut, opacity: 0})
                tl.set(iElm, {y: -350, scale: 1})
            };

            /**
             * @param {Number} duration The length of the animation.
             */
            $scope.slideUp = function () {
                TweenLite.to(iElm, 0.3, {y: -350, ease:Power2.easeOut, opacity: 0})
            };

            /**
             * @param {Number} duration The length of the animation.
             */
            $scope.slideDown = function () {
                TweenLite.to(iElm, 0.3, {y: 0, ease:Power2.easeOut, opacity: 1})
            };


            /**
             * watch state
             */
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

                if(newVal == 'outgoing-transfer'){
                    $log.log("transfer");
                    $timeout(function(){
                        if($scope.caller.state == 'outgoing-transfer'){
                            $log.log("still transfer");
                            $scope.transferAccepts()
                        }
                    },1000)
                }

            }, true);


            $scope.$watch(function () {
                
                return $scope.keypad.active
                
            }, function (newVal, oldVal) {

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