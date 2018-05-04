var finder = function () {

    var fTaskCopy, fParamsCopy, mapCopy;
    var findRes;

    // копирование переменных в модуль
    function copyVars(fParms, fTask, map) {
        fParamsCopy = fParms;
        fTaskCopy = fTask;
        mapCopy = map;
    }

    // построение окна поиска
    function builtFinder() {
        $('#featureCount').html("Окно поиска");
        $("#rightPane").html("Текст для поиска: <input type='text' id='searchText' size='15' value='Kansas' /><div id='tblSearch'></div>");

        //$("#executeFind").on('click',executeFind);
        $("#searchText").on('input', executeFind);
    }

    // Выполнение поиска
    function executeFind() {
        fParamsCopy.searchText = $("#searchText").val();
        fParamsCopy.layerIds = [4, 5];
        fParamsCopy.returnGeometry = true;
        //fParms.searchFields = ["*"];
        fTaskCopy.execute(fParamsCopy, showResults);
        //showResults();
        console.log('Hello');
    }

    // Вывод результатов
    function showResults(results) {
        $("#tblSearch").empty();
        console.log(results);
        findRes = results;
        $.each(results, function (key, value) {
                $("#tblSearch").append("<tr><td>" + value.value + "</td><td>" + value.layerName + "</td><td><input id =" + key + " type='button' value='Find'/></td></tr>");
        })
        $("#tblSearch :input").on("click", zoomToObject,);
        //$("#tblSearch button").on('click',zoomToObject())
    }

    // приближение к объекту
    function zoomToObject() {
        console.log(this.id);
        console.log(findRes[this.id].feature.geometry);
        mapCopy.centerAndZoom(findRes[this.id].feature.geometry, 17);
    }

    // Внешнее API
    return {
        builtFinder: builtFinder,
        copyVars: copyVars
    }
}()