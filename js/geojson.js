// //leaflet turtorial quick start
var mymap = L.map('mapid').setView([0, 0], 13);

var OpenStreetMap_HOT = L.tileLayer('http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
	maxZoom: 2,
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, Tiles courtesy of <a href="http://hot.openstreetmap.org/" target="_blank">Humanitarian OpenStreetMap Team</a>'
}).addTo(mymap);



//load the data...Example 2.3 line 22
// $.ajax("data/MegaCities.geojson", {
// 		dataType: "json",
// 		success: function(response){
// 				//create a Leaflet GeoJSON layer and add it to the map
// 				L.geoJson(response).addTo(mymap);
// 				//console.log(response);
// 		}
// });
	//console.log(mymap);

/* Map of GeoJSON data from MegaCities.json */

//function to instantiate the Leaflet map
function createMap(){
    //create the map
    var mymap = L.map('map', {
        center: [20, 0],
        zoom: 2
    });


    //add OSM base tilelayer
		L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
	}).addTo(mymap);

    //call getData function
    getData(mymap);
};

// //function to retrieve the data and place it on the map
// function getData(mymap){
//     //load the data
//     $.ajax("MegaCities.geojson", {
//         dataType: "json",
//         success: function(response){
//
//             //create a Leaflet GeoJSON layer and add it to the map
//             L.geoJson(response).addTo(mymap);
//         }
//     });
// };
//
// $(document).ready(createMap);



//Example 2.3 line 22...load the data
$.ajax("data/MegaCities.geojson", {
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


// //added at Example 2.3 line 20...function to attach popups to each mapped feature
// function onEachFeature(feature, layer) {
//     //no property named popupContent; instead, create html string with all properties
//     var popupContent = "";
//     if (feature.properties) {
//         //loop to add feature property names and values to html string
//         for (var property in feature.properties){
//             popupContent += "<p>" + property + ": " + feature.properties[property] + "</p>";
//         }
//         layer.bindPopup(popupContent);
//     };
// };
//
// //function to retrieve the data and place it on the map
// function getData(map){
//     //load the data
//     $.ajax("data/MegaCities.geojson", {
//         dataType: "json",
//         success: function(response){
//
//             //create a Leaflet GeoJSON layer and add it to the map
//             L.geoJson(response, {
//                 onEachFeature: onEachFeature
//             }).addTo(mymap);
//         }
//     });
// };
//
// //Example 2.3 line 22...load the data
// $.ajax("data/MegaCities.geojson", {
// 		dataType: "json",
// 		success: function(response){
//
// 				//create a Leaflet GeoJSON layer and add it to the map
// 				L.geoJson(response, {
// 						//use filter function to only show cities with 2015 populations greater than 20 million
// 						filter: function(feature, layer) {
// 								return feature.properties.Pop_2015 > 20;
// 						}
// 				}).addTo(mymap);
// 		}
// });
