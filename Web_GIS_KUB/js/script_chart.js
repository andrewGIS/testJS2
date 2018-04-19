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
var currentLyrID; // source layer , used for choose necessary pdk limit
var limitLine;// variable for store limit pdk value when only one indicator on graph
var isFirstTimeLoad = true;// is first time to load 

function modalListener() {
    // assert event handler for dom elements

    $(".close-modal, .modal-sandbox").click(function () {
        $('#modal-canvas').remove();
        $('#container').empty();
        $('#container').append('<canvas id="modal-canvas"><canvas>');
        $(".modal").css({ "display": "none" });
        $("#addInfo").off();
        $("#toggleTable").off();
        $("#lstIndicators").multiselect('unload');
        $("#lstDates").multiselect('unload');
        $("#lstIndicators").multiselect('reset');
        $("#lstDates").multiselect('reset');
        $("#macroElements").empty();
        $("#microElements").empty();
        $("#lstDates").empty();
        $("#lstDates").empty();
        isFirstTimeLoad = true;

    });

    // listener for buttons
    $("#recalcPDK").on('click', recalcPDK);
    $("#showElements").on('click', toggleTable);
    $("#showFlowRate").on('click', toggleTable);

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
            data: indicatorsValues[firstElement]['values']
        }]

    };

    // set limitLine
    limitLine = [{
        type: 'line',
        mode: 'horizontal',
        scaleID: 'y-axis-0',
        value: indicatorsValues[firstElement]['limit'][limitNumber()],
        borderWidth: 5,
        borderColor: 'red',
        label: {
            backgroundColor: "red",
            content: "Значение ПДК (" + indicatorsValues[firstElement]['limit'][limitNumber()] + ")",
            enabled: true,
            // for determination side of label above or below line
            yAdjust: Math.max.apply(null, barChartData.datasets[0].data) - indicatorsValues[firstElement]['limit'][limitNumber()] > 0 ? -10 : 10,
        }
    }];


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
                    scaleLabel: {
                        display: true,
                        labelString: 'Значение показателя, мг/дм³',
                        fontFamily: "'Segoe UI', 'Tahoma', 'Geneva', 'Verdana', 'sans-serif'",
                        fontSize: 14,
                        fontStyle: "bold",
                    },
                    type: 'logarithmic',
                    ticks: {
                        callback: function (value, index, values) {//needed to change the scientific notation results from using logarithmic scale
                            return value.toFixed(3);//pass tick values as a string into Number function
                        }
                    },
                    afterBuildTicks: function (axe) {
                        let labelsCount = 3;
                        axe.ticks = range(0, axe.max, axe.max / labelsCount);// fill count defined labels depends on max value of chart 

                    }
                }],
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Даты обследований',
                        fontFamily: "'Segoe UI', 'Tahoma', 'Geneva', 'Verdana', 'sans-serif'",
                        fontSize: 14,
                        fontStyle: "bold",
                        padding: 4,
                    }
                }]

            },
            annotation: {
                annotations: limitLine
            }
        }
    });



    if (isFirstTimeLoad) {


        createCheckboxesDates(dateValues);

    }

    createCheckboxesIndicator(indicatorsValues);
    isFirstTimeLoad = false;

}

function loadModal(dataForChart, layerID) {
    // calc variable for each record
    currentLyrID = layerID;
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
    $("#recalcPDK").prop("disabled", false);
    $("#showElements").prop("disabled", false);
    if (dataForChart.length > 1) {
        $("#showFlowRate").prop("disabled", false);
    }
    else {
        $("#showFlowRate").prop("disabled", true);
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

    setLine();
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

    let isSelected;
    let targetList;

    $.each(arr, function (key, value) {

        isSelected = key == firstElement ? true : false;
        targetList = value['class'] == "macro" ? "macroElements" : "microElements"

        $('#' + targetList)
            .append($("<option></option>")
                .attr("value", key)
                .attr("selected", isSelected)
                .text(value['alias']));

    });

    $('#lstIndicators').multiselect({
        columns: 5,
        onOptionClick: function (element, option) {
            if (option.checked) {
                addIndicator(option.value)
            } else {
                removeIndicator(option.value)
            }
        }
    });

}

function createCheckboxesDates(arr) {
    // create list of checkboxes for dates (arr of data must be in specific view 
    // and sorted by date)

    var uniqYearList;
    // uniq list of all years
    uniqYearList = new Set(arr.map(function (e) { return new Date(e).getFullYear() }));

    // create drop lists by years
    uniqYearList.forEach(function (value, v, k) {

        $('#lstDates')
            .append($("<optgroup></optgroup>")
                .attr("id", "group" + value)
                .attr("label", value));

    });

    // push values in neccesary group
    $.each(arr, function (key, value) {

        let isSelected = true;
        let curYearId = new Date(value).getFullYear();

        $('#group' + curYearId)
            .append($("<option></option>")
                .attr("value", value)
                .attr("selected", isSelected)
                .text(formateDate(value)));

    });

    // create multiselect
    $('#lstDates').multiselect({
        columns: 5,
        selectGroup: true,
        onOptionClick: function (element, option) {
            //console.log(element);
            if (option.checked) {
                // position of element
                let position;
                $(element).find('option:selected').each(function (index, value) {
                    if (option.value == $(value).attr("value")) {
                        console.log(index);
                        position = index;
                    }
                })
                addDate(option.value, position)
            } else {
                removeDate(option.value)
            }
        }
    });



}

function addIndicator(indicatorName) {
    // need to add only checked dates

    // all checked dates indexes
    let checkedDatesIndex = [];
    $('#lstDates').find('option:selected').each(function (key, value) {
        checkedDatesIndex.push(dateValues.indexOf(parseInt(value.value)));
    })

    // extract values 
    let arrValues = checkedDatesIndex.map(function (index) {
        return indicatorsValues[indicatorName]['values'][index]
    })

    // add selected (clicked) indicator to chart
    let dataToAdd;

    // check how to add data in pdk or not

    if (document.getElementById("recalcPDK").innerHTML == "Вернуть значения") {

        // dataToAdd = indicatorsValues[indicatorName]['values'].map(function (value) {
        dataToAdd = arrValues.map(function (value) {

            // limit number for using neccessary limit
            return value / indicatorsValues[indicatorName]['limit'][limitNumber()];

        });

    } else {

        dataToAdd = arrValues;

    }

    // need to add only checked data

    var newDataset = {
        label: indicatorsValues[indicatorName]['alias'],
        backgroundColor: indicatorsValues[indicatorName]['color'],
        borderColor: indicatorsValues[indicatorName]['color'],
        borderWidth: 1,
        data: dataToAdd
    };

    barChartData.datasets.push(newDataset);
    setLine();

    myBar.update();
};

function recalcPDK() {
    // recalc data in pdk value (pdk must be setted in elements)
    //console.log(currentLyrID);


    if (document.getElementById("recalcPDK").innerHTML == "Пересчитать в ПДК") {

        // clear limit line
        myBar.chart.annotation.options.annotations.pop();

        document.getElementById("recalcPDK").innerHTML = "Вернуть значения";

        barChartData.datasets.forEach(function (dataset) {

            let name = dataset.label

            dataset.data = dataset.data.map(function (value) {

                for (indicator in indicatorsValues) {

                    if (name == indicatorsValues[indicator]['alias']) {

                        return value / indicatorsValues[indicator]['limit'][limitNumber()];
                    }
                }
            });

        });
    } else {
        document.getElementById("recalcPDK").innerHTML = "Пересчитать в ПДК";

        setLine();

        // add only checked data
        // check it with data

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

function toggleTable() {
    //console.log(dataForChartRaw[1])
    if (this.id == "showFlowRate") {
        myBar.destroy();
        indicatorsValues = pushElementsValues(dataForChartRaw[1], 2);
        dateValues = dataForChartRaw[1].map(function (e) { return parseInt(Object.keys(e)[0]) });
        charTitle = "Данные по расходам"; // get name from first object
        color = Chart.helpers.color;
        colorNames = Object.keys(window.chartColors);
        firstElement = "rashod";
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
        $("#recalcPDK").prop("disabled", true);
        $('#lstIndicators').multiselect('disable', true);
        //$("#lstDates").multiselect('reset');
        $("#lstDates").empty();
        createCheckboxesDates(dateValues);
        $("#lstDates").multiselect('reload');
        init();
        $("#formIndicator").hide();


    }
    else {
        myBar.destroy();
        $("#recalcPDK").prop("disabled", true);
        $('#lstIndicators').multiselect('disable', false);
        $("#lstDates").empty();
        $("#recalcPDK").prop("disabled", false);
        dateValues = dataForChartRaw[0].map(function (e) { return parseInt(Object.keys(e)[0]) });
        $("#macroElements").empty();
        $("#microElements").empty();
        createCheckboxesDates(dateValues);
        $("#lstDates").multiselect('reload');
        loadModal(dataForChartRaw, currentLyrID);
        $("#formIndicator").show();

        // set selected indicators to first element
        $("#lstIndicators option:selected").each(function (key, value) {
            if (value.value == firstElement) {
                $(value).prop("selected", true)
            }
            else {
                $(value).removeAttr("selected")
            }
        })
        $("#lstIndicators").multiselect('reload');
        $("#lstIndicators").trigger("onSelectAll")
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

function limitNumber() {
    //return index of list which limit will be used
    // need to use different pdk value for different layers
    let indexOfList = (currentLyrID == 6 ||
        currentLyrID == 7) ? 0 : 1
    return indexOfList;
}

function setLine() {
    if (myBar.chart.config.data.datasets.length == 1 && $("#recalcPDK").text() != "Вернуть значения") {

        let currentIndicatorAlias = myBar.chart.config.data.datasets[0].label
        let elements = returnBlankTemplate();
        let pdkValue;
        $.each(elements, function (key, value) {
            if (elements[key]['alias'] == currentIndicatorAlias) {
                pdkValue = elements[key]['limit'][limitNumber()];
            };
        });

        // if PDK is not defined 
        if (pdkValue == 0) {
            pdkValue = NaN;
        }


        if (pdkValue > Math.max.apply(null, myBar.chart.data.datasets[0].data)) {
            //myBar.chart.scales['y-axis-0'].max = pdkValue + 0.2*pdkValue;
            //myBar.chart.scales['y-axis-0'].ticks.max = pdkValue + 0.2 * pdkValue;
            //myBar.update();
        }

        //myBar.chart.annotation.options.annotations[0].value = pdkValue;
        myBar.chart.annotation.options.annotations[0] = {
            drawTime: 'afterDatasetsDraw',
            type: 'line',
            mode: 'horizontal',
            scaleID: 'y-axis-0',
            value: pdkValue,
            borderWidth: 5,
            borderColor: 'red',
            label: {
                backgroundColor: "red",
                content: "Значение ПДК (" + pdkValue + ")",
                enabled: true,
                position: "center",
                // for showing label in chart
                yAdjust: Math.max.apply(null, myBar.chart.data.datasets[0].data) - pdkValue > 0 ? -10 : 10,
            }
        }
    }
    else {
        myBar.chart.annotation.options.annotations.pop();
    }
}
