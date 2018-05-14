var finder = function () {

    var fTaskCopy, fParamsCopy, mapCopy;
    var graphicCopy, pointSymbolCopy, polySymbolCopy, polylineSymbolCopy;
    var findRes;

    // копирование переменных в модуль
    function copyVars(fParms, fTask, map, graphic, pointSymbol, polySymbol, polylineSymbol) {
        fParamsCopy = fParms;
        fTaskCopy = fTask;
        mapCopy = map;
        graphicCopy = graphic;
        pointSymbolCopy = pointSymbol;
        polySymbolCopy = polySymbol;
        polylineSymbolCopy = polylineSymbol;
    }

    // построение окна поиска
    function builtFinder() {
        $('#featureCount').html("Панель поиска <style align='center'>");
        //$("#rightPane").html("<input type='text' id='searchText' size='30' placeholder = 'Введите искомое значение'/><button id='runSearch' class = 'modalButton'>Запуск поиска</button><button id='clearSearch' class = 'modalButton'>Очистить результаты</button><div id='tblSearch'></div>");
        $("#pager").html("<input type='text' id='searchText' placeholder = 'Введите искомое значение'/><button id='runSearch' class = 'modalButton findButton'>Запуск поиска</button><button id='clearSearch' class = 'modalButton findButton'>Очистить результаты</button><div id='tblSearch'></div>");

        //$("#executeFind").on('click',executeFind);
        //$("#searchText").on('input', executeFind);
        $("#runSearch").on('click', executeFind);
        $("#clearSearch").on('click', clearResult);
    }

    // Выполнение поиска
    function executeFind() {
        fParamsCopy.searchText = $("#searchText").val();
        fParamsCopy.layerIds = [4, 6, 7, 12, 19, 21, 23, 24];
        //fParamsCopy.layerIds = [4, 6, 7, 12, 19, 21];
        fParamsCopy.returnGeometry = true;
        //fParms.searchFields = ["*"];
        fParamsCopy.searchFields = ["name", "nazvanie", "bassin", "river", "sem9"];
        fTaskCopy.execute(fParamsCopy, showResults);
        //showResults();
        //console.log('Hello');
    }

    // Вывод результатов
    function showResults(results) {
        $('#featureCount').html("Найдено объектов: " + results.length);
        $("#tblSearch").empty();
        console.log(results);
        findRes = results;
        $.each(results, function (key, value) {
            $("#tblSearch").append("<tr class = 'rawResult'><td class = 'resObjName'>" + value.value + "</td><td class = = 'resLayerName'> Слой: " + value.layerName + "</td><td><input id =" + key + " type='button' value='Приблизить к объекту' class = 'modalButton zoomButtonResult'/></td></tr>");
        })
        $("#tblSearch :input").on("click", zoomToObject);
        //$("#tblSearch button").on('click',zoomToObject())
    }

    // приближение к объекту
    function zoomToObject() {
        mapCopy.graphics.clear();
        console.log(this.id);
        console.log(findRes[this.id].feature.geometry);
        //mapCopy.centerAndZoom(findRes[this.id].feature.geometry, 17);
        //graphicCopy.setGeometry(findRes[this.id].feature.geometry);
        graphicCopy.setGeometry(findRes[this.id].feature.geometry);
        // customize symbol 
        switch (findRes[this.id].geometryType) {
            case "esriGeometryPoint":
                graphicCopy.setSymbol(pointSymbolCopy);
                mapCopy.graphics.add(graphicCopy);
                mapCopy.centerAndZoom(graphicCopy.geometry, 15);

            case "esriGeometryPolygon":
                mapCopy.graphics.add(graphicCopy);
                mapCopy.setExtent(findRes[this.id].feature.geometry.getExtent(), true);
                graphicCopy.setSymbol(polySymbolCopy);

            case "esriGeometryPolyline":
                mapCopy.graphics.add(graphicCopy);
                mapCopy.setExtent(findRes[this.id].feature.geometry.getExtent(), true);
                graphicCopy.setSymbol(polylineSymbolCopy);

        }

    }

    function clearResult() {
        $("#tblSearch").html("");
        $('#featureCount').html("Панель поиска");
        $("#searchText").val("");
        mapCopy.graphics.clear();

    }

    function clearFinder() {

        //    graphicCopy, pointSymbolCopy, polySymbolCopy, polylineSymbolCopy = null;
        //    fTaskCopy, fParamsCopy, mapCopy = null;
        findRes = null;
        //
        //
    }

    // Внешнее API
    return {
        builtFinder: builtFinder,
        copyVars: copyVars,
        clearFinder: clearFinder
    }
}()