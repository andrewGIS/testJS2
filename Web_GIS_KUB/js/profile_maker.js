var profileMaker = function () {

    var gp; // geoproccesoor task
    var queryTask; // query river geometry from server
    var query; // query river geometry from server
    var profile_chart; // built graph
    var mapCopy;// copy for map object
    var profileData;// store native data from profile
    var grLayerRiver; // graphic layer for selected river
    var grLayerPnt;// graphic layer for selected point
    var step = 1000;; // step for profile
    var NAparams; // parameters for routing
    var closestFacilityTask; // routing


    // copy vars in module
    function copyVars(map) {
        mapCopy = map;
    }

    // make html elements
    function initProfileMaker() {


        $("#map").css("bottom", "calc(20px + 25% + 2px)");
        $("#profileContainer").show();


        require([
            "esri/tasks/query",
            "esri/tasks/QueryTask",
            "esri/symbols/SimpleMarkerSymbol",
            "esri/symbols/SimpleLineSymbol",
            "esri/renderers/SimpleRenderer",
            "esri/layers/GraphicsLayer",
            "esri/tasks/Geoprocessor",
            "esri/Color",
            "esri/graphic",
            "esri/geometry/Point",

        ], function (Query, QueryTask, SimpleMarkerSymbol, SimpleLineSymbol, SimpleRenderer, GraphicsLayer, Geoprocessor, Color, Graphic, Point) {

            query = new Query();
            queryTask = new QueryTask("http://maps.psu.ru:8080/arcgis/rest/services/KUB/river_for_profile/MapServer/0");
            //riverRenderer = new SimpleRenderer(lineStyle);
            //pointRenderer = new SimpleRenderer(pointStyle);
            //gp = new Geoprocessor("http://maps.psu.ru:8080/arcgis/rest/services/KUB/Profile/GPServer/profile_maker_2");
            gp = new Geoprocessor("http://maps.psu.ru:8080/arcgis/rest/services/KUB/prMaker/GPServer/profile_maker_6");
            grLayerRiver = new GraphicsLayer();
            grLayerPnt = new GraphicsLayer();

            pointGeometry = new Point();
            pointGeometry.spatialReference = mapCopy.spatialReference;

            pointStyle = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 15, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
                new Color([0, 0, 0]), 1.5), new Color([248, 0, 0, 0.8]));
            pointGraphic = new Graphic();

            profile_chart = new Highcharts.chart('profile_graph', {
                xAxis: {
                    categories: []
                },
                plotOptions: {
                    series: {
                        point: {
                            events: {
                                mouseOver: function (e) {
                                    //console.log(e);
                                    //console.log(profileData[e.target.index]);
                                    pointGeometry.x = profileData[e.target.index][0]
                                    pointGeometry.y = profileData[e.target.index][1]
                                    pointGraphic.setGeometry(pointGeometry);
                                    pointGraphic.setSymbol(pointStyle);
                                    //mapCopy.graphics.add(pointGraphic);
                                    grLayerPnt.add(pointGraphic);
                                }
                            }
                        }
                    }
                },
                legend: {
                    enabled: false
                },
                chart: {
                    zoomType: 'x'
                },
                series: [{
                    name: "Значение показателя",
                    data: [],
                    dataGrouping: {
                        enabled: false
                    }
                }],
                title: {
                    // Title of chart as Профиль реки и выбранная река
                    text: "Профиль реки " + $("label[for='" + $("#river_choice :checked").attr('id') + "']").html()
                }

            })

        })

        grLayerPnt.clear(); // clear point
        grLayerRiver.clear();// clear river

        mapCopy.addLayer(grLayerRiver);
        mapCopy.addLayer(grLayerPnt);

        //startGP();

        $("#surface_choice").on("click", "option", function () {
            startGP();
        });

        $("#river_choice").on("click", "input", function () {
            startGP();
        });


        set_params_NA();

    }

    function startGP() {
        //console.log(this);

        // $("#profile_graph").toggleClass("loader");
        profile_chart.showLoading();

        // reading current values selected river
        let idRiver = parseInt($("#river_choice :checked").val());
        let expression = "type = " + parseInt(idRiver);

        // get river geometry from server
        query.returnGeometry = true;
        query.where = "type = " + idRiver
        queryTask.execute(query, function (results) {
            //console.log(results);
            drawRiver(results.features[0]);
        })

        var paramsGp = {
            "Expression": expression,
            "step": step,
        };

        gp.submitJob(paramsGp, successGp, executeGp);
        //gp.execute(paramsGp).then(successGp);


    }

    // handle gP error
    function executeGp(e) {
        // profile_chart.hideLoading();
        console.log(e.jobStatus);
    }


    // success gP
    function successGp(job) {
        // enable options
        //console.log(results);
        //var zArray = results[0].value.features[0].geometry.paths[0].map(function (coord, index, arr) {
        //return coord[2]
        //})
        //builtProfile(zArray);
        //gp.getResultData(job.jobId, "outLine", function (outLine) {
        //console.log(outLine)
        //});

        //http://elevation.arcgis.com/arcgis/rest/services/Tools/Elevation/GPServer/Profile/jobs/<jobId>/results/OutputProfile?token=<your token>&returnZ=true&returnM=true&f=json

        //"http://maps.psu.ru:8080/arcgis/rest/services/KUB/Profile/GPServer/profile_maker_2/jobs/"+results.jobId+"/results/outLine?returnZ=true&returnM=false&f=json"

        // change out parameter
        let nameParam = $("#surface_choice :checked").val()

        $.ajax({
            // url: "http://maps.psu.ru:8080/arcgis/rest/services/KUB/Profile/GPServer/profile_maker_2/jobs/" + job.jobId + "/results/outLine?returnZ=true&returnM=true&f=json",
            url: "http://maps.psu.ru:8080/arcgis/rest/services/KUB/prMaker/GPServer/profile_maker_6/jobs/" + job.jobId + "/results/" + nameParam + "?returnZ=true&returnM=false&f=json",
            dataType: 'json'
        }).done(function (data) {

            console.log(data);

            profileData = data.value.features[0].geometry.paths[0];
            let zArray = data.value.features[0].geometry.paths[0].map(function (coord, index, arr) {
                return +coord[2].toFixed(2)
            })
            let labelsArr = data.value.features[0].geometry.paths[0].map(function (coord, index, arr) {
                return index * step / 1000 + "км."
            })
            updateChartData(zArray, labelsArr);
            //     //drawRiver(data.value.features[0]);
            //     // passing to neccessaary features
            //     // data.value.features[0].geometry.paths
            // })

        });
    }

    // make profile
    function updateChartData(dataArr, labelsArr) {

        profile_chart.hideLoading();

        profile_chart.setTitle({ text: "Профиль реки " + $("label[for='" + $("#river_choice :checked").attr('id') + "']").html() });
        profile_chart.series[0].setData(dataArr);
        profile_chart.xAxis[0].setCategories(labelsArr);


    }

    // clear element of Profile
    function resetProfileMaker() {
        $("#profileContainer").hide();
        $("#map").css("bottom", "20px");
        $("#river_choice").off();
        $("#surface_choice").off();
        profile_chart.destroy();
        grLayerPnt.clear(); // clear point
        grLayerRiver.clear();// clear river
    }

    // draw selected river on map
    function drawRiver(feature) {

        var lineStyle; // style for selected line
        var lineGraphic; // style for selected line

        grLayerPnt.clear();
        grLayerRiver.clear();

        require([
            "esri/symbols/SimpleLineSymbol",
            "esri/graphic",
            "esri/Color"
        ], function (SimpleLineSymbol, Graphic, Color) {
            lineStyle = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([102, 0, 0, 1]), 2);
            lineGraphic = new Graphic();
        })

        lineGraphic.setGeometry(feature.geometry);
        lineGraphic.setSymbol(lineStyle);
        //mapCopy.graphics.add(graphicCopy);
        grLayerRiver.add(lineGraphic);

    }

    //init NA server paramaters
    function set_params_NA() {
        require([
            "esri/tasks/ClosestFacilityTask",
            "esri/tasks/ClosestFacilityParameters",
            "esri/tasks/FeatureSet",
            "esri/graphic",
            "esri/geometry/Point",
            "esri/symbols/SimpleLineSymbol",
            "esri/Color"
        ], function (ClosestFacilityTask, ClosestFacilityParameters, FeatureSet, Graphic, Point,SimpleLineSymbol,Color) {

            NAparams = new ClosestFacilityParameters();
            NAparams.returnRoutes = true;

            let facilities = new FeatureSet();
            facilities.features = [new Graphic(new Point(6304047.245, 8157519.766, mapCopy.spatialReference)),
                                   new Graphic(new Point(6359320.8593, 8004508.7757, mapCopy.spatialReference)),
                                   new Graphic(new Point(6310216.6529, 8247780.4975, mapCopy.spatialReference))];

            NAparams.facilities = facilities;
            NAparams.outSpatialReference = mapCopy.spatialReference;


            let incidents = new FeatureSet();
            incidents.features = [new Graphic(new Point(6381746.283, 8171622.345, mapCopy.spatialReference))];
            NAparams.incidents = incidents;   

            closestFacilityTask = new ClosestFacilityTask("http://maps.psu.ru:8080/arcgis/rest/services/KUB/network_river/NAServer/make_route")

            closestFacilityTask.solve(NAparams, function(solveResult){
                console.log(solveResult)
                route = solveResult.routes[0]
                route.symbol = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0,255,255],0.25), 4.5);
                mapCopy.graphics.add(route);
            })
        })
    }

    return {
        initProfileMaker: initProfileMaker,
        copyVars: copyVars,
        resetProfileMaker: resetProfileMaker
    }
}()