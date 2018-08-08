var profileMaker = function () {

    var gp; // geoproccesoor task
    var profile_chart; // built graph
    var mapCopy;// copy for map object
    var profileData;// store native data from profile
    var grLayerRiver; // graphic layer for selected river
    var grLayerPnt;// graphic layer for selected point
    var step = 1000;; // step for profile
    var mapCopyClicker; // clciker map
    var clickedPoint;// storing cliked point
    var current_job;// storing current job id



    // copy vars in module
    function copyVars(map) {
        mapCopy = map;
    }

    // make html elements
    function initProfileMaker() {


        $("#map").css("bottom", "calc(20px + 25% + 2px)");
        $("#profileContainer").show();
        $("#layerListDom").css("bottom", "calc(20px + 25% + 2px + 50px)");
        $("#searchPanel").css("bottom", "calc(20px + 25% + 2px)");
        $("#rightPanel").css("bottom", "calc(20px + 25% + 2px)");


        require([
            "esri/symbols/SimpleMarkerSymbol",
            "esri/symbols/SimpleLineSymbol",
            "esri/layers/GraphicsLayer",
            "esri/tasks/Geoprocessor",
            "esri/Color",
            "esri/graphic",
            "esri/geometry/Point",

        ], function (SimpleMarkerSymbol, SimpleLineSymbol, GraphicsLayer, Geoprocessor, Color, Graphic, Point) {

            gp = new Geoprocessor("http://maps.psu.ru:8080/arcgis/rest/services/KUB/get_line/GPServer/get_line");
            grLayerRiver = new GraphicsLayer();
            grLayerPnt = new GraphicsLayer();

            // setting style of selected point
            pointGeometry = new Point();
            pointGeometry.spatialReference = mapCopy.spatialReference;

            pointStyle = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 15, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
                new Color([0, 0, 0]), 1.5), new Color([248, 0, 0, 0.8]));
            pointGraphic = new Graphic();

            profile_chart = new Highcharts.chart('profile_graph', {
                xAxis: {
                    categories: []
                },
                yAxis: {
                    title: {
                        text: null
                    }
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
                    text: "Профиль реки " + $("label[for='" + $("#river_choice :checked").attr('id') + "']").html(),
                    style: {
                        fontSize: "16px"
                    }
                }

            })

            profile_chart.setTitle({ text: "Кликните по карте для начала расчета" });

        })

        grLayerPnt.clear(); // clear point
        grLayerRiver.clear();// clear river

        mapCopy.addLayer(grLayerRiver);
        mapCopy.addLayer(grLayerPnt);

        // event handler
        mapCopyClicker = mapCopy.on("click", function (e) {
            console.log(e)
            clickedPoint = e.mapPoint;
            startGP()
        })

    }

    function startGP() {
        profile_chart.showLoading();
        profile_chart.setTitle({ text: "Идет расчет" });

        let startRoutePoint;

        require([
            "esri/tasks/FeatureSet",
            "esri/graphic",
            "esri/geometry/Point",
        ], function (FeatureSet, Graphic, Point) {
            startRoutePoint = new FeatureSet();
            //startRoutePoint.features = [new Graphic(new Point(6381746.283, 8171622.345, mapCopy.spatialReference))]
            startRoutePoint.features = [new Graphic(clickedPoint)]
        })

        var paramsGp = {
            "indients": startRoutePoint,
            "Sampling_Distance": step,
        };

        gp.submitJob(paramsGp, successGp, statusGp, errorGp);
        //gp.execute(paramsGp).then(successGp);


    }

    // handle gP error
    function statusGp(e) {
        // profile_chart.hideLoading();
        current_job = e;
        console.log(e.jobStatus);

    }

    // success gP
    function successGp(job) {

        // change out parameter
        // let nameParam = $("#surface_choice :checked").val()
        let nameParam = "outLine_h"

        $.ajax({
            url: "http://maps.psu.ru:8080/arcgis/rest/services/KUB/get_line/GPServer/get_line/jobs/" + job.jobId + "/results/" + nameParam + "?returnZ=true&returnM=false&f=json",
            dataType: 'json'
        }).done(function (data) {

            //console.log(data);

            drawRoute(data.value.features[0])

            profileData = data.value.features[0].geometry.paths[0];
            let zArray = data.value.features[0].geometry.paths[0].map(function (coord, index, arr) {
                return +coord[2].toFixed(2)
            })
            let labelsArr = data.value.features[0].geometry.paths[0].map(function (coord, index, arr) {
                return index * (step / 1000) + "км."
            })

            updateChartData(zArray, labelsArr);

        });
    }

    // errorGp
    function errorGp() {

        profile_chart.setTitle({ text: "Ошибка" });
        profile_chart.hideLoading();

    }

    // make profile
    function updateChartData(dataArr, labelsArr) {

        profile_chart.hideLoading();

        // profile_chart.setTitle({ text: "Профиль реки " + $("label[for='" + $("#river_choice :checked").attr('id') + "']").html() });
        profile_chart.setTitle({ text: "Результат расчета " });
        profile_chart.series[0].setData(dataArr);
        profile_chart.xAxis[0].setCategories(labelsArr);


    }

    // clear element of Profile
    function resetProfileMaker() {

        $("#searchPanel").css("bottom", "20px");
        $("#layerListDom").css("bottom", "80px");
        $("#rightPanel").css("bottom", "20px");
        $("#profileContainer").hide();
        $("#map").css("bottom", "20px");
        $("#river_choice").off();
        $("#surface_choice").off();
        profile_chart.destroy();
        grLayerPnt.clear(); // clear point
        grLayerRiver.clear();// clear river
        mapCopyClicker.remove(); // remove event handler for map click

        // cancelling job if not wait end
        try {
            gp.cancelJob(current_job.jobId, function (info) {
                console.log(info.jobStatus);// reset job
            }, function (info) {
                console.log(info.jobStatus);
            });
            
        } catch (error) {
            // handle error if job is not started
            console.log("Job not started")
        }
        
    };

    // draw selected route on map
    function drawRoute(feature) {

        var lineStyle; // style for selected line
        var lineGraphic; // style for selected line
        var lineGeom; // geom for builted route

        grLayerPnt.clear();
        grLayerRiver.clear();

        require([
            "esri/symbols/SimpleLineSymbol",
            "esri/graphic",
            "esri/Color",
            "esri/geometry/Polyline"
        ], function (SimpleLineSymbol, Graphic, Color, Polyline) {
            lineStyle = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([102, 0, 0, 1]), 2);
            lineGraphic = new Graphic();
            lineGeom = new Polyline({ "paths": feature.geometry.paths, "spatialReference": mapCopy.spatialReference })
        })


        lineGraphic.setGeometry(lineGeom);
        lineGraphic.setSymbol(lineStyle);

        grLayerRiver.add(lineGraphic);

    }


    return {
        initProfileMaker: initProfileMaker,
        copyVars: copyVars,
        resetProfileMaker: resetProfileMaker
    }
}()