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
};

//Step 3: Add circle markers for point features to the map
function createPropSymbols(data, mymap, attributes){

    //create marker options
    var geojsonMarkerOptions = {
        radius: 0,
        fillColor: "#ff7800",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    };


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

		//Example 2.1 line 1...function to convert markers to circle markers
		function pointToLayer(feature, latlng, attributes){
		    //Step 4: Assign the current attribute based on the first index of the attributes array
		    var attribute = attributes[0];
		    //check
		    console.log(attribute);

		//Example 1.2 line 13...create a Leaflet GeoJSON layer and add it to the map
	 L.geoJson(data, {
			 pointToLayer: function (feature, latlng, attributes) {

				 		var attribute = attributes[0];

				 		 console.log(attribute);

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
						 },
						 click: function(){
					$("#panel").html(popupContent);
						 }
					 });

					return layer;
			 }
	 }).addTo(mymap);

	 //Add circle markers for point features to the map
	 function createPropSymbols(data, mymap){
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



//GOAL: Allow the user to sequence through the attributes and resymbolize the map
//   according to each attribute
//STEPS:
//1. Create slider widget
//2. Create skip buttons
//3. Create an array of the sequential attributes to keep track of their order
//4. Assign the current attribute based on the index of the attributes array
//5. Listen for user input via affordances
//6. For a forward step through the sequence, increment the attributes array index;
//   for a reverse step, decrement the attributes array index
//7. At either end of the sequence, return to the opposite end of the seqence on the next step
//   (wrap around)
//8. Update the slider position based on the new index
//9. Reassign the current attribute based on the new attributes array index
//10. Resize proportional symbols according to each feature's value for the new attribute

//Step 1: Create new sequence controls
function createSequenceControls(mymap){
    //create range input element (slider)
    $('#panel').append('<input class="range-slider" type="range">');
		//set slider attributes
    $('.range-slider').attr({
        max: 6,
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
};


//Import GeoJSON data
function getData(mymap){
    //load the data
    $.ajax("data/elephant.json", {
        dataType: "json",
        success: function(response){

				 var attributes = processData(response);

            createPropSymbols(response, mymap, attributes);
            createSequenceControls(mymap, attributes);

        }
    });
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

     return attributes;
 };

//  //Example 2.1 line 1...function to convert markers to circle markers
//  function pointToLayer(feature, latlng, attributes){
//      //Step 4: Assign the current attribute based on the first index of the attributes array
//      var attribute = attributes[0];
//      //check
//      console.log(attributes);
};

$(document).ready(createMap);
//Example 1.2 line 1...Step 3: Add circle markers for point features to the map
//function createPropSymbols(data){

    //Step 4: Determine which attribute to visualize with proportional symbols
//    var attribute = "2014";
//}

//5th operator easiest is overlay, just need 2nd data set, moderate is filter, reexpress, resymbolize, difficult wouldb
