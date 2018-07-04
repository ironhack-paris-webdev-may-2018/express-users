// Google Maps script tag defines the "google" variable and its "maps" property
console.log("Google Maps", google.maps);

const mapDiv = document.querySelector(".my-google-map");
const locationInput = document.querySelector(".location-input");
const latInput = document.querySelector(".lat-input");
const longInput = document.querySelector(".long-input");
let map;

if (mapDiv) {
  startMap();
}

if (locationInput) {
  startPlaceAutocomplete();
}



// Functions
// -----------------------------------------------------------------------------
function startPlaceAutocomplete () {
  const autocomplete =
    new google.maps.places.Autocomplete(locationInput);

  autocomplete.addListener("place_changed", () => {
    const place = autocomplete.getPlace();
    console.log("User clicked on PLACE!", place);

    // set the coordinates in the form whenever the user clicks a suggestion
    const loc = place.geometry.location;
    latInput.value = loc.lat();
    longInput.value = loc.lng();
  });
}


function startMap () {
  // Draw a map centered on San Juan, Puerto Rico.
  map =
    new google.maps.Map(mapDiv, {
      zoom: 12,
      center: {
        lat: 18.3894,
        lng: -66.1305
      }
    });

  new google.maps.Marker({
    map,
    position: {
      lat: 18.3894,
      lng: -66.1305
    },
    title: "San Juan, Puerto Rico",
    animation: google.maps.Animation.DROP
  });

  new google.maps.Marker({
    map,
    position: {
      lat: 18.406,
      lng: -66.01595
    },
    title: "Carolina, Puerto Rico (birthplace of reggueton)",
    animation: google.maps.Animation.DROP
  });


  // use browser geolocation feature to get user's position
  navigator.geolocation.getCurrentPosition((result) => {
    const { latitude, longitude } = result.coords;

    // make the map show the user's location
    map.setCenter({ lat: latitude, lng: longitude });

    // draw a marker on the user's location
    new google.maps.Marker({
      map,
      position: {
        lat: latitude,
        lng: longitude
      },
      title: "Your Location",
      animation: google.maps.Animation.DROP
    });
  });
}
