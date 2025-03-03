const EPCI_NUITEE = {
    id: 'epci-fill',
    type: 'fill',
    source: 'epci',
   'layout': {
        // 'visibility': 'none', // initialement caché
            
    },
    // 'minzoom':5,
    // 'maxzoom':8,
    paint: {
        'fill-color': [
            "case",
            ['==', ['get', 'PartVolumeMoyen'], null], 'hsla(0, 0%, 0%, 0)', // Transparent for null values
            ['==', ['feature-state', 'selected'], true], '#1d1d1d', // Red for selected
            ['==', ['feature-state', 'hover'], true], '#b0bfc4', // Green for hover
            ['interpolate', ['linear'], ['get', 'PartVolumeMoyen'],
                0.001, "#faf9f3",
                0.2, "#fec46c",
                0.5, "#fe9929",
                2, "#e57217",
                8, "#c4510b",
                55.74, "#993404"
            ]
        ],
        'fill-opacity': [
            "step", ["zoom"], 0, 5, 0.6, 8, 0
        ],
        // 'fill-outline-color': [
        //     "step", ["zoom"], "rgba(0, 0, 0, 0)", 6, "#dcdacf", 10, "rgba(0, 0, 0, 0)"
        // ]
    }
};

const LINE_EPCI = {
    id: 'epci-outline',
    type: 'line',
    source: 'epci',
    layout: {},
    paint: {
        'line-color': '#685c5c',
        'line-width': [
            "step",
            ["zoom"],
            0,
            6,
            0.1,
            8,
            1,
            9,
            1,
            11,
            0
        ],
        'line-opacity': 1
    },
    'layout':{
        'line-join':'round'
      },
};

const COMMUNE_NUITEE = {
    id: 'commune-fill',
    type: 'fill',
    source: 'commune',
    'layout': {
        // 'visibility': 'none', // initialement caché
            
    },
    // 'minzoom':8,
    // 'maxzoom':11,
    paint: {
        'fill-color': [
            'case',
            ['==', ['get', 'PartVolumeMoyen'], null], 'hsla(0, 0%, 0%, 0)', // Transparent for null values
            ['==', ['feature-state', 'selected'], true], '#1d1d1d', // Red for selected
            ['==', ['feature-state', 'hover'], true], '#b0bfc4', // Green for hover
            ['interpolate', ['linear'], ['get', 'PartVolumeMoyen'],
            0.001, "#faf9f3",
            0.2, "#fec46c",
            0.5, "#fe9929",
            2, "#e57217",
            8, "#c4510b",
            31.99, "#993404"
            ]
        
        ],
        'fill-opacity': [
            "step", ["zoom"], 0, 8, 0.6, 11, 0
        ],
        // 'fill-outline-color': [
        //     "step", ["zoom"], "rgba(0, 0, 0, 0)", 8, "#dcdacf", 11, "rgba(0, 0, 0, 0)"
        // ]
    }
}

const LINE_COMMUNE = {
    id: 'commune-outline',
    type: 'line',
    source: 'commune',
    paint: {
        'line-color': ' #685c5c',
        'line-width': [
            "step",
            ["zoom"],
            0,
            5,
            0,
            8,
            0.1,
            11,
            1.5
        ],
        'line-opacity': 1
    },
    'layout':{
        'line-join':'round'
      },
};

const IRIS_NUITEE = {
    id: 'iris-fill',
    type: 'fill',
    source: 'iris',
    // 'minzoom':11,
    // 'maxzoom':22,
    'layout': {
        // 'visibility': 'none', // initialement caché
            
    },
    paint: {
        'fill-color': [
            "case",
            ['==', ['get', 'PartVolumeMoyen'], null], 'hsla(0, 0%, 0%, 0)', // Transparent for null values
            ['==', ['feature-state', 'selected'], true], '#1d1d1d', // Red for selected
            ['==', ['feature-state', 'hover'], true], '#b0bfc4', // Green for hover
            ['interpolate', ['linear'], ['get', 'PartVolumeMoyen'],
            0.001, "#faf9f3",
            0.2, "#fec46c",
            0.5, "#fe9929",
            2, "#e57217",
            8, "#c4510b",
            16.18, "#993404"
            ]
        ],
        'fill-opacity': [
            "step", ["zoom"], 0, 11, 0.6, 22, 0
        ],
        // 'fill-outline-color': [
        //     "step", ["zoom"], "rgba(0, 0, 0, 0)", 11, "#dcdacf"
        // ]
    }
};

const LINE_IRIS = {
    id: 'iris-outline',
    type: 'line',
    source: 'iris',
    
    paint: {
        'line-color': '#685c5c',
        'line-width': ["step", ["zoom"], 0, 11, 0.5],
        'line-opacity': 1
    },
    'layout':{
        'line-join':'round'
      },
};

// APPEL DES COUCHES DE CENTROIDE //

const EPCI_NUITEE_CENTRO = {
    'id': 'epci-centroids-layer',
    'type': 'circle',
    'source': 'epci-centroids',
    'layout': {
        'visibility': 'none', // initialement caché
            'circle-sort-key': ['get', 'VolumeMoyen']  // Tri des cercles par 'some_property'
    },
    'paint': {
        'circle-radius': [
            "step",
            ["get", "VolumeMoyen"],  
            0,
            50,
            2,
            200,
            10,
            600,
            15,
            2000,
            30,
            44417, 
            50
        ],
        'circle-color': [
            "step",
            ["zoom"],
            "rgba(255, 255, 255, 0)",
            5,
            "#ffffff",
            8,
            "rgba(255, 255, 255, 0)"
        ],
        'circle-stroke-color': [
            "step",
            ["zoom"],
            "rgba(144, 132, 132, 0)",
            5,
            "#908484",
            8,
            "rgba(144, 132, 132, 0)"
        ],
        'circle-stroke-opacity': [
            "step",
            ["zoom"],
            0,
            7.5,
            1,
            8,
            0
        ],
        'circle-stroke-width': [
            "step",
            ["zoom"],
            0,
            5,
            1,
            8,
            0
        ],
        'circle-opacity': [
            "step",
            ["zoom"],
            0,
            7.5,
            0.4, // Opacité initiale des cercles
            8,
            0, // Opacité lorsque le zoom est de 5 ou plus
          
        ]
    }
};



const EPCI_NUITEE_CENTRO_3H = {
    'id': 'epci-centroids-layer-3H',
    'type': 'circle',
    'source': 'epci-centroids',
    'layout': {
        'visibility': 'none', // initialement caché
            'circle-sort-key': ['get', 'VolumeMoyen_Sup3h']  // Tri des cercles par 'some_property'
    },
    'paint': {
        'circle-radius': [
            "step",
            ["get", "VolumeMoyen"],  
            0,
            50,
            2,
            200,
            10,
            600,
            15,
            2000,
            30,
            44417, 
            50
        ],
        'circle-color': [
            "step",
            ["zoom"],
            "rgba(255, 255, 255, 0)",
            5,
            "#ffffff",
            8,
            "rgba(255, 255, 255, 0)"
        ],
        'circle-stroke-color': [
            "step",
            ["zoom"],
            "rgba(144, 132, 132, 0)",
            5,
            "#908484",
            8,
            "rgba(144, 132, 132, 0)"
        ],
        'circle-stroke-opacity': [
            "step",
            ["zoom"],
            0,
            7.5,
            1,
            8,
            0
        ],
        'circle-stroke-width': [
            "step",
            ["zoom"],
            0,
            5,
            1,
            8,
            0
        ],
        'circle-opacity': [
            "step",
            ["zoom"],
            0,
            7.5,
            0.4, // Opacité initiale des cercles
            8,
            0, // Opacité lorsque le zoom est de 5 ou plus
          
        ]
    }
};





const COMMUNE_NUITEE_CENTRO = {
    'id': 'commune-centroids-layer',
    'type': 'circle',
    'source': 'commune-centroids',
    'layout': {
        'visibility': 'none', // initialement caché
            'circle-sort-key': ['get', 'VolumeMoyen']  // Tri des cercles par 'some_property'
    },
    'paint': {
        'circle-radius': [
            "step",
            ["get", "VolumeMoyen"],         
            0,
            50,
            2,
            200,
            10,
            600,
            15,
            2000,
            30,
            44417, 
            50
        ],
        'circle-color': [
            "step",
            ["zoom"],
            "rgba(255, 255, 255, 0)",
            8,
            "#ffffff",
            11,
            "rgba(255, 255, 255, 0)"
        ],
        'circle-stroke-color': [
            "step",
            ["zoom"],
            "rgba(144, 132, 132, 0)",
            8,
            "#908484",
            11,
            "rgba(144, 132, 132, 0)"
        ],
        'circle-stroke-opacity': [
            "step",
            ["zoom"],
            0,
            9.5,
            1,
            11,
            0
        ],
        'circle-stroke-width': [
            "step",
            ["zoom"],
            0,
            8,
            1,
            11,
            0
        ],
        
        'circle-opacity': [
            "step",
            ["zoom"],
            0,
            9.5,
            0.4, // Opacité initiale des cercles
            11,
            0, // Opacité lorsque le zoom est de 5 ou plus
        ]
    }
};

const IRIS_NUITEE_CENTRO = {
    'id': 'iris-centroids-layer',
    'type': 'circle',
    'source': 'iris-centroids',
    'layout': {
        'visibility': 'none', // initialement caché
            'circle-sort-key': ['get', 'VolumeMoyen']  // Tri des cercles par 'some_property'
    },
    'paint': {
        'circle-radius': [
            "step",
            ["get", "VolumeMoyen"],
            0,
            50,
            2,
            200,
            10,
            600,
            15,
            2000,
            30,
            44417, 
            50
        ],
        'circle-opacity': [
            "interpolate",
            ["linear"],
            ["zoom"],
            11,
            0.7,
            22,
            1
        ],
        'circle-color': [
            "step",
            ["zoom"],
            "rgba(255, 255, 255, 0)",
            8,
            "rgba(255, 255, 255, 0)",
            11,
            "#ffffff",
            22,
            "#ffffff"
        ],
        'circle-stroke-color': [
            "step",
            ["zoom"],
            "rgba(144, 132, 132, 0)",
            8,
            "rgba(144, 132, 132, 0)",
            11,
            "#908484",
            22,
            "#908484"
        ],
        'circle-stroke-opacity': [
            "step",
            ["zoom"],
            0,
            11,
            1,
            22,
            1
        ],
        'circle-stroke-width': [
            "step",
            ["zoom"],
            0,
            8,
            0,
            11,
            1,
            22,
            1
        ],
        'circle-opacity': [
            "step",
            ["zoom"],
            0,
            11,
            0.4, // Opacité initiale des cercles
            22,
            0, // Opacité lorsque le zoom est de 5 ou plus
        ]
    }
};



const COEUR_DE_VILLE = {
    id: 'coeur_ville_belfort',
    type: 'fill',
    source: 'coeur_ville_belfort',
    layout: {},
    paint: {
        'fill-color': 'white',              // Couleur de remplissage
        'fill-opacity': 0.9,                // Opacité du remplissage
        'fill-outline-color': '#000000',     // Couleur de contour pour la surbrillance
    
    }
};

// AJOUT DES CONTOURS DES REGIONS ET DEPARTEMENT POUR AMELIORER LE RENDU DU FOND DE CARTE

const FILL_REGION = {
    id: 'region',
    type: 'fill',
    source: 'region',
    layout: {},
    paint: {
      'fill-color': 'rgba(0, 0, 0, 0)'
    }
};

const FILL_DEPT = {
    id: 'dept',
    type: 'fill',
    source: 'dept',
    layout: {},
    paint: {
      'fill-color': 'rgba(0, 0, 0, 0)'
    }
};

const LINE_REGION = {
    id: 'region-outline',
    type: 'line',
    source: 'region',
    layout: {},
    paint: {
        'line-color': '#685c5c',
        'line-width': ["step", ["zoom"], 1.2, 8, 0, 22, 0 ],
        'line-opacity': 1
    },
    'layout':{
        'line-join':'round'
      },
};

const LINE_DEPT = {
    id: 'dept-outline',
    type: 'line',
    source: 'dept',
    layout: {},
    paint: {
        'line-color': '#685c5c',
        'line-width': ["step", ["zoom"], 0, 6, 1.2, 11, 0],
        'line-opacity': 1
    },
    'layout':{
        'line-join':'round'
      },
};


const DATES = ['2023-11-27', '2023-11-28', '2023-11-29', '2023-11-30', '2023-12-01',
    '2023-12-02', '2023-12-03', '2023-12-04', '2023-12-05', '2023-12-06',
    '2023-12-07', '2023-12-08', '2023-12-09', '2023-12-10', '2023-12-11',
    '2023-12-12', '2023-12-13', '2023-12-14', '2023-12-15', '2023-12-16',
    '2023-12-17', '2023-12-18', '2023-12-19', '2023-12-20', '2023-12-21',
    '2023-12-22', '2023-12-23', '2023-12-24', '2023-12-25', '2023-12-26',
    '2023-12-27', '2023-12-28', '2023-12-29', '2023-12-30', '2023-12-31',
    '2024-01-01', '2024-01-02', '2024-01-03', '2024-01-04', '2024-01-05',
    '2024-01-06', '2024-01-07', '2024-01-08', '2024-01-09', '2024-01-10',
    '2024-01-11', '2024-01-12', '2024-01-13', '2024-01-14', '2024-01-15',
    '2024-01-16', '2024-01-17', '2024-01-18', '2024-01-19', '2024-01-20',
    '2024-01-21', '2024-01-22', '2024-01-23', '2024-01-24', '2024-01-25',
    '2024-01-26', '2024-01-27', '2024-01-28'];