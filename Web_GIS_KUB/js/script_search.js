var singleton = function () {

    // Внутренняя логика
    function sayHello(fParms, fTask) {
        fParms.searchText = "а";
        fParms.layerIds = [4];
        fParms.searchFields = ["name"];
        fTask.execute(fParms, showResults);
        //showResults();
        console.log('Hello');
    }

    // Вывод результатов
    function showResults(results) {
        console.log(results);
    }

    // Внешнее API
    return {
        sayHello: sayHello
    }
}()