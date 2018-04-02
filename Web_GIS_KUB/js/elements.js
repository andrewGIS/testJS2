function returnBlankTemplate() {
    // limit value depend on сгккуте id layer
    return elements = {
        "ci": {
            "color": "rgb(255,0,0)",
            "alias": "CI",
            "values": [],
            "limit": [0, 0]
        },
        "co": {
            "color": "",
            "alias": "CO",
            "values": [],
            "limit": [0.1, 0.01]
        },
        "be": {
            "color": "",
            "alias": "Be",
            "values": [],
            "limit": [0.0002, 0.0003]
        },
        "ai": {
            "color": "",
            "alias": "AI",
            "values": [],
            "limit": [0, 0]
        },
        "pb": {
            "color": "",
            "alias": "Pb",
            "values": [],
            "limit": [0.01, 0.006]
        },
        "hco3": {
            "color": "",
            "alias": "HCO3",
            "values": [],
            "limit": [0, 0]
        },
        "cd": {
            "color": "",
            "alias": "Cd",
            "values": [],
            "limit": [0.001, 0.005]
        },
        "nh4": {
            "color": "",
            "alias": "NH4",
            "values": [],
            "limit": [1.5, 0.5]
        },
        "fe": {
            "color": "",
            "alias": "Fe",
            "values": [],
            "limit": [0.3, 0.1]
        },
        "sukh_ost": {
            "color": "",
            "alias": "Сухой остаток",
            "values": [],
            "limit": [0, 0]
        },
        "no2": {
            "color": "",
            "alias": "NO2",
            "values": [],
            "limit": [3.3, 0.08]
        },
        "no3": {
            "color": "",
            "alias": "NO3",
            "values": [],
            "limit": [0, 0]
        },
        "ni": {
            "color": "",
            "alias": "Ni",
            "values": [],
            "limit": [0.02, 0.01]
        },
        "mg": {
            "color": "",
            "alias": "Mg",
            "values": [],
            "limit": [50, 40]
        },
        "b": {
            "color": "",
            "alias": "B",
            "values": [],
            "limit": [0.5, 0.5]
        },
        "na": {
            "color": "",
            "alias": "Na",
            "values": [],
            "limit": [200, 120]
        },
        "k": {
            "color": "",
            "alias": "K",
            "values": [],
            "limit": [0, 50]
        },
        "mn": {
            "color": "",
            "alias": "Mn",
            "values": [],
            "limit": [0.1, 0.01]
        },
        "zn": {
            "color": "",
            "alias": "Zn",
            "values": [],
            "limit": [1, 0.01]
        },
        "li": {
            "color": "",
            "alias": "Li",
            "values": [],
            "limit": [0.03, 0.08]
        },
        "zhestkost": {
            "color": "",
            "alias": "Жесткость (ммоль/дм³)",
            "values": [],
            "limit": [7, 0]
        },
        "si": {
            "color": "",
            "alias": "Si",
            "values": [],
            "limit": [0, 0]
        },
        "ph": {
            "color": "",
            "alias": "pH",
            "values": [],
            "limit": [8.5, 0]
        },
        "ca": {
            "color": "",
            "alias": "Ca",
            "values": [],
            "limit": [0, 180]
        },
        "so4": {
            "color": "",
            "alias": "SO4",
            "values": [],
            "limit": [500, 100]
        }
    }
}
function returnTestData() {

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
    return testIndicatorsValues;
}
function returnSecondTemplate() {
    return discharge = {
        "rashod": {
            "color": "",
            "alias": "Расход",
            "values": [],
            "limit": 0
        }
    }
}