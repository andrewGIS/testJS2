function returnBlankTemplate(){
    return elements = {
        "ci": {
            "color": "rgb(255,0,0)",
            "alias": "CI",
            "values": [],
            "limit": 0
        },
        "co": {
            "color": "",
            "alias": "CO",
            "values": [],
            "limit": 0
        },
        "be": {
            "color": "",
            "alias": "Be",
            "values": [],
            "limit": 0
        },
        "ai": {
            "color": "",
            "alias": "AI",
            "values": [],
            "limit": 0
        },
        "pb": {
            "color": "",
            "alias": "Pb",
            "values": [],
            "limit": 0
        },
        "hco3": {
            "color": "",
            "alias": "HCO3",
            "values": [],
            "limit": 0
        },
        "cd": {
            "color": "",
            "alias": "Cd",
            "values": [],
            "limit": 0
        },
        "nh4": {
            "color": "",
            "alias": "NH4",
            "values": [],
            "limit": 0
        },
        "fe": {
            "color": "",
            "alias": "Fe",
            "values": [],
            "limit": 0
        },
        "sukh_ost": {
            "color": "",
            "alias": "Сухой остаток",
            "values": [],
            "limit": 0
        },
        "no2": {
            "color": "",
            "alias": "NO2",
            "values": [],
            "limit": 0
        },
        "no3": {
            "color": "",
            "alias": "NO3",
            "values": [],
            "limit": 0
        },
        "ni": {
            "color": "",
            "alias": "Ni",
            "values": [],
            "limit": 0
        },
        "mg": {
            "color": "",
            "alias": "Mg",
            "values": [],
            "limit": 0
        },
        "b": {
            "color": "",
            "alias": "B",
            "values": [],
            "limit": 0
        },
        "na": {
            "color": "",
            "alias": "Na",
            "values": [],
            "limit": 0
        },
        "k": {
            "color": "",
            "alias": "K",
            "values": [],
            "limit": 0
        },
        "mn": {
            "color": "",
            "alias": "Mn",
            "values": [],
            "limit": 0
        },
        "zn": {
            "color": "",
            "alias": "Zn",
            "values": [],
            "limit": 0
        },
        "li": {
            "color": "",
            "alias": "Li",
            "values": [],
            "limit": 0
        },
        "zhestkost": {
            "color": "",
            "alias": "Жесткость (ммоль/дм³)",
            "values": [],
            "limit": 0
        },
        "si": {
            "color": "",
            "alias": "Si",
            "values": [],
            "limit": 0
        },
        "ph": {
            "color": "",
            "alias": "Кислотность",
            "values": [],
            "limit": 0
        },
        "ca": {
            "color": "",
            "alias": "Ca",
            "values": [],
            "limit": 0
        },
        "so4": {
            "color": "",
            "alias": "SO4",
            "values": [],
            "limit": 0
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