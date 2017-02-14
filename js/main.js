//leaflet turtorial quick start
var mymap = L.map('mapid').setView([0, 0], 3);

var OpenStreetMap_HOT = L.tileLayer('http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, Tiles courtesy of <a href="http://hot.openstreetmap.org/" target="_blank">Humanitarian OpenStreetMap Team</a>'
}).addTo(mymap);


$.ajax("data/elephant.json", {
		dataType: "json",
		success: function(response){
				//create marker options
				var geojsonMarkerOptions = {
						radius: 8,
						fillColor: "#ff7800",
						color: "#000",
						weight: 1,
						opacity: 1,
						fillOpacity: 0.8
				};

				//create a Leaflet GeoJSON layer and add it to the map
				L.geoJson(response, {
						pointToLayer: function (feature, latlng){
								return L.circleMarker(latlng, geojsonMarkerOptions);
						}
				}).addTo(mymap);
		}
});
