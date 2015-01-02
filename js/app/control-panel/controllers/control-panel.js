app.controller('controlPanelController', ['$scope','$log','conductorService',function($scope,$log,conductorService){

    $scope.keypad = conductorService.keypad;

}])