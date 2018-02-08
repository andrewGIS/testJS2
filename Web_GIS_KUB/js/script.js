//Идентификация объектов на карте
require([
	"esri/config", "esri/map", "esri/layers/ArcGISTiledMapServiceLayer", "esri/layers/ArcGISDynamicMapServiceLayer", "esri/layers/WebTiledLayer", "esri/layers/FeatureLayer", "esri/layers/ArcGISImageServiceLayer", "esri/layers/ImageParameters", "esri/layers/RasterLayer",
	"esri/SpatialReference", "esri/geometry/Extent", "esri/geometry/webMercatorUtils", "esri/InfoTemplate", "esri/Color", "esri/renderers/SimpleRenderer", "esri/geometry/Point",
	"esri/symbols/SimpleMarkerSymbol", "esri/symbols/SimpleFillSymbol", "esri/symbols/SimpleLineSymbol",
	"esri/tasks/query", "esri/tasks/QueryTask", "esri/tasks/RelationshipQuery", "esri/tasks/GeometryService",
	"esri/dijit/Measurement", "esri/units", "esri/dijit/LayerList", "esri/dijit/Legend", "esri/dijit/Popup", "esri/dijit/PopupTemplate", "esri/dijit/HomeButton", "esri/dijit/OverviewMap", "esri/dijit/Scalebar", 

    "esri/tasks/Geoprocessor",
    "esri/tasks/ClassBreaksDefinition", "esri/tasks/AlgorithmicColorRamp",
    "esri/tasks/GenerateRendererParameters", "esri/tasks/GenerateRendererTask",

    "esri/TimeExtent", "esri/dijit/TimeSlider",
    "dojo/_base/array",

	"dgrid/Grid",
	"dijit/registry",
	"dojo/dom-construct", "dojo/ready", "dojo/on", "dojo/dom", "dojo/dom-class", "dojo/dom-style", "dojo/_base/connect",
	"dojo/query",
	"dojo/parser",	
	"dojo/domReady!"
], function(
	esriConfig, Map, ArcGISTiledMapServiceLayer, ArcGISDynamicMapServiceLayer, WebTiledLayer, FeatureLayer, ArcGISImageServiceLayer, ImageParameters, RasterLayer,
	SpatialReference, Extent, webMercatorUtils, InfoTemplate, Color, SimpleRenderer, Point,
	SimpleMarkerSymbol, SimpleFillSymbol, SimpleLineSymbol,
	Query, QueryTask, RelationshipQuery, GeometryService,
	Measurement, Units, LayerList, Legend, Popup, PopupTemplate, HomeButton, OverviewMap, Scalebar, 
	
    Geoprocessor,
    ClassBreaksDefinition, AlgorithmicColorRamp,
    GenerateRendererParameters, GenerateRendererTask,

    TimeExtent, TimeSlider,
    arrayUtils,

    Grid,
	registry,
	domConstruct, ready, on, dom, domClass, domStyle, connect,
	query,
	parser
) {
		
	parser.parse();	
	
	var map = new Map("map",{		
		center: [57.0, 58.8],
		zoom: 7,
		logo: false
	});	
			
	var OSMMap = new WebTiledLayer("http://c.tile.openstreetmap.org/${level}/${col}/${row}.png",{
    	"copyright": 'Map data © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'});
		
	
	var RivBassLarge = new FeatureLayer("http://maps.psu.ru:8080/arcgis/rest/services/KUB/River_bassins/MapServer/1", {				
		outFields: ["*"],		
	});	

	var RivBassSmall = new FeatureLayer("http://maps.psu.ru:8080/arcgis/rest/services/KUB/River_bassins/MapServer/0", {			
		outFields: ["*"],	
	});
	
	var selectionSymbolPol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
		new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([205,10,20,1]), 2.5),
		new Color([125, 125, 125, 0.5]));	
	RivBassLarge.setSelectionSymbol(selectionSymbolPol);
	RivBassSmall.setSelectionSymbol(selectionSymbolPol);
		
	map.addLayers([OSMMap]);	
	map.addLayers([RivBassLarge, RivBassSmall]);

	on(dom.byId("next"), "click", clickNext);
	on(dom.byId("previous"), "click", clickPrevious);	
	
	on(dom.byId("InfoBut"), "click", function () {
		if (dom.byId('rightPanel').style.display == 'none') {			
			dom.byId('rightPanel').style.display = 'block';
			document.getElementById('map').style.right = '290px';			
			mapClick = map.on("click", mouseIdentObj);			
		} else {			
			dom.byId('rightPanel').style.display = 'none';
			document.getElementById('map').style.right = '40px';
			document.getElementById('rightPane').innerHTML = '';			
			mapClick.remove();
			targetLay.clearSelection();
		}
	});

	var mapClick;
	var clickPnt;
	var selectedContent;
	var selectedFeatures;
	var targetLay;
	var iNumb;
	var queryLaySelect;
	
	function clickNext(){					
		if (iNumb<selectedContent.length-1){
			targetLay.clearSelection();						
			iNumb = iNumb+1;															
			queryLaySelect = new Query();
			queryLaySelect.objectIds = [selectedContent[iNumb][1]];				
			targetLay = map.getLayer(selectedContent[iNumb][2]);								
			targetLay.selectFeatures(queryLaySelect, targetLay.SELECTION_NEW);									
			document.getElementById("rightPane").innerHTML = selectedContent[iNumb][0];												
		}					
	};		

	function clickPrevious(){		
		if (iNumb > 0){
			targetLay.clearSelection();
			iNumb = iNumb-1;				
			queryLaySelect = new Query();
			queryLaySelect.objectIds = [selectedContent[iNumb][1]];			
			targetLay = map.getLayer(selectedContent[iNumb][2]);			
			targetLay.selectFeatures(queryLaySelect, targetLay.SELECTION_NEW);			
			registry.byId("rightPane").set("content", selectedContent[iNumb][0]);									
		}										
	}

	function mouseIdentObj(event) {
		document.getElementById('rightPane').innerHTML = '';
		iNumb = 0;
		clickPnt = null;
		targetLay = null;
		selectedFeatures = null;
		selectedContent = null;
		queryLaySelect = null;			
		var queryClick = new Query();		
		clickPnt = new Point (event["mapPoint"]);
		queryClick.geometry = clickPnt;					
		RivBassLarge.selectFeatures(queryClick,RivBassLarge.SELECTION_NEW, function(e){
			selectedFeatures = [];
			selectedContent = [];					
			selectedFeatures.push(e);
			RivBassSmall.selectFeatures(queryClick,RivBassSmall.SELECTION_NEW, function(e){												
				selectedFeatures.push(e);				
				createContent();														
			});										
		});							
				
		function createContent(){
			RivBassLarge.clearSelection();
			RivBassSmall.clearSelection();			
			console.log(selectedFeatures.length);
			console.log(selectedFeatures);								
				for (k=0; k<selectedFeatures[1].length; k++){
					var getContent = "<table cellpadding='1'>" + 
					"<tr><td class='tdGray'>Водоток: </td><td>" + selectedFeatures[1][k].attributes['name'] + "</td></tr>" +
					"<tr><td class='tdGray'>Порядок водотока: </td><td>" + selectedFeatures[1][k].attributes['strahler_order'] + "</td></tr>" +		 
					"<tr><td class='tdGray'>Площадь, кв. км: </td><td>" + selectedFeatures[1][k].attributes['kub_thematic_data.sde.Watershad_small.area'] + "</td></tr>" + 
					"<tr><td class='tdGray'>Средняя высота, м: </td><td>" + selectedFeatures[1][k].attributes['mean_height'] + "</td></tr>" + 
					"<tr><td class='tdGray'>Расброс высот, м: </td><td>" + selectedFeatures[1][k].attributes['range_height'] + "</td></tr>" + 
					"<tr><td class='tdGray'>Средний уклон, град: </td><td>" + selectedFeatures[1][k].attributes['mean_slope'] + "</td></tr>" + 
					"<tr><td class='tdGray'>Густота речной сети по карте масштаба 1:1000000, км/кв.км: </td><td>" + selectedFeatures[1][k].attributes['stream_density_1000000'] + "</td></tr>" + 
					"<tr><td class='tdGray'>Лесистость, %: </td><td>" + selectedFeatures[1][k].attributes['forest_percent'] + "</td></tr>" +  
					"<tr><td class='tdGray'>Преобладающий тип леса: </td><td>" + selectedFeatures[1][k].attributes['foresttype'] + "</td></tr>" +
					"<tr><td class='tdGray'>Озерность, %: </td><td>" + selectedFeatures[1][k].attributes['percent_lake'] + "</td></tr>" +
					"<tr><td class='tdGray'>Закарстованность, % : </td><td>" + selectedFeatures[1][k].attributes['percent_karst'] + "</td></tr>" +
					"<tr><td class='tdGray'>Заболоченность, %: </td><td>" + selectedFeatures[1][k].attributes['percent_wetland'] + "</td></tr>" +
					"<tr><td class='tdGray'>Преобладающий тип почв: </td><td>" + selectedFeatures[1][k].attributes['soiltype'] + "</td></tr>" +
					"<tr><td class='tdGray'>Преобладающая почвообразующая порода: </td><td>" + selectedFeatures[1][k].attributes['bedrock_type'] + "</td></tr>" +	
					"</table>"					
					selectedContent.push([getContent,selectedFeatures[1][k].attributes['objectid'],selectedFeatures[1][k]._layer.id]);										
				}
				for (l=0; l<selectedFeatures[0].length; l++){
					var getContent = "<table cellpadding='1'>" + 
					"<tr><td class='tdGray'>Водоток: </td><td>" + selectedFeatures[0][l].attributes['name'] + "</td></tr>" +		 
					"<tr><td class='tdGray'>Площадь, кв. км: </td><td>" + selectedFeatures[0][l].attributes['kub_thematic_data.sde.Watershad_large.area'] + "</td></tr>" + 
					"<tr><td class='tdGray'>Средняя высота, м: </td><td>" + selectedFeatures[0][l].attributes['mean_height'] + "</td></tr>" + 
					"<tr><td class='tdGray'>Расброс высот, м: </td><td>" + selectedFeatures[0][l].attributes['range_height'] + "</td></tr>" + 
					"<tr><td class='tdGray'>Средний уклон, град: </td><td>" + selectedFeatures[0][l].attributes['mean_slope'] + "</td></tr>" + 
					"<tr><td class='tdGray'>Густота речной сети по карте масштаба 1:1000000, км/кв.км: </td><td>" + selectedFeatures[0][l].attributes['stream_density_1000000'] + "</td></tr>" + 
					"<tr><td class='tdGray'>Лесистость, %: </td><td>" + selectedFeatures[0][l].attributes['forest_percent'] + "</td></tr>" + 
					"<tr><td class='tdGray'>Преобладающий тип леса: </td><td>" + selectedFeatures[0][l].attributes['foresttype'] + "</td></tr>" +		
					"</table>"					
					selectedContent.push([getContent,selectedFeatures[0][l].attributes['objectid'],selectedFeatures[0][l]._layer.id]);										
				}						
			fillContent();								
		}
		
		function fillContent(){									
			registry.byId("rightPane").set("content", selectedContent[0][0]);
			queryLaySelect = new Query();
			queryLaySelect.objectIds = [selectedContent[0][1]];			
			targetLay = map.getLayer(selectedContent[0][2]);			
			targetLay.selectFeatures(queryLaySelect, targetLay.SELECTION_NEW);					
		}
	}
	
	

});