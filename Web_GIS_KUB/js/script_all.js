
// Общий скрипт без идентификации

require([
	"esri/config", "esri/map", "esri/layers/ArcGISTiledMapServiceLayer", "esri/layers/ArcGISDynamicMapServiceLayer", "esri/layers/WebTiledLayer", "esri/layers/FeatureLayer", "esri/layers/ArcGISImageServiceLayer", "esri/layers/ImageParameters", "esri/layers/RasterLayer",
	"esri/SpatialReference", "esri/geometry/Extent", "esri/geometry/webMercatorUtils", "esri/InfoTemplate", "esri/Color", "esri/renderers/SimpleRenderer", "esri/geometry/Point",
	"esri/symbols/SimpleMarkerSymbol", "esri/symbols/SimpleFillSymbol", "esri/symbols/SimpleLineSymbol",
	"esri/tasks/query", "esri/tasks/QueryTask", "esri/tasks/RelationshipQuery", "esri/tasks/GeometryService",
	"esri/dijit/Measurement", "esri/units", "esri/dijit/LayerList", "esri/dijit/Legend", "esri/dijit/Popup", "esri/dijit/PopupTemplate", "esri/dijit/HomeButton", "esri/dijit/OverviewMap", "esri/dijit/Scalebar",

	"esri/tasks/Geoprocessor",
	"esri/tasks/ClassBreaksDefinition", "esri/tasks/AlgorithmicColorRamp",
	"esri/tasks/GenerateRendererParameters", "esri/tasks/GenerateRendererTask",
	"esri/tasks/IdentifyTask", "esri/tasks/IdentifyParameters",

	"esri/TimeExtent", "esri/dijit/TimeSlider",
	"dojo/_base/array",

	"dgrid/Grid",
	"dijit/registry",
	"dojo/dom-construct", "dojo/ready", "dojo/on", "dojo/dom", "dojo/dom-class", "dojo/dom-style", "dojo/_base/connect",
	"dojo/query",
	"dojo/parser",
	"dojo/domReady!"
], function (
	esriConfig, Map, ArcGISTiledMapServiceLayer, ArcGISDynamicMapServiceLayer, WebTiledLayer, FeatureLayer, ArcGISImageServiceLayer, ImageParameters, RasterLayer,
	SpatialReference, Extent, webMercatorUtils, InfoTemplate, Color, SimpleRenderer, Point,
	SimpleMarkerSymbol, SimpleFillSymbol, SimpleLineSymbol,
	Query, QueryTask, RelationshipQuery, GeometryService,
	Measurement, Units, LayerList, Legend, Popup, PopupTemplate, HomeButton, OverviewMap, Scalebar,

	Geoprocessor,
	ClassBreaksDefinition, AlgorithmicColorRamp,
	GenerateRendererParameters, GenerateRendererTask,
	IdentifyTask, IdentifyParameters,

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

		var map = new Map("map", {
			center: [57.0, 58.8],
			zoom: 7,
			logo: false
		});

		var mMeasure;
		var layerList;

		var mapClick;

		// мои переменные
		var selectedInfoNumber;
		var identifyResult;

		var identifyTask, identifyParams;

		map.on('load', function (results) {
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

			initFunctionallity();

			assertClick();


		});

		//добавление сервисов
		var BaseMap = new ArcGISTiledMapServiceLayer("http://maps.psu.ru:8080/arcgis/rest/services/KUB/Base_Map/MapServer");
		//var RivBassMap = new ArcGISDynamicMapServiceLayer("http://maps.psu.ru:8080/arcgis/rest/services/KUB/River_bassins_KUB/MapServer");
		var PollutionMap = new ArcGISDynamicMapServiceLayer("http://maps.psu.ru:8080/arcgis/rest/services/KUB/Pollution_KUB/MapServer");
		var BorderKUBMap = new ArcGISDynamicMapServiceLayer("http://maps.psu.ru:8080/arcgis/rest/services/KUB/Borders_KUB/MapServer");
		var DEMMap = new ArcGISDynamicMapServiceLayer("http://maps.psu.ru:8080/arcgis/rest/services/KUB/DEM20m_KUB/MapServer");
		var TemMaps = new ArcGISDynamicMapServiceLayer("http://maps.psu.ru:8080/arcgis/rest/services/KUB/Thematic_maps/MapServer");

		var OSMMap = new WebTiledLayer("http://c.tile.openstreetmap.org/${level}/${col}/${row}.png", {
			"copyright": 'Map data © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
		});

		var rosreestrMap = new ArcGISTiledMapServiceLayer("http://pkk5.rosreestr.ru/arcgis/rest/services/BaseMaps/BaseMap/MapServer");
		var rosreestrMapAno = new ArcGISTiledMapServiceLayer("http://apkk5.rosreestr.ru/arcgis/rest/services/BaseMaps/Anno/MapServer");

		var ArcGISWI = new ArcGISTiledMapServiceLayer("http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer");
		var ArcGISWTM = new ArcGISTiledMapServiceLayer("http://server.arcgisonline.com/arcgis/rest/services/World_Topo_Map/MapServer");

		var RivBassSmall = new FeatureLayer("http://maps.psu.ru:8080/arcgis/rest/services/KUB/River_bassins/MapServer/0", {
			outFields: ["*"],
		});
		var RivBassLarge = new FeatureLayer("http://maps.psu.ru:8080/arcgis/rest/services/KUB/River_bassins/MapServer/1", {
			outFields: ["*"],
			//infoTemplate: new InfoTemplate("Водосбор","Водоток: ${name} <br> Площадь, кв. км: ${kub_thematic_data.sde.Watershad_large.area} <br> Средняя высота, м: ${mean_height}")
		});

		var selectionSymbolPol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
			new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0, 255, 255, 1]), 1.5),
			new Color([125, 125, 125, 0]));
		RivBassLarge.setSelectionSymbol(selectionSymbolPol);

		map.addLayers([ArcGISWTM, ArcGISWI, rosreestrMap, rosreestrMapAno, OSMMap, BaseMap]);
		map.addLayers([DEMMap, TemMaps, BorderKUBMap, PollutionMap]);
		//map.addLayers([RivBassSmall, RivBassLarge]);	

		rosreestrMap.hide();
		rosreestrMapAno.hide();
		ArcGISWI.hide();
		ArcGISWTM.hide();
		DEMMap.hide();
		DEMMap.setOpacity(0.65);

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
			extent: new Extent(6285000, 7990000, 6470000, 8262000, new SpatialReference({ wkid: 102100 }))
		}, "HomeButton");
		home.startup();

		layerList = new LayerList({
			map: map,
			showLegend: true,
			showSubLayers: true,
			showOpacitySlider: false,
			layers: [{
				layer: TemMaps,
				title: "Тематические карты"
			}, {
				layer: RivBassLarge,
				title: "Бассейны средних рек"
			}, {
				layer: RivBassSmall,
				title: "Бассейны малых рек"
			}, {
				layer: DEMMap,
				title: "Цифровая модель рельефа (разр. 20м.)"
			}, {
				layer: BorderKUBMap,
				title: "Границы"
			}, {
				layer: PollutionMap,
				title: "Загрязнение"
			}
			],
		}, "layerListDom");
		layerList.startup();

		layerList.on('load', function () {
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

		function updateBackingMap() {
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

			// identify event
			map.on("click", doIdentify)

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
			} else {
				dom.byId('rightPanel').style.display = 'none';
				document.getElementById('map').style.right = '40px';
				RivBassSmall.on("mouse-over", cursorOut);
				RivBassLarge.on("mouse-over", cursorOut);
			}
		});

		// Функции для изменения указателя мыши при наведении на идентифицируемый объект
		function cursorOver() { map.setMapCursor("help"); };
		function cursorOut() { map.setMapCursor("default"); };

		// Отображение координат курсора мыши
		map.on("mouse-move", showCoordinates);
		function showCoordinates(evt) {
			var mp = webMercatorUtils.webMercatorToGeographic(evt.mapPoint);
			dom.byId("coord").innerHTML = mp.y.toFixed(3) + "°N, " + mp.x.toFixed(3) + "°E";
		}

		//Изменение масштаба карты
		map.on("zoom-end", function () {
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

		// Identify parameters
		function initFunctionallity() {
			//map.on("click", doIdentify);
			identifyTask = new IdentifyTask("http://maps.psu.ru:8080/arcgis/rest/services/" +
				"KUB/Pollution_KUB/MapServer");

			identifyParams = new IdentifyParameters();
			identifyParams.tolerance = 3;
			identifyParams.layerIds = [0, 1, 2, 3, 4, 5, 6];
			identifyParams.layerOption = IdentifyParameters.LAYER_OPTION_ALL;
			identifyParams.width = map.width;
			identifyParams.height = map.height;


		}

		// Identify test
		function doIdentify(event) {

			//map.graphics.clear();
			identifyParams.geometry = event.mapPoint;
			identifyParams.mapExtent = map.extent;
			identifyTask.execute(identifyParams, function (idResults) {
				//addToMap(idResults, event);
				//console.log(idResults[0]);
				//console.log(event);

				if (idResults.length == 0) {

					idResults = ["No results"]
				}

				identifyResults = idResults;

				selectedInfoNumber = 0;

				loadResults(selectedInfoNumber);

			});

		}

		//create table from object

		function createTable(currentObject) {

			if (currentObject == "No results") {

				return "No results"
			}

			let getContent = "<table cellpadding='1'>" +
				"<tr><td class='tdGray'>Водоток: </td><td>" +
				currentObject.feature.attributes.OBJECTID + "</td></tr>" +
				"<tr><td class='tdGray'>Порядок водотока: </td><td>" +
				currentObject.feature.attributes.OBJECTID + "</td></tr>" +
				"<tr><td class='tdGray'>Площадь, кв. км: </td><td>" +
				currentObject.feature.attributes.OBJECTID + "</td></tr>" +
				"<tr><td class='tdGray'>Преобладающая почвообразующая порода: </td><td>" +
				currentObject.feature.attributes.OBJECTID + "</td></tr>" +
				"<tr><td class='tdGray'></td><td>" +
				"<button id = 'addInfo'> Кнопка </button></td></tr>" +
				"</table>"

			return getContent
		}


		//load identify results to dom element

		function loadResults(number) {

			registry.byId("rightPane").set("content",
				createTable(identifyResults[number]));

			on(dom.byId("addInfo"), "click", showAddInfo);

		}

		// assert click for next and previous
		function assertClick() {
			on(dom.byId("next"), "click", nextClick);
			on(dom.byId("previous"), "click", previousClick);
		}

		// next click

		function nextClick() {
			try {

				loadResults(selectedInfoNumber + 1);
				selectedInfoNumber = selectedInfoNumber + 1

			} catch (error) {
				console.log(error)
			}
			finally {
				//
			}
		}

		// previous click

		function previousClick() {
			try {

				loadResults(selectedInfoNumber - 1);
				selectedInfoNumber = selectedInfoNumber - 1

			} catch (error) {
				console.log(error)
			}
			finally {
				//
			}
		}

		function showAddInfo() {

			console.log(identifyResults[selectedInfoNumber])

			alert(identifyResults[selectedInfoNumber].feature.attributes.OBJECTID)

			console.log(map.layerIds)

			let relatedQuery = new RelationshipQuery();
			// need to be dynamic relatedQuery.relationshipId
			relatedQuery.relationshipId = 3;
			relatedQuery.objectIds = [identifyResults[selectedInfoNumber].feature.attributes.OBJECTID];

			let layerID = identifyResults[selectedInfoNumber].layerId
			//let incidentLayer = map.getLayer(map.layerIds[4])
			let targetLyr = FeatureLayer("http://maps.psu.ru:8080/arcgis/rest/services/KUB/Pollution_KUB/MapServer/" +
				layerID)
			targetLyr.queryRelatedFeatures(relatedQuery, function (relatedRecords) {

				//alert(relatedRecords);
				console.log(relatedRecords)
				console.log(relatedRecords)

			});

		}

	});