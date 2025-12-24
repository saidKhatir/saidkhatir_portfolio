// AccesToken
mapboxgl.accessToken = 'pk.eyJ1IjoiMjIyMDUwMTMiLCJhIjoiY2xza2RzNzJ6MDF6MjJrczBkeW52d3JwZiJ9.pd_nGzRoD0tChlpOZo1KjA';

// Configuration de la carte
var map = new mapboxgl.Map({
  container: 'map',
  style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
  center: [-1.68, 48.12],
  zoom: 11,
  minZoom: 10,
  pitch: 0,
  bearing: 0,
  customAttribution: '<a href="https://esigat.wordpress.com/" target="_blank">SIGAT</a>',
});

map.on('load', function () {
  
  // Couche Mapbox Streets
  // Routes 
  map.addSource('mapbox-streets-v8', {
    type: 'vector',
    url: 'mapbox://mapbox.mapbox-streets-v8'
  });
  
  map.addLayer({
    "id": "Routes",
    "type": "line",
    "source": "mapbox-streets-v8",
    "layout": {'visibility': 'visible'},
    "source-layer": "road",
    "filter": ["all", ["in", "class", "primary", "trunk"]],
    "paint": {
      "line-color": [
        "match",
        ["get", "class"],
        "primary", "yellow",
        "trunk", "red",
        "#ccc"
      ]
    }
  });
  
  // Hydrographie
  map.addLayer({
    "id": "Hydro",
    "type": "fill",
    "source": "mapbox-streets-v8",
    "source-layer": "water",
    "paint": {"fill-color": "#A7C7E7"},
    "layout": {'visibility': 'visible'}
  });
  
  // Schema vélo
  map.addLayer({
    id: "schema_velo",
    type: "line",
    source: {
      type: "geojson",
      data: "https://data.rennesmetropole.fr/api/explore/v2.1/catalog/datasets/sd_velo_iti_2018/exports/geojson"
    },
    paint: {
      'line-color': 'green',
      'line-width': 1
    },
    'layout': {'visibility': 'none'}
  }); 
  
  // Ajout couche tiles - Organismes
  map.addSource('orga', {
    type: 'vector',
    url: 'mapbox://22205013.6l10jykp'
  });
  
  map.addLayer({
    'id': 'organisme',
    'type': 'circle',
    'source': 'orga',
    'source-layer': 'base-orga-var-9uvv8v',
    'layout': {'visibility': 'none'},
    'paint': {
      'circle-radius': {
        'base': 1.5,
        'stops': [[13, 2], [22, 60]]
      }, 
      'circle-color': 'grey',
    }, 
  });  

  // Ajout parc relais
  $.getJSON('https://data.rennesmetropole.fr/api/explore/v2.1/catalog/datasets/tco-parcsrelais-star-etat-tr/records?limit=20', 
    function(data) {
      var geojsonData4 = {
        type: 'FeatureCollection',
        features: data.results.map(function(element) {
          return {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [element.coordonnees.lon, element.coordonnees.lat]
            },
            properties: { 
              name: element.nom,
              capacity: element.jrdinfosoliste
            }
          };
        })
      };
    
      map.addLayer({ 
        'id': 'Parcrelais',
        'type': 'circle',
        'source': {
          'type': 'geojson',
          'data': geojsonData4
        },
        'paint': {
          'circle-color': 'orange', 
          'circle-radius': 10
        }
      });
    }
  );

  // Ajout VLS
  $.getJSON('https://data.explore.star.fr/api/explore/v2.1/catalog/datasets/vls-stations-etat-tr/records?limit=60', 
    function(data) {
      var geojsonVLS = {
        type: 'FeatureCollection',
        features: data.results.map(function(element) {
          return {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [element.coordonnees.lon, element.coordonnees.lat]
            },
            properties: { 
              name: element.nom,
              capacity: element.nombreemplacementsdisponibles
            }
          };
        })
      };
    
      map.addLayer({ 
        'id': 'VLS',
        'type': 'circle',
        'source': {
          'type': 'geojson',
          'data': geojsonVLS
        },
        paint: {
          'circle-color': 'grey',
          'circle-stroke-color': 'white',
          'circle-stroke-width': 1.5,
          'circle-radius': {
            property: 'capacity',
            type: 'exponential',
            stops: [[0, 0], [50, 20]]
          },
          'circle-opacity': 0.8
        }
      });
    }
  );

  // Ajout BUS temps réel
  map.addLayer({
    id: "BUS",
    type: "circle",
    source: {
      type: "geojson",
      data: "https://data.explore.star.fr/api/explore/v2.1/catalog/datasets/tco-bus-vehicules-position-tr/exports/geojson?lang=fr&timezone=Europe%2FBerlin&refine=etat%3AEn ligne"
    },
    paint: {
      'circle-color': 'blue',
      'circle-radius': 5 // CORRIGÉ: 'circle-width' n'existe pas
    },
    'layout': {'visibility': 'none'}
  }); 
   
  // AJOUT DU CADASTRE ETALAB
  map.addSource('Cadastre', {
    type: 'vector',
    url: 'https://openmaptiles.geo.data.gouv.fr/data/cadastre.json'
  });

  map.addLayer({
    'id': 'Cadastre',
    'type': 'line',
    'source': 'Cadastre',
    'source-layer': 'parcelles',
    'layout': {'visibility': 'visible'},
    'paint': {'line-color': 'red'},
    'minzoom': 16,
    'maxzoom': 19
  });
  
  map.addLayer({
    'id': 'Cadastre2',
    'type': 'fill',
    'source': 'Cadastre',
    'source-layer': 'parcelles',
    'layout': {'visibility': 'visible'},
    'paint': {
      'fill-color': '#000000',
      'fill-opacity': 0
    },
    'minzoom': 16,
    'maxzoom': 19
  });

  // CORRIGÉ: Vérifier si la couche existe avant de modifier
  if (map.getLayer('communeslimites')) {
    map.setPaintProperty('communeslimites', 'line-width', [
      "interpolate",
      ["exponential", 1],
      ["zoom"],
      16, 0.3,
      18, 1
    ]);
  }
  
  const ville = "Rennes";
  
  // Ajout des bars via Overpass API
  $.getJSON(`https://overpass-api.de/api/interpreter?data=[out:json];area[name="${ville}"]->.searchArea;(node["amenity"="bar"](area.searchArea););out center;`, 
    function(data) {
      var geojsonData = {
        type: 'FeatureCollection',
        features: data.elements.map(function(element) {
          return {
            type: 'Feature',
            geometry: { 
              type: 'Point',
              coordinates: [element.lon, element.lat]
            },
            properties: {}
          };
        })
      };
      
      map.addSource('customData', {
        type: 'geojson',
        data: geojsonData
      });
      
      map.addLayer({
        'id': 'pubs',
        'type': 'circle',
        'source': 'customData',
        'paint': {
          'circle-color': 'green',
          'circle-radius': 5
        },
        'layout': {'visibility': 'none'}
      });
    }
  );

  // Ajout BDTOPO
  map.addSource('BDTOPO', {
    type: 'vector',
    url: 'https://wxs.ign.fr/topographie/geoportail/tms/1.0.0/BDTOPO/metadata.json',
    minzoom: 15,
    maxzoom: 19
  });
		
  map.addLayer({
    'id': 'batiments',
    'type': 'fill-extrusion',
    'source': 'BDTOPO',
    'source-layer': 'batiment',
    'paint': {
      'fill-extrusion-color': 'grey', // CORRIGÉ: utiliser fill-extrusion-color
      'fill-extrusion-opacity': 0.90,
      'fill-extrusion-height': ['get', 'hauteur'] // Ajout hauteur pour 3D
    }
  });

  // Contour commune API cadastre 
  var dataCadastre = 'https://apicarto.ign.fr/api/cadastre/commune?code_insee=35238';
    
  jQuery.getJSON(dataCadastre, function(json) {
    for (var i = 0; i < json.features.length; i++) {
      json.features[i].geometry = json.features[i].geometry;
    }
       
    map.addLayer({
      'id': 'Contourcommune',
      'type': 'line',
      'source': {
        'type': 'geojson',
        'data': json
      },
      'paint': {
        'line-color': 'white',
        'line-width': 2.5
      },
      'layout': {'visibility': 'none'},
    });
  });

  // Ajout point champ
  var datachamps = 'https://apicarto.ign.fr/api/rpg/v2?annee=2021&geom=%7B%22type%22%3A%20%22Point%22%2C%22coordinates%22%3A%5B-1.7332900936740487%2C48.11449693545512%5D%7D';
    
  jQuery.getJSON(datachamps, function(json) {
    for (var i = 0; i < json.features.length; i++) {
      json.features[i].geometry = json.features[i].geometry;
    }
       
    map.addLayer({
      'id': 'parcelles_graphiques',
      'type': 'fill',
      'source': {
        'type': 'geojson',
        'data': json
      },
      'paint': {
        'fill-color': 'yellow', // CORRIGÉ: line-color -> fill-color
        'fill-opacity': 0.5
      },
      'layout': {'visibility': 'none'},
    });
  });

  // Ajout zone N API PLU
  var dataPLU = 'https://apicarto.ign.fr/api/gpu/zone-urba?partition=DU_243500139';

  jQuery.getJSON(dataPLU, function(json) {
    // Filtrer les entités pour ne garder que celles avec typezone = 'N'
    var filteredFeatures = json.features.filter(function(feature) {
      return feature.properties.typezone === 'N';
    });

    // Créer un objet GeoJSON avec les entités filtrées
    var filteredGeoJSON = { 
      type: 'FeatureCollection',
      features: filteredFeatures
    };

    map.addLayer({
      'id': 'PLU',
      'type': 'fill',
      'source': {
        'type': 'geojson',
        'data': filteredGeoJSON
      },
      'paint': {
        'fill-color': 'green',
        'fill-opacity': 0.5
      },
      'layout': {'visibility': 'none'}
    });
  });
  
  // AJOUT CONSOMMATION ÉLECTRIQUE
  map.addLayer({
    id: "CONSO",
    type: "fill",
    source: {
      type: "geojson",
      data: "https://data.rennesmetropole.fr/api/explore/v2.1/catalog/datasets/consommation-electrique-par-secteur-dactivite/exports/geojson?lang=fr&refine=annee%3A%222022%22&refine=code_grand_secteur%3A%22RESIDENTIEL%22&timezone=Europe%2FBerlin"
    },
    'paint': {
      'fill-color': {
        'property': 'conso_moyenne_mwh',
        'stops': [
          [1, '#1a9850'],
          [2, '#91cf60'],
          [3, '#d9ef8b'],
          [4, '#ffffbf'],
          [5, '#fee08b'],
          [6, '#fc8d59'],
          [7, '#d73027']
        ]
      },
      'fill-opacity': 0.9
    }
  }); 

// Fin map.on('load')
});

// Interactivité HOVER sur VLS
var popup = new mapboxgl.Popup({
  className: "Mypopuphover", // CORRIGÉ: lassName -> className
  closeButton: false,
  closeOnClick: false
}); 

map.on('mousemove', function(e) {
  var features = map.queryRenderedFeatures(e.point, { layers: ['VLS'] });
  map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';

  if (!features.length) {
    popup.remove();
    return;
  }

  var feature = features[0];
  popup.setLngLat(feature.geometry.coordinates)
    .setHTML('<h2>' + feature.properties.name + '</h2><hr>' + feature.properties.capacity + '&nbsp;vélos dispo')
    .addTo(map);
});

// Interactivité CLICK sur Parc relais
map.on('click', function (e) {
  var features = map.queryRenderedFeatures(e.point, { layers: ['Parcrelais'] });

  if (!features.length) {
    return;
  }

  var feature = features[0];
  var popup = new mapboxgl.Popup({
    className: "Mypopupclick",
    closeButton: false,
    closeOnClick: false, 
    offset: [0, -15]
  })
    .setLngLat(feature.geometry.coordinates)
    .setHTML('<h2>' + feature.properties.name + '</h2><hr>' + feature.properties.capacity + '&nbsp;places dispo')
    .addTo(map);
});

map.on('mousemove', function (e) {
  var features = map.queryRenderedFeatures(e.point, { layers: ['Parcrelais'] });
  map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';
});

// Bouton de navigation
var nav = new mapboxgl.NavigationControl();
map.addControl(nav, 'top-right');

// Echelle
map.addControl(new mapboxgl.ScaleControl({
  maxWidth: 120,
  unit: 'metric'
}), 'bottom-right');

// Géolocalisation
map.addControl(new mapboxgl.GeolocateControl({
  positionOptions: { enableHighAccuracy: true },
  trackUserLocation: true,
  showUserHeading: true
}));

// Interactivité CLICK sur cadastre 
map.on('click', function (e) {
  var features = map.queryRenderedFeatures(e.point, { layers: ['Cadastre2'] });
  
  if (!features.length) {
    return;
  }
  
  var feature = features[0];
  var popup3 = new mapboxgl.Popup({ 
    className: "Mypopup2",
    offset: [0, -15]
  })
    .setLngLat(e.lngLat)
    .setHTML(feature.properties.id + '<br>Numéro: ' + feature.properties.numero + '<br>' + feature.properties.contenance + ' m2') 
    .addTo(map);
});

map.on('mousemove', function (e) {
  var features = map.queryRenderedFeatures(e.point, { layers: ['Cadastre2'] });
  map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';
});

// Fonction pour basculer les couches
function switchlayer(lname) {
  if (document.getElementById(lname + "CB").checked) {
    map.setLayoutProperty(lname, 'visibility', 'visible');
  } else {
    map.setLayoutProperty(lname, 'visibility', 'none');
  }
}

// Configuration onglets géographiques 
document.getElementById('Gare').addEventListener('click', function () {
  map.flyTo({
    zoom: 16,
    center: [-1.672, 48.1043],
    pitch: 145,
    bearing: -197.6
  });
});

document.getElementById('Rennes1').addEventListener('click', function () {
  map.flyTo({
    zoom: 16,
    center: [-1.6348744693794592, 48.12148089976506],
    pitch: 145,
    bearing: -197.6
  });
});

document.getElementById('Rennes2').addEventListener('click', function () {
  map.flyTo({
    zoom: 16,
    center: [-1.7014896642191748, 48.119208748996186],
    pitch: 145,
    bearing: -197.6
  });
});