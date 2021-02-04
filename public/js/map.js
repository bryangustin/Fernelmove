///////////////////// MAP /////////////////////
const  url = "http://www.odwb.be/api"; 
const convivialite = "/records/1.0/search/?dataset=lieux-de-convivialite-fernelmont&q=" // GEO
const ecoles = "/records/1.0/search/?dataset=ecoles-de-fernelmont&q=" // GEO
const livres = "/records/1.0/search/?dataset=boites-a-livres&q=" //GEO

// Geolocation
let me = [];
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
        me.push(position.coords.longitude);
        me.push(position.coords.latitude);
        me = [4.9792, 50.5438]; // TO DELETE FOR REAL LOCALIZATION

        //Printing map

        mapboxgl.accessToken = 'pk.eyJ1Ijoib2Rhc3lsdmFpbiIsImEiOiJja2txbG1kaWwwNTNmMm9wY3hzbWpoZm94In0.KqoXKfntalmfcnKaaOgxGw';

        let geojson = {
          me: {
            geometry: {
              coordinates: me
            },
            properties: {
              title: 'You are here.',
              description: 'none'
            }
          }
        };

        fetch(url+convivialite)
        .then(response => response.json())
        .then(dataConvivialite => {

          data.records.forEach(elem => {
              let point = {};
              point.pos = [];
              point.pos.push(elem.fields.point_geocodage[1]);
              point.pos.push(elem.fields.point_geocodage[0]);
              point.text = elem.fields.remarques;

              points.push(point);
          });

          fetch(url+ecoles)
          .then(response => response.json())
          .then(dataEcoles => {

            fetch(url+livres)
            .then(response => response.json())
            .then(dataLivres => {
        
              var map = new mapboxgl.Map({
                  container: 'map',
                  style: 'mapbox://styles/mapbox/streets-v11',
                  center: me,
                  zoom: 11
              });
          
              // add markers to map
              geojson.features.forEach(function(marker) {

                // create a HTML element for each feature
                var el = document.createElement('div');
                el.className = 'markerRed';

                // make a marker for each feature and add to the map
                new mapboxgl.Marker(el)
                .setLngLat(marker.geometry.coordinates)
                .setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
                .setHTML('<h3>' + marker.properties.title + '</h3><p>' + marker.properties.description + '</p>'))
                .addTo(map);
              });
            })
          })
        })        
    });
  } else {
    console.log("Geolocation is not supported by this browser.");
  }
}

getLocation();

























            // mapboxgl.accessToken = 'pk.eyJ1Ijoib2Rhc3lsdmFpbiIsImEiOiJja2txbG1kaWwwNTNmMm9wY3hzbWpoZm94In0.KqoXKfntalmfcnKaaOgxGw';

            // let map = new mapboxgl.Map({
            //     container: 'map',
            //     style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
            //     center: me, // starting position [lng, lat] 
            //     zoom: 11 // starting zoom
            // });

            // let points = [{pos:me, text: "You are here."}];

            // data.records.forEach(elem => {
            //     let point = {};
            //     point.pos = [];
            //     point.pos.push(elem.fields.point_geocodage[1]);
            //     point.pos.push(elem.fields.point_geocodage[0]);
            //     point.text = elem.fields.remarques;

            //     points.push(point);
            // });

            // points.forEach((point) => {
            //     let popup = new mapboxgl.Popup({ offset: 25 }).setText(
            //     point.text
            //     );
            //     let marker = new mapboxgl.Marker()
            //     .setLngLat(point.pos)
            //     .setPopup(popup)
            //     .addTo(map);
            // })