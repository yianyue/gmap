function initialize() {
  var geocoder = new google.maps.Geocoder();
  var address = 'Toronto';

  var mapOptions = {
    zoom: 12,
  };

  var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

  var createMarker = function(locObj){
    var marker = new google.maps.Marker({
      map: map,
      position: locObj.geometry.location,
      title: locObj.address_components[0].long_name,
    });
    var infowindow = new google.maps.InfoWindow({
      content: locObj.formatted_address,
    });
    google.maps.event.addListener(marker, 'click', function() {
      infowindow.open(map,marker);
    });
  }

  var favLocations = [ 'Royal Ontario Museum', 'High Park', 'University of Toronto', 'Yorkdale'];

  var setFavLocations = function(LatLng){
      for (var i=0; i < favLocations.length; i++){
      geocoder.geocode( { 
        address: favLocations[i],
        bounds: map.getBounds(),
      }, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          // debugger;
          console.log(results);
          createMarker(results[0]);
        } else {
          alert("Geocode was not successful for the following reason: " + status);
        }
      });
    }

  }

  geocoder.geocode( { 
    address: address,
  }, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      map.setCenter(results[0].geometry.location);
      setFavLocations(results[0].geometry.location);
    } else {
      alert("Geocode was not successful for the following reason: " + status);
    }
  });


}

google.maps.event.addDomListener(window, 'load', initialize);
