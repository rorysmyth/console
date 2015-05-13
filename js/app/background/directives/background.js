app.directive('background', function(conductorService){
    return {
        restrict: 'A',
        replace: false,
        link: function ($scope, iElm, iAttrs, controller) {

            $scope.$watch(function(){
                return conductorService.incoming.state;
            }, function(newVal, oldVal){
                if(newVal == 'in-call'){
                    iElm.css("margin-top","50px")
                    iElm.css("background-image","url('/img/bg-connected.jpg')");
                }
            },true)

        }
    }
})