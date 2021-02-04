///////////////////// MAP /////////////////////
// Geolocation
let me = [];
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
        me.push(position.coords.longitude);
        me.push(position.coords.latitude);
        
        //Printing map
        mapboxgl.accessToken = 'pk.eyJ1Ijoib2Rhc3lsdmFpbiIsImEiOiJja2txbG1kaWwwNTNmMm9wY3hzbWpoZm94In0.KqoXKfntalmfcnKaaOgxGw';

        let map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
            center: me, // starting position [lng, lat]
            zoom: 10 // starting zoom
        });

        let points = [{pos:me, text: "You are here."}, {pos:[5, 1], text: "djsfhjdf"}, {pos:[1, 40], text: "djsfhjdf"}]

        points.forEach((point) => {
            let popup = new mapboxgl.Popup({ offset: 25 }).setText(
            point.text
            );
            let marker = new mapboxgl.Marker()
            .setLngLat(point.pos)
            .setPopup(popup)
            .addTo(map);
        })
    });
  } else {
    console.log("Geolocation is not supported by this browser.");
  }
}

getLocation();