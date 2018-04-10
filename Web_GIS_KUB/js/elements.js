function returnBlankTemplate() {
    // limit value depend on сгккуте id layer
    return elements = {
        "ci": {
            "color": "rgb(255,0,0)",
            "alias": "CI",
            "values": [],
            "limit": [0, 0],
            "class": "micro"
        },
        "co": {
            "color": "rgb(255,255,0)",
            "alias": "CO",
            "values": [],
            "limit": [0.1, 0.01],
            "class": "micro"
        },
        "be": {
            "color": "rgb(5,110,0)",
            "alias": "Be",
            "values": [],
            "limit": [0.0002, 0.0003],
            "class": "micro"
        },
        "ai": {
            "color": "rgb(0,48,0)",
            "alias": "AI",
            "values": [],
            "limit": [0, 0],
            "class": "micro"
        },
        "pb": {
            "color": "rgb(0,0,75)",
            "alias": "Pb",
            "values": [],
            "limit": [0.01, 0.006],
            "class": "micro"
        },
        "hco3": {
            "color": "rgb(0,0,50)",
            "alias": "HCO3",
            "values": [],
            "limit": [0, 0],
            "class": "macro"
        },
        "cd": {
            "color": "rgb(100,0,0)",
            "alias": "Cd",
            "values": [],
            "limit": [0.001, 0.005],
            "class": "micro"
        },
        "nh4": {
            "color": "rgb(0,100,0)",
            "alias": "NH4",
            "values": [],
            "limit": [1.5, 0.5],
            "class": "macro"
        },
        "fe": {
            "color": "rgb(0,0,200)",
            "alias": "Fe",
            "values": [],
            "limit": [0.3, 0.1],
            "class": "macro"
        },
        "sukh_ost": {
            "color": "",
            "alias": "Сухой остаток",
            "values": [],
            "limit": [0, 0],
            "class": "macro"
        },
        "no2": {
            "color": "",
            "alias": "NO2",
            "values": [],
            "limit": [3.3, 0.08],
            "class": "macro"
        },
        "no3": {
            "color": "",
            "alias": "NO3",
            "values": [],
            "limit": [0, 0],
            "class": "macro"
        },
        "ni": {
            "color": "",
            "alias": "Ni",
            "values": [],
            "limit": [0.02, 0.01],
            "class": "micro"
        },
        "mg": {
            "color": "",
            "alias": "Mg",
            "values": [],
            "limit": [50, 40],
            "class": "macro"
        },
        "b": {
            "color": "",
            "alias": "B",
            "values": [],
            "limit": [0.5, 0.5],
            "class": "micro"
        },
        "na": {
            "color": "",
            "alias": "Na",
            "values": [],
            "limit": [200, 120],
            "class": "macro"
        },
        "k": {
            "color": "",
            "alias": "K",
            "values": [],
            "limit": [0, 50],
            "class": "macro"
        },
        "mn": {
            "color": "",
            "alias": "Mn",
            "values": [],
            "limit": [0.1, 0.01],
            "class": "macro"
        },
        "zn": {
            "color": "",
            "alias": "Zn",
            "values": [],
            "limit": [1, 0.01],
            "class": "micro"
        },
        "li": {
            "color": "",
            "alias": "Li",
            "values": [],
            "limit": [0.03, 0.08],
            "class": "micro"
        },
        "zhestkost": {
            "color": "",
            "alias": "Жесткость (ммоль/дм³)",
            "values": [],
            "limit": [7, 0],
            "class": "macro"
        },
        "si": {
            "color": "",
            "alias": "Si",
            "values": [],
            "limit": [0, 0],
            "class": "micro"
        },
        "ph": {
            "color": "",
            "alias": "pH",
            "values": [],
            "limit": [8.5, 0],
            "class": "macro"
        },
        "ca": {
            "color": "",
            "alias": "Ca",
            "values": [],
            "limit": [0, 180],
            "class": "macro"
        },
        "so4": {
            "color": "",
            "alias": "SO4",
            "values": [],
            "limit": [500, 100],
            "class": "macro"
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