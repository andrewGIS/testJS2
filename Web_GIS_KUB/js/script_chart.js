function loadModal() {

        modalListener();
        function modalListener() {
            //$(".modal-trigger").click(function (e) {
                //e.preventDefault();
                //dataModal = $(this).attr("data-modal");
                $("#modal-name").css({ "display": "block" });
            //});

            $(".close-modal, .modal-sandbox").click(function () {

                //clear modal window

                myBar.destroy();
                barChartData = undefined;
                document.getElementById("addDate").removeEventListener('click', addDate);
                document.getElementById("removeDate").removeEventListener('click', removeDate);
                document.getElementById("recalcPDK").removeEventListener('click', recalcPDK);
                document.getElementById("recalcPDK").removeEventListener('click', recalcPDK);
                $("#modal-listIndicator").off('click',);
                $(".modal").css({ "display": "none" });
            });
        }

        var barChartData;
        var color = Chart.helpers.color;
        var colorNames = Object.keys(window.chartColors);
        var myBar;
        var targetCanvas;

        // first indicator to show
        var firstElement = "ph";

        // test data

        var testIndicatorsValues = {
            "ph": {
                "values": [144, 142, 95],
                "alias": "Кислотность",
                "limit": 100,
                "color": 'rgb(255, 99, 132)'
            },
            "so4": {
                "values": [10, 12, 15],
                "alias": "Окись серы",
                "limit": 5,
                "color": 'rgb(255, 159, 64)'
            },
            "h3": {
                "values": [1000, 800, 20],
                "alias": "Тритий",
                "limit": 5,
                "color": 'rgb(255, 205, 86)'
            }
        }

        // test dates
        testDateValues = [1379548800000, 1377561600000, 1377561600000];

        createCheckboxes(testIndicatorsValues);

        document.getElementById("addDate").disabled = true;
        document.getElementById("addDate").addEventListener('click', addDate);
        document.getElementById("removeDate").addEventListener('click', removeDate);
        document.getElementById("recalcPDK").addEventListener('click', recalcPDK);


        init();



        // first data to load on chart
        // convert date to format

        function init() {

            barChartData = {
                labels: testDateValues.map(function (e) {
                    var options = {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    };
                    return new Date(e).toLocaleString("ru", options);
                }),
                datasets: [{
                    label: testIndicatorsValues[firstElement]['alias'],
                    backgroundColor: testIndicatorsValues[firstElement]['color'],
                    borderColor: window.chartColors.red,
                    borderWidth: 1,
                    data: testIndicatorsValues[firstElement]['values']
                }]

            };

            targetCanvas = document.getElementById("modal-canvas").getContext("2d");
            myBar = new Chart(targetCanvas, {
                    type: 'bar',
                    data: barChartData,
                    options: {
                        responsive: true,
                        legend: {
                            position: 'top',
                            onClick: (e) => e.stopPropagation()
                        },
                        title: {
                            display: true,
                            text: 'Chart.js Bar Chart'
                        }
                    }
                });

            
        }

        // listener for checkbox

        document.getElementsByTagName("fieldset")[0].addEventListener('click', function (e) {

            if (e.srcElement.defaultValue && e.srcElement.checked) {

                addIndicator(e.srcElement.defaultValue);

            } else if (e.srcElement.defaultValue && !e.srcElement.checked) {

                removeIndicator(e.srcElement.defaultValue);

            }
        })


        // TO DO
        // transfrom input object to dict with elements key (also can include limit value)

        // create checkboxes for each indicator in data object
        // TO DO list with new line

        function createCheckboxes(arr) {

            var fldList = document.getElementById("modal-listIndicator")

            fldList.innerHTML = ""

            for (indicator in arr) {

                // let checkbox = document.createElement('input');
                // let label = document.createElement('label');

                // if (indicator == firstElement) {
                //     checkbox.checked = true;
                // }
                // checkbox.type = "checkbox";
                // checkbox.name = "indicators";
                // checkbox.value = indicator;
                // checkbox.id = indicator;
                // checkbox.style.display = "block";
                // label.innerHTML = arr[indicator]["alias"];

                if (indicator == firstElement) {
                    fldList.innerHTML += '<input type="checkbox" name="indicators" value=' + indicator + ' checked/>'
                        + arr[indicator]["alias"] + '<br />'
                }
                else {
                    fldList.innerHTML += '<input type="checkbox" name="indicators" value=' + indicator + ' />'
                        + arr[indicator]["alias"] + '<br />'
                }
                //fldList.appendChild(checkbox);

            }
        }


        // add indicator to chart

        function addIndicator(indicatorName) {
            //var colorName = colorNames[barChartData.datasets.length % colorNames.length];;
            //var dsColor = window.chartColors[colorName];
            let dataToAdd;

            // check how to add data in pdk or not

            if (document.getElementById("recalcPDK").innerHTML == "Вернуть значения") {

                dataToAdd = testIndicatorsValues[indicatorName]['values'].map(function (value) {

                    return value / testIndicatorsValues[indicatorName]['limit'];

                });

            } else {

                dataToAdd = testIndicatorsValues[indicatorName]['values']

            }

            var newDataset = {
                label: testIndicatorsValues[indicatorName]['alias'],
                backgroundColor: testIndicatorsValues[indicatorName]['color'],
                borderColor: testIndicatorsValues[indicatorName]['color'],
                borderWidth: 1,
                data: dataToAdd
            };

            barChartData.datasets.push(newDataset);
            myBar.update();
        };


        // add date to chart

        function addDate() {

            // if nothing to add disable button addDate
            if (barChartData.labels.length + 1 == testDateValues.length) {

                document.getElementById("addDate").disabled = true

            }

            let curLabelsLength = barChartData.labels.length;

            if (barChartData.datasets.length > 0) {

                barChartData.labels = testDateValues.slice(0, curLabelsLength + 1).map(function (e) {
                    var options = {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    };
                    return new Date(e).toLocaleString("ru", options);
                });

                barChartData.datasets.forEach(function (dataset) {

                    let name = dataset.label

                    for (indicator in testIndicatorsValues) {

                        if (name === testIndicatorsValues[indicator]['alias']) {

                            // check how to add data in pdk or not

                            if (document.getElementById("recalcPDK").innerHTML == "Вернуть значения") {

                                dataset.data = testIndicatorsValues[indicator]['values'].map(function (value) {

                                    return value / testIndicatorsValues[indicator]['limit'];

                                });


                            } else {

                                dataset.data = testIndicatorsValues[indicator]['values'];

                            }



                        }
                    }
                });

                myBar.update();

            }
        };


        // remove indicator from chart

        function removeIndicator(indicatorName) {

            for (var index = 0; index < barChartData.datasets.length; ++index) {

                if (barChartData.datasets[index].label === testIndicatorsValues[indicatorName]['alias']) {

                    barChartData.datasets.splice(index, 1);
                }
            }
            myBar.update();
        };


        // remove last data

        function removeDate() {

            // disable remove date when one date left

            if (barChartData.labels.length + 1 == testDateValues.length) {

                document.getElementById("removeDate").disabled = true

            }

            barChartData.labels.splice(-1, 1); // remove the label first

            myBar.update();

            document.getElementById("addDate").disabled = false;
        };


        // recalc data with pdk limit value
        // if data in abs value recalc to pdk
        // oposite return initial values
        function recalcPDK() {

            if (document.getElementById("recalcPDK").innerHTML == "Пересчитать в ПДК") {

                document.getElementById("recalcPDK").innerHTML = "Вернуть значения";

                barChartData.datasets.forEach(function (dataset) {

                    let name = dataset.label

                    dataset.data = dataset.data.map(function (value) {

                        for (indicator in testIndicatorsValues) {

                            if (name == testIndicatorsValues[indicator]['alias']) {

                                return value / testIndicatorsValues[indicator]['limit'];
                            }
                        }
                    });

                });
            } else {
                document.getElementById("recalcPDK").innerHTML = "Пересчитать в ПДК";

                barChartData.datasets.forEach(function (dataset) {

                    let name = dataset.label

                    //dataset.data = dataset.data.map(function (value) {

                    for (indicator in testIndicatorsValues) {

                        if (name == testIndicatorsValues[indicator]['alias']) {

                            dataset.data = testIndicatorsValues[indicator]['values'];
                        }
                    }
                    //});
                });
            }

            myBar.update();
        }


}