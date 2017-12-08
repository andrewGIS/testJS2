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
		
	esriConfig.defaults.io.proxyUrl = "/proxy/";
    esriConfig.defaults.io.alwaysUseProxy = false;
	esriConfig.defaults.geometryService = new GeometryService("http://maps.psu.ru:8080/arcgis/rest/services/Utilities/Geometry/GeometryServer");
	
	var map = new Map("map",{		
		center: [57.0, 58.8],
		zoom: 7,
		logo: false
	});	

	/*window.map = map;
	map.infoWindow.set("popupWindow", false);
	initializeSidebar(window.map);
	function initializeSidebar(map) {
		var popup = map.infoWindow;

		//when the selection changes update the side panel to display the popup info for the 
		//currently selected feature. 
		connect.connect(popup, "onSelectionChange", function() {
		  displayPopupContent(popup.getSelectedFeature());
		});

		//when the selection is cleared remove the popup content from the side panel. 
		connect.connect(popup, "onClearFeatures", function() {
		  //dom.byId replaces dojo.byId
		  dom.byId("featureCount").innerHTML = "Click to select feature";
		  //registry.byId replaces dijit.byId
		  registry.byId("leftPane").set("content", "");
		  domUtils.hide(dom.byId("pager"));
		});

		//When features are associated with the map's info window update the sidebar with the new content. 
		connect.connect(popup, "onSetFeatures", function() {
		  displayPopupContent(popup.getSelectedFeature());
		  if (popup.features.length > 1) {
			dom.byId("featureCount").innerHTML = popup.features.length + " features selected";
			//enable navigation if more than one feature is selected 
			domUtils.show(dom.byId("pager"))
		  } else {
			dom.byId("featureCount").innerHTML = popup.features.length + " feature selected";
			domUtils.hide(dom.byId("pager"));
		  }
		});
	  }

	  function displayPopupContent(feature) {
		if (feature) {
		  var content = feature.getContent();
		  registry.byId("leftPane").set("content", content);
		}
	  }

	  function selectPrevious() {
		window.map.infoWindow.selectPrevious();
	  }

	  function selectNext() {
		window.map.infoWindow.selectNext();
	  }*/
		
	var mMeasure;
	var layerList;	
		
	map.on('load', function(results) {		
		mMeasure = new Measurement({
			map: map,
			defaultAreaUnit: Units.SQUARE_KILOMETERS,
			defaultLengthUnit: Units.KILOMETERS
        }, dom.byId('MIst'));
		var Ediv = document.getElementById("dijit_layout_ContentPane_0");
		Ediv.id = "dijit_layout_ContentPane_0n";
		var Ediv1 = document.getElementById("dijit_layout_ContentPane_1");
		Ediv1.id = "dijit_layout_ContentPane_1n";
		var Ediv2 = document.getElementById("dijit_layout_ContentPane_2");
		Ediv2.id = "dijit_layout_ContentPane_2n";
		var Ediv3 = document.getElementById("dijit_layout_ContentPane_3");
		Ediv3.id = "dijit_layout_ContentPane_3n";
		var Ediv4 = document.getElementById("dijit_layout_ContentPane_4");
		Ediv4.id = "dijit_layout_ContentPane_4n";
		mMeasure.startup();		
	});
		
	//добавление сервисов
	var BaseMap = new ArcGISTiledMapServiceLayer("http://maps.psu.ru:8080/arcgis/rest/services/KUB/Base_Map/MapServer");	
	//var RivBassMap = new ArcGISDynamicMapServiceLayer("http://maps.psu.ru:8080/arcgis/rest/services/KUB/River_bassins_KUB/MapServer");
	var PollutionMap = new ArcGISDynamicMapServiceLayer("http://maps.psu.ru:8080/arcgis/rest/services/KUB/Pollution_KUB/MapServer");
	var BorderKUBMap = new ArcGISDynamicMapServiceLayer("http://maps.psu.ru:8080/arcgis/rest/services/KUB/Borders_KUB/MapServer");
	var DEMMap = new ArcGISDynamicMapServiceLayer("http://maps.psu.ru:8080/arcgis/rest/services/KUB/DEM20m_KUB/MapServer");
	var TemMaps = new ArcGISDynamicMapServiceLayer("http://maps.psu.ru:8080/arcgis/rest/services/KUB/Thematic_maps/MapServer");
		
	var OSMMap = new WebTiledLayer("http://c.tile.openstreetmap.org/${level}/${col}/${row}.png",{
    	"copyright": 'Map data © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'});
		
	var rosreestrMap = new ArcGISTiledMapServiceLayer("http://pkk5.rosreestr.ru/arcgis/rest/services/BaseMaps/BaseMap/MapServer");
	var rosreestrMapAno = new ArcGISTiledMapServiceLayer("http://apkk5.rosreestr.ru/arcgis/rest/services/BaseMaps/Anno/MapServer");

	var ArcGISWI = new ArcGISTiledMapServiceLayer("http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer");
	var ArcGISWTM = new ArcGISTiledMapServiceLayer("http://server.arcgisonline.com/arcgis/rest/services/World_Topo_Map/MapServer");
	
	var RivBassSmall = new FeatureLayer("http://maps.psu.ru:8080/arcgis/rest/services/KUB/River_bassins/MapServer/0", {			
		outFields: ["*"],							
		// infoTemplate: new InfoTemplate()
	});
	var RivBassLarge = new FeatureLayer("http://maps.psu.ru:8080/arcgis/rest/services/KUB/River_bassins/MapServer/1", {				
		outFields: ["*"],	
		//infoTemplate: new InfoTemplate("Водосбор","Водоток: ${name} <br> Площадь, кв. км: ${kub_thematic_data.sde.Watershad_large.area} <br> Средняя высота, м: ${mean_height}")
	});	
	
	var selectionSymbolPol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
		new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0,255,255,1]), 1.5),
		new Color([125, 125, 125, 0]));
	RivBassLarge.setSelectionSymbol(selectionSymbolPol);
		
	map.addLayers([ArcGISWTM, ArcGISWI, rosreestrMap, rosreestrMapAno, OSMMap, BaseMap]);
	map.addLayers([DEMMap, TemMaps, BorderKUBMap, PollutionMap]);	
	map.addLayers([RivBassSmall, RivBassLarge]);	
	
			
	rosreestrMap.hide();
    rosreestrMapAno.hide();
    ArcGISWI.hide();
	ArcGISWTM. hide();
	DEMMap.hide();
	DEMMap.setOpacity (0.65);	
		
	var overviewMapDijit = new OverviewMap({
		map: map,
		baseLayer: OSMMap,
		attachTo: "top-right",
		visible: false,
		height: 200,
		width: 250,				
	});
	overviewMapDijit.startup();
		
	var scalebar = new Scalebar({
		map: map,		
		scalebarUnit: "metric"
	});	
			
	var home = new HomeButton({
		map: map,
		extent: new Extent(6285000, 7990000, 6470000, 8262000, new SpatialReference({ wkid:102100 }))
	}, "HomeButton");
	home.startup();	
			
	layerList = new LayerList({
		map: map,
		showLegend: true,
		showSubLayers: true,
		showOpacitySlider: false,				
		layers: [{
				layer: TemMaps,
				title: "Тематические карты"},{
				layer: RivBassLarge,
				title: "Бассейны средних рек"},{
				layer: RivBassSmall,
				title: "Бассейны малых рек"},{
				layer: DEMMap,
				title: "Цифровая модель рельефа (разр. 20м.)"},{
				layer: BorderKUBMap,
				title: "Границы"},{
				layer: PollutionMap,
				title: "Загрязнение"}
			],		
	},"layerListDom");
	layerList.startup();	
    	
	layerList.on('load',function() {
		dom.byId("layerListDom").style.display = 'none';		
	});
				
	//включение и выключение базовой карты
	on(dom.byId("BaseMapTP"), "click", function () {
    	if (dom.byId("BaseMapTP").checked == false) {
    		BaseMap.hide();            
        } else {
			BaseMap.show();
        }    	
    });
	
	//смена подложек в панели картографическая основа
	var inputsBM = query(".backingMap");
    for (var i = 0; i < inputsBM.length; i++) {
    	on(dom.byId(inputsBM[i]), "change", updateBackingMap);
    }

    function updateBackingMap () {
    	if (dom.byId("OSMTP").checked == true) {
    		OSMMap.show(); rosreestrMap.hide(); rosreestrMapAno.hide(); ArcGISWI.hide(); ArcGISWTM.hide();
    	} else if (dom.byId("RosReestrTP").checked == true) {
    		rosreestrMap.show(); rosreestrMapAno.show(); ArcGISWI.hide(); ArcGISWTM.hide(); OSMMap.hide();
    	} else if (dom.byId("ArcGISSI").checked == true) {
    		ArcGISWI.show(); ArcGISWTM.hide(); OSMMap.hide(); rosreestrMap.hide(); rosreestrMapAno.hide(); 
    	} else if (dom.byId("ArcGISWM").checked == true) {
    		ArcGISWTM.show(); ArcGISWI.hide(); OSMMap.hide(); rosreestrMap.hide(); rosreestrMapAno.hide(); 
    	}
    };
		
	//Кнопка управление слоями
	on(dom.byId("LayList"), "click", function () {
		if (dom.byId('layerListDom').style.display == 'none') {
			dom.byId('layerListDom').style.display = 'block';
			dom.byId('caseTitlePaneBM').style.display = 'none';
			dom.byId('dMeasurePane').style.display = 'none';
			mMeasure.setTool("area", false);
			mMeasure.setTool("distance", false);
			mMeasure.setTool("location", false);			
			mMeasure.clearResult();
			dom.byId('rightPanel').style.display = 'none';
			document.getElementById('map').style.right = '40px';
		} else {
			dom.byId('layerListDom').style.display = 'none';					
		}	
	});
	
	//Кнопка картографическая основа
	on(dom.byId("BaseMapChange"), "click", function () {
		if (dom.byId('caseTitlePaneBM').style.display == 'none') {
			dom.byId('caseTitlePaneBM').style.display = 'block';
			dom.byId('layerListDom').style.display = 'none';
			dom.byId('dMeasurePane').style.display = 'none';
			mMeasure.setTool("area", false);
			mMeasure.setTool("distance", false);
			mMeasure.setTool("location", false);			
			mMeasure.clearResult();
			dom.byId('rightPanel').style.display = 'none';
			document.getElementById('map').style.right = '40px';
		} else {
			dom.byId('caseTitlePaneBM').style.display = 'none';					
		}	
	});	
	
	//Кнопка измерительные инструменты
	on(dom.byId("MeasureBut"), "click", function () {
		if (dom.byId('dMeasurePane').style.display == 'none') {
			dom.byId('dMeasurePane').style.display = 'block';
			dom.byId('layerListDom').style.display = 'none';
			dom.byId('caseTitlePaneBM').style.display = 'none';
			dom.byId('rightPanel').style.display = 'none';
			document.getElementById('map').style.right = '40px';
		} else {			
			dom.byId('dMeasurePane').style.display = 'none';
			destroyMeasure();
		}
	});	
			
	//отключение инструментов измерения при скрытии блока с ними
	function destroyMeasure() {
		if (dom.byId('dMeasurePane').style.display == 'none') {
			mMeasure.setTool("area", false);
			mMeasure.setTool("distance", false);
			mMeasure.setTool("location", false);			
			mMeasure.clearResult();
		};
	};
	
	// Инфопанель справа
	on(dom.byId("InfoBut"), "click", function () {
		if (dom.byId('rightPanel').style.display == 'none') {			
			dom.byId('rightPanel').style.display = 'block';
			dom.byId('dMeasurePane').style.display = 'none';
			dom.byId('layerListDom').style.display = 'none';
			dom.byId('caseTitlePaneBM').style.display = 'none';
			document.getElementById('map').style.right = '290px';
			mMeasure.setTool("area", false);
			mMeasure.setTool("distance", false);
			mMeasure.setTool("location", false);			
			mMeasure.clearResult();
			
			// Изменение указателя мыши при наведении на идентифицируемый объект
			RivBassSmall.on("mouse-over", cursorOver);
			RivBassSmall.on("mouse-out", cursorOut);
			RivBassLarge.on("mouse-over", cursorOver);
			RivBassLarge.on("mouse-out", cursorOut);

			RivBassSmall.on("click", mouseIdentRBS);
			RivBassLarge.on("click", mouseIdentRBL);			
		} else {			
			dom.byId('rightPanel').style.display = 'none';
			document.getElementById('map').style.right = '40px';
			RivBassSmall.on("mouse-over", cursorOver);
			RivBassLarge.on("mouse-over", cursorOut);
			RivBassLarge.on("click", mouseIdentOff);
			RivBassSmall.on("click", mouseIdentOff);
		}		
	});
	
	// Функции для изменения указателя мыши при наведении на идентифицируемый объект
	function cursorOver() { map.setMapCursor("help"); };
	function cursorOut() { map.setMapCursor("default"); };

	function mouseIdentRBL(event) {	
		/*var query = new Query();
		query.geometry = clickPnt;
		var clickPnt = new Point (event["mapPoint"]);	
		RivBassSmall.selectFeatures(query,RivBassLarge.SELECTION_NEW);
		console.log(RivBassSmall.getSelectedFeatures())			 	
		var getContent = "<table cellpadding='1'>" + 
		"<tr><td class='tdGray'>Водоток: </td><td>" + event.graphic.attributes['name'] + "</td></tr>" +		 
		"<tr><td class='tdGray'>Площадь, кв. км: </td><td>" + event.graphic.attributes['kub_thematic_data.sde.Watershad_large.area'] + "</td></tr>" + 
		"<tr><td class='tdGray'>Средняя высота, м: </td><td>" + event.graphic.attributes['mean_height'] + "</td></tr>" + 
		"<tr><td class='tdGray'>Расброс высот, м: </td><td>" + event.graphic.attributes['range_height'] + "</td></tr>" + 
		"<tr><td class='tdGray'>Средний уклон, град: </td><td>" + event.graphic.attributes['mean_slope'] + "</td></tr>" + 
		"<tr><td class='tdGray'>Густота речной сети по карте 1:1000000, км/кв.км: </td><td>" + event.graphic.attributes['stream_density_1000000'] + "</td></tr>" + 
		"<tr><td class='tdGray'>Лесистость, %: </td><td>" + event.graphic.attributes['forest_percent'] + "</td></tr>" + 
		"<tr><td class='tdGray'>Преобладающий тип леса: </td><td>" + event.graphic.attributes['foresttype'] + "</td></tr>" + 		
		"</table>"		
		var clickPnt = new Point (event["mapPoint"]);		
		var query = new Query();
		query.geometry = clickPnt;
		RivBassLarge.queryFeatures(query, selectInBuffer);
		function selectInBuffer(response) {
			var feature;
			var features = response.features;
			console.log(features);
			var selectedFeatures = [];			
			for (var i = 0; i < features.length; i++) {
			  feature = features[i];
			  if(feature.geometry.contains(clickPnt)){
				selectedFeatures.push(feature.attributes['*']);
			  }
			}
			console.log(selectedFeatures);
		}		
		registry.byId("rightPanel").set("content", getContent);*/				
	}

	function mouseIdentRBS(event) {	
		var query = new Query();		
		var clickPnt = new Point (event["mapPoint"]);
		query.geometry = clickPnt;	
		RivBassSmall.selectFeatures(query,RivBassSmall.SELECTION_NEW, function(e){console.log(e)});
		//console.log(RivBassSmall.getSelectedFeatures())
		
		var getContent = "<table cellpadding='1'>" + 
		"<tr><td class='tdGray'>Водоток: </td><td>" + event.graphic.attributes['name'] + "</td></tr>" +
		"<tr><td class='tdGray'>Порядок водотока: </td><td>" + event.graphic.attributes['strahler_order'] + "</td></tr>" +		 
		"<tr><td class='tdGray'>Площадь, кв. км: </td><td>" + event.graphic.attributes['kub_thematic_data.sde.Watershad_small.area'] + "</td></tr>" + 
		"<tr><td class='tdGray'>Средняя высота, м: </td><td>" + event.graphic.attributes['mean_height'] + "</td></tr>" + 
		"<tr><td class='tdGray'>Расброс высот, м: </td><td>" + event.graphic.attributes['range_height'] + "</td></tr>" + 
		"<tr><td class='tdGray'>Средний уклон, град: </td><td>" + event.graphic.attributes['mean_slope'] + "</td></tr>" + 
		"<tr><td class='tdGray'>Густота речной сети по карте 1:1000000, км/кв.км: </td><td>" + event.graphic.attributes['stream_density_1000000'] + "</td></tr>" + 
		"<tr><td class='tdGray'>Лесистость, %: </td><td>" + event.graphic.attributes['forest_percent'] + "</td></tr>" +  
		"<tr><td class='tdGray'>Преобладающий тип леса: </td><td>" + event.graphic.attributes['foresttype'] + "</td></tr>" +
		"<tr><td class='tdGray'>Озерность, %: </td><td>" + event.graphic.attributes['percent_lake'] + "</td></tr>" +
		"<tr><td class='tdGray'>Закарстованность, % : </td><td>" + event.graphic.attributes['percent_karst'] + "</td></tr>" +
		"<tr><td class='tdGray'>Заболоченность, %: </td><td>" + event.graphic.attributes['percent_wetland'] + "</td></tr>" +
		"<tr><td class='tdGray'>Преобладающий тип почв: </td><td>" + event.graphic.attributes['soiltype'] + "</td></tr>" +
		"<tr><td class='tdGray'>Преобладающая почвообразующая порода: </td><td>" + event.graphic.attributes['bedrock_type'] + "</td></tr>" +		
		"</table>"
		console.log(getContent);
		registry.byId("rightPanel").set("content", getContent);
	}

	function mouseIdentOff(){

	}

	// Отображение координат курсора мыши
	map.on("mouse-move", showCoordinates);
	function showCoordinates(evt) {
        var mp = webMercatorUtils.webMercatorToGeographic(evt.mapPoint);
        dom.byId("coord").innerHTML = mp.y.toFixed(3) + "°N, " + mp.x.toFixed(3) + "°E";
    }

	//Изменение масштаба карты
	map.on("zoom-end", function() {
		var currentLevel = map.getLevel();

		var levelAndScale = [
			level5 = "| М 1:20'000'000",
			level6 = "| М 1:10'000'000",
			level7 = "| М 1:5'000'000",
			level8 = "| М 1:2'500'000",
			level9 = "| М 1:1'000'000",
			level10 = "| М 1:500'000",
			level11 = "| М 1:300'000",
			level12 = "| М 1:150'000",
			level13 = "| М 1:80'000",
			level14 = "| М 1:40'000",
			level15 = "| М 1:20'000",
			level16 = "| М 1:10'000",
			level17 = "| М 1:5'000",
			level18 = "| М 1:2'500"
		];

		for (var i = 5; i < 19; i++) {
			if (currentLevel == i) {
				var NumAr = i - 5
				dom.byId("scale").innerHTML = levelAndScale[NumAr]	
			}
		}
	});
		
});