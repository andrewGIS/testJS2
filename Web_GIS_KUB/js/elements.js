function returnBlankTemplate() {
    // limit value depend on  current id layer
    return elements = {
        "ci": {
            "color": "#4dc9f6",
            "alias": "CI",
            "values": [],
            "limit": [0, 0],
            "class": "macro"
        },
        "co": {
            "color": "#e4d6a7",
            "alias": "CO",
            "values": [],
            "limit": [0.1, 0.01],
            "class": "micro"
        },
        "be": {
            "color": "#a1cf6b",
            "alias": "Be",
            "values": [],
            "limit": [0.0002, 0.0003],
            "class": "micro"
        },
        "ai": {
            "color": "#ba5a31",
            "alias": "Al",
            "values": [],
            "limit": [0.2, 0.04],
            "class": "micro"
        },
        "pb": {
            "color": "#334e58",
            "alias": "Pb",
            "values": [],
            "limit": [0.01, 0.006],
            "class": "micro"
        },
        "hco3": {
            "color": "#ffcf56",
            "alias": "HCO₃",
            "values": [],
            "limit": [0, 0],
            "class": "macro"
        },
        "cd": {
            "color": "#afbe8f",
            "alias": "Cd",
            "values": [],
            "limit": [0.001, 0.005],
            "class": "micro"
        },
        "nh4": {
            "color": "#7ea0b7",
            "alias": "NH₄",
            "values": [],
            "limit": [1.5, 0.5],
            "class": "macro"
        },
        "fe": {
            "color": "#a44200",
            "alias": "Fe",
            "values": [],
            "limit": [0.3, 0.1],
            "class": "macro"
        },
        "sukh_ost": {
            "color": "#91aec1",
            "alias": "Сухой остаток",
            "values": [],
            "limit": [0, 0],
            "class": "macro"
        },
        "no2": {
            "color": "#01baef",
            "alias": "NO₂",
            "values": [],
            "limit": [3.3, 0.08],
            "class": "macro"
        },
        "no3": {
            "color": "#577590",
            "alias": "NO₃",
            "values": [],
            "limit": [40, 45],
            "class": "macro"
        },
        "ni": {
            "color": "#ab9f9d",
            "alias": "Ni",
            "values": [],
            "limit": [0.02, 0.01],
            "class": "micro"
        },
        "mg": {
            "color": "#2dc7ff",
            "alias": "Mg",
            "values": [],
            "limit": [50, 40],
            "class": "macro"
        },
        "b": {
            "color": "#6f8f72",
            "alias": "B",
            "values": [],
            "limit": [0.5, 0.5],
            "class": "micro"
        },
        "na": {
            "color": "#735cdd",
            "alias": "Na",
            "values": [],
            "limit": [200, 120],
            "class": "macro"
        },
        "k": {
            "color": "#84c7d0",
            "alias": "K",
            "values": [],
            "limit": [0, 50],
            "class": "macro"
        },
        "mn": {
            "color": "#90ddf0",
            "alias": "Mn",
            "values": [],
            "limit": [0.1, 0.01],
            "class": "macro"
        },
        "zn": {
            "color": "#0d090a",
            "alias": "Zn",
            "values": [],
            "limit": [1, 0.01],
            "class": "micro"
        },
        "li": {
            "color": "#c8b8db",
            "alias": "Li",
            "values": [],
            "limit": [0.03, 0.08],
            "class": "micro"
        },
        "zhestkost": {
            "color": "#fa9f42",
            "alias": "Жесткость (ммоль/дм³)",
            "values": [],
            "limit": [7, 0],
            "class": "macro"
        },
        "si": {
            "color": "#f5dd90",
            "alias": "Si",
            "values": [],
            "limit": [0, 0],
            "class": "micro"
        },
        "ph": {
            "color": "#9d9171",
            "alias": "pH",
            "values": [],
            "limit": [7.0, 7.0],
            "class": "macro"
        },
        "ca": {
            "color": "#886176",
            "alias": "Ca",
            "values": [],
            "limit": [0, 180],
            "class": "macro"
        },
        "so4": {
            "color": "#cec3c1",
            "alias": "SO₄",
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