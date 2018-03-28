var barChartData;// data for chart
var myBar;// graphic
var targetCanvas;// canvas for chart drawing
var nativeData; // store for initial data
var chartType;// variable for first type of chart
var indicatorsValues;// keep template from elements with filled data
var dateValues;// list of obesrvation day
var firstElement; // first indicator to show
var charTitle;
var color;// variable from samples with charts
var colorNames;// variable from samples with charts
var dataForChartRaw;// variable from samples with charts


function modalListener() {
    // assert event handler for dom elements

    $(".close-modal, .modal-sandbox").click(function () {
        $('#modal-canvas').remove();
        $('#container').append('<canvas id="modal-canvas"><canvas>');
        $("#recalcPDK").off();
        $("#toggleChart").off();
        $("#modal-listIndicator").off();
        $("#modal-listDates").off();
        $(".modal").css({ "display": "none" });
        document.getElementById("modal-listDates").innerHTML = "";
        document.getElementById("modal-listIndicator").innerHTML = "";
        $("#addInfo").off();
        $("#toggleTable").off();
    });

    // listener for buttons
    document.getElementById("recalcPDK").addEventListener('click', recalcPDK);
    document.getElementById("toggleChart").addEventListener('click', toggleChart);
    document.getElementById("toggleTable").addEventListener('click', toggleTable);


    // listener for checkbox of indicators
    document.getElementById("modal-listIndicator").addEventListener('click', function (e) {

        if (e.target.defaultValue && e.target.checked) {

            addIndicator(e.target.defaultValue);

        } else if (e.target.defaultValue && !e.target.checked) {

            removeIndicator(e.target.defaultValue);

        }
    })

    // listener for checkbox of dates
    document.getElementById("modal-listDates").addEventListener('click', function (e) {

        if (e.target.defaultValue && e.target.checked) {
            // position of input date (when more then one elements is deleted)

            var checkedCheckboxIndex = $('input[name=dates]:checked').map(function (index, obj) {
                if (obj.value == e.target.defaultValue) {
                    return index;
                }
            })
            addDate(e.target.defaultValue, checkedCheckboxIndex[0]);

        } else if (e.target.defaultValue && !e.target.checked) {

            removeDate(e.target.defaultValue);

        }
    })
}

function formateDate(dateValue) {
    // transform date from string to locale date string
    var options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    return new Date(parseInt(dateValue)).toLocaleString("ru", options);
}


function init() {
    // create data for Chart and show modal window and create check boxes
    $("#modal-name").css({ "display": "block" });

    barChartData = {
        labels: dateValues.map(function (e) { return formateDate(e) }),
        datasets: [{
            label: indicatorsValues[firstElement]['alias'],
            backgroundColor: indicatorsValues[firstElement]['color'],
            borderColor: window.chartColors.red,
            borderWidth: 1,
            data: indicatorsValues[firstElement]['values']
        }]

    };


    myBar = new Chart(targetCanvas, {
        type: chartType,
        data: barChartData,
        options: {
            responsive: true,
            legend: {
                position: 'top',
                onClick: (e) => e.stopPropagation()
            },
            title: {
                display: true,
                text: charTitle,
                fontFamily: "'Segoe UI', 'Tahoma', 'Geneva', 'Verdana', 'sans-serif'",
                fontSize: 16
            },
            scales: {
                yAxes: [{
                    type: 'logarithmic',
                    ticks: {
                        callback: function (value, index, values) {//needed to change the scientific notation results from using logarithmic scale
                            return value.toFixed(3);//pass tick values as a string into Number function
                        }
                    },
                    afterBuildTicks: function (axe) {
                        console.log(axe.max);
                        let labelsCount = 3;
                        axe.ticks = range(0, axe.max, axe.max / labelsCount);// fill count defined labels depends on max value of chart 
                    }
                }]
            }
        }
    });
    

    createCheckboxesIndicator(indicatorsValues);
    createCheckboxesDates(dateValues);


}

function loadModal(dataForChart) {
    // calc variable for each record
    chartType = 'bar';
    dataForChartRaw = dataForChart;
    indicatorsValues = pushElementsValues(dataForChart[0], 1);
    dateValues = dataForChart[0].map(function (e) { return parseInt(Object.keys(e)[0]) })
    charTitle = Object.values(dataForChart[0]["0"])[0].naimenovanie; // get name from first object
    color = Chart.helpers.color;
    colorNames = Object.keys(window.chartColors);
    targetCanvas = document.getElementById("modal-canvas").getContext("2d");
    firstElement = "ph";
    $("#recalcPDK").html("Пересчитать в ПДК");
    $("#toggleTable").html("Данные по расходам");
    $("#recalcPDK").prop("disabled", false);
    if (dataForChart.length > 1) {
        $("#toggleTable").prop("disabled", false);
    }
    else {
        $("#toggleTable").prop("disabled", true);
    }
    init();

}

function addDate(dateValue, position) {
    // add date for graphic

    let curLabelsLength = barChartData.labels.length;
    let indexDate = position;

    if (barChartData.datasets.length > 0) {

        //barChartData.labels.splice(indexDate, 1,formateDate(dateValue))

        barChartData.labels.splice(indexDate, 0, formateDate(dateValue));

        barChartData.datasets.forEach(function (dataset) {

            let name = dataset.label

            for (indicator in indicatorsValues) {

                if (name === indicatorsValues[indicator]['alias']) {

                    // check how to add data in pdk or not
                    //var indicatorValue = nativeData[dateValue][name]
                    var selectedDataObj = nativeData.filter(function (e) {
                        if (Object.keys(e)[0] == dateValue) {
                            return e
                        }
                    })[0]

                    var indicatorValue = selectedDataObj[dateValue][indicator]

                    if (document.getElementById("recalcPDK").innerHTML == "Вернуть значения") {

                        var pdkValue = indicatorValue / indicatorsValues[indicator]['limit']

                        dataset.data.splice(indexDate, 0, pdkValue);



                    } else {

                        dataset.data.splice(indexDate, 0, indicatorValue);

                    }
                }
            }
        });

        myBar.update();

    }
};


function removeIndicator(indicatorName) {

    // remove indicator from chart
    for (var index = 0; index < barChartData.datasets.length; ++index) {

        if (barChartData.datasets[index].label === indicatorsValues[indicatorName]['alias']) {

            barChartData.datasets.splice(index, 1);
        }
    }
    myBar.update();
};


function removeDate(dateValue) {
    // remove selected data from chart
    var indexDate = barChartData.labels.indexOf(formateDate(dateValue));

    barChartData.labels.splice(indexDate, 1); // remove the label first

    barChartData.datasets.forEach(function (e) {
        e.data.splice(indexDate, 1)
    });

    myBar.update();

};

function createCheckboxesIndicator(arr) {
    // create list of checkboxes for indicators (arr of data must be in specific view 
    // and sorted by date)
    var fldList = document.getElementById("modal-listIndicator");
    for (indicator in arr) {

        if (indicator == firstElement) {
            fldList.innerHTML += '<input type="checkbox" name="indicators" value=' + indicator + ' checked="checked" id = ' + arr[indicator]["alias"] + ' />' + '<label for=' + arr[indicator]["alias"] + ' class = "labelIndicators">' + arr[indicator]["alias"] + '</label>'
        }
        else {
            fldList.innerHTML += '<input type="checkbox" name="indicators" value=' + indicator + '  id = ' + arr[indicator]["alias"] + ' />' + '<label for=' + arr[indicator]["alias"] + ' class = "labelIndicators">' + arr[indicator]["alias"] + '</label>'
        }
    }
}

function createCheckboxesDates(arr) {
    // create list of checkboxes for dates (arr of data must be in specific view 
    // and sorted by date)
    var fldList = document.getElementById("modal-listDates")

    arr.forEach(function (e, index) {

        fldList.innerHTML += '<input type="checkbox" name="dates" value=' + e + ' checked="checked" id = ' + e + ' />' +
            '<label for=' + e + ' class = "labelDates">' + formateDate(e) + '</label>'

    })

}

function addIndicator(indicatorName) {
    // add selected (clicked) indicator to chart
    let dataToAdd;

    // check how to add data in pdk or not

    if (document.getElementById("recalcPDK").innerHTML == "Вернуть значения") {

        dataToAdd = indicatorsValues[indicatorName]['values'].map(function (value) {

            return value / indicatorsValues[indicatorName]['limit'];

        });

    } else {

        dataToAdd = indicatorsValues[indicatorName]['values']

    }

    var newDataset = {
        label: indicatorsValues[indicatorName]['alias'],
        backgroundColor: indicatorsValues[indicatorName]['color'],
        borderColor: indicatorsValues[indicatorName]['color'],
        borderWidth: 1,
        data: dataToAdd
    };

    barChartData.datasets.push(newDataset);
    myBar.update();
};

function recalcPDK() {
    // recalc data in pdk value (pdk must be setted in elements)
    if (document.getElementById("recalcPDK").innerHTML == "Пересчитать в ПДК") {

        document.getElementById("recalcPDK").innerHTML = "Вернуть значения";

        barChartData.datasets.forEach(function (dataset) {

            let name = dataset.label

            dataset.data = dataset.data.map(function (value) {

                for (indicator in indicatorsValues) {

                    if (name == indicatorsValues[indicator]['alias']) {

                        return value / indicatorsValues[indicator]['limit'];
                    }
                }
            });

        });
    } else {
        document.getElementById("recalcPDK").innerHTML = "Пересчитать в ПДК";

        barChartData.datasets.forEach(function (dataset) {

            let name = dataset.label

            //dataset.data = dataset.data.map(function (value) {

            for (indicator in indicatorsValues) {

                if (name == indicatorsValues[indicator]['alias']) {

                    dataset.data = indicatorsValues[indicator]['values'];
                }
            }
            //});
        });
    }
    myBar.update();
}

function pushElementsValues(ObjectForFill, index) {
    // writing data from object to template which are in elemenets.js
    //storing the default data
    nativeData = ObjectForFill.valueOf();
    elements = (index == 1) ? returnBlankTemplate() : returnSecondTemplate();
    for (var key in elements) {
        elements[key].values = ObjectForFill.map(function (e) {
            for (let dateValue in e) {
                return e[dateValue][key]
            }
        })


    }
    return elements
}

function toggleChart() {
    // toggle type of chart
    myBar.destroy();
    //change chart type: 
    chartType = (myBar.config.type == 'bar') ? 'line' : 'bar';
    //restart chart:
    myBar = new Chart(targetCanvas, {
        type: chartType,
        data: barChartData,
        options: {
            responsive: true,
            legend: {
                position: 'top',
                onClick: (e) => e.stopPropagation()
            },
            title: {
                display: true,
                text: charTitle
            },
            scales: {
                yAxes: [{
                    type: 'logarithmic',
                    ticks: {
                        callback: function (value, index, values) {//needed to change the scientific notation results from using logarithmic scale
                            return value.toFixed(3);//pass tick values as a string into Number function
                        }
                    },
                    afterBuildTicks: function (axe) {
                        console.log(axe.max);
                        let labelsCount = 3;
                        axe.ticks = range(0, axe.max, axe.max / labelsCount);// fill count defined labels depends on max value of chart 
                    }
                }]
            }
        }
    });
}

function toggleTable() {
    //console.log(dataForChartRaw[1])
    if (document.getElementById("toggleTable").innerHTML == "Данные по расходам") {
        myBar.destroy();
        document.getElementById("modal-listDates").innerHTML = "";
        document.getElementById("modal-listIndicator").innerHTML = "";
        indicatorsValues = pushElementsValues(dataForChartRaw[1], 2);
        dateValues = dataForChartRaw[1].map(function (e) { return parseInt(Object.keys(e)[0]) });
        charTitle = "Данные по расходам"; // get name from first object
        color = Chart.helpers.color;
        colorNames = Object.keys(window.chartColors);
        firstElement = "rashod";
        $("#recalcPDK").html("Пересчитать в ПДК");
        $("#toggleTable").html("Данные по элементам");
        $("#recalcPDK").prop("disabled", true);
        init();

    }
    else {
        $("#toggleTable").html("Данные по расходам");
        myBar.destroy();
        document.getElementById("modal-listDates").innerHTML = "";
        document.getElementById("modal-listIndicator").innerHTML = "";
        $("#recalcPDK").prop("disabled", false);
        loadModal(dataForChartRaw);
    }

}

function range(start, edge, step) {
    // If only one number was passed in make it the edge and 0 the start.
    if (arguments.length == 1) {
        edge = start;
        start = 0;
    }

    // Validate the edge and step numbers.
    edge = edge || 0;
    step = step || 1;

    // Create the array of numbers, stopping befor the edge.
    for (var ret = []; (edge - start) * step > 0; start += step) {
        ret.push(start);
    }
    return ret;
}