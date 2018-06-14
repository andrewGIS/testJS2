var profileMaker = function () {

    var gp; // geoproccesoor task
    var queryTask; // query river geometry from server
    var query; // query river geometry from server
    var profile_chart; // buit graph
    var mapCopy;// copy for map object
    var profileData;// store native data from profile
    var grLayerRiver; // graphic layer for selected river
    var grLayerPnt;// graphic layer for selected point


    // copy vars in module
    function copyVars(map) {
        mapCopy = map;
    }

    // make html elements
    function initProfileMaker() {



        var routeRenderer;
        var pointRenderer;


        $("#map").css("bottom", "calc(20px + 25% + 2px)");
        $("#profileContainer").show();


        require([
            "esri/tasks/query",
            "esri/tasks/QueryTask",
            "esri/symbols/SimpleMarkerSymbol",
            "esri/symbols/SimpleLineSymbol",
            "esri/renderers/SimpleRenderer",
            "esri/layers/GraphicsLayer",
            "esri/tasks/Geoprocessor"

        ], function (Query, QueryTask, SimpleMarkerSymbol, SimpleLineSymbol, SimpleRenderer, GraphicsLayer, Geoprocessor) {

            query = new Query();
            queryTask = new QueryTask("http://maps.psu.ru:8080/arcgis/rest/services/KUB/river_for_profile/MapServer/0");
            //riverRenderer = new SimpleRenderer(lineStyle);
            //pointRenderer = new SimpleRenderer(pointStyle);
            //gp = new Geoprocessor("http://maps.psu.ru:8080/arcgis/rest/services/KUB/Profile/GPServer/profile_maker_2");
            gp = new Geoprocessor("http://maps.psu.ru:8080/arcgis/rest/services/KUB/prMaker/GPServer/profile_maker_5");
            grLayerRiver = new GraphicsLayer();
            grLayerPnt = new GraphicsLayer();

        })

        // new GraphicsLayer({"id":"river"}),
        //new GraphicsLayer({"id":"pnts"})


        // test to change prjection 
        //grLayer.spatialReference = {wkid:102100}        
        //grLayerPnt.spatialReference = {wkid:102100}       


        // setting render
        //grLayer.setRenderer(riverRenderer);
        //grLayerPnt.setRenderer(pointRenderer);

        grLayerPnt.clear(); // clear point
        grLayerRiver.clear();// clear river

        mapCopy.addLayer(grLayerRiver);
        mapCopy.addLayer(grLayerPnt);




        $("#river_choice").on("click", "input", function () {
            //console.log(this);
            query.returnGeometry = true;
            query.where = "type = " + parseInt(this.value)
            queryTask.execute(query, function (results) {
                //console.log(results);
                drawRiver(results.features[0]);
            })
            getInterpolatedLine(this.value);
        });




    }

    function getInterpolatedLine(idRiver) {

        var target_river = parseInt(idRiver);
        var parameter_for_interpolate = 1;
        var step = 1000;
        var expression = "type = " + parseInt(idRiver);

        var paramsGp = {
            "Expression": expression,
            "step": 100,
        };
        // var paramsGp = {
        //      "target_river": target_river,
        //      "parameter_for_interpolate": parameter_for_interpolate,
        //      "step_profile_for_interpolate": step
        // };

        gp.submitJob(paramsGp, successGp, errorGp);
        //gp.execute(paramsGp).then(successGp);



        //gp.execute(params, successGp , errorGp);


    }

    // handle gP error
    function errorGp(e) {
        console.log(e.jobStatus)
    }


    function successGp(job) {
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

        //console.log(job.jobId);

        // change out parameter
        $.ajax({
            // url: "http://maps.psu.ru:8080/arcgis/rest/services/KUB/Profile/GPServer/profile_maker_2/jobs/" + job.jobId + "/results/outLine?returnZ=true&returnM=true&f=json",
            url: "http://maps.psu.ru:8080/arcgis/rest/services/KUB/prMaker/GPServer/profile_maker_5/jobs/" + job.jobId + "/results/outLine_hillshade?returnZ=true&returnM=false&f=json",
            dataType: 'json'
        }).done(function (data) {
            console.log(data);
            profileData = data.value.features[0].geometry.paths[0];
            var zArray = data.value.features[0].geometry.paths[0].map(function (coord, index, arr) {
                return coord[2]
            })
            var labelsArr = data.value.features[0].geometry.paths[0].map(function (coord, index, arr) {
                return index * 10/1000 + "км."
            })
            builtProfile(zArray, labelsArr);
            //     //drawRiver(data.value.features[0]);
            //     // passing to neccessaary features
            //     // data.value.features[0].geometry.paths
            // })

        });
    }

    // make profile
    function builtProfile(dataArr, labelsArr) {


        var pointGeometry; // for point geometry
        var pointStyle;// style for selected point on profile
        var pointGraphic;// style for selected point on profile



        require([
            "esri/geometry/Point",
            "esri/symbols/SimpleMarkerSymbol",
            "esri/symbols/SimpleLineSymbol",
            "esri/Color",
            "esri/graphic"
        ], function (Point, SimpleMarkerSymbol, SimpleLineSymbol, Color, Graphic) {
            pointGeometry = new Point();
            pointGeometry.spatialReference = mapCopy.spatialReference;

            pointStyle = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 15, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
                new Color([0, 0, 0]), 1.5), new Color([248, 0, 0, 0.8]));
            pointGraphic = new Graphic();
        })


        profile_chart = new Highcharts.chart('profile_graph', {
            xAxis: {
                categories: labelsArr
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
                data: dataArr,
                dataGrouping: {
                    enabled: false
                }
            }]
        })

    }

    // clear dom element of Profile
    function resetProfileMaker() {
        $("#profileContainer").hide();
        $("#map").css("bottom", "20px");
        $("#river_choice").off();
        profile_chart.destroy();
    }

    // draw selected river on map
    function drawRiver(feature) {

        var lineStyle; // style for selected line
        var lineGraphic; // style for selected line


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

    return {
        initProfileMaker: initProfileMaker,
        copyVars: copyVars,
        resetProfileMaker: resetProfileMaker
    }
}()