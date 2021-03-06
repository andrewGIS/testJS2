require([
	"esri/config", "esri/map", "esri/layers/ArcGISTiledMapServiceLayer", "esri/layers/ArcGISDynamicMapServiceLayer", "esri/layers/WebTiledLayer", "esri/layers/FeatureLayer", "esri/layers/ArcGISImageServiceLayer", "esri/layers/ImageParameters", "esri/layers/RasterLayer",
	"esri/SpatialReference", "esri/geometry/Extent", "esri/geometry/webMercatorUtils", "esri/InfoTemplate", "esri/Color", "esri/renderers/SimpleRenderer", "esri/geometry/Point",
	"esri/graphic",
	"esri/symbols/SimpleMarkerSymbol", "esri/symbols/SimpleFillSymbol", "esri/symbols/SimpleLineSymbol",
	"esri/tasks/query", "esri/tasks/QueryTask", "esri/tasks/RelationshipQuery", "esri/tasks/GeometryService",
	"esri/dijit/Measurement", "esri/units", "esri/dijit/LayerList", "esri/dijit/Legend", "esri/dijit/Popup", "esri/dijit/PopupTemplate", "esri/dijit/HomeButton", "esri/dijit/OverviewMap", "esri/dijit/Scalebar",
	"esri/layers/GraphicsLayer",
	"esri/tasks/Geoprocessor",
	"esri/tasks/ClassBreaksDefinition", "esri/tasks/AlgorithmicColorRamp",
	"esri/tasks/GenerateRendererParameters", "esri/tasks/GenerateRendererTask",
	"esri/tasks/IdentifyTask", "esri/tasks/IdentifyParameters",
	"esri/tasks/FindTask", "esri/tasks/FindParameters",
	"esri/tasks/FeatureSet", "esri/dijit/FeatureTable",
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
	Graphic,
	SimpleMarkerSymbol, SimpleFillSymbol, SimpleLineSymbol,
	Query, QueryTask, RelationshipQuery, GeometryService,
	Measurement, Units, LayerList, Legend, Popup, PopupTemplate, HomeButton, OverviewMap, Scalebar,
	GraphicsLayer,

	Geoprocessor,
	ClassBreaksDefinition, AlgorithmicColorRamp,
	GenerateRendererParameters, GenerateRendererTask,
	IdentifyTask, IdentifyParameters,
	FindTask, FindParameters,
	FeatureSet, FeatureTable,

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
		var clickPnt;
		var selectedContent;
		var selectedFeatures;
		var iNumb;
		var queryLaySelect;
		var selectedInfoNumber;
		var identifyResult;
		var identifyTask, identifyParams;
		var findParams, findTask;
		var massPointLabels = ["Отвалы", "Изливы", "Родники"];
		var identificationLayerId;
		var trElemId;
		var trElemIdTwo;
		var rowColorInit;
		var rowColorInitTwo;
		var trElem;
		var trElemTwo;

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

			// listen toggle menu
			$("#rightPanelSet").on("click", "li", function () {
				console.log(this.children[0].id);
				//console.log(this.firstElementChild.children[0].id);
				//$(this.children[0]).toggleClass("activeButton");

			});


			mMeasure.startup();

			initFunctionallity();

			assertClick();

			modalListener();

		});

		//добавление сервисов
		var BaseMap = new ArcGISTiledMapServiceLayer("http://maps.psu.ru:8080/arcgis/rest/services/KUB/Base_Map/MapServer");
		var PollutionMap = new ArcGISDynamicMapServiceLayer("http://maps.psu.ru:8080/arcgis/rest/services/KUB/Pollution_KUB/MapServer");
		var PhotoLayer = new FeatureLayer("http://maps.psu.ru:8080/arcgis/rest/services/KUB/Photos/MapServer/0", {
			outFields: ["comments", "name_file", "date"],
			infoTemplate: new InfoTemplate("Фотография", "<a href='photos_kub/${name_file}' target='_blank'><img src='photos_kub/${name_file}' width='250'></a><br>${comments}<br>Дата съемки: ${date:DateFormat(selector: 'date', fullYear: true)}")
		});

		var OSMMap = new WebTiledLayer("http://c.tile.openstreetmap.org/${level}/${col}/${row}.png", {
			"copyright": 'Map data © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
		});

		var rosreestrMap = new ArcGISTiledMapServiceLayer("http://pkk5.rosreestr.ru/arcgis/rest/services/BaseMaps/BaseMap/MapServer");
		var rosreestrMapAno = new ArcGISTiledMapServiceLayer("http://apkk5.rosreestr.ru/arcgis/rest/services/BaseMaps/Anno/MapServer");

		var ArcGISWI = new ArcGISTiledMapServiceLayer("http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer");
		var ArcGISWTM = new ArcGISTiledMapServiceLayer("http://server.arcgisonline.com/arcgis/rest/services/World_Topo_Map/MapServer");

		map.addLayers([ArcGISWTM, ArcGISWI, rosreestrMap, rosreestrMapAno, OSMMap, BaseMap]);
		map.addLayers([PollutionMap, PhotoLayer]);

		PhotoLayer.hide();
		BaseMap.hide();

		//clustering for photos
		PhotoLayer.setFeatureReduction({
			type: "cluster",
			clusterRadius: 25,
		});

		rosreestrMap.hide();
		rosreestrMapAno.hide();
		ArcGISWI.hide();
		ArcGISWTM.hide();

		var grPollPnt = new GraphicsLayer();
		map.addLayer(grPollPnt);

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
				layer: PollutionMap,
				title: "Слои"
			}],
		}, "layerListDom");
		layerList.startup();
		//$("#layerListDom").addClass("container");

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


		//Right panel menu
		// $( function() {
		// 	$( "#tabs" ).tabs();
		//   } );



		//Кнопка управление слоями
		on(dom.byId("LayList"), "click", function () {
			if (dom.byId('layerListDom').style.display == 'none') {

				$(this).toggleClass("activeButton");
				$("#layerListDom").show();
				$("#layerListDom").hover(function () {
					$(this).fadeTo(1000, 0.9);
				}, function () {
					$(this).fadeTo(1000, 0.05);
				})
			} else {
				$("#layerListDom").hide();
				$("#layerListDom").off("mouseenter mouseleave");
				$("#layerListDom").css('opacity', '0.9');
				$(this).toggleClass("activeButton");
			}
		});

		//Кнопка картографическая основа
		on(dom.byId("BaseMapChange"), "click", function () {
			if (dom.byId('caseTitlePaneBM').style.display == "none") {
				dom.byId('caseTitlePaneBM').style.display = 'block';
				$("#searchPanel, #rightPanel, #dMeasurePane").hide();
				mMeasure.setTool("area", false);
				mMeasure.setTool("distance", false);
				mMeasure.setTool("location", false);
				mMeasure.clearResult();
				dom.byId('rightPanel').style.display = 'none';
				document.getElementById('map').style.right = '40px';
				cursorOut();
			} else {
				dom.byId('caseTitlePaneBM').style.display = 'none';
			}
		});

		//Кнопка измерительные инструменты
		on(dom.byId("MeasureBut"), "click", function () {
			if (dom.byId('dMeasurePane').style.display == 'none') {
				dom.byId('dMeasurePane').style.display = 'block';
				$("#searchPanel, #rightPanel, #caseTitlePaneBM").hide();
				document.getElementById('map').style.right = '40px';
				mapClick.remove();
				cursorOut();
				map.graphics.clear();
				grPollPnt.clear();
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
				$('#rightPane').html("");
				//dom.byId('rightPanel').style.display = 'block';
				$('#rightPanel').show();
				$('#clearSelBut, #previous, #next').hide();
				$('#featureCount').html('Кликните по объекту для идентификации');
				$("#searchPanel, #dMeasurePane, #caseTitlePaneBM").hide();
				document.getElementById('featureCount').innerHTML = 'Кликните по объекту для идентификации';
				document.getElementById('rightPane').innerHTML = '';
				//document.getElementById('pager').innerHTML = '';
				document.getElementById('map').style.right = '300px';
				mMeasure.setTool("area", false);
				mMeasure.setTool("distance", false);
				mMeasure.setTool("location", false);
				mMeasure.clearResult();
				mapClick = map.on("click", doIdentify);
				cursorOver();
			} else {
				$('#rightPanel').hide();
				dom.byId('rightPanel').style.display = 'none';
				document.getElementById('map').style.right = '40px';
				$('#rightPane').html('');
				mapClick.remove();
				map.graphics.clear();
				grPollPnt.clear();
				document.getElementById('clearSelBut').style.display = 'none';
				document.getElementById('previous').style.display = 'none';
				document.getElementById('next').style.display = 'none';
				cursorOut();
			}
		});

		// Button for show photos
		on(dom.byId("PhotosBut"), "click", function () {
			$(this).toggleClass("activeButton");
			if (PhotoLayer.visible == false) {
				PhotoLayer.show();
			} else {
				PhotoLayer.hide();
			}
		});

		// Панель поиска
		on(dom.byId("FindBut"), "click", function () {
			//$("#searchPanel").toggleClass("activeTab");
			if (dom.byId('searchPanel').style.display == 'none') {
				map.graphics.clear();
				grPollPnt.clear();
				dom.byId('searchPanel').style.display = 'block';
				$("#rightPanel, #dMeasurePane, #caseTitlePaneBM").hide();
				//$("#rightPanel").html("");
				$("#featureCount").html('Кликните по объекту для идентификации');
				$('#clearSelBut').hide();
				$('#previous').hide();
				$('#next').hide();
				document.getElementById('map').style.right = '300px';
				mMeasure.setTool("area", false);
				mMeasure.setTool("distance", false);
				mMeasure.setTool("location", false);
				mMeasure.clearResult();
				finder.copyVars(findParams, findTask, map, new Graphic(), setSelectionSymbol("point"), setSelectionSymbol("polygon"), setSelectionSymbol("polyline"));
				finder.builtFinder();
				mapClick.remove();
				cursorOut();
			} else {
				dom.byId('searchPanel').style.display = 'none';
				document.getElementById('map').style.right = '40px';
				document.getElementById('featureCount').innerHTML = 'Кликните по объекту для идентификации';
				map.graphics.clear();
				grPollPnt.clear();
				$('#clearSelBut').hide();
				$('#previous').hide();
				$('#next').hide();
				finder.clearFinder();
				cursorOut();
			}
		});

		// Панель профиля
		on(dom.byId("ProfileBut"), "click", function () {
			//$("#searchPanel").toggleClass("activeTab");
			$(this).toggleClass("activeButton");
			if (dom.byId('profileContainer').style.display == 'none') {
				profileMaker.copyVars(map);
				profileMaker.initProfileMaker();
				map.graphics.clear();
				grPollPnt.clear();
				mMeasure.setTool("area", false);
				mMeasure.setTool("distance", false);
				mMeasure.setTool("location", false);
				mMeasure.clearResult();
			} else {
				profileMaker.resetProfileMaker();
			}
		});


		// Функции для изменения указателя мыши
		function cursorOver() { map.setMapCursor("help"); };
		function cursorOut() { map.setMapCursor("default"); };

		//Функция для кнопки очистки выбранных объектов
		function clickClearSelBut() {
			document.getElementById('rightPane').innerHTML = '';
			document.getElementById('featureCount').innerHTML = 'Кликните по объекту для идентификации';
			map.graphics.clear();
			grPollPnt.clear();
			document.getElementById('clearSelBut').style.display = 'none';
			document.getElementById('previous').style.display = 'none';
			document.getElementById('next').style.display = 'none';
		}

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


		function initFunctionallity() {
			//map.on("click", doIdentify);
			identifyTask = new IdentifyTask("http://maps.psu.ru:8080/arcgis/rest/services/KUB/Pollution_KUB/MapServer");

			identifyParams = new IdentifyParameters();
			identifyParams.tolerance = 5;
			identifyParams.layerIds = [4, 5, 6, 7, 8, 9, 10, 12, 14, 17, 20, 23, 24, 26];
			identifyParams.layerOption = IdentifyParameters.LAYER_OPTION_VISIBLE;
			identifyParams.width = map.width;
			identifyParams.height = map.height;

			// find tasks
			findTask = new FindTask("http://maps.psu.ru:8080/arcgis/rest/services/KUB/Pollution_KUB/MapServer/");

			findParams = new FindParameters();


		}

		// Identify
		function doIdentify(event) {

			// make identify

			identifyParams.geometry = event.mapPoint;
			identifyParams.returnGeometry = true;
			identifyParams.mapExtent = map.extent;
			identifyParams.maxAllowableOffset = 10;
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

				return "Ничего не выбрано"
			}


			var currentContent = "<table cellpadding='1'>"

			currentContent += "<tr><td class='tdGray'>Слой: </td><td>" +
				currentObject.layerName + "</td></tr>"

			$.each(currentObject.feature.attributes, function (key, value) {
				// exlcuded fields 
				if (key !== "OBJECTID"
					&& key !== "Shape"
					&& key !== "objectid"
					&& key !== "shape"
					&& key !== "st_area(shape)"
					&& key !== "objectid_1"
				) {

					// round float fields values, other stay as they are, also parsing integer number as integer
					let formattedValue = parseFloat(value) ? parseFloat(value).toFixed(2) % 1 == 0 ?
						parseFloat(value).toFixed(0): parseFloat(value).toFixed(2): value

					currentContent += "<tr><td class='tdGray'>" + key + "</td><td>" +
						formattedValue + "</td></tr>"
				}

			});

			if (currentObject.layerId === 5 ||
				currentObject.layerId === 6 ||
				currentObject.layerId === 7 ||
				currentObject.layerId === 8 ||
				currentObject.layerId === 9 ||
				currentObject.layerId === 12) {
				currentContent += "<tr><td colspan='2' style = 'text-align:center'><button id = 'addInfo' class = 'modalButton' style = 'font-size: 13px;padding:0'> Дополнительная информация </button></td></tr>"
			}

			if (currentObject.layerId === 23 ||
				currentObject.layerId === 24) {
				currentContent += "<tr><td colspan='2' style='text-align:center;'>Источники загрязнения</td></tr>"
				currentContent += "<tr><td colspan='2'><canvas id='chart-area' width='230px' height='230px'></canvas></td></tr>"
			}

			if (currentObject.layerId == 9 && (currentObject.feature.attributes.OBJECTID == 1 ||
				currentObject.feature.attributes.OBJECTID == 2 ||
				currentObject.feature.attributes.OBJECTID == 3 ||
				currentObject.feature.attributes.OBJECTID == 4 ||
				currentObject.feature.attributes.OBJECTID == 6 ||
				currentObject.feature.attributes.OBJECTID == 7 ||
				currentObject.feature.attributes.OBJECTID == 8 ||
				currentObject.feature.attributes.OBJECTID == 10 ||
				currentObject.feature.attributes.OBJECTID == 11 ||
				currentObject.feature.attributes.OBJECTID == 15 ||
				currentObject.feature.attributes.OBJECTID == 16 ||
				currentObject.feature.attributes.OBJECTID == 17 ||
				currentObject.feature.attributes.OBJECTID == 21 ||
				currentObject.feature.attributes.OBJECTID == 24 ||
				currentObject.feature.attributes.OBJECTID == 25 ||
				currentObject.feature.attributes.OBJECTID == 26 ||
				currentObject.feature.attributes.OBJECTID == 27 ||
				currentObject.feature.attributes.OBJECTID == 28 ||
				currentObject.feature.attributes.OBJECTID == 29 ||
				currentObject.feature.attributes.OBJECTID == 30 ||
				currentObject.feature.attributes.OBJECTID == 31 ||
				currentObject.feature.attributes.OBJECTID == 32 ||
				currentObject.feature.attributes.OBJECTID == 33 ||
				currentObject.feature.attributes.OBJECTID == 34 ||
				currentObject.feature.attributes.OBJECTID == 35 ||
				currentObject.feature.attributes.OBJECTID == 37 ||
				currentObject.feature.attributes.OBJECTID == 38 ||
				currentObject.feature.attributes.OBJECTID == 39)) {
				currentContent += "<tr><td colspan='2' style = 'text-align:center'><button id = 'addTable' class = 'modalButton' style = 'font-size: 13px; padding:0; line-height:1.2em'> Список источников загрязнения<br>поверхностных вод </button></td></tr>"
			}

			currentContent += "</table>"

			return currentContent
		}

		function PrepareDataForPieChart(geometry) {
			var IdsLyrForQuery = ["5", "6", "7"];
			Promise.all(IdsLyrForQuery.map(function (element) {
				var urlLayerQuery = "http://maps.psu.ru:8080/arcgis/rest/services/KUB/Pollution_KUB/MapServer/" + element;
				var qt = new QueryTask(urlLayerQuery);
				var queryParams = new Query();
				queryParams.returnGeometry = false;
				queryParams.outFields = ["objectid"];
				queryParams.spatialRelationship = Query.SPATIAL_REL_INTERSECTS;
				queryParams.geometry = geometry;
				return qt.execute(queryParams, function (results) {
					//console.log(results);
					//console.log(results.features.length);
					return results;
				});
			})).then(values => CreatePieChart(values.map(function (e) {
				return e.features.length
			})));
		}

		//create new pie diagram with pollution points statistics in bassins

		function CreatePieChart(data) {
			// if zeros data return nothing
			let isEmpty = !data.some(el => el !== 0);
			if (isEmpty) {
				return
			}
			var config = {
				type: 'pie',
				data: {
					datasets: [{
						data: data,
						backgroundColor: [
							'#828282',
							'#ff00c5',
							'#730000',
						],
						label: 'Dataset 1'
					}],
					labels: massPointLabels
				},
				options: {
					responsive: true,
					legend: {
						display: true,
						position: 'bottom',
						labels: {
							boxWidth: 20
						}
					}
				}
			};

			var ctx = document.getElementById("chart-area").getContext("2d");
			var myPie = new Chart(ctx, config);
		}

		//load identify results to dom element

		function loadResults(number) {

			registry.byId("rightPane").set("content",
				createTable(identifyResults[number]));
			PrepareDataForPieChart(identifyResults[number].feature.geometry);

			// load first time
			if (number == 0) {
				$("#featureCount").html("Выбрано объектов: " + identifyResults.length +
					" ( " + 1 + " из " + identifyResults.length + " )");
				map.graphics.clear();
				grPollPnt.clear();
				map.graphics.add(new Graphic(identifyResults[selectedInfoNumber].feature.geometry,
					setSelectionSymbol(identifyResults[selectedInfoNumber].feature.geometry.type)))
			}

			// add graphic of selected feature (with pre-selecting symbol)


			$('#clearSelBut').show();
			$('#previous').show();
			$('#next').show();

			// exception when button don't exist
			try {
				on(dom.byId("addInfo"), "click", showAddInfo);
			} catch (error) {
				console.log("Кнопка не создана");
				console.log(error);
			}

			//on(dom.byId("addInfo"), "click", loadModal);
			try {
				on(dom.byId("addTable"), "click", selectObsBuss);
			} catch (error) {
				console.log("Кнопка не создана");
				console.log(error);
			}

		}

		// assert click for next and previous
		function assertClick() {
			on(dom.byId("next"), "click", nextClick);
			on(dom.byId("previous"), "click", previousClick);
			on(dom.byId("clearSelBut"), "click", clickClearSelBut);
		}

		// next click

		function nextClick() {
			try {
				loadResults(selectedInfoNumber + 1);
				selectedInfoNumber = selectedInfoNumber + 1;
				map.graphics.clear();
				grPollPnt.clear();
				map.graphics.add(new Graphic(identifyResults[selectedInfoNumber].feature.geometry,
					setSelectionSymbol(identifyResults[selectedInfoNumber].feature.geometry.type)));
				$("#featureCount").html("Выбрано объектов: " + identifyResults.length +
					" ( " + (selectedInfoNumber + 1) + " из " + identifyResults.length + " )");


			} catch (error) {
				console.log(error)
				console.log("Дошли до конца")
			}
			finally {
				//
			}
		}

		// previous click

		function previousClick() {
			try {
				loadResults(selectedInfoNumber - 1);
				selectedInfoNumber = selectedInfoNumber - 1;
				map.graphics.clear();
				grPollPnt.clear();
				map.graphics.add(new Graphic(identifyResults[selectedInfoNumber].feature.geometry,
					setSelectionSymbol(identifyResults[selectedInfoNumber].feature.geometry.type)));

				$("#featureCount").html("Выбрано объектов: " + identifyResults.length +
					" ( " + (selectedInfoNumber + 1) + " из " + identifyResults.length + " )");



			} catch (error) {
				console.log(error)
				console.log("Дошли до начала")
			}
			finally {
				//
			}
		}


		function showAddInfo() {

			//console.log(identifyResults[selectedInfoNumber])

			identificationLayerId = identifyResults[selectedInfoNumber].layerId

			let targetLyr = new FeatureLayer("http://maps.psu.ru:8080/arcgis/rest/services/KUB/Pollution_KUB/MapServer/" +
				identificationLayerId)

			let relatedTaskResult = [];

			targetLyr.on("load", function () {

				var relatedQuery = new RelationshipQuery();

				relatedQuery.objectIds = [identifyResults[selectedInfoNumber].feature.attributes.OBJECTID];
				relatedQuery.outFields = ["*"];

				Promise.all(targetLyr.relationships.map(function (element) {

					//console.log(element.id);

					relatedQuery.relationshipId = element.id

					// return promise in list with map function
					return targetLyr.queryRelatedFeatures(relatedQuery, function (relatedRecords) {
						// in promise return related record
						return relatedRecords;
					})
				})).then(values => prepareRelatedDataToChart(values));
			})
		}

		function prepareRelatedDataToChart(arrOfData) {
			// transform related data from server to specific view:
			// arr - for each related table
			var arr = arrOfData.map(function (e) {
				//console.log(e);

				// go by key necessary for accessing features
				for (key in e) {
					var dates;
					//console.log(element[key].features)

					// each feature transform to object with date key 
					//and atrributes as property and return in list
					dates = e[key].features.map(function (element) {

						var transformObject = {};
						//dateArr.push(element.attributes.date_proby)
						//console.log(new Date(element.attributes.date_proby))

						// !!! in other table maybe other name of date_proby!!! 
						let dateValue;

						if (parseInt(element.attributes.date_proby)) {
							dateValue = parseInt(element.attributes.date_proby);
						} else {
							dateValue = parseInt(element.attributes.data);
						}
						if (dateValue) {
							transformObject[dateValue] = element.attributes
						}
						return transformObject
					})
					return dates.sort(function (a, b) {
						return parseInt(Object.keys(a)[0]) - parseInt(Object.keys(b)[0])
					});
				}

			});

			if (arr.length) {
				loadModal(arr, identificationLayerId);
			} else {
				alert("Нет дополнительной информации для точки")
			}


		}

		//Remove table in DOM for list with pollution points
		function removePollPnrTbl() {
			$("#addTable").replaceWith("<button id = 'delTable' class = 'modalButton' style = 'font-size: 13px; padding:0; line-height:1.2em'> Скрыть список<br> источников загрязнения </button>");
			$("#delTable").on("click", function () {
				$("#delTable").replaceWith("<button id = 'addTable' class = 'modalButton' style = 'font-size: 13px; padding:0; line-height:1.2em'> Список источников загрязнения<br>поверхностных вод </button>");
				$("#pollPntTable").remove();
				grPollPnt.clear();
				$("#addTable").on("click", selectObsBuss);
			});
		}

		//Selection watershed in observation point for surface waters
		function selectObsBuss() {
			let ObservationBass = "http://maps.psu.ru:8080/arcgis/rest/services/KUB/ObservationBass/MapServer/0";
			var qtBass = new QueryTask(ObservationBass);
			var QueryObsBass = new Query();
			QueryObsBass.where = "objectid = '" + [identifyResults[selectedInfoNumber].feature.attributes.OBJECTID] + "'";
			QueryObsBass.returnGeometry = true;
			QueryObsBass.maxAllowableOffset = 10;
			QueryObsBass.outFields = ["*"];
			qtBass.execute(QueryObsBass, function (results) {
				selectPollPnt(results.features[0].geometry);
			});
		}

		//Selection pollution points in watershed
		function selectPollPnt(objectBass) {
			var IdsPollutLyrForQuery = ["5", "6", "7"];
			Promise.all(IdsPollutLyrForQuery.map(function (element) {
				var urlLayerQuery = "http://maps.psu.ru:8080/arcgis/rest/services/KUB/Pollution_KUB/MapServer/" + element;
				var qtPollPnt = new QueryTask(urlLayerQuery);
				var queryPollPnt = new Query();
				queryPollPnt.spatialRelationship = Query.SPATIAL_REL_INTERSECTS;
				queryPollPnt.returnGeometry = true;
				queryPollPnt.outFields = ["*"];
				queryPollPnt.geometry = objectBass;
				return qtPollPnt.execute(queryPollPnt, function (results) {
					return results;
				}, function (error) {
					console.log(error);
				});
			})).then(values => showAddTable(values.map(function (e) {
				return e.features;
			})));
		}

		//Create table in DOM for list with pollution points
		function showAddTable(objectPollPnt) {
			console.log(objectPollPnt);
			$("#rightPane").append('<div id="pollPntTable">');
			$("#pollPntTable").html(createPollPntTable(objectPollPnt));
			removePollPnrTbl();
			$("#tblPollPnt").on("mouseenter", ".PollPnts", objectPollPnt, selectPollObject);
			$("#tblPollPnt").on("mouseleave", ".PollPnts", objectPollPnt, clearPollObject);
		}

		//Create table with list pollution points in watershed
		function createPollPntTable(objectPollPnt) {
			var currentContentPollPnt = "<table id='tblPollPnt' cellpadding='1' cellspacing='0' style='text-align:center; font-size:8pt'>"
			currentContentPollPnt += "<tr><td class='tdGray' colspan='3'style='text-align:center; font-size:13px; line-height:1.2em''>Источники загрязнения<br> поверхностных вод</td></tr>"
			currentContentPollPnt += "<tr style='background-color:#ccd9d6'><td class='tdGray'>Тип</td><td>Название</td><td>Река-приемник<br> загрязненного стока</td></tr>"
			var i;
			var rowColor = '#dde7cc';
			for (i = 0; i < objectPollPnt[0].length; i++) {
				if (rowColor == '#f8eeb0') {
					rowColor = '#dde7cc';
				} else {
					rowColor = '#f8eeb0';
				}
				currentContentPollPnt += "<tr class='PollPnts' id='" + objectPollPnt[0][i].attributes.objectid + objectPollPnt[0][i].attributes.nazvanie + "' style='background-color:" + rowColor + "'><td class='tdGray'>Отвал</td><td>" +
					objectPollPnt[0][i].attributes.nazvanie + "</td><td>" +
					objectPollPnt[0][i].attributes.river + "</td></tr>"
			}
			for (i = 0; i < objectPollPnt[1].length; i++) {
				if (rowColor == '#f8eeb0') {
					rowColor = '#dde7cc';
				} else {
					rowColor = '#f8eeb0';
				}
				currentContentPollPnt += "<tr class='PollPnts' id='" + objectPollPnt[1][i].attributes.objectid + objectPollPnt[1][i].attributes.nazvanie + "' style='background-color:" + rowColor + "'><td class='tdGray'>Излив</td><td>" +
					objectPollPnt[1][i].attributes.nazvanie + "</td><td>" +
					objectPollPnt[1][i].attributes.river + "</td></tr>"
			}
			for (i = 0; i < objectPollPnt[2].length; i++) {
				if (rowColor == '#f8eeb0') {
					rowColor = '#dde7cc';
				} else {
					rowColor = '#f8eeb0';
				}
				currentContentPollPnt += "<tr class='PollPnts' id='" + objectPollPnt[2][i].attributes.objectid + objectPollPnt[2][i].attributes.nazvanie + "' style='background-color:" + rowColor + "'><td class='tdGray'>Родник</td><td>" +
					objectPollPnt[2][i].attributes.nazvanie + "</td><td>" +
					objectPollPnt[2][i].attributes.river + "</td></tr>"
			}
			currentContentPollPnt += "</table>"

			return currentContentPollPnt
		}

		//show pollution points on map
		function selectPollObject(event) {
			//console.log(this);
			//console.log(event.data);
			trElem = $(this);
			trElemId = $(this).attr('id');
			rowColorInit = $(this).attr('style');
			if (trElemTwo != undefined) {
				if (trElemId != trElemIdTwo) {
					trElemTwo[0].attributes[2].value = rowColorInitTwo;
				} else {
					rowColorInit = rowColorInitTwo;
				}
			}
			var i, j;
			for (i = 0; i < event.data.length; i++) {
				for (j = 0; j < event.data[i].length; j++) {
					if (event.data[i][j].attributes.objectid + event.data[i][j].attributes.nazvanie == trElemId) {
						grPollPnt.clear();
						grPollPnt.add(new Graphic(event.data[i][j].geometry,
							new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 15, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
								new Color([0, 0, 0]), 1.5), new Color([0, 150, 0, 0.8]))));
						$(this).attr('style', 'background-color:#009600');
					}
				}
			}
		}

		function clearPollObject() {
			if ($(':hover').length > 4) {
				if ($(':hover')[5].attributes[0].value == "pollPntTable") {
					$(this).attr('style', rowColorInit);
				} else {
					rowColorInitTwo = rowColorInit;
					trElemTwo = trElem;
					trElemIdTwo = trElemId;
				}
			} else {
				rowColorInitTwo = rowColorInit;
				trElemTwo = trElem;
				trElemIdTwo = trElemId;
			}
			// $(this).attr('style', rowColorInit);
		}


		function setSelectionSymbol(typeGeometry) {
			// set point symbol
			switch (typeGeometry) {
				case "point":
					return new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 15, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
						new Color([0, 0, 0]), 1.5), new Color([248, 0, 0, 0.8]));

				case "polygon":
					return new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
						new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([205, 10, 20, 1]), 2.5),
						new Color([125, 125, 125, 0.5]));

				case "polyline":
					return new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([102, 0, 0, 1]), 7.5)
			}
		}

	});