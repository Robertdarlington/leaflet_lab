//leaflet turtorial quick start

function createMap(){
	var mymap = L.map('mapid').setView([-5, 20], 4);

	var Stamen_TerrainBackground = L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/terrain-background/{z}/{x}/{y}.{ext}', {
		attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
		subdomains: 'abcd',
		minZoom: 0,
		maxZoom: 18,
		ext: 'png'
	}).addTo(mymap);

	getData(mymap);
}

//Step 3: Add circle markers for point features to the map
function createPropSymbols(data, mymap){
    //create marker options
    var geojsonMarkerOptions = {
        radius: 0,
        fillColor: "#ff7800",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    };


    //create a Leaflet GeoJSON layer and add it to the map
    L.geoJson(data, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, geojsonMarkerOptions);
        }
    }).addTo(mymap);

		var attribute = "2014";

		//calculate the radius of each proportional symbol
		function calcPropRadius(attValue) {
		    //scale factor to adjust symbol size evenly
		    var scaleFactor = .07;
		    //area based on attribute value and scale factor
		    var area = attValue * scaleFactor;
		    //radius calculated based on area
		    var radius = Math.sqrt(area/Math.PI);

		    return radius;
		};


		//Example 1.2 line 13...create a Leaflet GeoJSON layer and add it to the map
	 L.geoJson(data, {
			 pointToLayer: function (feature, latlng) {
					 //Step 5: For each feature, determine its value for the selected attribute
					 var attValue = Number(feature.properties[attribute]);

					 //examine the attribute value to check that it is correct

					geojsonMarkerOptions.radius = calcPropRadius(attValue);

					 //create circle markers
					 var layer = L.circleMarker(latlng, geojsonMarkerOptions);

					 //build popup content string
				   var popupContent = "<p><b>Area:</b> " + feature.properties.Country + "</p><p><b>" + attribute + ":</b> " + feature.properties[attribute] + "</p>";

					 //add formatted attribute to popup content string
				   //var year = attribute.split("_")[1];
				   //popupContent += "<p><b>Population in " + year + ":</b> " + feature.properties[attribute] + " million</p>";

				   //bind the popup to the circle marker
				   layer.bindPopup(popupContent);

			     //return the circle marker to the L.geoJson pointToLayer option
			     return layer;

			 }
	 }).addTo(mymap);

	 //Add circle markers for point features to the map
	 function createPropSymbols(data, map){
	     //create a Leaflet GeoJSON layer and add it to the map
	     L.geoJson(data, {
	         pointToLayer: pointToLayer
	     }).addTo(mymap);
		 }
};

//Step 2: Import GeoJSON data
function getData(mymap){
    //load the data
    $.ajax("data/elephant.json", {
        dataType: "json",
        success: function(response){
            //call function to create proportional symbols
            createPropSymbols(response, mymap);
        }
    });
};




$(document).ready(createMap);
//Example 1.2 line 1...Step 3: Add circle markers for point features to the map
//function createPropSymbols(data){

    //Step 4: Determine which attribute to visualize with proportional symbols
//    var attribute = "2014";
//}

//5th operator easiest is overlay, just need 2nd data set, moderate is filter, reexpress, resymbolize, difficult wouldb
