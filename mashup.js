
function initialize() {
  var MyPlaces = {};
  var geocoder = new google.maps.Geocoder();
  var address = 'Toronto';
  var mapOptions = {
    zoom: 12,
    mapTypeId: google.maps.MapTypeId.TERRAIN,
  };
  var infowindow = new google.maps.InfoWindow({
      maxWidth: 200,
  }); 
  var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

  var favLocations = [ 'Royal Ontario Museum', 'High Park', 'University of Toronto', 'Yorkdale', 'Toronto Zoo', 'Centre Island'];

  $('body').append('<div id="favourites"><h3>Favourite Locations</h3></div>');

  var addLocation = function(locObj){
    var locName = locObj.address_components[0].long_name;
    var latlng = locObj.geometry.location;
    var addr = locObj.formatted_address;
    $('#favourites').append('<label><input type="checkbox" name="'+locName+'" value="'+locName+'" checked />'+locName+'</label><br />');
    var checkbox = $('input').last();
    var marker = new google.maps.Marker({
      map: map,
      position: latlng,
      title: locName,
    });
// store the location
    MyPlaces[locName] = {
      name: locName,
      latlng: latlng,
      marker: marker,
      address: addr,
      checkbox: checkbox
    }    
    attachListener(MyPlaces[locName]);
  }

//get the favourite locations from an array of names, biased with the current view
  var setFavLocations = function(){
      for (var i=0; i < favLocations.length; i++){
      geocoder.geocode( { 
        address: favLocations[i],
        bounds: map.getBounds(),
      }, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          addLocation(results[0]);
        } else {
          alert("Geocode was not successful for the following reason: " + status);
        }
      });
    }
  }


  var attachListener = function(place){
        var content= '<div id="content">'+
      '<div id="siteNotice"></div>'+
      '<h3 id="firstHeading" class="firstHeading">'+place.name+'</h3>'+
      '<div id="bodyContent"><p>'+place.address+'</p></div></div>';

    google.maps.event.addListener(place.marker, 'click', function() {
      infowindow.setContent(content);
      infowindow.open(place.marker.get('map'), this); 
    });

    place.checkbox.change(function(){
      if ($(this).is(':checked')) {
        MyPlaces[$(this).val()].marker.setMap(map);
      } else {
        MyPlaces[$(this).val()].marker.setMap(null);
      }
    });

  }

  geocoder.geocode( { 
    address: address,
  }, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      map.setCenter(results[0].geometry.location);
      setFavLocations();
    } else {
      alert("Geocode was not successful for the following reason: " + status);
    }
  });

}

google.maps.event.addDomListener(window, 'load', initialize);

