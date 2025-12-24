document.addEventListener('DOMContentLoaded', function () {
    // Sélection de la div existante pour la carte
    const mapDiv = document.getElementById('map');

    MAPTILER_KEY = 'K0GNbSwpA1EySYt39611'

    const map = new maplibregl.Map({
        container: mapDiv,
        style:  `https://api.maptiler.com/maps/3a7343e8-95db-4065-81c3-45cf20abc8ac/style.json?key=${MAPTILER_KEY}`,
        // https://openmaptiles.geo.data.gouv.fr/styles/osm-bright/style.json tuile vectorielle en licence ouverte produite par Etalab
        center: [2.2137, 46.9],
        zoom: 5,
        minZoom: 5,
        attributionControl: false // Désactive l'attribution par défaut
    });

// Ajouter un contrôle d'attribution personnalisé, sans l'option compact
map.addControl(new maplibregl.AttributionControl({
    compact: false, // Assure que les attributions sont toujours visibles et non repliées
    customAttribution: "Orange Business"
}), 'bottom-right'); // Positionnement des attributions en bas à droite

     // disable map rotation using right click + drag
     map.dragRotate.disable();

     map.addControl(new maplibregl.FullscreenControl());
// Modifier le texte de l'infobulle après l'ajout du contrôle
const fullscreenButton = document.querySelector('.maplibregl-ctrl-fullscreen');
if (fullscreenButton) {
    fullscreenButton.title = 'Passer en plein écran'; // Modifiez le texte ici
}

class ResetZoomControl {
    onAdd(map) {
        this.map = map;
        this.container = document.createElement('div');
        this.container.className = 'maplibregl-ctrl maplibregl-ctrl-group';

        const resetZoomControl = document.createElement('button');
        resetZoomControl.className = 'maplibregl-ctrl-icon mapboxgl-ctrl-icon mapboxgl-ctrl-compass'; // Utilisation des classes de NavigationControl
        resetZoomControl.title = 'Revenir au zoom initial'; // Ajouter une infobulle

        const resetIcon = document.createElement('img');
        resetIcon.src = '../data_webmap/icons/reset.svg';
        resetIcon.style.width = '20px';
        resetZoomControl.appendChild(resetIcon);

        resetZoomControl.onclick = () => {
            this.map.flyTo({
                center: [2.2137, 46.9],
                zoom: 5,
                bearing: 0
            });
        };

        this.container.appendChild(resetZoomControl);
        return this.container;
    }

    onRemove() {
        this.container.parentNode.removeChild(this.container);
        this.map = undefined;
    }
}

    map.addControl(new ResetZoomControl(), 'top-right');
    // Ajouter le contrôle de navigation sans le bouton "Reset Bearing North"
    map.addControl(new maplibregl.NavigationControl({
    showCompass: false,  // Masquer le bouton "Reset Bearing North"
    showZoom: true       // Garder les boutons de zoom
    }), 'top-right');
    map.addControl(new maplibregl.ScaleControl({ maxWidth: 80, unit: 'metric' }));

let hoveredStateId = null;  // To track the hovered feature
let selectedStateId = null;  // To track the clicked (selected) feature
let selectedVariable = "PartVolumeMoyen";  // Default selected variable

    map.on('load', () => {
        const layers = map.getStyle().layers;
        let firstSymbolId;
        for (const layer of layers) {
            if (layer.type === 'symbol') {
                firstSymbolId = layer.id;
                break;
            }
        }
        // const GEOSERVER_KEY = '6b07c417-efe7-4ca4-9573-9fbd698419c9';
        const GEOJSON_EPCI = '../data_webmap/simplifier/epci_nuite_simplifier.geojson';
        const GEOJSON_COMMUNE = '../data_webmap/simplifier/commune_nuite_simplifier.geojson';
        const GEOJSON_IRIS = '../data_webmap/simplifier/iris_nuite_simplifier.geojson';
        const GEOJSON_COEUR_DE_VILLE = '../data_webmap/zone_etude/contour_cdv.geojson';
        


        map.addSource('epci', {
            type: 'geojson',
            data: GEOJSON_EPCI,
            promoteId: 'NE_ID',
            
        });
        
        map.addLayer(EPCI_NUITEE, firstSymbolId);
   
        map.addSource('commune', {
            type: 'geojson',
            data: GEOJSON_COMMUNE,
            promoteId: 'NE_ID',
            
        });
        map.addLayer(COMMUNE_NUITEE, firstSymbolId);
        
        map.addSource('iris', {
            type: 'geojson',
            data: GEOJSON_IRIS,
            promoteId: 'NE_ID',
            
        });
        map.addLayer(IRIS_NUITEE, firstSymbolId);

           // Ajoutez la source GeoJSON
     map.addSource('coeur_ville_belfort', {
        'type': 'geojson',
        'data': GEOJSON_COEUR_DE_VILLE,
        promoteId: 'NE_ID',
        
    });
    map.addLayer(COEUR_DE_VILLE, firstSymbolId);

        // Ajout des centroïdes pour EPCI
        fetch(GEOJSON_EPCI)
            .then(response => response.json())
            .then(polygonGeoJSON => {
                const pointGeoJSON = {
                    'type': 'FeatureCollection',
                    'features': polygonGeoJSON.features.map(feature => {
                        const pointOnSurface = turf.pointOnSurface(feature);
                        return {
                            'type': 'Feature',
                            'geometry': pointOnSurface.geometry,
                            'properties': feature.properties
                        };
                    })
                };

                map.addSource('epci-centroids', {
                    type: 'geojson',
                    data: pointGeoJSON,
                    promoteId: 'NE_ID'
                });

                map.addLayer(EPCI_NUITEE_CENTRO, firstSymbolId);
                // map.setFilter('epci-centroids-layer', ['>', ['get', 'VolumeMoyen'], 100]);
            });

        // Ajout des centroïdes pour Communes
        fetch(GEOJSON_COMMUNE)
            .then(response => response.json())
            .then(polygonGeoJSON => {
                const pointGeoJSON = {
                    'type': 'FeatureCollection',
                    'features': polygonGeoJSON.features.map(feature => {
                        const pointOnSurface = turf.pointOnSurface(feature);
                        return {
                            'type': 'Feature',
                            'geometry': pointOnSurface.geometry,
                            'properties': feature.properties
                        };
                    })
                };

                map.addSource('commune-centroids', {
                    type: 'geojson',
                    data: pointGeoJSON,
                    promoteId: 'NE_ID'
                });

                map.addLayer(COMMUNE_NUITEE_CENTRO, firstSymbolId);
                // map.setFilter('commune-centroids-layer', ['>', ['get', 'VolumeMoyen'], 100]);
            });
           
        // Ajout des centroïdes pour IRIS
        fetch(GEOJSON_IRIS)
            .then(response => response.json())
            .then(polygonGeoJSON => {
                const pointGeoJSON = {
                    'type': 'FeatureCollection',
                    'features': polygonGeoJSON.features.map(feature => {
                        const pointOnSurface = turf.pointOnSurface(feature);
                        return {
                            'type': 'Feature',
                            'geometry': pointOnSurface.geometry,
                            'properties': feature.properties
                        };
                    })
                };

                map.addSource('iris-centroids', {
                    type: 'geojson',
                    data: pointGeoJSON, 
                    promoteId: 'NE_ID'
                    
                });

                map.addLayer(IRIS_NUITEE_CENTRO, firstSymbolId);
                // map.setFilter('iris-centroids-layer', ['>', ['get', 'VolumeMoyen'], 100]);
            });

        map.addLayer(LINE_EPCI, firstSymbolId);
        map.addLayer(LINE_COMMUNE, firstSymbolId);
        map.addLayer(LINE_IRIS, firstSymbolId);


      document.getElementById('toggle-all-circles').addEventListener('change', function () {
          const visibility = this.checked ? 'visible' : 'none';
          map.setLayoutProperty('epci-centroids-layer', 'visibility', visibility);
          map.setLayoutProperty('commune-centroids-layer', 'visibility', visibility);
          map.setLayoutProperty('iris-centroids-layer', 'visibility', visibility);
      });

  // Event listener for dropdown change
  document.getElementById('variableSelect').addEventListener('change', function (e) {
    selectedVariable = e.target.value === "NUITE" ? "PartVolumeMoyen" : "Tx_Nuitee_Pop_Active_Sup3h";
    updateLayerState(selectedVariable);
    });

// Function to update the feature state based on the selected variable
function updateLayerState(variable) {
    if (variable === "PartVolumeMoyen") {
        // Afficher la couche IRIS lorsque 'PartVolumeMoyen' est sélectionné
        map.setLayoutProperty('iris-fill', 'visibility', 'visible');

        // Mise à jour pour la couche 'commune-fill'
        map.setPaintProperty('commune-fill', 'fill-color', [
            'case',
            ['==', ['get', 'PartVolumeMoyen'], null], 'hsla(0, 0%, 0%, 0)', // Transparent for null values
            ['==', ['feature-state', 'selected'], true], '#FF0000', // Red for selected
            ['==', ['feature-state', 'hover'], true], '#b0bfc4', // Green for hover
            ['interpolate', ['linear'], ['get', 'PartVolumeMoyen'],
                0.001, "#faf9f3",
                0.2, "#fec46c",
                0.5, "#fe9929",
                2, "#e57217",
                8, "#c4510b",
                31.99, "#993404"
            ]
        ]);

        // Mise à jour pour la couche 'epci-fill'
        map.setPaintProperty('epci-fill', 'fill-color', [
            'case',
            ['==', ['get', 'PartVolumeMoyen'], null], 'hsla(0, 0%, 0%, 0)', // Transparent for null values
            ['==', ['feature-state', 'selected'], true], '#FF0000', // Red for selected
            ['==', ['feature-state', 'hover'], true], '#b0bfc4', // Green for hover
            ['interpolate', ['linear'], ['get', 'PartVolumeMoyen'],
                0.001, "#faf9f3",
                0.2, "#fec46c",
                0.5, "#fe9929",
                2, "#e57217",
                8, "#c4510b",
                55.74, "#993404"
            ]
        ]);

        // Mise à jour pour la couche 'iris-fill'
        map.setPaintProperty('iris-fill', 'fill-color', [
            'case',
            ['==', ['get', 'PartVolumeMoyen'], null], 'hsla(0, 0%, 0%, 0)', // Transparent for null values
            ['==', ['feature-state', 'selected'], true], '#FF0000', // Red for selected
            ['==', ['feature-state', 'hover'], true], '#b0bfc4', // Green for hover
            ['interpolate', ['linear'], ['get', 'PartVolumeMoyen'],
            0.001, "#faf9f3",
            0.2, "#fec46c",
            0.5, "#fe9929",
            2, "#e57217",
            8, "#c4510b",
            16.18, "#993404"
            ]
        ]);
        
    
    document.getElementById('etranger-checkbox').disabled = false;
    
    document.getElementById('inf30min-checkbox').disabled = false;
    document.getElementById('30min3h-checkbox').disabled = false;

    } else if (variable === "Tx_Nuitee_Pop_Active_Sup3h") {
        // Rendre invisible la couche IRIS lorsque 'Tx_Nuitee_Pop_Active_Sup3h' est sélectionné
        map.setLayoutProperty('iris-fill', 'visibility', 'none');

        // Mise à jour pour la couche 'commune-fill'
        map.setPaintProperty('commune-fill', 'fill-color', [
            'case',
            ['==', ['get', 'Tx_Nuitee_Pop_Active_Sup3h'], null], 'hsla(0, 0%, 0%, 0)', // Transparent for null values
            ['==', ['feature-state', 'selected'], true], '#FF0000', // Red for selected
            ['==', ['feature-state', 'hover'], true], '#b0bfc4', // Green for hover
            ['interpolate', ['linear'], ['get', 'Tx_Nuitee_Pop_Active_Sup3h'],
            0.001, '#e0f3f8',
            1, '#abd9e9',
            10, '#74add1',
            20, '#4575b4',
            30, '#313695',
            80, '#253494',
            180, '#253494'
            ]
        ]);

        // Mise à jour pour la couche 'epci-fill'
        map.setPaintProperty('epci-fill', 'fill-color', [
            'case',
            ['==', ['get', 'Tx_Nuitee_Pop_Active_Sup3h'], null], 'hsla(0, 0%, 0%, 0)', // Transparent for null values
            ['==', ['feature-state', 'selected'], true], '#FF0000', // Red for selected
            ['==', ['feature-state', 'hover'], true], '#b0bfc4', // Green for hover
            ['interpolate', ['linear'], ['get', 'Tx_Nuitee_Pop_Active_Sup3h'],
            0.001, '#e0f3f8',
            1, '#abd9e9',
            10, '#74add1',
            20, '#4575b4',
            30, '#313695',
            80, '#253494',
            180, '#253494'
            ]
        ]);
        // if(document.getElementById('toggle-all-circles').checked) {
        //     map.addLayer(EPCI_NUITEE_CENTRO_3H);
        //     map.setLayoutProperty('epci-centroids-layer-3H', 'visibility', 'visible');
            
        // }
        
        // map.setLayoutProperty('commune-centroids-layer', 'visibility', visibility);
        // map.setLayoutProperty('iris-centroids-layer', 'visibility', visibility);
        
    document.getElementById('inf30min-checkbox').disabled = true;
    document.getElementById('30min3h-checkbox').disabled = true;
    document.getElementById('etranger-checkbox').disabled = true;
    
    document.getElementById('inf30min-checkbox').checked = false;
    document.getElementById('30min3h-checkbox').checked = false;
    document.getElementById('etranger-checkbox').checked = false;


    
    }


}

// Apply hover and click effects immediately on load
applyHoverAndClickEffects();

// Automatically select the first feature and display its info
selectFirstFeature();

// Variables pour stocker les niveaux de zoom des couches
let zoomLevels = {
    commune: { minZoom: 8, maxZoom: 11 },
    epci: { minZoom: 5, maxZoom: 8 },
    iris: { minZoom: 11, maxZoom: 22 }
};

// Variables pour stocker les IDs des entités sélectionnées pour chaque couche
let selectedStateIdCommune = null;
let selectedStateIdEPCI = null;
let selectedStateIdIRIS = null;

// Variables pour stocker les IDs des entités survolées pour chaque couche
let hoveredStateIdCommune = null;
let hoveredStateIdEPCI = null;
let hoveredStateIdIRIS = null;

// Function to apply hover and click effects immediately on load and when data is updated
function applyHoverAndClickEffects() {
    // List of layers that need hover and click effects
    const layers = ['commune-fill', 'iris-fill', 'epci-fill'];

    layers.forEach(layer => {
        // Hover effect: Change the fill color on hover
        // Effet hover : Changer la couleur de remplissage au survol
        map.on('mousemove', layer, function (e) {
            const zoom = map.getZoom();

            // Vérifier le niveau de zoom pour chaque couche en utilisant les niveaux stockés
            if (
                (layer === 'commune-fill' && zoom >= zoomLevels.commune.minZoom && zoom <= zoomLevels.commune.maxZoom) ||
                (layer === 'epci-fill' && zoom >= zoomLevels.epci.minZoom && zoom <= zoomLevels.epci.maxZoom) ||
                (layer === 'iris-fill' && zoom >= zoomLevels.iris.minZoom && zoom <= zoomLevels.iris.maxZoom)
            ) {
                if (e.features.length > 0) {
                    let currentHoveredId = e.features[0].id;

                    // Reset the hover state of the previous feature for the specific layer
                    resetHoverState(layer);

                    // Set the hover state of the new feature
                    map.setFeatureState(
                        { source: layer.replace('-fill', ''), id: currentHoveredId },  // Adjust source according to layer
                        { hover: true }
                    );

                    // Store the new hovered ID based on the layer
                    if (layer === 'commune-fill') {
                        hoveredStateIdCommune = currentHoveredId;
                    } else if (layer === 'epci-fill') {
                        hoveredStateIdEPCI = currentHoveredId;
                    } else if (layer === 'iris-fill') {
                        hoveredStateIdIRIS = currentHoveredId;
                    }
                }
            }
        });

        map.on('mouseleave', layer, function () {
            resetHoverState(layer); // Reset hover state when leaving a layer
        });

        // Effet clic : Changer la couleur de remplissage au clic
        map.on('click', layer, function (e) {
            const zoom = map.getZoom();

            // Vérifier le niveau de zoom pour chaque couche en utilisant les niveaux stockés
            if (
                (layer === 'commune-fill' && zoom >= zoomLevels.commune.minZoom && zoom <= zoomLevels.commune.maxZoom) ||
                (layer === 'epci-fill' && zoom >= zoomLevels.epci.minZoom && zoom <= zoomLevels.epci.maxZoom) ||
                (layer === 'iris-fill' && zoom >= zoomLevels.iris.minZoom && zoom <= zoomLevels.iris.maxZoom)
            ) {
                if (e.features.length > 0) {
                    selectFeature(layer, e.features[0].id, e.features[0].properties); // Pass layer to selectFeature
                }
            }
        });
    });
}

// Function to reset hover state of the previous feature for a specific layer
function resetHoverState(layer) {
    if (layer === 'commune-fill' && hoveredStateIdCommune !== null) {
        map.setFeatureState(
            { source: 'commune', id: hoveredStateIdCommune },
            { hover: false }
        );
        hoveredStateIdCommune = null;
    } else if (layer === 'epci-fill' && hoveredStateIdEPCI !== null) {
        map.setFeatureState(
            { source: 'epci', id: hoveredStateIdEPCI },
            { hover: false }
        );
        hoveredStateIdEPCI = null;
    } else if (layer === 'iris-fill' && hoveredStateIdIRIS !== null) {
        map.setFeatureState(
            { source: 'iris', id: hoveredStateIdIRIS },
            { hover: false }
        );
        hoveredStateIdIRIS = null;
    }
}

// Function to select a feature and display its information
function selectFeature(layer, featureId, properties) {
    let selectedStateId = null;

    // Gérer la sélection selon la couche cliquée
    if (layer === 'commune-fill') {
        selectedStateId = selectedStateIdCommune;
    } else if (layer === 'epci-fill') {
        selectedStateId = selectedStateIdEPCI;
    } else if (layer === 'iris-fill') {
        selectedStateId = selectedStateIdIRIS;
    }

    // Réinitialiser l'état sélectionné précédent si un autre élément est sélectionné
    if (selectedStateId !== null && selectedStateId !== featureId) {
        map.setFeatureState(
            { source: layer.replace('-fill', ''), id: selectedStateId },
            { selected: false }  // Désélectionner l'ancienne entité
        );
    }

    // Mettre à jour l'ID sélectionné pour la couche actuelle
    if (layer === 'commune-fill') {
        selectedStateIdCommune = featureId;
    } else if (layer === 'epci-fill') {
        selectedStateIdEPCI = featureId;
    } else if (layer === 'iris-fill') {
        selectedStateIdIRIS = featureId;
    }

    // Appliquer l'état sélectionné pour la nouvelle entité
    map.setFeatureState(
        { source: layer.replace('-fill', ''), id: featureId },
        { selected: true }  // Mettre en surbrillance la nouvelle entité
    );



    
// Access the variable values based on selectedVariable
let variableText;
const communeName = properties.NOM_COM || "Nom de la commune indisponible";  // Fetching the commune name
const epciName = properties.NOM || "Nom de l'EPCI indisponible";
const irisName = properties.NOM_IRIS || "Nom de l'IRIS indisponible";
const sumpopactive = properties.sum_pop_active || "Données indisponibles";

// Récupérer l'objet VolumeMoyen
const volumeMoyenObject = properties.VolumeMoyen;

// Vérification si l'objet VolumeMoyen existe et contient le champ sum
let volumeMoyenText = "Données indisponibles";
console.log(typeof volumeMoyenObject)
// if (volumeMoyenObject && volumeMoyenObject.sum !== undefined) {
    if(typeof volumeMoyenObject === 'number') {
        volumeMoyenText = volumeMoyenObject.toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
// si jamais le type est un number on se sert de volumemoyenobject sinon on se sert de volumemoyenobject.sum 
    

} 
else if (volumeMoyenObject && JSON.parse(volumeMoyenObject).sum !== undefined)
        volumeMoyenText = JSON.parse(volumeMoyenObject).sum.toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 0 });


// Condition pour afficher 'VolumeMoyen_Sup3h' uniquement pour les couches commune et epci
let volumeMoyen3hText = "";
if (layer === 'commune-fill' || layer === 'epci-fill') {
    const volumeMoyen3h = properties.VolumeMoyen_Sup3h !== null && properties.VolumeMoyen_Sup3h !== undefined
        ? properties.VolumeMoyen_Sup3h.toFixed(0)  // Formater sans décimales
        : "Données indisponibles";

    volumeMoyen3hText = `
        <strong style="font-size: 10px;">Flux moyen de personnes fréquentant<br /> le coeur de Belfort au moins 3 heures:</strong><br>
        <span style="font-size: 9px; color: #0066cc;">${volumeMoyen3h}</span><br><br>
    `;
}

if (selectedVariable === "PartVolumeMoyen") {
    const partVolumeMoyen = properties.PartVolumeMoyen;
    const partVolumeMoyenText = partVolumeMoyen !== null && partVolumeMoyen !== undefined ? `${partVolumeMoyen.toFixed(2)}%` : "Données indisponibles";

    // Structuring and improving readability
    variableText = `
      <strong style="font-size: 10px;">EPCI :</strong> <span style="font-size: 14px;">${epciName}</span><br><br>
      <strong style="font-size: 10px;">Commune :</strong> <span style="font-size: 14px;">${communeName}</span><br><br>
      <strong style="font-size: 10px;">IRIS :</strong> <span style="font-size: 14px;">${irisName}</span><br><br>

      <strong style="font-size: 10px;">Flux cumulé de personnes fréquentant <br />le coeur de Belfort:</strong><br>
      <span style="font-size: 14px;">${volumeMoyenText}</span><br><br>

      <strong style="font-size: 10px;">Part du flux cumulé de personnes fréquentant le coeur de Belfort<br /> :</strong><br>
      <span style="font-size: 14px;">${partVolumeMoyenText}</span>
    `;
} else if (selectedVariable === "Tx_Nuitee_Pop_Active_Sup3h") {
    const txNuitePopActive = properties.Tx_Nuitee_Pop_Active_Sup3h;
    const txNuitePopActiveText = txNuitePopActive !== null && txNuitePopActive !== undefined ? `${txNuitePopActive.toFixed(2)}%` : "Données indisponibles";


    // Structuring and improving readability
    variableText = `
      <strong style="font-size: 10px;">Commune :</strong> <span style="font-size: 9px;">${communeName}</span><br><br>

      ${volumeMoyen3hText} <!-- Insertion de la condition pour VolumeMoyen_Sup3h -->

      <strong style="font-size: 10px;">Nombre d'actif* dans cette commune:</strong><br>
      <span style="font-size: 9px; color: #0066cc;">${sumpopactive}</span><br><br>

      <strong style="font-size: 10px;">Taux de pénétration d'actifs * <br /> </strong>
      (Part du flux moyen de personnes fréquentant <br /> le coeur de Belfort au moins 3 heures<br /> rapporté au nombre d'actif*) :<br>
      <span style="font-size: 9px; color: #009933;">${txNuitePopActiveText}</span>
    `;
}


    // Display the information in the #info element
    document.getElementById('info').innerHTML = variableText;
}

// Automatically select and display information of the first feature
function selectFirstFeature() {
    const features = map.querySourceFeatures('commune');
    if (features.length > 0) {
      const firstFeature = features[0];
      selectFeature(firstFeature.id, firstFeature.properties);
    }
}









    
// Fonction pour vérifier si une couche existe
function layerExists(layerId) {
    return map.getLayer(layerId) !== undefined;
}

// Fonction pour mettre à jour la visibilité des couches
function updateLayerVisibility() {
    // Récupération de l'état du toggle switch, des checkboxes et du toggle des centroides
    const switchChecked = document.getElementById('flexSwitchCheckChecked').checked;
    const circlesToggleChecked = document.getElementById('toggle-all-circles').checked;
    const epciCheckbox = document.getElementById('epci');
    const communeCheckbox = document.getElementById('commune-regroupee');
    const irisCheckbox = document.getElementById('iris-regroupe');

    // Vérifier si les couches fill et centroides existent
    const epciLayerExists = layerExists('epci-fill');
    const communeLayerExists = layerExists('commune-fill');
    const irisLayerExists = layerExists('iris-fill');
    const epciCentroidLayerExists = layerExists('epci-centroids-layer');
    const communeCentroidLayerExists = layerExists('commune-centroids-layer');
    const irisCentroidLayerExists = layerExists('iris-centroids-layer');

    if (switchChecked) {
        // Si le toggle switch est activé, rendre toutes les couches fill visibles
        if (epciLayerExists) {
            map.setLayoutProperty('epci-fill', 'visibility', 'visible');
            map.setPaintProperty('epci-fill', 'fill-opacity', [
                "step", ["zoom"], 0, 5, 0.6, 8, 0
            ]);
            if (epciCentroidLayerExists && circlesToggleChecked) {
                map.setLayoutProperty('epci-centroids-layer', 'visibility', 'visible');
            }
        }
        if (communeLayerExists) {
            map.setLayoutProperty('commune-fill', 'visibility', 'visible');
            map.setPaintProperty('commune-fill', 'fill-opacity', [
                "step", ["zoom"], 0, 8, 0.6, 11, 0
            ]);
            if (communeCentroidLayerExists && circlesToggleChecked) {
                map.setLayoutProperty('commune-centroids-layer', 'visibility', 'visible');
            }
        }
        if (irisLayerExists) {
            map.setLayoutProperty('iris-fill', 'visibility', 'visible');
            map.setPaintProperty('iris-fill', 'fill-opacity', [
                "step", ["zoom"], 0, 11, 0.6, 22, 0
            ]);
            if (irisCentroidLayerExists && circlesToggleChecked) {
                map.setLayoutProperty('iris-centroids-layer', 'visibility', 'visible');
            }
        }

        // Cocher et désactiver les checkboxes
        epciCheckbox.checked = true;
        communeCheckbox.checked = true;
        irisCheckbox.checked = true;

        epciCheckbox.disabled = true;
        communeCheckbox.disabled = true;
        irisCheckbox.disabled = true;
    } else {
        // Si le toggle switch est désactivé, cacher toutes les couches fill et centroides
        epciCheckbox.checked = false;
        communeCheckbox.checked = false;
        irisCheckbox.checked = false;

        if (epciLayerExists) map.setLayoutProperty('epci-fill', 'visibility', 'none');
        if (communeLayerExists) map.setLayoutProperty('commune-fill', 'visibility', 'none');
        if (irisLayerExists) map.setLayoutProperty('iris-fill', 'visibility', 'none');

        if (epciCentroidLayerExists) map.setLayoutProperty('epci-centroids-layer', 'visibility', 'none');
        if (communeCentroidLayerExists) map.setLayoutProperty('commune-centroids-layer', 'visibility', 'none');
        if (irisCentroidLayerExists) map.setLayoutProperty('iris-centroids-layer', 'visibility', 'none');

        // Réactiver les checkboxes
        epciCheckbox.disabled = false;
        communeCheckbox.disabled = false;
        irisCheckbox.disabled = false;
    }
}

// Fonction pour gérer le comportement des checkboxes lorsqu'une est cochée
function handleCheckboxChange() {
    const switchChecked = document.getElementById('flexSwitchCheckChecked').checked;
    const circlesToggleChecked = document.getElementById('toggle-all-circles').checked;
    const epciCheckbox = document.getElementById('epci');
    const communeCheckbox = document.getElementById('commune-regroupee');
    const irisCheckbox = document.getElementById('iris-regroupe');

    // Vérifier si les couches fill et centroides existent
    const epciLayerExists = layerExists('epci-fill');
    const communeLayerExists = layerExists('commune-fill');
    const irisLayerExists = layerExists('iris-fill');
    const epciCentroidLayerExists = layerExists('epci-centroids-layer');
    const communeCentroidLayerExists = layerExists('commune-centroids-layer');
    const irisCentroidLayerExists = layerExists('iris-centroids-layer');

    // Cacher toutes les couches fill et centroides
    if (epciLayerExists) map.setLayoutProperty('epci-fill', 'visibility', 'none');
    if (communeLayerExists) map.setLayoutProperty('commune-fill', 'visibility', 'none');
    if (irisLayerExists) map.setLayoutProperty('iris-fill', 'visibility', 'none');

    if (epciCentroidLayerExists) map.setLayoutProperty('epci-centroids-layer', 'visibility', 'none');
    if (communeCentroidLayerExists) map.setLayoutProperty('commune-centroids-layer', 'visibility', 'none');
    if (irisCentroidLayerExists) map.setLayoutProperty('iris-centroids-layer', 'visibility', 'none');

    const epciChecked = epciCheckbox.checked;
    const communeChecked = communeCheckbox.checked;
    const irisChecked = irisCheckbox.checked;

    if (!switchChecked) {  // Seulement si le toggle switch est désactivé
        if (epciChecked && epciLayerExists) {
            map.setLayoutProperty('epci-fill', 'visibility', 'visible');
            map.setPaintProperty('epci-fill', 'fill-opacity', [
                "step", ["zoom"], 0, 5, 0.6, 22, 0
            ]);
            if (epciCentroidLayerExists && circlesToggleChecked) {
                map.setLayoutProperty('epci-centroids-layer', 'visibility', 'visible');
            }
            communeCheckbox.disabled = true;
            irisCheckbox.disabled = true;
        } else if (communeChecked && communeLayerExists) {
            map.setLayoutProperty('commune-fill', 'visibility', 'visible');
            map.setPaintProperty('commune-fill', 'fill-opacity', [
                "step", ["zoom"], 0, 5, 0.6, 22, 0
            ]);
            if (communeCentroidLayerExists && circlesToggleChecked) {
                map.setLayoutProperty('commune-centroids-layer', 'visibility', 'visible');
            }
            epciCheckbox.disabled = true;
            irisCheckbox.disabled = true;
        } else if (irisChecked && irisLayerExists) {
            map.setLayoutProperty('iris-fill', 'visibility', 'visible');
            map.setPaintProperty('iris-fill', 'fill-opacity', [
                "step", ["zoom"], 0, 5, 0.6, 22, 0
            ]);
            if (irisCentroidLayerExists && circlesToggleChecked) {
                map.setLayoutProperty('iris-centroids-layer', 'visibility', 'visible');
            }
            epciCheckbox.disabled = true;
            communeCheckbox.disabled = true;
        } else {
            // Si aucune checkbox n'est cochée, réactiver toutes les checkboxes
            epciCheckbox.disabled = false;
            communeCheckbox.disabled = false;
            irisCheckbox.disabled = false;
        }
    }
}

// Ajout des événements `change` pour chaque checkbox, le toggle switch et le toggle des cercles
document.getElementById('flexSwitchCheckChecked').addEventListener('change', updateLayerVisibility);
document.getElementById('toggle-all-circles').addEventListener('change', updateLayerVisibility);
document.getElementById('epci').addEventListener('change', handleCheckboxChange);
document.getElementById('commune-regroupee').addEventListener('change', handleCheckboxChange);
document.getElementById('iris-regroupe').addEventListener('change', handleCheckboxChange);


// Initialiser la visibilité des couches lors du chargement de la page
map.on('load', updateLayerVisibility);
      map.flyTo({
          center: [6.826716845307154, 47.693645238186654],
          zoom: 7,
          bearing: 0
      });
  }
);

  function formatDate(dateStr) {
      const options = { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateStr).toLocaleDateString('fr-FR', options);
  }

// Fonction pour mettre à jour un label spécifique
const setLabel = (lbl, val) => {
    const label = document.getElementById(`slider-${lbl}-label`);
    label.textContent = formatDate(DATES[val]);
    
    // Sélectionnez la poignée du slider correspondante
    const sliderHandle = document.querySelector(`#slider-div .${lbl}-slider-handle`);
    
    // Obtenez la position relative du conteneur parent
    const containerRect = document.querySelector('.dropdown-menu').getBoundingClientRect();
    
    // Obtenez la position de la poignée
    const rect = sliderHandle.getBoundingClientRect();
    
    // Calculez la position en fonction du conteneur parent
    label.style.top = `${rect.top - containerRect.top - 30}px`;
    label.style.left = `${rect.left - containerRect.left}px`;
};

const setLabels = (values) => {   
    setLabel("min", values[0]);
    setLabel("max", values[1]);

    // Positionnement des labels
    positionLabel("min-label", values[0]);
    positionLabel("max-label", values[1]);
};

const positionLabel = (labelId, value) => {
    const sliderElement = $('#ex2').parent(); // Sélectionnez le parent du slider
    const handles = sliderElement.find('.min-slider-handle, .max-slider-handle'); // Essayez de trouver les handles avec ces classes
    const label = $("#" + labelId);
    
    if (handles.length < 2) {
        console.error("Impossible de trouver les handles du slider.");
        return;
    }
    
    const handle = value === 0 ? handles[0] : handles[1];
    
    if (!handle) {
        console.error("Impossible de trouver le handle correspondant pour la valeur:", value);
        return;
    }
    
    const handlePosition = $(handle).position().left;
    const sliderWidth = sliderElement.width();
    const labelWidth = label.outerWidth();
    const leftPosition = handlePosition - (labelWidth / 2) + (sliderWidth * (value / (DATES.length - 1)));
    label.css('left', leftPosition + 'px');
};














































  // Définition des fonctions de filtrage

  const getSelectedNationalities = () => {
      const nationalities = [];
      if (document.getElementById('nationaux-checkbox').checked) {
          nationalities.push('National');
      }
      if (document.getElementById('etranger-checkbox').checked) {
          nationalities.push('Etranger');
      }
      return nationalities.length === 0 ? ['National', 'Etranger'] : nationalities;
  };

  const getSelectedDurations = () => {
      const durations = [];
      if (document.getElementById('inf30min-checkbox').checked) durations.push('Inf30min');
      if (document.getElementById('30min3h-checkbox').checked) durations.push('30min3h');
      if (document.getElementById('sup3h-checkbox').checked) durations.push('Sup3h');
      return durations.length ? durations : ['Inf30min', '30min3h', 'Sup3h'];
  };





// Fonction pour filtrer et sommer les volumes de nuitées
const filterAndSumVolume = (data, dates, key = 'NE_ID', isEPCI = false) => {
    const selectedDurations = getSelectedDurations();
    const selectedNationalities = getSelectedNationalities();

    // Créer un objet pour stocker les sommes
    const volumeSums = data
        .filter(d => dates.includes(d.Date) 
                     && selectedDurations.includes(d.Duree) 
                     && selectedNationalities.includes(d.Type))
        .reduce((acc, row) => {
            const idKey = row[key]; // Utilise 'NE_ID' ou une autre clé

            // Initialisation de l'accumulateur pour chaque clé
            if (!acc[idKey]) {
                acc[idKey] = { sum: 0, count: 0 }; // Somme et compte initialisés à 0
            }

            // Ajouter le volume de nuitée et augmenter le compte
            acc[idKey].sum += +row.volume_nuitee;
            acc[idKey].count += 1;

            return acc;
        }, {});

    return volumeSums;
};

// Calculer la moyenne pour chaque clé
const calculateAverages = (sumsAndCounts) => {
    const averages = {};
    Object.keys(sumsAndCounts).forEach(idKey => {
        const { sum, count } = sumsAndCounts[idKey];
        averages[idKey] = count === 0 ? 0 : sum / count; // Éviter la division par zéro
    });
    return averages;
};

// Fonction pour calculer la part du volume moyen
const calculatePartVolumeMoyen = (data, selectedDates, key = 'NE_ID', isEPCI = false) => {
    const volumeSums = filterAndSumVolume(data, selectedDates, key, isEPCI);
    const totalVolumeReference = Object.values(volumeSums).reduce((acc, val) => acc + val.sum, 0);

    if (totalVolumeReference === 0) return {}; // Éviter la division par zéro

    return Object.keys(volumeSums).reduce((acc, idKey) => {
        acc[idKey] = (volumeSums[idKey].sum / totalVolumeReference) * 100;
        return acc;
    }, {});
};

// Fonction pour calculer le taux de pénétration d'actifs
const calculatePenetrationRate = (data, averages, key = 'NE_ID') => {
    const penetrationRates = {};

    // Boucle sur chaque clé (NE_ID) dans les moyennes calculées
    Object.keys(averages).forEach(idKey => {
        // Chercher l'entrée dans 'data' qui correspond à cette clé
        const entry = data.find(d => d[key] === idKey);

        if (entry && entry.sum_pop_active > 0) {
            // Calcul du taux de pénétration (moyenne volume / sum_pop_active)
            penetrationRates[idKey] = (averages[idKey] / entry.sum_pop_active) * 100;  // Multiplication par 100 pour obtenir un pourcentage
        } else {
            // Si 'sum_pop_active' est manquant ou 0, le taux est 0
            penetrationRates[idKey] = 0;
        }
    });

    return penetrationRates;
};

// Fonction pour mettre à jour la carte avec de nouvelles données
const updateMapWithNewData = (selectedDates) => {
    // Mise à jour pour les communes
    d3.dsv(';', '../data_webmap/simplifier/COM_NUITEE_POPACTIVE.csv').then(data => {
        return fetch('../data_webmap/simplifier/commune_nuite_simplifier.geojson')
            .then(response => response.json())
            .then(polygonGeoJSON => {
                const volumeData = filterAndSumVolume(data, selectedDates, 'NE_ID');
                const averages = calculateAverages(volumeData);
                const partVolumeData = calculatePartVolumeMoyen(data, selectedDates, 'NE_ID');
                const TxPenetration = calculatePenetrationRate(data, averages, 'NE_ID');

                const pointGeoJSON = {
                    'type': 'FeatureCollection',
                    'features': polygonGeoJSON.features.map(feature => {
                        const NeId = feature.properties.NE_ID;
                        let volumeMoyen = volumeData[NeId] || 0;

                        // Si l'objet 'volumeMoyen' est bien défini et contient un champ 'sum'
                        if (typeof volumeMoyen === 'object' && volumeMoyen !== null && volumeMoyen.sum !== undefined) {
                            // On conserve uniquement 'sum'
                            feature.properties.VolumeMoyen = volumeMoyen.sum;
                        } else {
                            // Sinon, on assigne 0
                            feature.properties.VolumeMoyen = 0;
                        }
                
                        // console.log(feature.properties.VolumeMoyen); // Log uniquement la somme
                        feature.properties.PartVolumeMoyen = partVolumeData[NeId] || 0;
                        feature.properties.Tx_Nuitee_Pop_Active_Sup3h = TxPenetration[NeId] || 0;
                        feature.properties.VolumeMoyen_Sup3h = averages[NeId] || 0;

                        const pointOnSurface = turf.pointOnSurface(feature);
                        return {
                            'type': 'Feature',
                            'geometry': pointOnSurface.geometry,
                            'properties': feature.properties
                        };
                    })
                };

                // Mise à jour des centroids des communes
                if (map.getSource('commune-centroids')) {
                    map.getSource('commune-centroids').setData(pointGeoJSON);
                } else {
                    map.addSource('commune-centroids', {
                        type: 'geojson',
                        data: pointGeoJSON
                    });
                    map.addLayer(COMMUNE_NUITEE_CENTRO, firstSymbolId);
                    map.setFilter('commune-centroids-layer', ['>', ['get', 'VolumeMoyen'], 100]);
                }

                // Mise à jour des polygones des communes
                if (map.getSource('commune')) {
                    map.getSource('commune').setData(polygonGeoJSON);
                } else {
                    map.addSource('commune', {
                        type: 'geojson',
                        data: polygonGeoJSON
                    });
                    map.addLayer(COMMUNE_NUITEE, firstSymbolId);
          
                }
            });
    })
    .then(() => {
      // Mise à jour pour EPCI
      return d3.dsv(';', '../data_webmap/simplifier/EPCI_NUITEE_POPACTIVE.csv').then(data => {
          return fetch('../data_webmap/simplifier/epci_nuite_simplifier.geojson')
              .then(response => response.json())
              .then(polygonGeoJSON => {
                const volumeData = filterAndSumVolume(data, selectedDates, 'NE_ID');
                const averages = calculateAverages(volumeData);
                const partVolumeData = calculatePartVolumeMoyen(data, selectedDates, 'NE_ID');
                const TxPenetration = calculatePenetrationRate(data, averages, 'NE_ID');

  
                const pointGeoJSON = {
                    'type': 'FeatureCollection',
                    'features': polygonGeoJSON.features.map(feature => {
                        const NeId = feature.properties.NE_ID;
                        let volumeMoyen = volumeData[NeId] || 0;

                        // Si l'objet 'volumeMoyen' est bien défini et contient un champ 'sum'
                        if (typeof volumeMoyen === 'object' && volumeMoyen !== null && volumeMoyen.sum !== undefined) {
                            // On conserve uniquement 'sum'
                            feature.properties.VolumeMoyen = volumeMoyen.sum;
                        } else {
                            // Sinon, on assigne 0
                            feature.properties.VolumeMoyen = 0;
                        }
                
                        // console.log(feature.properties.VolumeMoyen); // Log uniquement la somme
                        feature.properties.PartVolumeMoyen = partVolumeData[NeId] || 0;
                        feature.properties.Tx_Nuitee_Pop_Active_Sup3h = TxPenetration[NeId] || 0;
                        // console.log(TxPenetration)
                        feature.properties.VolumeMoyen_Sup3h = averages[NeId] || 0;
  
                          const pointOnSurface = turf.pointOnSurface(feature);
                          return {
                              'type': 'Feature',
                              'geometry': pointOnSurface.geometry,
                              'properties': feature.properties
                          };
                      })
                  };
  
                   
  
                  if (map.getSource('epci-centroids')) {
                      map.getSource('epci-centroids').setData(pointGeoJSON);
                  } else {
                      map.addSource('epci-centroids', {
                          type: 'geojson',
                          data: pointGeoJSON
                      });
  
                      map.addLayer(EPCI_NUITEE_CENTRO, firstSymbolId);
                      map.addLayer(EPCI_NUITEE_CENTRO_3H, firstSymbolId);
                      map.setFilter('epci-centroids-layer', ['>', ['get', 'VolumeMoyen'], 100]);
                  }
  
                  if (map.getSource('epci')) {
                      map.getSource('epci').setData(polygonGeoJSON);
                  } else {
                      map.addSource('epci', {
                          type: 'geojson',
                          data: pointGeoJSON
                      });
                      map.addLayer(EPCI_NUITEE, firstSymbolId);
                  }
              });
      });
  })
  
    .then(() => {
        // Mise à jour pour IRIS
        return d3.dsv(';', '../data_webmap/simplifier/IRIS_NUITEE_POPACTIVE.csv').then(data => {
            return fetch('../data_webmap/simplifier/iris_nuite_simplifier.geojson')
                .then(response => response.json())
                .then(polygonGeoJSON => {
                    const volumeData = filterAndSumVolume(data, selectedDates, 'NE_ID'); // Utilisation de NE_ID pour IRIS
                    const partVolumeData = calculatePartVolumeMoyen(data, selectedDates, 'NE_ID');

                    const pointGeoJSON = {
                        'type': 'FeatureCollection',
                        'features': polygonGeoJSON.features.map(feature => {
                            const NeId = feature.properties.NE_ID;
                            let volumeMoyen = volumeData[NeId] || 0;

                            // Si l'objet 'volumeMoyen' est bien défini et contient un champ 'sum'
                            if (typeof volumeMoyen === 'object' && volumeMoyen !== null && volumeMoyen.sum !== undefined) {
                                // On conserve uniquement 'sum'
                                feature.properties.VolumeMoyen = volumeMoyen.sum;
                            } else {
                                // Sinon, on assigne 0
                                feature.properties.VolumeMoyen = 0;
                            }
                    
                            // console.log(feature.properties.VolumeMoyen); // Log uniquement la somme
                            feature.properties.PartVolumeMoyen = partVolumeData[NeId] || 0;

                            const pointOnSurface = turf.pointOnSurface(feature);
                            return {
                                'type': 'Feature',
                                'geometry': pointOnSurface.geometry,
                                'properties': feature.properties
                            };
                        })
                    };

                    if (map.getSource('iris-centroids')) {
                        map.getSource('iris-centroids').setData(pointGeoJSON);
                    } else {
                        map.addSource('iris-centroids', {
                            type: 'geojson',
                            data: pointGeoJSON
                        });

                        map.addLayer(IRIS_NUITEE_CENTRO, firstSymbolId);
                        map.setFilter('iris-centroids-layer', ['>', ['get', 'VolumeMoyen'], 100]);
                    }

                    if (map.getSource('iris')) {
                        map.getSource('iris').setData(polygonGeoJSON);
                    } else {
                        map.addSource('iris', {
                            type: 'geojson',
                            data: polygonGeoJSON
                        });
                        map.addLayer(IRIS_NUITEE, firstSymbolId);
                    }
                });
        });
    })
};


$(document).ready(function() {
    $('.dropdown-menu').on('click', function(e) {
        e.stopPropagation();
    });
});
// Initialisation du slider
const slider = $('#ex2').slider({
    min: 0,
    max: DATES.length - 1,
    range: true,
    value: [0, DATES.length - 1],
    tooltip: 'hide',
    step: 1,
    formatter: function (value) {
        return formatDate(DATES[value[0]]) + ' - ' + formatDate(DATES[value[1]]);
    }
}).on('slide', function (ev) {
    setLabels(ev.value);
}).on('slideStop', function (ev) {
    const selectedDates = DATES.slice(ev.value[0], ev.value[1] + 1);
    updateMapWithNewData(selectedDates);
});

// Met à jour les étiquettes initiales
setLabels($('#ex2').slider('getValue'));

  // Ajout des écouteurs d'événements pour les cases à cocher
// Fonction commune pour gérer les changements
const handleCheckboxChange = () => {
    const selectedDates = DATES.slice(slider.slider('getValue')[0], slider.slider('getValue')[1] + 1);
    updateMapWithNewData(selectedDates);
  };
  
  // Liste des ID des cases à cocher
  const checkboxIds = [
    'inf30min-checkbox', '30min3h-checkbox','sup3h-checkbox','nationaux-checkbox','etranger-checkbox'
  ];
  
  // Ajout des écouteurs d'événements pour chaque case à cocher
  checkboxIds.forEach(id => {
    document.getElementById(id).addEventListener('change', handleCheckboxChange);
  });
  

// Activer les tooltips sur les éléments ayant l'attribut data-toggle="tooltip"
$(function(){
    $('[data-toggle="tooltip"]').tooltip();

});

// Valeurs statiques pour la légende
const staticMin = 1000;
const staticMean = 5000;
const staticMax = 2798273;


// Tailles de cercles définies manuellement (en pixels)
const minCircleSize = 10;
const meanCircleSize = 20;
const maxCircleSize = 50;

// Créer la légende statique dans la div 'controls'
function createStaticLegend(min, mean, max) {
    const legendContainer = document.getElementById('controls');
    
    if (!legendContainer) {
        console.error("Element with ID 'controls' not found in the document.");
        return;
    }

    legendContainer.innerHTML = ''; // Clear existing content

    // Titre principal et bouton de rétraction
    const titleContainer = document.createElement('div');
    titleContainer.classList.add('legend-title');

    const mainTitle = document.createElement('h8');
    mainTitle.innerText = 'Légende';
    titleContainer.appendChild(mainTitle);

    const toggleButton = document.createElement('button');
    toggleButton.classList.add('legend-toggle-btn');
    toggleButton.innerText = 'v';
    titleContainer.appendChild(toggleButton);

    legendContainer.appendChild(titleContainer);

    // Conteneur pour le contenu de la légende
    const legendContent = document.createElement('div');
    legendContent.id = 'legend-content';
    legendContent.classList.add('legend-content');

    // Titre pour les cercles
    const circleTitle = document.createElement('div');
    circleTitle.classList.add('legend-title');
    circleTitle.innerText = 'Flux de visiteur cumulé par secteur';
    circleTitle.style.fontSize = '10px';
    legendContent.appendChild(circleTitle);

    // Fonction pour créer un cercle de la légende sans le diminutif
    function createCircleLabel(value, size) {
        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.alignItems = 'center';
        container.style.marginBottom = '8px';
        
        const circle = document.createElement('div');
        circle.style.width = `${size}px`;
        circle.style.height = `${size}px`;
        circle.style.borderRadius = '50%';
        circle.style.backgroundColor = 'white';
        circle.style.border = '0.5px solid grey';
        circle.style.marginRight = '10px';
        
        const text = document.createElement('span');
        text.style.fontSize = '10px'; // Change la taille selon ton besoin
        text.innerText = value.toLocaleString();  // Affiche uniquement la valeur
        
        container.appendChild(circle);
        container.appendChild(text);
        legendContent.appendChild(container);
    }

    // Ajouter les cercles à la légende sans diminutif
    createCircleLabel(max, maxCircleSize);
    createCircleLabel(mean, meanCircleSize);
    createCircleLabel(min, minCircleSize);

    // Titre pour les aplats de couleurs
    const colorTitle = document.createElement('div');
    colorTitle.classList.add('legend-title');
    colorTitle.innerText = 'La part du flux cumulé de visiteurs par secteurs';
    colorTitle.style.fontSize = '10px';
    legendContent.appendChild(colorTitle);

    // Légende des couleurs
    const ul = document.createElement('ul');
    ul.className = 'colorscale estimates';
    ul.innerHTML = `
        <li class="lbound">0%</li>
        <li class="q1_12 q-first tip-top" title="< 0.000194729"></li>
        <li class="q2_12 tip-top" title="0.001"></li>
        <li class="q3_12 tip-top" title="0.2"></li>
        <li class="q4_12 tip-top" title="0.5"></li>
        <li class="q5_12 tip-top" title="2"></li>
        <li class="q6_12 tip-top" title="8"></li>
        <li class="q7_12 q-last tip-top" title="> 0.06"></li>
        <li class="ubound">51,16%</li>
    `;

    legendContent.appendChild(ul);

    //  // Titre pour les aplats de couleurs
    //  const colorTitle2 = document.createElement('div');
    //  colorTitle2.classList.add('legend-title');
    //  colorTitle2.innerHTML = "Part du flux moyen de personnes fréquentant<br /> le cœur de Belfort au moins 3 heures rapporté <br />au nombre d'actifs";


    //  colorTitle2.margin= '10px';
    //  legendContent.appendChild(colorTitle2);

    //  // Ajout d'un espacement entre les deux éléments
    // colorTitle2.style.marginTop = '20px'; // Ajouter un espacement entre les deux divs
    // legendContent.appendChild(colorTitle2);
 

//     // Légende des couleurs
//     const ul2 = document.createElement('ul');
//     ul2.className = 'colorscale estimates';
//     ul2.innerHTML = `
//     <li class="lbound">0%</li>
//     <li class="q1_12 q-first tip-top" title="< 0.000194729" style="background-color: #e0f3f8;"></li>
//     <li class="q2_12 tip-top" title="0.001" style="background-color: #abd9e9;"></li>
//     <li class="q3_12 tip-top" title="0.2" style="background-color: #74add1;"></li>
//     <li class="q4_12 tip-top" title="0.5" style="background-color: #4575b4;"></li>
//     <li class="q5_12 tip-top" title="2" style="background-color: #313695;"></li>
//     <li class="q6_12 tip-top" title="8" style="background-color: #253494;"></li>
//     <li class="q7_12 q-last tip-top" title="> 0.06" style="background-color: #253494;"></li>
//     <li class="ubound">120%</li>
// `;



//     legendContent.appendChild(ul2);
    legendContainer.appendChild(legendContent);

    // Gestionnaire d'événements pour masquer/afficher la légende
    toggleButton.addEventListener('click', () => {
        legendContent.classList.toggle('hidden');
        toggleButton.innerText = legendContent.classList.contains('hidden') ? '+' : 'V';
    });
}



    
// Appeler la fonction pour créer et afficher la légende
createStaticLegend(staticMin, staticMean, staticMax);

// Coordonnées pour placer le marqueur
const coordinates = [6.859063174372086, 47.6388176793477]; 

// Créer l'élément DOM pour le marqueur original
const el = document.createElement('div');
el.id = 'marker';

// Créer le marqueur original sans attacher la popup
new maplibregl.Marker({ element: el })
    .setLngLat(coordinates)
    .addTo(map);

     // Ajouter un événement de clic pour supprimer le marqueur
     el.addEventListener('click', () => {
        el.remove(); // Supprime le marqueur lorsqu'il est cliqué
    });

    document.getElementById('close-extra').addEventListener('click', function () {
        var extraContainer = document.getElementById('extra-container');
        var mapContainer = document.getElementById('map-container');
        var openButton = document.getElementById('open-extra');
        
        extraContainer.classList.add('collapsed');
        mapContainer.style.width = '100%';
        extraContainer.style.width = '0';
        openButton.classList.remove('hidden');
    });

    document.getElementById('open-extra').addEventListener('click', function () {
        var extraContainer = document.getElementById('extra-container');
        var mapContainer = document.getElementById('map-container');
        var openButton = document.getElementById('open-extra');
        
        extraContainer.classList.remove('collapsed');
        mapContainer.style.width = '70%';
        extraContainer.style.width = '30%';
        openButton.classList.add('hidden');
    });


    document.getElementById('zoom-to-study').addEventListener('click', function() {
        // Remplacez ces valeurs par les coordonnées de la zone d'étude
        const studyAreaCoordinates = [6.859063174372086, 47.6388176793477];
        const zoomLevel = 14; // Ajustez le niveau de zoom selon vos besoins
    
        map.flyTo({
            center: studyAreaCoordinates,
            zoom: zoomLevel,
            essential: true // Ce paramètre assure le zoom même si l'utilisateur a des préférences de réduction des animations
        });
    });})
