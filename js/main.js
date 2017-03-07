//leaflet turtorial quick start

function createMap(){
	var mymap = L.map('mapid').setView([30, 0], 2);

	var Stamen_TerrainBackground = L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/toner-background/{z}/{x}/{y}.{ext}', {
		attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> & Film data by <a href="http://data.uis.unesco.org/index.aspx?queryid=60&lang=en">USI.stat</a>',
		subdomains: 'abcd',
		minZoom: 2,
		maxZoom: 4,
		ext: 'png'
	}).addTo(mymap);

	// var OpenStreetMap_Mapnik = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	// 	maxZoom: 19,
	// 	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
	// }).addTo(mymap);

	getData(mymap);   ////http://data.uis.unesco.org/index.aspx?queryid=60&lang=en
}


//calculate the radius of each proportional symbol
function calcPropRadius(attValue) {
		//scale factor to adjust symbol size evenly
		var scaleFactor = 3;
		//area based on attribute value and scale factor
		var area = attValue * scaleFactor;
		//radius calculated based on area
		var radius = Math.sqrt(area/Math.PI);

		return radius;
};


function createPopup(properties, attribute, layer, radius){
    //add city to popup content string
    var popupContent = "<p><b>Country</b> " + properties.Country + "</p>";

    //add formatted attribute to panel content string
    var year = attribute.split("_")[1];
    popupContent += "<p><b>Production in " + year + "</b> " + properties[attribute] + " Films</p>";

    //replace the layer popup
    layer.bindPopup(popupContent, {
        offset: new L.Point(0,-radius)
    });
		console.log(popupContent);
};

//Example 1.2 line 1...Popup constructor function
function Popup(properties, attribute, layer, radius){
    this.properties = properties;
    this.attribute = attribute;
    this.layer = layer;
    this.year = attribute.split("_")[1];
    this.population = this.properties[attribute];
    this.content = "<p><b>Country</b> " + this.properties.Country + "</p><p><b>Production in " + this.year + "</b> " + this.population + " Films</p>";

    this.bindToLayer = function(){
        this.layer.bindPopup(this.content, {
            offset: new L.Point(0,-radius)
        	});
    };
};



//Example 2.1 line 1...function to convert markers to circle markers
function pointToLayer(feature, latlng, attributes){
    //Step 4: Assign the current attribute based on the first index of the attributes array
    var attribute = attributes[0];
    //check
    //console.log(attribute);

// //Step 3: Add circle markers for point features to the map
// function createPropSymbols(data, mymap, attributes){
    //create marker options
    var geojsonMarkerOptions = {
        radius: 0,
        fillColor: "#E2B227",
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


					 createPopup(feature.properties, attribute, layer, geojsonMarkerOptions.radius);

					 //create new popup
					 var popup = new Popup(feature.properties, attribute, layer, geojsonMarkerOptions.radius);
					 //create another popup based on the first
					//  var popup2 = Object.create(popup);
					 //
					//  //change the content
					//  popup.content = "<h2>" + popup.population + " Films</h2>";
					//  popup2.content = "<h2>" + popup.population + " million</h2>";
					 //
					//  //add popup to circle marker
					//  popup.bindToLayer();
					//  //add popup to circle marker
					//  popup2.bindToLayer();



//console.log(popup.content) //original popup content

					 //build popup content string
				  //  var popupContent = "<p><b>Country:</b> " + feature.properties.Country + "</p>";
					 //
					//  //add formatted attribute to popup content string
				  //  var year = attribute.split("_")[1];
				  //  popupContent += "<p><b>Production in " + year + ":</b> " + feature.properties[attribute] + " films</p>";

				   //bind the popup to the circle marker
				   //layer.bindPopup(popupContent);

			     //return the circle marker to the L.geoJson pointToLayer option
			     //return layer;

					 //Example 2.1 line 27...bind the popup to the circle marker
					 //layer.bindPopup(popupContent);

					//  layer.bindPopup(popupContent, {
					 //  offset: new L.Point(0,-geojsonMarkerOptions.radius)
					 layer.on({
						 mouseover: function(){
							 this.openPopup();
						 },
						 mouseout: function(){
							 this.closePopup();
						 }
					 });
		return layer;


					 //event listeners to open popup on hover
				//,
				//		 click: function(){
				//	$("#panel").html(popupContent);
					//	 }
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
						 //console.log(attributes);
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

	  createLegend(mymap, attributes);
};

//Step 10: Resize proportional symbols according to new attribute values
function updatePropSymbols(mymap, attribute){
    mymap.eachLayer(function(layer){
        if (layer.feature && layer.feature.properties[attribute]){
            //update the layer style and popup
						//access feature properties
				var props = layer.feature.properties;

				//update each feature's radius based on new attribute values
				var radius = calcPropRadius(props[attribute]);
				layer.setRadius(radius);



				createPopup(props, attribute, layer, radius);
				var popup = new Popup(props, attribute, layer, radius);
				//add popup to circle marker
				popup.bindToLayer();

				updateLegend(mymap, attribute);

				//add city to popup content string
				// var popupContent = "<p><b>Country:</b> " + props.Country + "</p>";
				//
				// //add formatted attribute to panel content string
				// var year = attribute.split("_")[1];
				// popupContent += "<p><b>Production in " + year + ":</b> " + props[attribute] + " films</p>";
				//
				// //replace the layer popup
				// layer.bindPopup(popupContent, {
				// 		offset: new L.Point(0,-radius)

					};
				});

};


function createLegend(mymap, attribute){
	    	var LegendControl = L.Control.extend({
			  	options: {
						position: 'bottomright'
				},

				onAdd: function (mymap) {
						// create the control container with a particular class name
						var container = L.DomUtil.create('div', 'legend-control-container');

						//PUT YOUR SCRIPT TO CREATE THE TEMPORAL LEGEND HERE
						$(container).append('<div id="temporal-legend">');
						//$(container).append(attributes);

						//Step 1: start attribute legend svg string
            var svg = '<svg id="attribute-legend" width="180px" height="180px">';

						//array of circle names to base loop on

						//object to base loop on...replaces Example 3.10 line 1
						var circles = {
								max: -30,
								mean: 0,
								min: 30
						};

						//loop to add each circle and text to svg string
						for (var circle in circles){
								//circle string
								svg += '<circle class="legend-circle" id="' + circle + '" fill="#E2B227" fill-opacity="0.8" stroke="#000000" cx="55"/>';

						//text string
		        svg += '<text id="' + circle + '-text" x="120" y="' + (circles[circle] + 60) + '"></text>';
        		// var circles = ["max", "mean", "min"];
						//
		        // //Step 2: loop to add each circle and text to svg string
		        // for (var i=0; i<circles.length; i++){
            // //circle string
            // svg += '<circle class="legend-circle" id="' + circles[i] +
            // '" fill="#F47821" fill-opacity="0.8" stroke="#000000" cx="50"/>';
						//
						//text string
            //svg += '<text id="' + circles[i] + '-text" x="65" y="60"></text>';
        		};

		        //close svg string
		        svg += "</svg>";


            //add attribute legend svg to container
            $(container).append(svg);


						return container;
				}
		});



		mymap.addControl(new LegendControl());

		updateLegend(mymap, attribute[0]);

};


//Calculate the max, mean, and min values for a given attribute
function getCircleValues(map, attributes){
    //start with min at highest possible and max at lowest possible number
    var min = Infinity,
        max = -Infinity;

    map.eachLayer(function(layer){
        //get the attribute value
        if (layer.feature){
            var attributeValue = Number(layer.feature.properties[attributes]);

            //test for min
            if (attributeValue < min){
                min = attributeValue;
            };

            //test for max
            if (attributeValue > max){
                max = attributeValue;
            };
        };
    });

    //set mean
    var mean = (max + min) / 2;

    //return values as an object
    return {
        max: max,
        mean: mean,
        min: min
    };
};


//Update the legend with new attribute
function updateLegend(mymap, attribute){
    //create content for legend
    var year = attribute.split("_")[1];
    var content = "Film Production in " + year;

    //replace legend content
    $('#temporal-legend').html(content);

		// console.log(attribute.split("_"));
		// console.log(year);

		//get the max, mean, and min values as an object
	 	var circleValues = getCircleValues(mymap, attribute);

		for (var key in circleValues){
			 //get the radius
			 var radius = calcPropRadius(circleValues[key]);

			 //Step 3: assign the cy and r attributes
			 $('#'+key).attr({
					 cy: 90 - radius,
					 r: radius
			 });
			 //Step 4: add legend text
        $('#'+key+'-text').text(Math.round(circleValues[key]*100)/100 + "")
		 };
};


//Step 1: Create new sequence controls
function createSequenceControls(mymap, attributes){

	var SequenceControl = L.Control.extend({
			options: {
					position: 'bottomleft'
			},

			onAdd: function (mymap) {
					// create the control container div with a particular class name
					var container = L.DomUtil.create('div', 'sequence-control-container');

					//kill any mouse event listeners on the map
					 $(container).on('mousedown', function(e){
							 L.DomEvent.stopPropagation(e);
					 });
					 $(container).on('dblclick', function(e){
							L.DomEvent.stopPropagation(e);
					 });
					 $(container).on('onclick', function(e){
						 L.DomEvent.stopPropagation(e);
			  	 });
				   $(container).on('ondrag', function(e){
						L.DomEvent.stopPropagation(e);
					 });
					//create range input element (slider)
          $(container).append('<input class="range-slider" type="range">');
					//add skip buttons
				  $(container).append('<button class="skip" id="reverse" title="Reverse">Reverse</button>');
					$(container).append('<button class="skip" id="forward" title="Forward">Skip</button>');

					// ... initialize other DOM elements, add listeners, etc.

					return container;
			}
	});

	mymap.addControl(new SequenceControl());

		//
    // //create range input element (slider)
    // $('#panel').append('<input class="range-slider" type="range">');
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
