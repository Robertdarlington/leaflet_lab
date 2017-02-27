//leaflet turtorial quick start

function createMap(){
	var mymap = L.map('mapid').setView([20, 0], 2);

	var Stamen_TerrainBackground = L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/toner-background/{z}/{x}/{y}.{ext}', {
		attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
		subdomains: 'abcd',
		minZoom: 2,
		maxZoom: 5,
		ext: 'png'
	}).addTo(mymap);

	getData(mymap);
}


//calculate the radius of each proportional symbol
function calcPropRadius(attValue) {
		//scale factor to adjust symbol size evenly
		var scaleFactor = 5;
		//area based on attribute value and scale factor
		var area = attValue * scaleFactor;
		//radius calculated based on area
		var radius = Math.sqrt(area/Math.PI);

		return radius;
};

//Example 2.1 line 1...function to convert markers to circle markers
function pointToLayer(feature, latlng, attributes){
    //Step 4: Assign the current attribute based on the first index of the attributes array
    var attribute = attributes[0];
    //check
    console.log(attribute);

// //Step 3: Add circle markers for point features to the map
// function createPropSymbols(data, mymap, attributes){
    //create marker options
    var geojsonMarkerOptions = {
        radius: 0,
        fillColor: "#ff7800",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: .8
    };

		//var attribute = "Pop_2014";

		//Example 1.2 line 13...create a Leaflet GeoJSON layer and add it to the map
	//  L.geoJson(data, {
	// 		 pointToLayer: function (feature, latlng) {
					 //Step 5: For each feature, determine its value for the selected attribute
					 var attValue = Number(feature.properties[attribute]);


					 //examine the attribute value to check that it is correct

					geojsonMarkerOptions.radius = calcPropRadius(attValue);

					 //create circle markers
					 var layer = L.circleMarker(latlng, geojsonMarkerOptions);

					 //build popup content string
				   var popupContent = "<p><b>Country:</b> " + feature.properties.Country + "</p>";

					 //add formatted attribute to popup content string
				   var year = attribute.split("_")[1];
				   popupContent += "<p><b>Production in " + year + ":</b> " + feature.properties[attribute] + " films</p>";

				   //bind the popup to the circle marker
				   //layer.bindPopup(popupContent);

			     //return the circle marker to the L.geoJson pointToLayer option
			     //return layer;

					 //Example 2.1 line 27...bind the popup to the circle marker
					 //layer.bindPopup(popupContent);

					 layer.bindPopup(popupContent, {
			 		 offset: new L.Point(0,-geojsonMarkerOptions.radius)

	 				});


				// //original popupContent changed to panelContent...Example 2.2 line 1
				// var panelContent = "<p><b>Country:</b> " + feature.properties.Country + "</p>";
				//
				// //add formatted attribute to panel content string
				// var year = attribute.split("_")[1];
				// panelContent += "<p><b>Population in " + "2014" + ":</b> " + feature.properties[attribute] + " million</p>";
				//
				// //popup content is now just the city name
				// var popupContent = feature.properties.Country;
				//
				// //bind the popup to the circle marker
				// layer.bindPopup(popupContent, {
				// 		offset: new L.Point(0,-geojsonMarkerOptions.radius),
				// 		closeButton: false
				// });

					 //event listeners to open popup on hover
					 layer.on({
						 mouseover: function(){
							 this.openPopup();
						 },
						 mouseout: function(){
							 this.closePopup();
						 }//,
				//		 click: function(){
				//	$("#panel").html(popupContent);
					//	 }
					 });





console.log(popupContent);





		return layer;

	 };

//Above Example 3.8...Step 3: build an attributes array from the data
function processData(data){
			 //empty array to hold attributes
			 var attributes = [];

			 //properties of the first feature in the dataset
			 var properties = data.features[0].properties;

			 //push each attribute name into attributes array
			 for (var attribute in properties){
					 //only take attributes with population values
					 if (attribute.indexOf("Pop") > -1){
							 attributes.push(attribute);
					 };
			 };
			       //check result
						 console.log(attributes);
			      //console.log(properties);

			      return attributes;


};

//Add circle markers for point features to the map
function createPropSymbols(data, mymap, attributes){
	     //create a Leaflet GeoJSON layer and add it to the map
	     var symbol = L.geoJson(data, {
				 pointToLayer: function(feature, latlng){
		 return pointToLayer(feature, latlng, attributes);
	 }
 }).addTo(mymap);





 var searchControl = new L.Control.Search({layer: symbol, propertyName: 'Country', circleLocation:false});
	searchControl.on('search_locationfound', function(e) {
	e.layer.setStyle({fillColor: 'white', color: 'white', fillOpacity: 0.5});
	//map.fitBounds(e.layer.getBounds());
	if(e.layer._popup);
	e.layer.openPopup();
	}).on('search_collapsed', function(e) {
	symbol.eachLayer(function(layer) {
	symbol.resetStyle(layer);
	});
 });

 mymap.addControl( searchControl ); //inizialize search control

};

//Step 10: Resize proportional symbols according to new attribute values
function updatePropSymbols(map, attribute){
    map.eachLayer(function(layer){
        if (layer.feature && layer.feature.properties[attribute]){
            //update the layer style and popup
						//access feature properties
				var props = layer.feature.properties;

				//update each feature's radius based on new attribute values
				var radius = calcPropRadius(props[attribute]);
				layer.setRadius(radius);

				//add city to popup content string
				var popupContent = "<p><b>Country:</b> " + props.Country + "</p>";

				//add formatted attribute to panel content string
				var year = attribute.split("_")[1];
				popupContent += "<p><b>Production in " + year + ":</b> " + props[attribute] + " films</p>";

				//replace the layer popup
				layer.bindPopup(popupContent, {
						offset: new L.Point(0,-radius)
					});
				};
			});
};


//Step 1: Create new sequence controls
function createSequenceControls(mymap, attributes){
    //create range input element (slider)
    $('#panel').append('<input class="range-slider" type="range">');
		//set slider attributes
    $('.range-slider').attr({
        max: 8,
        min: 0,
        value: 0,
        step: 1
    });

		//below Example 3.4...add skip buttons
		$('#panel').append('<button class="skip" id="reverse">Reverse</button>');
		$('#panel').append('<button class="skip" id="forward">Skip</button>');
		//Below Example 3.5...replace button content with images
		$('#reverse').html('<img src="img/arrow_reverse.png">');
		$('#forward').html('<img src="img/arrow_forward.png">');

		//Below Example 3.6 in createSequenceControls()
		//Step 5: click listener for buttons
		$('.skip').click(function(){
				//sequence
				//get the old index value
		var index = $('.range-slider').val();

		//Step 6: increment or decrement depending on button clicked
			 if ($(this).attr('id') == 'forward'){
					 index++;
					 //Step 7: if past the last attribute, wrap around to first attribute
					 index = index > 8 ? 0 : index;
			 } else if ($(this).attr('id') == 'reverse'){
					 index--;
					 //Step 7: if past the first attribute, wrap around to last attribute
					 index = index < 0 ? 8 : index;
			 };
			 //Step 8: update slider
			 $('.range-slider').val(index);
			 //Step 9: pass new attribute to update symbols
			 updatePropSymbols(mymap, attributes[index]);
	 });

		//Step 5: input listener for slider
		$('.range-slider').on('input', function(){
				//sequence
				var index = $(this).val();

				//Called in both skip button and slider event listener handlers
				//Step 9: pass new attribute to update symbols
				updatePropSymbols(mymap, attributes[index]);
		});
};




//Import GeoJSON data
function getData(mymap){
    //load the data
    $.ajax("data/film_prod.json", {
        dataType: "json",
        success: function(response){

				 var attributes = processData(response);

            createPropSymbols(response, mymap, attributes);
            createSequenceControls(mymap, attributes);
        }
    });
};



$(document).ready(createMap);
