app.factory('myAppSrv', function ($q, $http) {
    var map;
    var locations = [];

    function getlocations() {

        var async = $q.defer()
        var usersUrl = "https://glacial-escarpment-40412.herokuapp.com/users";

        $http.get(usersUrl).then(function (response) {

            for (var j = 0; j < response.data.length; j++) {

                var lat = response.data[j]['location']['latitude'];
                var lon = response.data[j]['location']['longitude'];
                var id = response.data[j]['id'];

                // var res = calcByDistance(lat, lon, id)

                // arrOfDist.push(res)

                locations.push({ lat: Number(lat), lng: Number(lon) })

                marker = new google.maps.Marker({
                    position: new google.maps.LatLng(lat, lon),
                    map: map
                });
            }

            async.resolve(locations);
        }, function (response) {
            console.error(response)
            async.reject([])
        });
        return async.promise;

    }

    function calcByDistance(lat2, lon2, arrOfLocations) {

        var reOrderArr = [];

        for (let i = 0; i < arrOfLocations.length; i++) {

            var lat1 = Number(arrOfLocations[i].location.latitude)
            var lon1 = Number(arrOfLocations[i].location.longitude)
            var R = 6371; // Radius of the earth in km
            var dLat = deg2rad(lat2 - lat1);  // deg2rad below
            var dLon = deg2rad(lon2 - lon1);
            var a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2)
                ;
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            var d = R * c; // Distance in km

            arrOfLocations[i].location.d = Math.round(d);

            reOrderArr.push(arrOfLocations[i])

        }
        return reOrderArr;
    }

    function deg2rad(deg) {
        return deg * (Math.PI / 180)
    }

    function getAllMarkers() {

        var async = $q.defer();
        var itemsUrl = 'https://glacial-escarpment-40412.herokuapp.com/users';

        $http.get(itemsUrl).then(function (response) {

            async.resolve(response.data);
        }, function (response) {
            console.error(response)
            async.reject([])
        });
        return async.promise;
    }

    function initMap(lat, lng) {

        var locationOfCounty =
            { lat: 15, lng: 0 };


        if (lat && lng) {
            locationOfCounty.lat = lat;
            locationOfCounty.lng = lng;
        }

        map = new google.maps.Map(document.getElementById('map'), {
            zoom: 3,
            center: new google.maps.LatLng(locationOfCounty.lat, locationOfCounty.lng)
        });

        // calcByDistance(locationOfCounty.lat, locationOfCounty.lng)

        var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

        var markers = locations.map(function (location, i) {

            return new google.maps.Marker({
                position: location,
                label: labels[i % labels.length]
            });
        });

        var markerCluster = new MarkerClusterer(map, markers,
            { imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m' });

    }

    return {
        getlocations: getlocations,
        getAllMarkers: getAllMarkers,
        initMap: initMap,
        calcByDistance: calcByDistance

    }

});