app.controller('myAppCtrl', function (myAppSrv, $scope) {

    
    $scope.locations = [];
    myAppSrv.getlocations().then(function (userObj) {
        $scope.locations = userObj
    });
    
    $scope.markers = [];
    $scope.reOrderArr=[];
    myAppSrv.getAllMarkers().then(function (userObj) {
        $scope.markers = userObj;
        myAppSrv.initMap();
      $scope.reOrderArr = myAppSrv.calcByDistance(15, 0, $scope.markers);          
    })
    
    $scope.changeCenter = function (lat, lng) {
        myAppSrv.initMap(lat, lng)
        myAppSrv.calcByDistance(lat, lng, $scope.markers)

    }

    

});