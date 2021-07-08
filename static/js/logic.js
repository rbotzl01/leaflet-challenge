
//data source for earthquake data
var earthquake_url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

//set starting latitude and longitude of map
var myMap = L.map("mapid", {
    center: [34.0754, -84.2941],
    zoom: 2
});

//create layer to map
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagnitudeery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: API_KEY
}).addTo(myMap);

//set color scale
function getColor(magnitude) {
    var circleColor = "006b3c";
    if (magnitude > 90) {
        circleColor = "#e32636";
    }
    else if (magnitude > 70) {
        circleColor = "#ed872d";
    }
    else if (magnitude > 50) {
        circleColor = "#ffbf00";
    }
    else if (magnitude > 30) {
        circleColor = "#fdee00";
    }   
    else if (magnitude > 10) {
        circleColor = "#66ff00";
    }
    return circleColor;
}
d3.json(earthquake_url).then(data => {
    L.geoJSON(data, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, {
                radius: feature.properties.mag*2,
                fillColor: getColor(feature.geometry.coordinates[2]),
                color: "",
                weight: 1
            });
        },
            onEachFeature: function(feature, layer) {
                layer.bindPopup(`${feature.properties.place}<br>Magnitude: ${feature.properties.mag}<br>${new Date(feature.properties.time)}`);
            }
        }).addTo(myMap)

        var legend = L.control({ position: "bottomright" });
            legend.onAdd = function() {
            var div = L.DomUtil.create("div", "info legend");
            var limits = ["-10-10", "10-30", "30-50", "50-70", "70-90", ">90"];
            var colors = ["006b3c", "#66ff00", "#fdee00", "#ffbf00", "#ed872d", "e32636"];
            var labels = [];

            limits.forEach(function(limit, index) {
                labels.push("<i style=\"background-color: " + colors[index] + "\"></i>" + limit+ "<br>");
              });
          
              div.innerHTML += labels.join("");
              return div;
            };

          // Adding legend to the map
             legend.addTo(myMap);
        }).catch(function(error) {
    console.log(error);
        });