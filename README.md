# Leaflet-challenge 

The United States Geological Survey, or USGS for short, is responsible for providing scientific data about natural hazards, the health of our ecosystems and environment, and the impacts of climate and land-use change. Their scientists develop new methods and tools to supply timely, relevant, and useful information about the Earth and its processes.

The USGS is interested in building a new set of tools that will allow them to visualize their earthquake data. They collect a massive amount of data from all over the world each day, but they lack a meaningful way of displaying it. In this challenge, you have been tasked with developing a way to visualize USGS data that will allow them to better educate the public and other government organizations (and hopefully secure more funding) on issues facing our planet.

# Gather GeoJson Data from USGS
The USGS provides earthquake dat in a number of different formats, updated every 5 minutes. Data sets can be found here: https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php
For this project, I chose to use data that will show us weekly earthquake data. Using the URL for these Json data set, I was able to pull in the data for the visualization using JavaScript.

The URL that was used: 
https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson

# Import and Visualize the Data
- Using Leaflet and JavaScript, I created a map that plots all the earthquakes in the dataset based on their longitude and latitude.
- Data markers reflect the magnitude of the earthquake by their size and the depth of the earthquake by color. The deeper the quake, the darker the color.
- Popups are included to provide additional information about each quake when the marker is clicked. The information that appears include: place, time, and magnitude.
- A legend is provided to provided the depth of each quake by the color of it's marker.


Here is an image of the street map view


![StreetMapViewPopups](https://github.com/SheTroxel/leaflet-challenge/blob/main/Leaflet-Part-1/map_image_popup.png) 



Here is an image of the topographical map view

![TopoMapPopup](https://github.com/SheTroxel/leaflet-challenge/blob/main/Leaflet-Part-1/topo_map_popup.png)
