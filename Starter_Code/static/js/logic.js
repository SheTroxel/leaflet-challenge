// Store our API endpoint as a QueryURL: "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
  console.log(data);
  createFeatures(data.features);
});

// Set color schema for depth/markers
let color = {
  level1: '#1feb35',
  level2: '#00dc5e',
  level3: '#00ae92',
  level4: '#00b98b',
  level5: '#00a695',
  level6: '#009398'

}
//console.log(color)

 // Define function that we want to run for each feature in the features array
function createFeatures(earthquakeData) {
  // Create a popup layer that describes the place, time and magnitude of the quake
  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p><br><h2> Magnitude:${feature.properties.mag}</h2>`);
  }

// Set marker variables for latitude, longitude, depth and magnitude

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
  
  // add magMarkers to magMarkers array
  magMarkers.push(magMarker); 
}
// Create our map, giving it the streetmap and earthquakes layers to display on load.
var myMap = L.map("map", {
  center: [37.09, -95.71],
  zoom: 5,
  });

//create title layer
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(myMap);

// Create street view and topographic map tile layers
var streetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});

var topoMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
  maxZoom: 17,
  attribution: '&copy; <a href="https://opentopomap.org/about">OpenTopoMap</a>'
});

// Create an object to hold the base layers
var baseMaps = {
  "Street Map": streetMap,
  "Topographic Map": topoMap
};

// Create an overlay layer for the earthquake markers
var earthquakeLayer = L.layerGroup(magMarkers);

// Create an object to hold the overlay layers
var overlayMaps = {
  "Earthquakes": earthquakeLayer
};

// Create the map with streetMap as the default tile layer
var myMap = L.map("map", {
  center: [37.09, -95.71],
  zoom: 5,
  layers: [streetMap, earthquakeLayer] // Add streetMap and earthquakeLayer as default layers
});

// Add the layer control to the map
L.control.layers(baseMaps, overlayMaps).addTo(myMap);

// Create a legend
var legend = L.control({ position: "bottomright" });

legend.onAdd = function (map) {
  var div = L.DomUtil.create("div", "info legend");
  var depthLevels = [-10, 10, 20, 40, 60, 80, 100];
  var labels = [];

  div.innerHTML += "<h4>Depth (km)</h4>"; // Add legend title

  // Generate labels for the legend based on depth levels and color schema
  for (var i = 0; i < depthLevels.length; i++) { // Update this line to iterate from 0 to 7
    div.innerHTML +=
      '<i style="background:' + getColor(depthLevels[i] + 1) + '"></i> ' +
      depthLevels[i] + (depthLevels[i + 1] ? '&ndash;' + depthLevels[i + 1] + '<br>' : '+');
  }

  return div;
};

// Add the legend to the map
legend.addTo(myMap)