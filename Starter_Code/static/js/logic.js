// weekly earthquake summary API as a QueryURL: "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
const queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
  console.log(data);

   // Define function that we want to run for each feature in the features array
   createFeatures(data.features);
  });

 // Define create features function 
function createFeatures(earthquakeData) {
  
  // Define each point from geoJson to appear on map
  function onEachFeature(feature, layer) {
    
    // Create a popup layer that describes the place, time and magnitude of the quake
    layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}<br>Magnitude:${feature.properties.mag}</p>`);
  };

  //Define marker appearance. 
  //The radius of each circle will be based on the size of the magnitude. 
  // Larger earthquakes will have a higher radius than smaller earthquakes.
  // Fill color will be based on depth.

  function createMarker(feature, latlng){
    let options = {
    radius: feature.properties.mag * 11000,
    color: markerColor((feature.geometry.coordinates[2])),
    fillColor: markerColor((feature.geometry.coordinates[2])),
    fillOpacity: 1,
    weight: 3
    };
      return L.circle(latlng, options);
  };

  let earthquakes = L.geoJson(earthquakeData,{
    onEachFeature: onEachFeature,
    pointToLayer: createMarker

  });
  // Add earthquakes layer to map
  createMap(earthquakes);

  //set ranges and color values for marker layer to demonstrate the depth of each earthquake
  function markerColor(depth){
    switch(true) {
      case depth > 200:
        return '##3c0f59';
      case depth > 100:
        return '#7b1fa2';
      case depth > 75:
        return '#d40d12';
      case depth > 50:
        return '#d23600';
      case depth > 25:
        return '#ff6600';
      default:
        return '#ff8c00'
      };
    };
};

// Create colors for legend
function getColor(d) {
  return  d > 200 ? '#3c0f59':
          d > 100 ? '#7b1fa2':
          d> 75 ? '#d40d12': 
          d > 50 ? '#d23600':
          d > 25 ? '#ff6600':
                  '#ff8c00'; 

}

// Create a legend
var legend = L.control({ position: "bottomleft" });

legend.onAdd = function(map) {
  var div = L.DomUtil.create("div", "info legend");
  var grades = [0, 25, 50, 75, 100, 200];
  var labels = [];
  
  let legendData= "<h4> USGS All Earthquakes, Past Week <br /> Depth of Earthquake(km): </hr>" + "</div>";

  div.innerHTML = legendData;
  
  // Loop and push information to legend
  for (var i= 0; i < grades.length; i++) {
    div.innerHTML += 
    '<i style="background: '+ getColor(grades[i]+1) + '"></i> ' + 
    grades[i] + (grades [i +1] ? '&ndash;' + grades[i + 1] + '<br>' : '+')
  
  };

    return div; 
};



  

//Create our map, giving it the streetmap and earthquakes layers
function createMap(earthquakes){
   
  // Create street view and topographic map tile layers
  let streetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});
  // Create topoMap
  let topoMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});
  
  //Create an object to hold the base layers
  let baseMaps = {
    "Street Map": streetMap,
    "Topographic Map": topoMap
  };
    
  // Create an object to hold the overlay layers
  let overlayMaps = {
    "Earthquakes": earthquakes
  };

  // Create the map 
  let myMap = L.map("map", {
  center: [37.09, -95.71],
  zoom: 5,
  layers: [streetMap, earthquakes] 
  });


  // Add layers to map
  L.control.layers(baseMaps, overlayMaps, {collapsed: false}).addTo(myMap);
  // Add legend to myMap
  legend.addTo(myMap);
};