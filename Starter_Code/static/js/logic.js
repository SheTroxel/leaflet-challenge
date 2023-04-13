// Store our API endpoint as a QueryURL: "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
  console.log.data
  createFeatures(data.features);
});

// Set color schema for depth/markers
let color = {
  level1: '#1feb35',
  level2: '#00ce74',
  level3: '#00ae92',
  level4: '#008c96',
  level5: '##008c96',
  level6: '#2a4858'

}
//console.log(color)

 // Define function that we want to run for each feature in the features array
function createFeatures(earthquakeData) {
  // Create a popup layer that describes the place, time and magnitude of the quake
  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p><br><h2> Magnitude:${feature.properties.mag}</h2>`);
  }

// Set variables for latitude, longitude, depth and magnitude
var latitude= [];
var longitude=[];
var depth=[];
var magnitude=[];
var magMarkers = []; //create an array to store magMarkers

for (var i = 0; i < earthquakeData.length; i++) { // Use earthquakeData.length
  latitude = earthquakeData[i].geometry.coordinates[1];
  longitude = earthquakeData[i].geometry.coordinates[0];
  depth = earthquakeData[i].geometry.coordinates[2];
  magnitude = earthquakeData[i].properties.mag;
  
 // console.log(latitude, longitude, depth, magnitude)


  // set ranges and color values for marker layer to demonstrate the depth of each earthquake
  var depthColor;
  if (depth > 100) {
    depthColor = color.level6;
  } else if (depth > 80) {
    depthColor = color.level5;
  } else if (depth > 60) {
    depthColor = color.level4;
  } else if (depth > 40) {
    depthColor = color.level3;
  } else if (depth > 20) {
    depthColor = color.level2;
  } else {
    depthColor = color.level1;
  }
//console.log(depthColor)

  // The radius of each circle will be based on the size of the magnitude. 
  // Larger earthquakes will have a higher radius than smaller earthquakes.
  // Fill color will be based on depth.
  var magMarker = L.circle([latitude, longitude], {
    radius: magnitude ** 2,
    color: null, // set to null to remove border color
    stroke: true, // use stroke instead of border
    fillColor: depthColor,
    fillOpacity: 1,
    weight: 1
  });

  magMarkers.push(magMarker); // add magMarkers to magMarkers array
}
//console.log(magMarker)
L.layerGroup(magMarkers).addTo(myMap); // create a layer group from magMarkers and add it to the map
}

// Set the legend to appear in the bottom right of our map//
var legend = L.control({
  position: 'bottomright'
});

// Adding on the legend based off the color scheme we have //
legend.onAdd = function (map) {
  var div = L.DomUtil.create('div', 'legend');
  var levels = ['>1', '1-2', '2-3', '3-4', '4-5', '5+'];
  var colors = ['#1feb35', '#00ce74', '#00ae92','#008c96','##008c96','#2a4858];
  
  for (var i = 0; i < levels.length; i++) {
      div.innerHTML += '<i style="background:' + colors[i] + '"></i>' + levels[i] + '<br>';
  }
  return div;
}
console.log(legend)

// Create our map, giving it the streetmap and earthquakes layers to display on load.
var myMap = L.map("map", {
  setView: [
    37.09, -95.71
  ],
  zoom: 5,
  });

  // Create title layer
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// Create the base layers.
var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
})

var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});

// Create a baseMaps object.
var baseMaps = {
  "Street Map": street,
  "Topographic Map": topo
};//


// add layer to my Map
L.control.layers(baseMaps).addTo(myMap);
//console log to confirm code is working
console.log(baseMaps)



