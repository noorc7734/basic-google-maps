// Victoria
let myLat = 48.4284;
let myLong = -123.3656;
let myLocation = new google.maps.LatLng(myLat, myLong);

let map;
let service;
let infoWindowPark; // for park info
let infoWindowCurrentLocation; // for your location

let markers = []; // list of all markers on the map


// when the window loads, intialize the map
window.onload = initializeMap;

//initialize map
function initializeMap() {
  // start centered in Victoria, showing nearby parks
  map = new google.maps.Map(document.getElementById("map"), {
    center: myLocation,
    zoom: 13
  });
  searchForParks(myLocation);

  // https://developers.google.com/maps/documentation/javascript/infowindows
  infoWindowCurrentLocation = new google.maps.InfoWindow();
  infoWindowPark = new google.maps.InfoWindow(); 

  // Create "Pan to Current Location" button
  // https://developers.google.com/maps/documentation/javascript/geolocation
  const locationButton = document.createElement("button");
  locationButton.textContent = "Pan to Current Location";
  locationButton.classList.add("custom-map-control-button");
  
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);
  
  locationButton.addEventListener("click", () => {
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const pos = {
            lat: 48.4475,
            lng: -123.4956
          };
          
          /*
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };*/
          infoWindowCurrentLocation.setPosition(pos);
          infoWindowCurrentLocation.setContent("Location found.");
          infoWindowCurrentLocation.open(map);
          map.setCenter(pos);
          searchForParks(pos);
        },
        () => {
          handleLocationError(true, infoWindowCurrentLocation, map.getCenter());
        }
      );
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindowCurrentLocation, map.getCenter());
    }
  });
} // initializemap

// search parks in 5km
// from https://developers.google.com/maps/documentation/javascript/examples/place-search#maps_place_search-javascript
function searchForParks(location){
  let request = {
    location: location,
    radius: "500",
    query: "park",
  };

  service = new google.maps.places.PlacesService(map);
  service.textSearch(request, processParks);
  
}

//process search resuls for parks
function processParks(results, status) {
if (status == google.maps.places.PlacesServiceStatus.OK) {
  deleteMarkers();
      for (let i = 0; i < results.length; i++) {
        let place = results[i];
        console.log(place)
        createMarker(place);
      }
    }
} // Process Parks

// create a marker at place
// from 
function createMarker(place) {
  
  if (!place.geometry || !place.geometry.location) return;

  const scaledIcon = {
    url: place.icon,
    scaledSize: new google.maps.Size(30, 30),
    origin: new google.maps.Point(0, 0), // origin
    anchor: new google.maps.Point(0, 0), // anchor
  }
  
  const marker = new google.maps.Marker({
    map,
    position: place.geometry.location,
    icon: scaledIcon,
    title: place.name
  });

  google.maps.event.addListener(marker, "click", () => {
    let contentString = "<h3>" + place.name + "</h3>" + "Rating: <br>"
      + place.rating + "</b> /5 <p>" + place.formatted_address + "</p>";
    
    infoWindowPark.setContent(contentString || "");
    infoWindowPark.open(map, marker);
  });
  
  markers.push(marker);
} //  createMarker
  
// stolen from https://developers.google.com/maps/documentation/javascript/examples/marker-remove
// Sets the map on all markers in the array.
function setMapOnAll(map) {
  for (let i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}

// Removes the markers from the map, but keeps them in the array.
function hideMarkers() {
  setMapOnAll(null);
}

// Shows any markers currently in the array.
function showMarkers() {
  setMapOnAll(map);
}

// Deletes all markers in the array by removing references to them.
function deleteMarkers() {
  hideMarkers();
  markers = [];
}